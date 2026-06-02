"""
ArcGIS REST Service Connector — handles FeatureServer, MapServer, and
ArcGIS Hub/Open Data endpoints. Covers ~180+ of the 611 sources including
FEMA NFHL, EPA sites, CDC SVI, city zoning layers, HRSA health centers, NOAA SLR.
"""
from __future__ import annotations

import asyncio
import json
from typing import Any
from urllib.parse import urlencode, urlparse, parse_qs

import httpx
import structlog

logger = structlog.get_logger(__name__)


class ArcGISConnector:
    """ArcGIS REST FeatureServer/MapServer query connector with pagination."""

    def __init__(self, timeout=30.0, max_retries=3, headers=None, max_records=1000):
        self.timeout = timeout
        self.max_retries = max_retries
        self.headers = headers or {}
        self.max_records = max_records

    def _build_query_url(self, url, params):
        parsed = urlparse(url)
        existing = parse_qs(parsed.query)
        arcgis_params = {
            "f": "json", "where": "1=1", "outFields": "*",
            "returnGeometry": "false", "resultOffset": "0",
            "resultRecordCount": str(self.max_records),
        }
        for k, v in params.items():
            arcgis_params[k] = str(v)
        for k in ("f", "where", "outFields", "returnGeometry", "geometry",
                   "geometryType", "inSR", "spatialRel", "outSR",
                   "resultOffset", "resultRecordCount", "orderByFields"):
            if k in existing and k not in params:
                arcgis_params[k] = existing[k][0]
        base = f"{parsed.scheme}://{parsed.netloc}{parsed.path}"
        return f"{base}?{urlencode(arcgis_params)}"

    async def _request(self, url):
        last_exc = None
        for attempt in range(self.max_retries):
            try:
                async with httpx.AsyncClient(timeout=self.timeout, follow_redirects=True) as client:
                    resp = await client.get(url, headers=self.headers)
                    resp.raise_for_status()
                    return resp.json()
            except (httpx.HTTPError, json.JSONDecodeError) as exc:
                last_exc = exc
                await asyncio.sleep(0.5 * (2 ** attempt) + 0.1)
        raise last_exc

    async def fetch(self, url, params=None, **kwargs):
        params = params or {}
        query_url = self._build_query_url(url, params)

        if "latitude" in kwargs and "longitude" in kwargs:
            lat, lon = kwargs["latitude"], kwargs["longitude"]
            radius = kwargs.get("radius", 1000)
            geometry = json.dumps({"x": lon, "y": lat})
            parsed = urlparse(query_url)
            qs = parse_qs(parsed.query)
            qs["geometry"] = [geometry]
            qs["geometryType"] = ["esriGeometryPoint"]
            qs["inSR"] = ["4326"]
            qs["spatialRel"] = ["esriSpatialRelIntersects"]
            qs["units"] = ["esriSRUnit_Meters"]
            qs["distance"] = [str(radius)]
            query_url = f"{parsed.scheme}://{parsed.netloc}{parsed.path}?{urlencode(qs, doseq=True)}"

        data = await self._request(query_url)
        if "error" in data:
            raise RuntimeError(f"ArcGIS error: {data['error'].get('message', 'Unknown')}")

        features = data.get("features", [])
        records = [f.get("attributes", f) for f in features if f.get("attributes")]

        if not records and "fields" in data and "data" in data:
            inner = data["data"]
            if isinstance(inner, list):
                records = inner
            elif isinstance(inner, dict) and "features" in inner:
                records = [f.get("attributes", f) for f in inner["features"]]

        total = data.get("properties", {}).get("total", len(records))
        if total > self.max_records and not params.get("no_paginate"):
            offset = self.max_records
            while offset < total and len(records) < 5000:
                await asyncio.sleep(0.1)
                parsed = urlparse(query_url)
                qs = parse_qs(parsed.query)
                qs["resultOffset"] = [str(offset)]
                page_url = f"{parsed.scheme}://{parsed.netloc}{parsed.path}?{urlencode(qs, doseq=True)}"
                try:
                    page_data = await self._request(page_url)
                    page_features = page_data.get("features", [])
                    if not page_features:
                        break
                    records.extend([f.get("attributes", f) for f in page_features])
                    offset += self.max_records
                except Exception:
                    break

        logger.debug("arcgis_fetch", url=url[:80], records=len(records), total=total)
        return records

    async def fetch_field_info(self, url):
        parsed = urlparse(url)
        base = f"{parsed.scheme}://{parsed.netloc}{parsed.path}"
        try:
            data = await self._request(f"{base}?f=json")
            return data.get("fields", [])
        except Exception:
            return []

    async def fetch_layer_count(self, url):
        parsed = urlparse(url)
        base = f"{parsed.scheme}://{parsed.netloc}{parsed.path}"
        try:
            data = await self._request(f"{base}?f=json&where=1=1&returnCountOnly=true")
            return data.get("count", 0)
        except Exception:
            return -1
