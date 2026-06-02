from __future__ import annotations

import json
import ssl
import time
from http.client import RemoteDisconnected
from typing import Any
from urllib.error import HTTPError, URLError
from urllib.parse import quote
from urllib.request import Request, urlopen

from .config import AppConfig


class AppwriteError(RuntimeError):
    def __init__(self, status_code: int, message: str, payload: dict[str, Any] | None = None):
        self.status_code = status_code
        self.payload = payload or {}
        super().__init__(f"Appwrite API error {status_code}: {message}")


class AppwriteClient:
    RETRYABLE_STATUS_CODES = {408, 429, 500, 502, 503, 504}

    def __init__(self, config: AppConfig):
        self.config = config
        self.ssl_context = self._ssl_context()

    def request(
        self,
        method: str,
        path: str,
        payload: dict[str, Any] | None = None,
        expected_statuses: tuple[int, ...] = (200, 201, 202, 204),
    ) -> dict[str, Any] | None:
        body = None
        headers = {
            "Content-Type": "application/json",
            "X-Appwrite-Project": self.config.project_id,
            "X-Appwrite-Key": self.config.api_key,
            "X-Appwrite-Response-Format": self.config.response_format,
        }
        if payload is not None:
            body = json.dumps(payload).encode("utf-8")

        url = f"{self.config.endpoint}/{path.lstrip('/')}"
        req = Request(url, data=body, headers=headers, method=method.upper())
        for attempt in range(5):
            try:
                with urlopen(req, timeout=120, context=self.ssl_context) as response:
                    data = response.read()
                    if response.status not in expected_statuses:
                        raise AppwriteError(response.status, data.decode("utf-8", errors="replace"))
                    if not data:
                        return None
                    return json.loads(data.decode("utf-8"))
            except HTTPError as exc:
                raw = exc.read().decode("utf-8", errors="replace")
                try:
                    payload = json.loads(raw)
                    message = payload.get("message", raw)
                except json.JSONDecodeError:
                    payload = None
                    message = raw

                if exc.code in self.RETRYABLE_STATUS_CODES and attempt < 4:
                    self._sleep_before_retry(attempt)
                    continue
                raise AppwriteError(exc.code, message, payload) from exc
            except (RemoteDisconnected, TimeoutError, URLError, ConnectionError) as exc:
                if attempt < 4:
                    self._sleep_before_retry(attempt)
                    continue
                raise AppwriteError(0, str(exc)) from exc

        raise AppwriteError(0, "Appwrite request failed after retries")

    def get_database(self, database_id: str) -> dict[str, Any] | None:
        return self._get_or_none(f"tablesdb/{quote(database_id)}")

    def create_database(self, database_id: str, name: str) -> dict[str, Any] | None:
        return self.request("POST", "tablesdb", {"databaseId": database_id, "name": name})

    def get_table(self, database_id: str, table_id: str) -> dict[str, Any] | None:
        return self._get_or_none(f"tablesdb/{quote(database_id)}/tables/{quote(table_id)}")

    def create_table(
        self,
        database_id: str,
        table_id: str,
        name: str,
        permissions: list[str] | None = None,
    ) -> dict[str, Any] | None:
        payload = {
            "tableId": table_id,
            "name": name,
            "permissions": permissions or [],
            "rowSecurity": False,
            "enabled": True,
        }
        return self.request("POST", f"tablesdb/{quote(database_id)}/tables", payload)

    def get_column(self, database_id: str, table_id: str, key: str) -> dict[str, Any] | None:
        return self._get_or_none(
            f"tablesdb/{quote(database_id)}/tables/{quote(table_id)}/columns/{quote(key)}"
        )

    def create_column(
        self,
        database_id: str,
        table_id: str,
        column: dict[str, Any],
    ) -> dict[str, Any] | None:
        column_type = column["type"]
        payload = {key: value for key, value in column.items() if key != "type"}
        payload.setdefault("array", False)
        if column_type in {"varchar", "text", "mediumtext", "longtext", "string"}:
            payload.setdefault("encrypt", False)
        return self.request(
            "POST",
            f"tablesdb/{quote(database_id)}/tables/{quote(table_id)}/columns/{quote(column_type)}",
            payload,
            expected_statuses=(200, 201, 202),
        )

    def get_index(self, database_id: str, table_id: str, key: str) -> dict[str, Any] | None:
        return self._get_or_none(
            f"tablesdb/{quote(database_id)}/tables/{quote(table_id)}/indexes/{quote(key)}"
        )

    def create_index(
        self,
        database_id: str,
        table_id: str,
        index: dict[str, Any],
    ) -> dict[str, Any] | None:
        payload = {
            "key": index["key"],
            "type": index["type"],
            "columns": index.get("columns") or index.get("attributes") or [],
            "orders": index.get("orders", []),
            "lengths": index.get("lengths", []),
        }
        return self.request(
            "POST",
            f"tablesdb/{quote(database_id)}/tables/{quote(table_id)}/indexes",
            payload,
            expected_statuses=(200, 201, 202),
        )

    def upsert_row(
        self,
        database_id: str,
        table_id: str,
        row_id: str,
        data: dict[str, Any],
        permissions: list[str] | None = None,
    ) -> dict[str, Any] | None:
        payload = {"data": data}
        if permissions:
            payload["permissions"] = permissions
        return self.request(
            "PUT",
            f"tablesdb/{quote(database_id)}/tables/{quote(table_id)}/rows/{quote(row_id)}",
            payload,
        )

    def upsert_rows(
        self,
        database_id: str,
        table_id: str,
        rows: list[dict[str, Any]],
    ) -> dict[str, Any] | None:
        return self.request(
            "PUT",
            f"tablesdb/{quote(database_id)}/tables/{quote(table_id)}/rows",
            {"rows": rows},
        )

    def _get_or_none(self, path: str) -> dict[str, Any] | None:
        try:
            return self.request("GET", path)
        except AppwriteError as exc:
            if exc.status_code == 404:
                return None
            raise

    @staticmethod
    def _sleep_before_retry(attempt: int) -> None:
        time.sleep(min(2**attempt, 10))

    @staticmethod
    def _ssl_context() -> ssl.SSLContext:
        try:
            import certifi

            return ssl.create_default_context(cafile=certifi.where())
        except ImportError:
            return ssl.create_default_context()
