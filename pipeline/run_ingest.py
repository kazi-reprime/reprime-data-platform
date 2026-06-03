#!/usr/bin/env python3
"""Ingestion runner — reads pipeline/ingest_manifest.json, fetches sources via
typed connectors, writes per-source results + a coverage report.

Writes JSON now (DB-ready); when DATABASE_URL is set it can also upsert to
Postgres (see pipeline/schema.sql). Designed to run in GitHub Actions on a cron.

Usage:
  python3 pipeline/run_ingest.py --tier live_api --auth keyless --limit 25 --max 0
    --tier   filter to a tier (live_api|rss|bulk|scrape|inspect); default all
    --auth   filter to an auth class (keyless|api_key|unknown); default all
    --max    cap number of sources this run (0 = no cap)
"""
import argparse
import concurrent.futures
import json
import os
import re
import time
from datetime import datetime, timezone

HERE = os.path.dirname(os.path.abspath(__file__))
import sys
sys.path.insert(0, HERE)
import connectors  # noqa: E402

MANIFEST = os.path.join(HERE, "ingest_manifest.json")
DATA_DIR = os.path.join(HERE, "data")
REPORT = os.path.join(HERE, "ingest_report.json")


def slug(s: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", s.lower()).strip("-")[:60] or "src"


def run(tier=None, auth=None, limit=25, cap=0, workers=8):
    manifest = json.load(open(MANIFEST, encoding="utf-8"))
    items = manifest["sources"]
    if tier:
        items = [i for i in items if i["tier"] == tier]
    if auth:
        items = [i for i in items if i["auth"] == auth]
    if cap:
        items = items[:cap]

    os.makedirs(DATA_DIR, exist_ok=True)
    results = []

    def _do(it):
        t0 = time.time()
        r = connectors.fetch(it["url"], limit=limit)
        r["latency_ms"] = int((time.time() - t0) * 1000)
        rec = {**it, **{k: r[k] for k in ("status", "record_count", "latency_ms") if k in r},
               "fetched_at": datetime.now(timezone.utc).isoformat()}
        # persist the sample payload per source
        cat_dir = os.path.join(DATA_DIR, it["category"])
        os.makedirs(cat_dir, exist_ok=True)
        with open(os.path.join(cat_dir, slug(it["name"]) + ".json"), "w", encoding="utf-8") as f:
            json.dump({"source": it, "result": r}, f, ensure_ascii=False, default=str)
        return rec

    with concurrent.futures.ThreadPoolExecutor(max_workers=workers) as ex:
        for rec in ex.map(_do, items):
            results.append(rec)

    ok = [r for r in results if r["status"] == "ok"]
    total_records = sum(r["record_count"] for r in ok)
    report = {
        "run_at": datetime.now(timezone.utc).isoformat(),
        "filter": {"tier": tier, "auth": auth, "limit": limit, "cap": cap},
        "attempted": len(results),
        "succeeded": len(ok),
        "empty": len([r for r in results if r["status"] == "empty"]),
        "not_data": len([r for r in results if r["status"] == "not_data"]),
        "errors": len([r for r in results if r["status"] == "error"]),
        "sample_records_pulled": total_records,
        "by_status": {},
        "sources": sorted(results, key=lambda r: -r["record_count"]),
    }
    from collections import Counter
    report["by_status"] = dict(Counter(r["status"] for r in results))
    with open(REPORT, "w", encoding="utf-8") as f:
        json.dump(report, f, ensure_ascii=False, indent=2, default=str)
    return report


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--tier", default=None)
    ap.add_argument("--auth", default=None)
    ap.add_argument("--limit", type=int, default=25)
    ap.add_argument("--max", type=int, default=0)
    a = ap.parse_args()
    rep = run(tier=a.tier, auth=a.auth, limit=a.limit, cap=a.max)
    print(f"attempted={rep['attempted']} ok={rep['succeeded']} empty={rep['empty']} "
          f"not_data={rep['not_data']} errors={rep['errors']} "
          f"records_sampled={rep['sample_records_pulled']}")
    print("top sources by records:")
    for s in rep["sources"][:10]:
        print(f"  {s['record_count']:>5}  {s['status']:8} {s['name'][:50]}")
