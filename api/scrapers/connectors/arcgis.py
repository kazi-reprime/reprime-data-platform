"""ArcGIS Feature Server connector for GIS/mapping portals (~40 sources)."""

from __future__ import annotations
from typing import Any
from .base import BaseConnector


class ArcGisConnector(BaseConnector):
    """Queries ArcGIS REST Feature Services with pagination."""

    BATCH_SIZE = 1000

    async def fetch_data(self) -> list[dict[str, Any]]:
        all_features: list[dict[str, Any]] = []
        offset = 0

        while True:
            params = {
                "where": self.config.params.get("where", "1=1"),
                "outFields": self.config.params.get("outFields", "*"),
                "f": "json",
                "resultRecordCount": str(self.BATCH_SIZE),
                "resultOffset": str(offset),
                "returnGeometry": self.config.params.get("returnGeometry", "true"),
            }
            response = await self._make_request(
                self.config.endpoint + "/query", params=params
            )
            data = response.json()
            features = data.get("features", [])
            if not features:
                break

            for feat in features:
                record = {**feat.get("attributes", {})}
                geom = feat.get("geometry")
                if geom:
                    record["_geometry"] = geom
                all_features.append(record)

            if len(features) < self.BATCH_SIZE:
                break
            offset += self.BATCH_SIZE

        return all_features
