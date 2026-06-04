#!/usr/bin/env python3
"""Ingest a curated set of CRE-relevant macro indicators from FRED (keyless CSV)
into the warehouse as one 'CRE Macro Indicators (FRED)' dataset.

Each series is fetched live; only series that actually return a value are stored
(no guessed numbers). Reliable, free, no key.

Usage:  DATABASE_URL="postgresql://..." python3 pipeline/fred_cre.py
"""
import json
import os
import ssl
import sys
import urllib.request

UA = {"User-Agent": "RePrime-DataPlatform/1.0"}
CTX = ssl.create_default_context()

SERIES = [
    ("DGS10", "10-Year Treasury Yield", "%"),
    ("DGS2", "2-Year Treasury Yield", "%"),
    ("T10Y2Y", "10Y–2Y Treasury Spread", "%"),
    ("MORTGAGE30US", "30-Year Fixed Mortgage", "%"),
    ("FEDFUNDS", "Fed Funds Rate", "%"),
    ("SOFR", "SOFR", "%"),
    ("CPIAUCSL", "CPI (All Items)", "index"),
    ("CPILFESL", "Core CPI", "index"),
    ("UNRATE", "Unemployment Rate", "%"),
    ("DRCRELEXFACBS", "CRE Loan Delinquency Rate", "%"),
    ("TLCOMCONS", "Commercial Construction Spending", "$M"),
    ("RRVRUSQ156N", "Rental Vacancy Rate", "%"),
    ("CSUSHPISA", "Case-Shiller Home Price Index", "index"),
    ("HOUST", "Housing Starts", "K units"),
    ("PERMIT", "Building Permits", "K units"),
    ("MSPUS", "Median Sales Price of Houses", "$"),
]


def latest(series_id):
    try:
        u = f"https://fred.stlouisfed.org/graph/fredgraph.csv?id={series_id}"
        txt = urllib.request.urlopen(urllib.request.Request(u, headers=UA), timeout=10, context=CTX).read().decode()
        rows = [r for r in txt.strip().splitlines() if r and not r.startswith("DATE") and "observation_date" not in r]
        for line in reversed(rows):
            parts = line.split(",")
            if len(parts) >= 2 and parts[1] not in (".", ""):
                return parts[1], parts[0]
    except Exception:  # noqa: BLE001
        pass
    return None, None


def main():
    from concurrent.futures import ThreadPoolExecutor
    def one(item):
        sid, label, unit = item
        val, date = latest(sid)
        return {"series": sid, "indicator": label, "value": val, "unit": unit, "as_of": date} if val is not None else None
    rows = []
    with ThreadPoolExecutor(max_workers=8) as ex:
        for r in ex.map(one, SERIES):
            if r:
                rows.append(r); print(f"  {r['indicator']:34} {r['value']} {r['unit']}  ({r['as_of']})")
    print(f"Built {len(rows)} CRE macro indicators.")
    dsn = os.environ.get("DATABASE_URL")
    if not dsn:
        print("DATABASE_URL not set — not loading."); return 0
    import psycopg2
    c = psycopg2.connect(dsn, connect_timeout=15); c.autocommit = True; cur = c.cursor()
    cur.execute("""INSERT INTO sources (name, category, provider, url, type, tier, auth, updated_at)
                   VALUES ('CRE Macro Indicators (FRED)','macro_indicator','FRED / St. Louis Fed',
                           'https://fred.stlouisfed.org/','RAW_API','live_api','keyless', now())
                   ON CONFLICT (name) DO UPDATE SET updated_at=now() RETURNING id""")
    sid = cur.fetchone()[0]
    cur.execute("INSERT INTO source_data (source_id, status, record_count, payload, fetched_at) VALUES (%s,'ok',%s,%s,now())",
                (sid, len(rows), json.dumps(rows)))
    cur.close(); c.close()
    print(f"Loaded CRE Macro Indicators ({len(rows)} series) into Supabase (source_id {sid}).")
    return 0


if __name__ == "__main__":
    sys.exit(main())
