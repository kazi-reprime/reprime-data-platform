"""REST API connector for free JSON/XML endpoints (218+ sources)."""

from __future__ import annotations
from typing import Any
from .base import BaseConnector


class RestApiConnector(BaseConnector):
    """Generic REST API connector. Handles JSON and XML responses."""

    async def fetch_data(self) -> list[dict[str, Any]]:
        response = await self._make_request(self.config.endpoint)
        content_type = response.headers.get("content-type", "")

        if "xml" in content_type or "sdmx" in content_type:
            return self._parse_xml(response.text)

        data = response.json()

        # Handle common API response wrappers
        if isinstance(data, list):
            return data
        if isinstance(data, dict):
            # Try common wrapper keys
            for key in ("results", "data", "records", "features", "observations",
                        "result", "items", "rows", "entries", "series"):
                if key in data and isinstance(data[key], list):
                    return data[key]
            # Single record — wrap in list
            return [data]
        return [{"value": data}]

    @staticmethod
    def _parse_xml(text: str) -> list[dict[str, Any]]:
        from xml.etree import ElementTree
        root = ElementTree.fromstring(text)
        records = []
        for elem in root.iter():
            if elem.attrib:
                records.append({**elem.attrib, "_tag": elem.tag})
        return records if records else [{"raw_xml": text[:2000]}]
