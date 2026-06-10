#!/usr/bin/env python3
"""Load normalized ingestion data into all Supabase tables via PostgREST.

Reads JSON from pipeline/data/_normalized/{type}.json and upserts into:
  - properties        (address-deduplicated CRE assets)
  - market_metrics    (time-series KPIs)
  - parcels           (zoning/land-use)
  - hazard_scores     (environmental/climate risk)
  - news_items        (RSS/sentiment)
  - data_records      (catch-all)

Uses the service-role key for bypass-RLS writes. Never runs client-side.

Env:  SUPABASE_URL, SUPABASE_SERVICE_KEY
Usage:
  python3 pipeline/rest_load_all.py              # load all types
  python3 pipeline/rest_load_all.py --type market_metrics  # single type
  python3 pipeline/rest_load_all.py --dry-run    # just report counts
"""
from __future__ import annotations

import argparse
import json
import os
import ssl
import sys
import time
import urllib.parse
import urllib.request

HERE = os.path.dirname(os.path.abspath(__file__))
NORMALIZED_DIR = os.path.join(HERE, "data", "_normalized")
CTX = ssl.create_default_context()
BATCH_SIZE = 200  # rows per POST â keeps payloads under ~1 MB


# ââ PostgREST HTTP helpers ââââââââââââââââââââââââââââââââââââââââââââââ

def _request(
    url: str,
    key: str,
    method: str = "GET",
    body: object = None,
    prefer: str = "return=minimal",
) -> tuple[int, str]:
    """Send an authenticated PostgREST request. Returns (status, body_text)."""
    headers = {
        "apikey": key,
        "Authorization": f"Bearer {key}",
        "Content-Type": "application/json",
        "Prefer": prefer,
    }
    data = json.dumps(body, default=str).encode("utf-8") if body is not None else None
    req = urllib.request.Request(url, data=data, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req, timeout=30, context=CTX) as resp:
            return resp.status, resp.read().decode("utf-8", errors="replace")
    except urllib.error.HTTPError as e:
        body_text = e.read().decode("utf-8", errors="replace") if e.fp else ""
        return e.code, body_text


def _upsert(
    base_url: str,
    key: str,
    table: str,
    rows: list[dict],
    on_conflict: str = "",
) -> tuple[int, int]:
    """Upsert rows in batches. Returns (inserted_count, error_count)."""
    ok_count = 0
    err_count = 0
    # Build prefer header for upsert (merge-duplicates) when conflict cols given
    prefer = "return=minimal"
    if on_conflict:
        prefer = "return=minimal,resolution=merge-duplicates"

    endpoint = f"{base_url}/rest/v1/{table}"
    if on_conflict:
        endpoint += f"?on_conflict={on_conflict}"

    for i in range(0, len(rows), BATCH_SIZE):
        batch = rows[i : i + BATCH_SIZE]
        status, body = _request(endpoint, key, "POST", batch, prefer=prefer)
        if 200 <= status < 300:
            ok_count += len(batch)
        else:
            err_count += len(batch)
            # Try inserting one-by-one to salvage what we can
            if len(batch) > 1:
                for row in batch:
                    s2, _ = _request(endpoint, key, "POST", [row], prefer=prefer)
                    if 200 <= s2 < 300:
                        ok_count += 1
                        err_count -= 1  # undo the batch error count for this row
    return ok_count, err_count


# ââ Table-specific preparation ââââââââââââââââââââââââââââââââââââââââââ

def _prep_properties(rows: list[dict]) -> list[dict]:
    """Clean property rows for PostgREST upsert."""
    out = []
    for r in rows:
        addr = (r.get("address") or "").strip()
        if not addr:
            continue
        out.append({
            "address": addr[:200],
            "city": (r.get("city") or "")[:60],
            "state": (r.get("state") or "")[:10],
            "zip": (r.get("zip") or "")[:10],
            "lat": r.get("lat"),
            "lng": r.get("lng"),
            "property_type": (r.get("property_type") or "")[:60],
            "sqft": r.get("sqft"),
            "year_built": r.get("year_built"),
            "owner": (r.get("owner") or "")[:200],
            "assessed_value": r.get("assessed_value"),
            "raw_data": r.get("raw_data"),
            "source_ids": r.get("source_ids") or [],
        })
    return out


def _prep_metrics(rows: list[dict]) -> list[dict]:
    """Clean metric rows for PostgREST upsert."""
    out = []
    for r in rows:
        val = r.get("value")
        period = r.get("period")
        if val is None or not period:
            continue
        # Ensure period is a valid date string
        period_str = str(period).strip()
        if len(period_str) < 4:
            continue
        # Pad to full date if needed
        if len(period_str) == 4:
            period_str += "-01-01"
        elif len(period_str) == 7:
            period_str += "-01"
        out.append({
            "metric_name": (r.get("metric_name") or "unknown")[:80],
            "market": (r.get("market") or "US")[:60],
            "value": float(val),
            "period": period_str,
            "source_name": (r.get("source_name") or "")[:200],
        })
    return out


def _prep_parcels(rows: list[dict]) -> list[dict]:
    """Clean parcel rows for PostgREST insert."""
    out = []
    for r in rows:
        out.append({
            "parcel_id": (r.get("parcel_id") or "")[:60],
            "city": (r.get("city") or "")[:60],
            "state": (r.get("state") or "")[:10],
            "zoning_code": (r.get("zoning_code") or "")[:30],
            "land_use": (r.get("land_use") or "")[:100],
            "lot_area_sf": r.get("lot_area_sf"),
            "raw_data": r.get("raw_data"),
        })
    return out


def _prep_hazards(rows: list[dict]) -> list[dict]:
    """Clean hazard rows for PostgREST insert."""
    out = []
    for r in rows:
        out.append({
            "location": (r.get("location") or "")[:200],
            "city": (r.get("city") or "")[:60],
            "state": (r.get("state") or "")[:10],
            "lat": r.get("lat"),
            "lng": r.get("lng"),
            "hazard_type": (r.get("hazard_type") or "general")[:30],
            "risk_score": r.get("risk_score"),
            "detail": r.get("detail"),
            "source_name": (r.get("source_name") or "")[:200],
        })
    return out


def _prep_news(rows: list[dict]) -> list[dict]:
    """Clean news rows for PostgREST insert."""
    out = []
    for r in rows:
        title = (r.get("title") or "").strip()
        if not title:
            continue
        out.append({
            "title": title[:300],
            "url": (r.get("url") or "")[:500],
            "source_name": (r.get("source_name") or "")[:200],
            "category": (r.get("category") or "news_sentiment")[:40],
            "published_at": r.get("published_at") or None,
            "summary": (r.get("summary") or "")[:500],
        })
    return out


def _prep_data_records(rows: list[dict]) -> list[dict]:
    """Clean generic data_records for PostgREST insert."""
    out = []
    for r in rows:
        out.append({
            "source_name": (r.get("source_name") or "unknown")[:300],
            "category": (r.get("category") or "other")[:40],
            "fields": r.get("fields") or r,
        })
    return out


# ââ Table config ââââââââââââââââââââââââââââââââââââââââââââââââââââââââ

TABLE_CONFIG: dict[str, dict] = {
    "properties": {
        "prep": _prep_properties,
        "on_conflict": "address,city,state",
    },
    "market_metrics": {
        "prep": _prep_metrics,
        "on_conflict": "metric_name,market,period",
    },
    "parcels": {
        "prep": _prep_parcels,
        "on_conflict": "",  # no unique constraint â plain insert
    },
    "hazard_scores": {
        "prep": _prep_hazards,
        "on_conflict": "",
    },
    "news_items": {
        "prep": _prep_news,
        "on_conflict": "",
    },
    "data_records": {
        "prep": _prep_data_records,
        "on_conflict": "",
    },
}


# ââ Main ââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ

def load_all(
    types: list[str] | None = None,
    dry_run: bool = False,
    clear_first: bool = False,
) -> dict:
    """Load normalized JSON into Supabase tables. Returns summary dict."""
    base_url = (os.environ.get("SUPABASE_URL") or "").rstrip("/")
    key = os.environ.get("SUPABASE_SERVICE_KEY") or ""

    if not base_url or not key:
        print("SUPABASE_URL / SUPABASE_SERVICE_KEY not set â skipping.")
        return {"status": "skipped", "reason": "no credentials"}

    targets = types or list(TABLE_CONFIG.keys())
    summary: dict[str, dict] = {}
    t0 = time.time()

    for tname in targets:
        cfg = TABLE_CONFIG.get(tname)
        if not cfg:
            print(f"  Unknown table type: {tname}")
            continue

        fpath = os.path.join(NORMALIZED_DIR, f"{tname}.json")
        if not os.path.isfile(fpath):
            print(f"  No data file for {tname} â skipping")
            summary[tname] = {"raw": 0, "prepped": 0, "loaded": 0, "errors": 0}
            continue

        with open(fpath, encoding="utf-8") as f:
            raw = json.load(f)
        if not isinstance(raw, list):
            raw = [raw]

        prepped = cfg["prep"](raw)
        print(f"  {tname}: {len(raw)} raw â {len(prepped)} prepped")

        if dry_run:
            summary[tname] = {"raw": len(raw), "prepped": len(prepped), "loaded": 0, "errors": 0}
            continue

        # Optionally clear existing rows before insert
        if clear_first:
            try:
                _request(f"{base_url}/rest/v1/{tname}", key, "DELETE")
                print(f"    Cleared {tname}")
            except Exception as e:
                print(f"    Clear failed: {e}")

        ok, errs = _upsert(base_url, key, tname, prepped, on_conflict=cfg["on_conflict"])
        print(f"    â loaded {ok}, errors {errs}")
        summary[tname] = {"raw": len(raw), "prepped": len(prepped), "loaded": ok, "errors": errs}

    elapsed = round(time.time() - t0, 1)
    total_loaded = sum(s.get("loaded", 0) for s in summary.values())
    total_errors = sum(s.get("errors", 0) for s in summary.values())
    print(f"\nDone in {elapsed}s â {total_loaded} rows loaded, {total_errors} errors")

    return {
        "elapsed_seconds": elapsed,
        "tables": summary,
        "total_loaded": total_loaded,
        "total_errors": total_errors,
    }


if __name__ == "__main__":
    ap = argparse.ArgumentParser(description="Load normalized data to Supabase")
    ap.add_argument("--type", default=None, help="Single table type to load")
    ap.add_argument("--dry-run", action="store_true", help="Just show counts")
    ap.add_argument("--clear", action="store_true", help="Clear tables before loading")
    a = ap.parse_args()

    types = [a.type] if a.type else None
    result = load_all(types=types, dry_run=a.dry_run, clear_first=a.clear)

    if a.dry_run:
        print("\n[DRY RUN] Would load:")
        for t, s in result.get("tables", {}).items():
            print(f"  {t}: {s['prepped']} rows")
