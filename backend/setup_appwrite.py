from __future__ import annotations

from .appwrite_client import AppwriteClient
from .config import AppConfig
from .schema import (
    DATABASE_NAME,
    IMPORT_METADATA_COLUMNS,
    IMPORT_METADATA_INDEXES,
    IMPORT_METADATA_TABLE_NAME,
    IMPORT_RUNS_TABLE_NAME,
    IMPORT_RUN_COLUMNS,
    IMPORT_RUN_INDEXES,
    SCORECARD_COLUMNS,
    SCORECARD_INDEXES,
    SCORECARD_TABLE_NAME,
)


def ensure_table(
    client: AppwriteClient,
    config: AppConfig,
    table_id: str,
    table_name: str,
    columns: list[dict],
    indexes: list[dict],
) -> None:
    if client.get_table(config.database_id, table_id):
        print(f"Table exists: {table_id}")
    else:
        client.create_table(
            config.database_id,
            table_id,
            table_name,
            config.table_permissions,
        )
        print(f"Created table: {table_id}")
    for column in columns:
        if client.get_column(config.database_id, table_id, column["key"]):
            print(f"Column exists: {table_id}.{column['key']}")
        else:
            client.create_column(config.database_id, table_id, column)
            print(f"Created column: {table_id}.{column['key']}")
    for index in indexes:
        if client.get_index(config.database_id, table_id, index["key"]):
            print(f"Index exists: {table_id}.{index['key']}")
        else:
            client.create_index(config.database_id, table_id, index)
            print(f"Created index: {table_id}.{index['key']}")


def main() -> None:
    config = AppConfig.from_env()
    client = AppwriteClient(config)

    if client.get_database(config.database_id):
        print(f"Database exists: {config.database_id}")
    else:
        client.create_database(config.database_id, DATABASE_NAME)
        print(f"Created database: {config.database_id}")

    ensure_table(
        client,
        config,
        config.import_runs_table_id,
        IMPORT_RUNS_TABLE_NAME,
        IMPORT_RUN_COLUMNS,
        IMPORT_RUN_INDEXES,
    )
    ensure_table(
        client,
        config,
        config.import_metadata_table_id,
        IMPORT_METADATA_TABLE_NAME,
        IMPORT_METADATA_COLUMNS,
        IMPORT_METADATA_INDEXES,
    )
    ensure_table(
        client,
        config,
        config.scorecard_table_id,
        SCORECARD_TABLE_NAME,
        SCORECARD_COLUMNS,
        SCORECARD_INDEXES,
    )


if __name__ == "__main__":
    main()
