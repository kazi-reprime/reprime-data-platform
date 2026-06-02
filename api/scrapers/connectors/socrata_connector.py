"""
Socrata SODA Connector — city open data portals (NYC, Chicago, Baltimore, LA, etc.).
Covers ~80+ of the 611 sources (building permits, crime, zoning, parcels).
"""
from __future__ import annotations

import asyncio
from urllib.parse import urlparse

import httpx
import structlog

logger = structlog.get_logger(__name__)


class SocrataConnector:
    """Connects to Socrata open data portals via SODA API."""

    def __init__(self, timeout=30.0, max_retries=3, headers=None, app_token=None, max_records=1000):
        self.timeout = timeout
        self.max_retries = max_retries
        self.max_records = max_records
        self.headers = {"Accept": "application/json", **(headers or {})}
        if app_token:
            self.headers["X-App-Token"] = app_token

    def _normalize_url(self, url):
        if "/dataset/" in url or "/d/" in url:
            parts = url.rstrip("/").split("/")
            for i, part in enumerate(parts):
                if part in ("dataset", "d") and i + 1 < len(parts):
                    dataset_id = parts[i + 1].split("-")[0] if "-" in parts[i + 1] else parts[i + 1]
                    domain = urlparse(url).netloc
                    return f"https://{domain}/resource/{dataset_id}.json"
        if url.endswith(".json"):
            return url
        if "/resource/" in url:
            return url if url.endswith(".json") else f"{url}.json"
        return url

    def _build_soda_params(self, params):
        soda = {}
        if "where" in params:
            soda["$where"] = params["where"]
        elif "address" in params:
            soda["$where"] = f"address LIKE '%{params['address']}%'"
        soda["$limit"] = str(min(int(params.get("limit", self.max_records)), self.max_records))
        if "offset" in params:
            soda["$offset"] = str(params["offset"])
        if "select" in params:
            soda["$select"] = params["select"]
        elif "fields" in params:
            soda["$select"] = ",".join(params["fields"])
        if "order" in params:
            soda["$order"] = params["order"]
        elif "sort" in params:
            soda["$order"] = params["sort"]
        if "group" in params:
            soda["$group"] = params["group"]
        for k, v in params.items():
            if k.startswith("$") and k not in soda:
                soda[k] = str(v)
        return soda

    async def _request(self, url, params):
        last_exc = None
        for attempt in range(self.max_retries):
            try:
                async with httpx.AsyncClient(timeout=self.timeout, follow_redirects=True) as client:
                    resp = await client.get(url, params=params, headers=self.headers)
                    resp.raise_for_status()
                    if "text/html" in resp.headers.get("content-type", ""):
                        raise RuntimeError(f"Socrata returned HTML: {url[:80]}")
                    return resp.json()
            except Exception as exc:
                last_exc = exc
                wait = 2.0 * (attempt + 1) if "429" in str(exc) else 0.5 * (2 ** attempt)
                await asyncio.sleep(wait)
        raise last_exc

    async def fetch(self, url, params=None, **kwargs):
        url = self._normalize_url(url)
        params = self._build_soda_params(params or {})
        data = await self._request(url, params)

        if isinstance(data, list):
            records = data
        elif isinstance(data, dict):
            records = data.get("data", data.get("results", [data]))
            if not isinstance(records, list):
                records = [records]
        else:
            records = [data] if data else []

        limit = int(params.get("$limit", self.max_records))
        if len(records) == limit and not params.get("no_paginate"):
            offset = limit
            while len(records) < 5000:
                await asyncio.sleep(0.15)
                page_params = {**params, "$offset": str(offset)}
                try:
                    page_data = await self._request(url, page_params)
                    if isinstance(page_data, list):
                        if not page_data:
                            break
                        records.extend(page_data)
                        if len(page_data) < limit:
                            break
                    elif isinstance(page_data, dict):
                        page_records = page_data.get("data", page_data.get("results", []))
                        if not page_records:
                            break
                        records.extend(page_records if isinstance(page_records, list) else [page_records])
                    else:
                        break
                    offset += limit
                except Exception:
                    break

        logger.debug("socrata_fetch", url=url[:80], records=len(records))
        return records

    async def fetch_count(self, url, where="1=1"):
        url = self._normalize_url(url)
        try:
            data = await self._request(url, {"$select": "count(*)", "$where": where})
            if isinstance(data, list) and len(data) > 0:
                return list(data[0].values())[0]
            return 0
        except Exception:
            return -1

    async def fetch_columns(self, url):
        url = self._normalize_url(url)
        try:
            data = await self._request(url, {"$limit": "1"})
            if isinstance(data, list) and len(data) > 0:
                return list(data[0].keys())
            return []
        except Exception:
            return []
