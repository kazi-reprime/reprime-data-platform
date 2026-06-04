#!/usr/bin/env python3
"""Ingest major-REIT financials from SEC EDGAR (free, no key) into the warehouse.

Uses SEC's authoritative ticker->CIK map, then XBRL companyconcept for Assets,
Revenues, and Net Income (latest 10-K). High-value CRE data; CIKs are never
guessed. Stores one 'REIT Financials (SEC EDGAR)' dataset in Postgres.

Usage:  DATABASE_URL="postgresql://..." python3 pipeline/sec_reits.py
"""
import json
import os
import ssl
import sys
import time
import urllib.request

UA = {"User-Agent": "RePrime-DataPlatform/1.0 (contact g@floridastatetrust.com)"}
CTX = ssl.create_default_context()
REITS = ["O", "PLD", "SPG", "WELL", "DLR", "EQIX", "AVB", "PSA",
         "BXP", "VTR", "EXR", "MAA", "KIM", "FRT", "ARE"]


def _get(url):
    return json.loads(urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=12, context=CTX).read())


def _latest(cik, tag):
    try:
        c = _get(f"https://data.sec.gov/api/xbrl/companyconcept/CIK{cik:010d}/us-gaap/{tag}.json")
        usd = [x for x in c.get("units", {}).get("USD", []) if x.get("form") in ("10-K", "10-Q")]
        if not usd:
            return None, None
        x = sorted(usd, key=lambda r: r["end"])[-1]
        return x["val"], x["end"]
    except Exception:  # noqa: BLE001
        return None, None


def build_rows():
    tmap = _get("https://www.sec.gov/files/company_tickers.json")
    byt = {v["ticker"]: (v["cik_str"], v["title"]) for v in tmap.values()}
    rows = []
    for t in REITS:
        if t not in byt:
            continue
        cik, name = byt[t]
        assets, asof = _latest(cik, "Assets"); time.sleep(0.12)
        rev, _ = _latest(cik, "Revenues"); time.sleep(0.12)
        ni, _ = _latest(cik, "NetIncomeLoss"); time.sleep(0.12)
        rows.append({"ticker": t, "company": name, "cik": cik,
                     "total_assets_usd": assets, "revenues_usd": rev,
                     "net_income_usd": ni, "as_of": asof})
        print(f"  {t:5} {name[:34]:36} assets={'$%0.1fB'%(assets/1e9) if assets else 'n/a'}")
    return rows


def main():
    rows = build_rows()
    rows = [r for r in rows if r["total_assets_usd"]]
    print(f"Built {len(rows)} REIT financial rows.")
    dsn = os.environ.get("DATABASE_URL")
    if not dsn:
        print("DATABASE_URL not set — not loading."); return 0
    import psycopg2
    c = psycopg2.connect(dsn, connect_timeout=15); c.autocommit = True; cur = c.cursor()
    cur.execute("""INSERT INTO sources (name, category, provider, url, type, tier, auth, updated_at)
                   VALUES ('REIT Financials (SEC EDGAR)','capital_markets','SEC EDGAR',
                           'https://data.sec.gov/api/xbrl/','RAW_API','live_api','keyless', now())
                   ON CONFLICT (name) DO UPDATE SET updated_at=now() RETURNING id""")
    sid = cur.fetchone()[0]
    cur.execute("""INSERT INTO source_data (source_id, status, record_count, payload, fetched_at)
                   VALUES (%s,'ok',%s,%s, now())""", (sid, len(rows), json.dumps(rows)))
    cur.close(); c.close()
    print(f"Loaded REIT financials dataset (source_id {sid}, {len(rows)} REITs) into Supabase.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
