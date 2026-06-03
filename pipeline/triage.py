#!/usr/bin/env python3
"""Triage the source registry into ingestion tiers.

"Scrape all 611" is not a generic fetch job — endpoint_url is usually a landing
page, and each real API has its own call pattern. This script classifies every
source by HOW it can actually be ingested, so the pipeline knows what connector
to use and where to start. It writes pipeline/ingest_manifest.json.

Tiers (by ingestion method):
  live_api    — a real machine endpoint returning JSON/XML (ArcGIS, Socrata,
                FDSN, OpenFEMA, FRED-CSV, *.json, ?$..., /query, /resource/)
  rss         — RSS/Atom feed
  bulk        — bulk CSV/file download or dataset portal
  scrape      — needs a headless browser (JS-rendered site)
  inspect     — has a URL but it looks like a doc/portal page; needs per-source
                adapter work before it yields data
Auth: keyless | api_key | unknown   (keyless = ingest immediately)
"""
import csv
import json
import os
import re
import urllib.parse
from collections import Counter
from datetime import datetime, timezone

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "_extraction", "master.csv")
OUT = os.path.join(ROOT, "pipeline", "ingest_manifest.json")

API_HINTS = re.compile(
    r"(/api/|api\.|format=json|[?&]\$|/query\b|\.json\b|/resource/|fdsnws|"
    r"/arcgis/|/rest/services/|/efservice/|/data/|/v\d+/|overpass|/feed)",
    re.I,
)
RSS_HINTS = re.compile(r"(rss|/feed|atom\.xml|\.rss)", re.I)
BULK_HINTS = re.compile(r"(\.csv|\.zip|\.xlsx|/download|/dataset|bulkdata|/files/)", re.I)


def _free(r):
    return "free" in (r.get("price_tier") or "").lower()


def _auth(r):
    a = (r.get("auth") or "").lower()
    if not a or "none" in a or "no auth" in a or "no key" in a:
        return "keyless"
    if "oauth" in a:
        return "oauth"
    if "key" in a or "token" in a:
        return "api_key"
    return "unknown"


def _tier(r):
    t = (r.get("type") or "").upper()
    url = (r.get("endpoint_url") or "").strip()
    if t == "RSS_FEED" or RSS_HINTS.search(url):
        return "rss"
    if t == "SCRAPE_TARGET":
        return "scrape"
    if t in ("BULK_DOWNLOAD", "DATASET_PORTAL") or BULK_HINTS.search(url):
        return "bulk"
    if not url:
        return "inspect"
    if API_HINTS.search(url):
        return "live_api"
    return "inspect"  # has a URL but looks like a doc/portal landing page


def main():
    rows = list(csv.DictReader(open(SRC, encoding="utf-8")))
    uniq = {}
    for r in rows:
        n = (r.get("source_name") or "").strip().lower()
        if n and n not in uniq:
            uniq[n] = r
    free = [r for r in uniq.values() if _free(r) and (r.get("endpoint_url") or "").strip()]

    entries = []
    for r in free:
        entries.append({
            "name": (r.get("source_name") or "").strip()[:200],
            "category": (r.get("category") or "other").strip(),
            "provider": (r.get("provider") or "").strip(),
            "url": (r.get("endpoint_url") or "").strip(),
            "type": (r.get("type") or "UNKNOWN").strip(),
            "tier": _tier(r),
            "auth": _auth(r),
        })

    by_tier = Counter(e["tier"] for e in entries)
    by_auth = Counter(e["auth"] for e in entries)
    # immediately actionable = live_api + keyless
    ready = [e for e in entries if e["tier"] == "live_api" and e["auth"] == "keyless"]

    doc = {
        "generated": datetime.now(timezone.utc).isoformat(),
        "total_free_sources": len(entries),
        "by_tier": dict(by_tier),
        "by_auth": dict(by_auth),
        "ready_to_ingest_now": len(ready),  # live_api + keyless
        "sources": entries,
    }
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    with open(OUT, "w", encoding="utf-8") as f:
        json.dump(doc, f, ensure_ascii=False, indent=2)

    print(f"Wrote {OUT}")
    print(f"  total free sources with a URL: {len(entries)}")
    print("  by tier:", dict(by_tier))
    print("  by auth:", dict(by_auth))
    print(f"  READY NOW (live_api + keyless): {len(ready)}")
    print("  live_api by category:")
    for c, n in Counter(e["category"] for e in entries if e["tier"] == "live_api").most_common():
        print(f"    {c:24} {n}")


if __name__ == "__main__":
    main()
