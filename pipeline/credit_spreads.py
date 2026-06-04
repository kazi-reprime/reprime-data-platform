#!/usr/bin/env python3
"""Ingest credit spreads & debt-financing benchmarks (FRED keyless CSV) as one
'Credit Spreads & Debt Benchmarks (FRED)' dataset — relevant to CRE debt pricing.
Only series that return a value are stored.

Usage:  DATABASE_URL="postgresql://..." python3 pipeline/credit_spreads.py
"""
import datetime
import json
import os
import ssl
import sys
import urllib.request
from concurrent.futures import ThreadPoolExecutor

UA = {"User-Agent": "RePrime-DataPlatform/1.0"}
CTX = ssl.create_default_context()
COSD = (datetime.date.today() - datetime.timedelta(days=120)).isoformat()

SERIES = [
    ("BAMLC0A0CM", "IG Corporate OAS", "%"),
    ("BAMLH0A0HYM2", "High-Yield OAS", "%"),
    ("BAMLC0A4CBBB", "BBB Corporate OAS", "%"),
    ("DBAA", "Moody's Baa Corporate Yield", "%"),
    ("DAAA", "Moody's Aaa Corporate Yield", "%"),
    ("T10Y3M", "10Y–3M Treasury Spread", "%"),
    ("T10Y2Y", "10Y–2Y Treasury Spread", "%"),
    ("DPRIME", "Bank Prime Loan Rate", "%"),
    ("BAMLEMCBPIOAS", "Emerging-Markets Corporate OAS", "%"),
]


def latest(series_id):
    try:
        u = f"https://fred.stlouisfed.org/graph/fredgraph.csv?id={series_id}&cosd={COSD}"
        txt = urllib.request.urlopen(urllib.request.Request(u, headers=UA), timeout=10, context=CTX).read().decode()
        rows = [r for r in txt.strip().splitlines() if r and not r.startswith("DATE") and "observation_date" not in r]
        for line in reversed(rows):
            p = line.split(",")
            if len(p) >= 2 and p[1] not in (".", ""):
                return p[1], p[0]
    except Exception:  # noqa: BLE001
        pass
    return None, None


def main():
    def one(item):
        sid, label, unit = item
        v, d = latest(sid)
        return {"series": sid, "benchmark": label, "value": v, "unit": unit, "as_of": d} if v is not None else None
    with ThreadPoolExecutor(max_workers=9) as ex:
        rows = [r for r in ex.map(one, SERIES) if r]
    for r in rows:
        print(f"  {r['benchmark']:34} {r['value']}{r['unit']}  ({r['as_of']})")
    print(f"Built {len(rows)} credit benchmarks.")
    dsn = os.environ.get("DATABASE_URL")
    if not dsn:
        print("DATABASE_URL not set — not loading."); return 0
    import psycopg2
    c = psycopg2.connect(dsn, connect_timeout=15); c.autocommit = True; cur = c.cursor()
    cur.execute("""INSERT INTO sources (name, category, provider, url, type, tier, auth, updated_at)
                   VALUES ('Credit Spreads & Debt Benchmarks (FRED)','capital_markets','ICE BofA / Moody''s / FRED',
                           'https://fred.stlouisfed.org/','RAW_API','live_api','keyless', now())
                   ON CONFLICT (name) DO UPDATE SET updated_at=now() RETURNING id""")
    sid = cur.fetchone()[0]
    cur.execute("INSERT INTO source_data (source_id, status, record_count, payload, fetched_at) VALUES (%s,'ok',%s,%s,now())",
                (sid, len(rows), json.dumps(rows)))
    cur.close(); c.close()
    print(f"Loaded Credit Spreads ({len(rows)} benchmarks) into Supabase (source_id {sid}).")
    return 0


if __name__ == "__main__":
    sys.exit(main())
