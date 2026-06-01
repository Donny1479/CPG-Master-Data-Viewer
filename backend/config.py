from __future__ import annotations

import os
from dataclasses import dataclass
from pathlib import Path


def load_env_file(path: str | Path = ".env") -> None:
    env_path = Path(path)
    if not env_path.exists():
        return

    for raw_line in env_path.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        key = key.strip()
        value = value.strip().strip('"').strip("'")
        os.environ.setdefault(key, value)


def _required(name: str) -> str:
    value = os.environ.get(name, "").strip()
    if not value:
        raise RuntimeError(f"Missing required environment variable: {name}")
    return value


def _optional(name: str, default: str) -> str:
    return os.environ.get(name, default).strip() or default


def _permissions(value: str) -> list[str]:
    return [item.strip() for item in value.split(",") if item.strip()]


@dataclass(frozen=True)
class AppConfig:
    endpoint: str
    project_id: str
    api_key: str
    response_format: str
    database_id: str
    scorecard_table_id: str
    import_runs_table_id: str
    table_permissions: list[str]
    bulk_batch_size: int

    @classmethod
    def from_env(cls) -> "AppConfig":
        load_env_file()
        endpoint = _required("APPWRITE_ENDPOINT").rstrip("/")
        return cls(
            endpoint=endpoint,
            project_id=_required("APPWRITE_PROJECT_ID"),
            api_key=_required("APPWRITE_API_KEY"),
            response_format=_optional("APPWRITE_RESPONSE_FORMAT", "1.9.5"),
            database_id=_optional("APPWRITE_DATABASE_ID", "tim_cpg_insights"),
            scorecard_table_id=_optional("APPWRITE_SCORECARD_TABLE_ID", "scorecard_rows"),
            import_runs_table_id=_optional("APPWRITE_IMPORT_RUNS_TABLE_ID", "import_runs"),
            table_permissions=_permissions(os.environ.get("APPWRITE_TABLE_PERMISSIONS", "")),
            bulk_batch_size=int(_optional("APPWRITE_BULK_BATCH_SIZE", "100")),
        )

