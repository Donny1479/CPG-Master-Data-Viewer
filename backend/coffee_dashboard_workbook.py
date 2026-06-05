from __future__ import annotations

import re
from pathlib import Path
from typing import Any, Iterator

from .schema import EXCEL_TO_APPWRITE_COLUMN
from .source_pulls import PULL_ORDER, build_product, discover_source_sheets, product_case
from .workbook import appwrite_row_id, file_sha256, load_data_workbook, normalize_cell, row_hash

DASHBOARD_BUSINESS = "coffee_dashboard"

PRICE_METRICS = [
    "Avg Units Price",
    "No Promo Units Price",
    "Any Promo Units Price",
    "Avg Pounds Price",
    "Any Promo Pounds Price",
    "No Promo Pounds Price",
]

PRICE_CHANGE_METRICS = [
    "Avg Units Price % Chg YA",
    "No Promo Units Price % Chg YA",
    "Any Promo Units Price % Chg YA",
    "Avg Pounds Price % Chg YA",
    "Any Promo Pounds Price % Chg YA",
    "No Promo Pounds Price % Chg YA",
]

MONTH_TO_PERIOD = {
    "jan": "P1",
    "feb": "P2",
    "mar": "P3",
    "apr": "P4",
    "may": "P5",
    "jun": "P6",
    "jul": "P7",
    "aug": "P8",
    "sep": "P9",
    "oct": "P10",
    "nov": "P11",
    "dec": "P12",
}


def append_unique(values: list[str], seen: set[str], value: Any) -> None:
    if value is None:
        return
    text = str(value).strip()
    if not text or text in seen:
        return
    seen.add(text)
    values.append(text)


def dashboard_period(value: Any) -> str | None:
    if value is None:
        return None
    text = str(value).strip()
    if not text:
        return None
    match = re.match(r"^([A-Za-z]{3})\s+(\d{2})\b", text)
    if not match:
        return text
    period_code = MONTH_TO_PERIOD.get(match.group(1).lower())
    if not period_code:
        return text
    return f"{period_code} 20{match.group(2)}"


def iter_dashboard_rows(
    paths: list[str | Path],
    import_run_id: str,
    limit: int | None = None,
) -> Iterator[dict[str, Any]]:
    source_sheets = discover_source_sheets(paths, business="coffee")
    source_shas = {sheet.file_path: file_sha256(sheet.file_path) for sheet in source_sheets.values()}

    emitted = 0
    for pull_type in PULL_ORDER["coffee"]:
        source = source_sheets[pull_type]
        workbook = load_data_workbook(source.file_path)
        worksheet = workbook[source.sheet_name]
        rows = worksheet.iter_rows(min_row=source.header_row, values_only=True)
        headers = [str(value).strip() if value is not None else "" for value in next(rows)]

        for source_row_number, values in enumerate(rows, start=source.header_row + 1):
            raw = dict(zip(headers, values))
            if pull_type == "topline_brands":
                product = product_case(raw.get("Products"))
                size = raw.get("SIZE")
            else:
                size = raw.get("SIZE", raw.get("NUMBER OF PACKETS"))
                product = build_product(raw.get("BRAND"), raw.get("TH BRAND"), size)

            market = normalize_cell("market", raw.get("Markets"))
            period = dashboard_period(raw.get("Periods"))
            if not market or not period or not product:
                continue

            output: dict[str, Any] = {
                "market": market,
                "period": period,
                "product": product,
                "source_sheet": source.sheet_name,
                "source_pull_type": pull_type,
                "source_file": source.file_path.name,
                "source_file_sha256": source_shas[source.file_path],
                "import_run_id": import_run_id,
                "source_row_number": source_row_number,
            }

            normalized_raw: dict[str, Any] = dict(raw)
            normalized_raw["Products"] = product
            normalized_raw["SIZE"] = size

            for excel_header, appwrite_key in EXCEL_TO_APPWRITE_COLUMN.items():
                if appwrite_key in {"market", "period", "product"}:
                    continue
                normalized = normalize_cell(appwrite_key, normalized_raw.get(excel_header))
                if normalized is not None:
                    output[appwrite_key] = normalized

            output["row_hash"] = row_hash(output)
            output["$id"] = appwrite_row_id(output)
            yield output

            emitted += 1
            if limit is not None and emitted >= limit:
                return


def summarize_dashboard_workbook(paths: list[str | Path], import_run_id: str, limit: int | None = None) -> dict[str, Any]:
    source_sheets = discover_source_sheets(paths, business="coffee")
    markets: list[str] = []
    periods: list[str] = []
    products: list[str] = []
    market_seen: set[str] = set()
    period_seen: set[str] = set()
    product_seen: set[str] = set()
    source_counts: dict[str, int] = {}
    rows = 0

    for row in iter_dashboard_rows(paths, import_run_id, limit=limit):
        rows += 1
        append_unique(markets, market_seen, row.get("market"))
        append_unique(periods, period_seen, row.get("period"))
        append_unique(products, product_seen, row.get("product"))
        pull_type = str(row.get("source_pull_type") or "unknown")
        source_counts[pull_type] = source_counts.get(pull_type, 0) + 1

    non_monthly_periods = [
        period for period in periods if not period.upper().startswith("P") or "W/E" in period.upper()
    ]

    return {
        "business": DASHBOARD_BUSINESS,
        "import_run_id": import_run_id,
        "sources": {
            pull_type: {
                "file": str(sheet.file_path),
                "sheet": sheet.sheet_name,
                "header_row": sheet.header_row,
                "rows": source_counts.get(pull_type, 0),
            }
            for pull_type, sheet in sorted(source_sheets.items())
        },
        "total_rows": rows,
        "sourceCounts": source_counts,
        "options": {
            "markets": markets,
            "periods": periods,
            "products": products,
            "nonMonthlyPeriods": non_monthly_periods,
            "priceMetrics": PRICE_METRICS,
            "priceChangeMetrics": PRICE_CHANGE_METRICS,
        },
    }
