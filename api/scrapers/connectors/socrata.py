"""Socrata SODA API connector for government open data portals (~30 sources)."""

from __future__ import annotations
from typing import Any
from .base import BaseConnector


class SocrataConnector(BaseConnector):
    """Handles Socrata SODA API with pagination and SoQL queries."""

    BATCH_SIZE = 1000

    async def fetch_data(self) -> list[dict[str, Any]]:
        all_records: list[dict[str, Any]] = []
        offset = 0

        while True:
            params = {
                "$limit": str(self.BATCH_SIZE),
                "$offset": str(offset),
                "$order": ":id",
                **self.config.params,
            }
            response = await self._make_request(
                self.config.endpoint, params=params
            )
            batch = response.json()
            if not batch:
                break
            all_records.extend(batch)
            if len(batch) < self.BATCH_SIZE:
                break
            offset += self.BATCH_SIZE

        return all_records
