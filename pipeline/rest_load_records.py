#!/usr/bin/env python3
"""Flatten the locally-cached ingested source payloads (pipeline/data/**/*.json)
into the Supabase `data_records` table via the PostgREST service key — no
Postgres password / DATABASE_URL needed.

Per source it REPLACES that source's rows (delete-by-source then insert) — the
same idempotent "refresh" semantics as deep_records.py — so re-runs don't
duplicate. Only touches the sources it loads; never mass-deletes.

Env (server-side only, never committed):
  SUPABASE_URL, SUPABASE_SERVICE_KEY
Usage:  python3 pipeline/rest_load_records.py [start_idx] [num_files] [cap_per_source]
"""
import glob
import json
import os
import ssl
import sys
import time
import urllib.parse
import urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA = os.path.join(ROOT, "pipeline", "data")
CTX = ssl.create_default_context()
POST_BATCH = 500
TIME_BUDGET = int(os.environ.get("RP_TIME_BUDGET", "40"))  # seconds; cron sets higher


def _arr_from(d):
    for k in ("features", "results", "data", "items", "records", "observations", "rows", "value", "elements"):
        if isinstance(d.get(k), list):
            return d[k]
    return None


def flatten(p):
    # unwrap our connector envelope: {source:{…}, result:{…, sample:{…}}}
    if isinstance(p, dict) and isinstance(p.get("result"), dict):
        p = p["result"]
    if isinstance(p, dict) and "sample" in p:
        s = p["sample"]
        p = s if isinstance(s, (dict, list)) else p
    if isinstance(p, list):
        items = p
    elif isinstance(p, dict):
        items = _arr_from(p)
        if items is None:
            return [p]  # single-entity payload (e.g. SEC XBRL facts) = one row
    else:
        return []
    out = []
    for r in items:
        if isinstance(r, dict):
            out.append(r.get("attributes") if isinstance(r.get("attributes"), dict) else r)
    return out


def req(url, key, method="GET", body=None):
    h = {"apikey": key, "Authorization": "Bearer " + key, "Content-Type": "application/json", "Prefer": "return=minimal"}
    data = json.dumps(body).encode("utf-8") if body is not None else None
    r = urllib.request.Request(url, data=data, headers=h, method=method)
    with urllib.request.urlopen(r, timeout=30, context=CTX) as resp:
        return resp.status


def main():
    url = (os.environ.get("SUPABASE_URL") or "").rstrip("/")
    key = os.environ.get("SUPABASE_SERVICE_KEY") or ""
    if not url or not key:
        print("SUPABASE_URL / SUPABASE_SERVICE_KEY not set — skipping (no-op).")
        return 0
    start = int(sys.argv[1]) if len(sys.argv) > 1 else 0
    num = int(sys.argv[2]) if len(sys.argv) > 2 else 9999
    cap = int(sys.argv[3]) if len(sys.argv) > 3 else 300

    # largest payloads first → most rows per round-trip
    files = sorted(glob.glob(os.path.join(DATA, "*", "*.json")), key=os.path.getsize, reverse=True)[start:start + num]
    t0 = time.time()
    total, done = 0, 0
    for fp in files:
        if time.time() - t0 > TIME_BUDGET:
            print("time budget hit at file %d" % (start + done)); break
        category = os.path.basename(os.path.dirname(fp))
        try:
            payload = json.load(open(fp, encoding="utf-8"))
        except Exception:
            continue
        src = ""
        if isinstance(payload, dict):
            src = str(payload.get("source") or "")
        if not src:
            src = os.path.splitext(os.path.basename(fp))[0].replace("-", " ").title()
        rows = flatten(payload)[:cap]
        if not rows:
            done += 1; continue
        # replace this source's rows (idempotent refresh — no duplicates)
        try:
            req(url + "/rest/v1/data_records?source_name=eq." + urllib.parse.quote(src), key, "DELETE")
        except Exception:
            pass
        recs = [{"source_name": src[:300], "category": category, "fields": r} for r in rows if isinstance(r, dict)]
        for i in range(0, len(recs), POST_BATCH):
            try:
                req(url + "/rest/v1/data_records", key, "POST", recs[i:i + POST_BATCH]); total += len(recs[i:i + POST_BATCH])
            except Exception as e:
                print("  insert fail %s: %s" % (src[:40], str(e)[:80]))
        done += 1
    print("rest_load_records: processed %d files (idx %d-%d), inserted %d rows" % (done, start, start + done, total))
    return 0


if __name__ == "__main__":
    sys.exit(main())
