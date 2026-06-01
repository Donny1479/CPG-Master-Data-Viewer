from __future__ import annotations

import argparse
from datetime import UTC, datetime
from itertools import islice
from pathlib import Path
from typing import Iterable, Iterator

from .appwrite_client import AppwriteClient
from .config import AppConfig
from .workbook import file_sha256, import_run_id_for_file, iter_master_rows, summarize_workbook


def chunks(items: Iterable[dict], size: int) -> Iterator[list[dict]]:
    iterator = iter(items)
    while True:
        batch = list(islice(iterator, size))
        if not batch:
            return
        yield batch


def now_iso() -> str:
    return datetime.now(UTC).isoformat().replace("+00:00", "Z")


def main() -> None:
    parser = argparse.ArgumentParser(description="Import a Nielsen scorecard workbook into Appwrite.")
    parser.add_argument("workbook_path")
    parser.add_argument("--dry-run", action="store_true", help="Parse the workbook without sending rows to Appwrite.")
    parser.add_argument("--limit", type=int, default=None, help="Limit imported rows for testing.")
    args = parser.parse_args()

    workbook_path = Path(args.workbook_path)
    import_run_id = import_run_id_for_file(workbook_path)

    if args.dry_run:
        summary = summarize_workbook(workbook_path)
        sample = list(iter_master_rows(workbook_path, import_run_id=import_run_id, limit=3))
        print(f"Dry run OK: {summary['master_table']['rows']} master rows detected")
        print(f"Import run ID: {import_run_id}")
        print(f"Sample row keys: {sorted(sample[0].keys()) if sample else []}")
        return

    config = AppConfig.from_env()
    client = AppwriteClient(config)
    source_sha = file_sha256(workbook_path)
    started_at = now_iso()

    client.upsert_row(
        config.database_id,
        config.import_runs_table_id,
        import_run_id,
        {
            "file_name": workbook_path.name,
            "file_sha256": source_sha,
            "status": "running",
            "row_count": 0,
            "started_at": started_at,
        },
        config.table_permissions,
    )

    rows = iter_master_rows(workbook_path, import_run_id=import_run_id, limit=args.limit)
    imported = 0
    for batch in chunks(rows, config.bulk_batch_size):
        client.upsert_rows(config.database_id, config.scorecard_table_id, batch)
        imported += len(batch)
        print(f"Imported {imported} rows")

    client.upsert_row(
        config.database_id,
        config.import_runs_table_id,
        import_run_id,
        {
            "file_name": workbook_path.name,
            "file_sha256": source_sha,
            "status": "complete",
            "row_count": imported,
            "started_at": started_at,
            "completed_at": now_iso(),
        },
        config.table_permissions,
    )
    print(f"Import complete: {imported} rows")


if __name__ == "__main__":
    main()

