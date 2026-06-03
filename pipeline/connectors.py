#!/usr/bin/env python3
"""Typed ingestion connectors.

A 'live_api' URL is not always directly fetchable — each API *family* has its
own query convention. This module detects the family from the URL and builds the
right request, then counts the records returned. Standard-library only so it runs
identically in GitHub Actions and locally.
"""
from __future__ import annotations

import json
import ssl
import urllib.parse
import urllib.request

_CTX = ssl.create_default_context()
UA = {"User-Agent": "RePrime-Ingest/1.0 (data pipeline)"}


def detect_family(url: str) -> str:
    u = url.lower()
    if "/rest/services/" in u or "featureserver" in u or "mapserver" in u or "/arcgis/" in u:
        return "arcgis"
    if "/resource/" in u and ".json" in u:
        return "socrata"
    if "fdsnws" in u:
        return "fdsn"
    if "/api/open/" in u or ("fema.gov" in u and "/api" in u):
        return "openfema"
    if "fredgraph.csv" in u or "fred.stlouisfed.org/graph" in u:
        return "fred_csv"
    if "api.census.gov" in u:
        return "census"
    return "generic"


def build_url(url: str, family: str, limit: int = 25) -> str:
    sep = "&" if "?" in url else "?"
    if family == "arcgis":
        base = url
        if "/query" not in base.lower():
            base = base.rstrip("/")
            if "server" in base.lower() and not base.rstrip("/").split("/")[-1].isdigit():
                base = base + "/0"
            base = base + "/query"
        s = "&" if "?" in base else "?"
        return f"{base}{s}where=1%3D1&outFields=*&resultRecordCount={limit}&f=json"
    if family == "socrata":
        return f"{url}{sep}$limit={limit}"
    if family == "openfema":
        return f"{url}{sep}$top={limit}"
    return url


def _count_records(payload) -> int:
    if isinstance(payload, list):
        return len(payload)
    if isinstance(payload, dict):
        for k in ("features", "results", "data", "items", "observations", "records"):
            v = payload.get(k)
            if isinstance(v, list):
                return len(v)
        return 1 if payload else 0
    return 0


def fetch(url: str, family: str | None = None, limit: int = 25, timeout: int = 12) -> dict:
    """Returns {status, record_count, content_type, sample, error}."""
    family = family or detect_family(url)
    req_url = build_url(url, family, limit)
    try:
        req = urllib.request.Request(req_url, headers=UA)
        with urllib.request.urlopen(req, timeout=timeout, context=_CTX) as r:
            ct = r.headers.get("Content-Type", "")
            raw = r.read(2_000_000).decode("utf-8", "replace")
    except Exception as e:  # noqa: BLE001
        return {"status": "error", "record_count": 0, "error": str(e)[:160], "request_url": req_url}

    body = raw.lstrip()
    if family == "fred_csv" or (ct.startswith("text/csv")) or (body[:4] == "DATE"):
        rows = [r for r in raw.strip().splitlines() if r]
        return {"status": "ok", "record_count": max(0, len(rows) - 1), "content_type": "csv",
                "sample": rows[-3:], "request_url": req_url}
    if "json" in ct or body[:1] in "{[":
        try:
            payload = json.loads(raw)
            n = _count_records(payload)
            sample = payload if isinstance(payload, list) else payload
            return {"status": "ok" if n else "empty", "record_count": n, "content_type": "json",
                    "sample": _trim(sample), "request_url": req_url}
        except Exception as e:  # noqa: BLE001
            return {"status": "error", "record_count": 0, "error": f"json parse: {e}", "request_url": req_url}
    if "xml" in ct or body[:5] == "<?xml":
        return {"status": "ok", "record_count": raw.count("<entry") + raw.count("<item"),
                "content_type": "xml", "sample": raw[:500], "request_url": req_url}
    # HTML or other → the endpoint_url is a doc/landing page, not data
    return {"status": "not_data", "record_count": 0,
            "content_type": ("html" if "<html" in body[:500].lower() else "other"),
            "error": "endpoint returned a page, not machine data — needs per-source adapter",
            "request_url": req_url}


def _trim(payload):
    """Keep a small sample for storage/inspection."""
    if isinstance(payload, list):
        return payload[:5]
    if isinstance(payload, dict):
        for k in ("features", "results", "data", "items", "observations", "records"):
            if isinstance(payload.get(k), list):
                out = dict(payload)
                out[k] = payload[k][:5]
                return out
        return payload
    return payload
