from __future__ import annotations

from typing import Any

DATABASE_NAME = "Tim Hortons CPG Insights"
SCORECARD_TABLE_NAME = "Scorecard Rows"
IMPORT_RUNS_TABLE_NAME = "Import Runs"

EXCEL_TO_APPWRITE_COLUMN = {
    "Markets": "market",
    "Periods": "period",
    "Products": "product",
    "$ Shr - Product": "dollar_share_product",
    "$ Shr Chg YA - Product": "dollar_share_chg_ya_product",
    "$ ('000)": "dollar_sales_000",
    "$ ('000) Chg YA": "dollar_sales_chg_ya_000",
    "$ % Chg YA": "dollar_pct_chg_ya",
    "Pounds ('000)": "pounds_000",
    "Pounds ('000) Chg YA": "pounds_chg_ya_000",
    "Pounds % Chg YA": "pounds_pct_chg_ya",
    "Units ('000)": "units_000",
    "Units ('000) Chg YA": "units_chg_ya_000",
    "Units % Chg YA": "units_pct_chg_ya",
    "Avg Pounds Price": "avg_pounds_price",
    "Avg Pounds Price % Chg YA": "avg_pounds_price_pct_chg_ya",
    "Avg Units Price": "avg_units_price",
    "Avg Units Price Chg YA": "avg_units_price_chg_ya",
    "Avg Units Price % Chg YA": "avg_units_price_pct_chg_ya",
    "No Promo Units Price": "no_promo_units_price",
    "No Promo Units Price % Chg YA": "no_promo_units_price_pct_chg_ya",
    "Any Promo Units Price": "any_promo_units_price",
    "Any Promo Units Price % Chg YA": "any_promo_units_price_pct_chg_ya",
    "% Sold on Promotion": "sold_on_promo_pct",
    "% Sold on Promotion Chg YA": "sold_on_promo_chg_ya_pct",
    "Disp Only Units": "disp_only_units",
    "Disp Only Units % Chg YA": "disp_only_units_pct_chg_ya",
    "Feat Only Units": "feat_only_units",
    "Feat Only Units % Chg YA": "feat_only_units_pct_chg_ya",
    "Price Decr Only Units": "price_decr_only_units",
    "Price Decr Only Units % Chg YA": "price_decr_only_units_pct_chg_ya",
    "Feat & Disp & Price Decr Units": "feat_disp_price_decr_units",
    "Feat & Disp & Price Decr Units % Chg YA": "feat_disp_price_decr_pct_chg_ya",
    "% ACV": "acv_pct",
    "% ACV % Chg YA": "acv_pct_chg_ya",
    "No. of Items per Store": "items_per_store",
    "No. of Items per Store Chg YA": "items_per_store_chg_ya",
    "$ SPPDP": "dollar_sppdp",
    "$ SPPDP % Chg YA": "dollar_sppdp_pct_chg_ya",
    "TH CATEGORY": "th_category",
    "TH CONTAINER TYPE": "th_container_type",
    "BRAND": "brand",
    "TH BRAND": "th_brand",
    "SIZE": "size",
}

DIMENSION_KEYS = {
    "market",
    "period",
    "product",
    "th_category",
    "th_container_type",
    "brand",
    "th_brand",
    "size",
    "source_sheet",
    "source_pull_type",
    "source_file",
    "source_file_sha256",
    "import_run_id",
    "row_hash",
}

METRIC_KEYS = set(EXCEL_TO_APPWRITE_COLUMN.values()) - DIMENSION_KEYS

REQUIRED_MASTER_HEADERS = list(EXCEL_TO_APPWRITE_COLUMN.keys())


def string_column(key: str, size: int = 512, required: bool = False) -> dict[str, Any]:
    return {"key": key, "type": "varchar", "size": size, "required": required}


def float_column(key: str, required: bool = False) -> dict[str, Any]:
    return {"key": key, "type": "float", "required": required}


def integer_column(key: str, required: bool = False) -> dict[str, Any]:
    return {"key": key, "type": "integer", "required": required}


def datetime_column(key: str, required: bool = False) -> dict[str, Any]:
    return {"key": key, "type": "datetime", "required": required}


SCORECARD_COLUMNS = [
    string_column("market", 256, True),
    string_column("period", 128, True),
    string_column("product", 256, True),
    *[float_column(key) for key in EXCEL_TO_APPWRITE_COLUMN.values() if key in METRIC_KEYS],
    string_column("th_category", 128),
    string_column("th_container_type", 128),
    string_column("brand", 256),
    string_column("th_brand", 256),
    string_column("size", 128),
    string_column("source_sheet", 64, True),
    string_column("source_pull_type", 64, True),
    string_column("source_file", 256, True),
    string_column("source_file_sha256", 64, True),
    string_column("import_run_id", 36, True),
    integer_column("source_row_number", True),
    string_column("row_hash", 64, True),
]

SCORECARD_INDEXES = [
    {"key": "idx_market_period", "type": "key", "attributes": ["market", "period"]},
    {"key": "idx_product_period", "type": "key", "attributes": ["product", "period"]},
    {"key": "idx_brand_period", "type": "key", "attributes": ["brand", "period"]},
    {"key": "idx_th_brand_period", "type": "key", "attributes": ["th_brand", "period"]},
    {"key": "idx_category_period", "type": "key", "attributes": ["th_category", "period"]},
    {"key": "idx_container_period", "type": "key", "attributes": ["th_container_type", "period"]},
    {"key": "idx_import_run", "type": "key", "attributes": ["import_run_id"]},
    {"key": "idx_pull_type", "type": "key", "attributes": ["source_pull_type"]},
]

IMPORT_RUN_COLUMNS = [
    string_column("file_name", 256, True),
    string_column("file_sha256", 64, True),
    string_column("status", 32, True),
    integer_column("row_count"),
    string_column("notes", 1024),
    datetime_column("started_at", True),
    datetime_column("completed_at"),
]

IMPORT_RUN_INDEXES = [
    {"key": "idx_file_sha256", "type": "key", "attributes": ["file_sha256"]},
    {"key": "idx_status", "type": "key", "attributes": ["status"]},
]
