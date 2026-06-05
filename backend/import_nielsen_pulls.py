from __future__ import annotations

import argparse
import json
from datetime import UTC, datetime
from itertools import islice
from pathlib import Path
from typing import Iterable, Iterator

from .appwrite_client import AppwriteClient
from .config import AppConfig
from .source_pulls import combined_import_run_id, iter_compiled_pull_rows, summarize_source_pulls
from .workbook import file_sha256


def chunks(items: Iterable[dict], size: int) -> Iterator[list[dict]]:
    iterator = iter(items)
    while True:
        batch = list(islice(iterator, size))
        if not batch:
            return
        yield batch


def now_iso() -> str:
    return datetime.now(UTC).isoformat().replace("+00:00", "Z")


def combined_file_sha(paths: list[Path]) -> str:
    import hashlib

    digest = hashlib.sha256()
    for path in sorted(paths):
        digest.update(path.name.encode("utf-8"))
        digest.update(file_sha256(path).encode("utf-8"))
    return digest.hexdigest()


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Compile Nielsen pulls and import dashboard-ready rows into Appwrite."
    )
    parser.add_argument(
        "paths",
        nargs="+",
        help="One workbook containing the Nielsen tabs, or separate pull workbooks.",
    )
    parser.add_argument(
        "--business",
        choices=("coffee", "soup_chili"),
        default="coffee",
        help="Select the pull structure to compile. Coffee expects 4 pulls; soup_chili expects Ready to Serve, Condensed, and Chili.",
    )
    parser.add_argument("--dry-run", action="store_true", help="Parse the pulls without sending rows to Appwrite.")
    parser.add_argument("--limit", type=int, default=None, help="Limit imported rows for testing.")
    args = parser.parse_args()

    paths = [Path(item) for item in args.paths]
    import_run_id = combined_import_run_id(paths, args.business)

    if args.dry_run:
        summary = summarize_source_pulls(paths, business=args.business)
        print(f"Dry run OK: {summary['total_rows']} compiled rows detected")
        print(f"Import run ID: {summary['import_run_id']}")
        for pull_type, source in summary["sources"].items():
            print(f"{pull_type}: {source['rows']} rows from {source['file']} / {source['sheet']}")
        return

    config = AppConfig.from_env()
    client = AppwriteClient(config)
    started_at = now_iso()
    file_names = ", ".join(path.name for path in paths)
    file_sha = combined_file_sha(paths)

    client.upsert_row(
        config.database_id,
        config.import_runs_table_id,
        import_run_id,
        {
            "file_name": file_names,
            "file_sha256": file_sha,
            "status": "running",
            "row_count": 0,
            "started_at": started_at,
        },
        config.table_permissions,
    )

    rows = iter_compiled_pull_rows(paths, import_run_id=import_run_id, limit=args.limit, business=args.business)
    imported = 0
    markets: set[str] = set()
    periods: set[str] = set()
    products: set[str] = set()
    source_counts: dict[str, int] = {}
    for batch in chunks(rows, config.bulk_batch_size):
        for row in batch:
            if row.get("market"):
                markets.add(str(row["market"]))
            if row.get("period"):
                periods.add(str(row["period"]))
            if row.get("product"):
                products.add(str(row["product"]))
            pull_type = str(row.get("source_pull_type") or "unknown")
            source_counts[pull_type] = source_counts.get(pull_type, 0) + 1

        client.upsert_rows(config.database_id, config.scorecard_table_id, batch)
        imported += len(batch)
        if imported % 1000 == 0:
            print(f"Imported {imported} rows")

    metadata_json = json.dumps(
        {
            "source": "nielsen_raw_tabs",
            "business": args.business,
            "rowCount": imported,
            "sourceCounts": source_counts,
            "options": {
                "markets": sorted(markets),
                "periods": sorted(periods),
                "products": sorted(products),
            },
        },
        separators=(",", ":"),
    )

    client.upsert_row(
        config.database_id,
        config.import_runs_table_id,
        import_run_id,
        {
            "file_name": file_names,
            "file_sha256": file_sha,
            "status": "complete",
            "row_count": imported,
            "started_at": started_at,
            "completed_at": now_iso(),
        },
        config.table_permissions,
    )
    client.upsert_row(
        config.database_id,
        config.import_metadata_table_id,
        import_run_id,
        {
            "import_run_id": import_run_id,
            "row_count": imported,
            "metadata_json": metadata_json,
        },
        config.table_permissions,
    )
    print(f"Import complete: {imported} rows")


if __name__ == "__main__":
    main()
