from __future__ import annotations

from .appwrite_client import AppwriteClient
from .config import AppConfig
from .schema import (
    DATABASE_NAME,
    IMPORT_RUNS_TABLE_NAME,
    IMPORT_RUN_COLUMNS,
    IMPORT_RUN_INDEXES,
    SCORECARD_COLUMNS,
    SCORECARD_INDEXES,
    SCORECARD_TABLE_NAME,
)


def main() -> None:
    config = AppConfig.from_env()
    client = AppwriteClient(config)

    if client.get_database(config.database_id):
        print(f"Database exists: {config.database_id}")
    else:
        client.create_database(config.database_id, DATABASE_NAME)
        print(f"Created database: {config.database_id}")

    if client.get_table(config.database_id, config.import_runs_table_id):
        print(f"Table exists: {config.import_runs_table_id}")
    else:
        client.create_table(
            config.database_id,
            config.import_runs_table_id,
            IMPORT_RUNS_TABLE_NAME,
            config.table_permissions,
        )
        print(f"Created table: {config.import_runs_table_id}")
    for column in IMPORT_RUN_COLUMNS:
        if client.get_column(config.database_id, config.import_runs_table_id, column["key"]):
            print(f"Column exists: {config.import_runs_table_id}.{column['key']}")
        else:
            client.create_column(config.database_id, config.import_runs_table_id, column)
            print(f"Created column: {config.import_runs_table_id}.{column['key']}")
    for index in IMPORT_RUN_INDEXES:
        if client.get_index(config.database_id, config.import_runs_table_id, index["key"]):
            print(f"Index exists: {config.import_runs_table_id}.{index['key']}")
        else:
            client.create_index(config.database_id, config.import_runs_table_id, index)
            print(f"Created index: {config.import_runs_table_id}.{index['key']}")

    if client.get_table(config.database_id, config.scorecard_table_id):
        print(f"Table exists: {config.scorecard_table_id}")
    else:
        client.create_table(
            config.database_id,
            config.scorecard_table_id,
            SCORECARD_TABLE_NAME,
            config.table_permissions,
        )
        print(f"Created table: {config.scorecard_table_id}")
    for column in SCORECARD_COLUMNS:
        if client.get_column(config.database_id, config.scorecard_table_id, column["key"]):
            print(f"Column exists: {config.scorecard_table_id}.{column['key']}")
        else:
            client.create_column(config.database_id, config.scorecard_table_id, column)
            print(f"Created column: {config.scorecard_table_id}.{column['key']}")
    for index in SCORECARD_INDEXES:
        if client.get_index(config.database_id, config.scorecard_table_id, index["key"]):
            print(f"Index exists: {config.scorecard_table_id}.{index['key']}")
        else:
            client.create_index(config.database_id, config.scorecard_table_id, index)
            print(f"Created index: {config.scorecard_table_id}.{index['key']}")


if __name__ == "__main__":
    main()
