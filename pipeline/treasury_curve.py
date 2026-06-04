#!/usr/bin/env python3
"""Ingest the full U.S. Treasury yield curve (all tenors, FRED keyless CSV) as one
'U.S. Treasury Yield Curve' dataset. Foundational for CRE cap-rate benchmarking
and debt pricing. Only tenors that actually return a value are stored.

Usage:  DATABASE_URL="postgresql://..." python3 pipeline/treasury_curve.py
"""
import json
import os
import ssl
import sys
import urllib.request
from concurrent.futures import ThreadPoolExecutor

UA = {"User-Agent": "RePrime-DataPlatform/1.0"}
CTX = ssl.create_default_context()

TENORS = [
    ("DGS1MO", "1 Month"), ("DGS3MO", "3 Month"), ("DGS6MO", "6 Month"),
    ("DGS1", "1 Year"), ("DGS2", "2 Year"), ("DGS3", "3 Year"),
    ("DGS5", "5 Year"), ("DGS7", "7 Year"), ("DGS10", "10 Year"),
    ("DGS20", "20 Year"), ("DGS30", "30 Year"),
]


def latest(series_id):
    try:
        u = f"https://fred.stlouisfed.org/graph/fredgraph.csv?id={series_id}&cosd=2026-02-04"
        txt = urllib.request.urlopen(urllib.request.Request(u, headers=UA), timeout=10, context=CTX).read().decode()
        rows = [r for r in txt.strip().splitlines() if r and not r.startswith("DATE") and "observation_date" not in r]
        for line in reversed(rows):
            p = line.split(",")
            if len(p) >= 2 and p[1] not in (".", ""):
                return float(p[1]), p[0]
    except Exception:  # noqa: BLE001
        pass
    return None, None


def main():
    order = {t[0]: i for i, t in enumerate(TENORS)}
    def one(item):
        sid, label = item
        v, d = latest(sid)
        return {"tenor": label, "series": sid, "yield_pct": v, "as_of": d} if v is not None else None
    rows = []
    with ThreadPoolExecutor(max_workers=11) as ex:
        rows = [r for r in ex.map(one, TENORS) if r]
    rows.sort(key=lambda r: order[r["series"]])
    for r in rows:
        print(f"  {r['tenor']:9} {r['yield_pct']}%  ({r['as_of']})")
    print(f"Built {len(rows)} curve points.")
    dsn = os.environ.get("DATABASE_URL")
    if not dsn:
        print("DATABASE_URL not set — not loading."); return 0
    import psycopg2
    c = psycopg2.connect(dsn, connect_timeout=15); c.autocommit = True; cur = c.cursor()
    cur.execute("""INSERT INTO sources (name, category, provider, url, type, tier, auth, updated_at)
                   VALUES ('U.S. Treasury Yield Curve','capital_markets','U.S. Treasury / FRED',
                           'https://fred.stlouisfed.org/','RAW_API','live_api','keyless', now())
                   ON CONFLICT (name) DO UPDATE SET updated_at=now() RETURNING id""")
    sid = cur.fetchone()[0]
    cur.execute("INSERT INTO source_data (source_id, status, record_count, payload, fetched_at) VALUES (%s,'ok',%s,%s,now())",
                (sid, len(rows), json.dumps(rows)))
    cur.close(); c.close()
    print(f"Loaded Treasury Yield Curve ({len(rows)} tenors) into Supabase (source_id {sid}).")
    return 0


if __name__ == "__main__":
    sys.exit(main())
