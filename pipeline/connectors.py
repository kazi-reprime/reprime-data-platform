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
import time
import urllib.parse
import urllib.request

_CTX = ssl.create_default_context()
# Descriptive UA with contact — required by SEC EDGAR and good practice elsewhere.
UA = {"User-Agent": "RePrime-DataPlatform/1.0 (ingest; contact g@floridastatetrust.com)",
      "Accept": "application/json, text/csv, application/xml;q=0.9, */*;q=0.5"}


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
    if family == "arcgis":
        # Strip any existing query; resolve to a layer's /query endpoint.
        base = url.split("?")[0].rstrip("/")
        low = base.lower()
        if not low.endswith("/query"):
            tail = base.split("/")[-1]
            if tail.isdigit():                      # .../MapServer/0  -> add /query
                base = base + "/query"
            elif low.endswith(("mapserver", "featureserver")):
                base = base + "/0/query"            # service root -> default layer 0
            else:
                base = base + "/0/query"            # best effort (folder roots will 400, reported honestly)
        return f"{base}?where=1%3D1&outFields=*&resultRecordCount={limit}&f=json"
    if family == "socrata":
        base = url.split("?")[0]
        return f"{base}?$limit={limit}"
    if family == "openfema":
        # OpenFEMA datasets: drop placeholder/empty $filter, take N records nationally.
        base = url.split("?")[0]
        return f"{base}?$top={limit}"
    if family == "overpass":
        # Overpass is a POST-with-QL / per-location tool; if the URL already carries
        # a ?data= query, GET it as-is, otherwise it can't be bulk-ingested here.
        return url if "data=" in url else url
    sep = "&" if "?" in url else "?"
    return url if family in ("fdsn", "fred_csv", "census") else url + ("" if "?" in url else "")


def total_count(url: str, family: str, timeout: int = 8):
    """Cheaply ask the source for its TRUE total row count (not just the sample).
    ArcGIS supports returnCountOnly; Socrata supports select=count(*). Returns int or None."""
    try:
        if family == "arcgis":
            base = url.split("?")[0].rstrip("/")
            low = base.lower()
            if not low.endswith("/query"):
                tail = base.split("/")[-1]
                base = base + ("/query" if tail.isdigit() else "/0/query")
            j = _http_json(f"{base}?where=1%3D1&returnCountOnly=true&f=json", timeout=timeout)
            return j.get("count")
        if family == "socrata":
            base = url.split("?")[0]
            j = _http_json(f"{base}?%24select=count(%2A)", timeout=timeout)  # $select=count(*)
            if isinstance(j, list) and j:
                return int(list(j[0].values())[0])
    except Exception:  # noqa: BLE001
        return None
    return None


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
    if not url.lower().startswith(("http://", "https://")):
        url = "https://" + url.lstrip("/")          # registry sometimes omits scheme
    family = family or detect_family(url)
    req_url = build_url(url, family, limit)
    raw = ct = None
    last_err = None
    for attempt in range(2):                          # one retry for 429/403/transient
        try:
            req = urllib.request.Request(req_url, headers=UA)
            with urllib.request.urlopen(req, timeout=timeout, context=_CTX) as r:
                ct = r.headers.get("Content-Type", "")
                raw = r.read(2_000_000).decode("utf-8", "replace")
            break
        except urllib.error.HTTPError as e:
            last_err = f"HTTP {e.code}"
            if e.code in (429, 403, 503) and attempt == 0:
                time.sleep(1.2)
                continue
            return {"status": "error", "record_count": 0, "error": last_err, "request_url": req_url}
        except Exception as e:  # noqa: BLE001
            last_err = str(e)[:160]
            if attempt == 0:
                time.sleep(0.5)
                continue
            return {"status": "error", "record_count": 0, "error": last_err, "request_url": req_url}

    body = raw.lstrip()
    if family == "fred_csv" or (ct.startswith("text/csv")) or (body[:4] == "DATE"):
        rows = [r for r in raw.strip().splitlines() if r]
        return {"status": "ok", "record_count": max(0, len(rows) - 1), "content_type": "csv",
                "sample": rows[-3:], "request_url": req_url}
    if "json" in ct or body[:1] in "{[":
        try:
            payload = json.loads(raw)
            n = _count_records(payload)
            # for ArcGIS/Socrata, report the TRUE total available (not just the sample size)
            total = total_count(url, family) if family in ("arcgis", "socrata") else None
            rc = total if isinstance(total, int) and total >= n else n
            return {"status": "ok" if rc else "empty", "record_count": rc,
                    "sample_size": n, "content_type": "json",
                    "sample": _trim(payload), "request_url": req_url}
        except Exception as e:  # noqa: BLE001
            return {"status": "error", "record_count": 0, "error": f"json parse: {e}", "request_url": req_url}
    low = body[:400].lower()
    if "xml" in ct or "rss" in ct or "atom" in ct or any(t in low for t in ("<?xml", "<rss", "<feed", "<rdf")):
        cnt = raw.count("<item") + raw.count("<item ") + raw.count("<entry>") + raw.count("<entry ")
        # extract a few item/entry titles for the sample
        import re as _re
        titles = _re.findall(r"<title[^>]*>(.*?)</title>", raw, _re.S | _re.I)[1:6]
        return {"status": "ok" if cnt else "empty", "record_count": cnt,
                "content_type": "xml/feed", "sample": [t.strip()[:120] for t in titles],
                "request_url": req_url}
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
