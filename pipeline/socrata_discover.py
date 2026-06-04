#!/usr/bin/env python3
"""Discover real city open-data datasets via the Socrata catalog API (no guessed
IDs) across major metros, register each as a source, and pull rows into
data_records. Scales the warehouse + Data Wall with genuine municipal data.

Usage:  DATABASE_URL="postgresql://..." python3 socrata_discover.py [per_domain] [rows]
"""
import json
import os
import ssl
import sys
import urllib.parse
import urllib.request
from concurrent.futures import ThreadPoolExecutor

UA = {"User-Agent": "RePrime-DataPlatform/1.0"}
CTX = ssl.create_default_context()
DOMAINS = ["data.cityofnewyork.us", "data.cityofchicago.org", "data.lacity.org",
           "data.sfgov.org", "data.seattle.gov", "data.austintexas.gov",
           "data.boston.gov", "data.kingcounty.gov"]
PER_DOMAIN = int(sys.argv[1]) if len(sys.argv) > 1 else 8
ROWS = int(sys.argv[2]) if len(sys.argv) > 2 else 300


def _get(url, timeout=15):
    return json.loads(urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=timeout, context=CTX).read())


def categorize(name):
    n = name.lower()
    if any(k in n for k in ("permit", "zoning", "building", "property", "land", "housing", "construction", "violation")):
        return "housing_re"
    if any(k in n for k in ("business", "license", "economic", "tax", "budget", "salary", "expenditure")):
        return "economic"
    if any(k in n for k in ("census", "population", "demographic", "income")):
        return "demographic"
    if any(k in n for k in ("environment", "air", "water", "energy", "waste")):
        return "hazard_environmental"
    return "infrastructure"


def discover(domain):
    try:
        u = f"https://api.us.socrata.com/api/catalog/v1?domains={domain}&only=dataset&limit={PER_DOMAIN}"
        res = _get(u).get("results", [])
        out = []
        for r in res:
            rid = r.get("resource", {}).get("id"); nm = r.get("resource", {}).get("name")
            if rid and nm:
                out.append((nm.strip()[:140], f"https://{domain}/resource/{rid}.json", domain))
        return out
    except Exception:  # noqa: BLE001
        return []


def fetch_rows(url, n=ROWS):
    try:
        raw = urllib.request.urlopen(urllib.request.Request(url + f"?$limit={n}", headers=UA), timeout=18, context=CTX).read().decode("utf-8", "replace")
        j = json.loads(raw)
        return j if isinstance(j, list) else []
    except Exception:  # noqa: BLE001
        return []


def main():
    dsn = os.environ.get("DATABASE_URL")
    if not dsn:
        print("DATABASE_URL not set"); return 1
    import psycopg2
    from psycopg2.extras import execute_values
    c = psycopg2.connect(dsn, connect_timeout=15); c.autocommit = True; cur = c.cursor()

    datasets = []
    with ThreadPoolExecutor(max_workers=8) as ex:
        for lst in ex.map(discover, DOMAINS):
            datasets += lst
    print(f"Discovered {len(datasets)} datasets across {len(DOMAINS)} metros.")

    def work(d):
        nm, url, dom = d
        return nm, url, dom, fetch_rows(url)
    total_rows = 0; added = 0
    with ThreadPoolExecutor(max_workers=10) as ex:
        for nm, url, dom, rows in ex.map(work, datasets):
            if not rows:
                continue
            label = f"{nm} ({dom.split('.')[1].upper() if dom.count('.')>1 else dom})"
            cat = categorize(nm)
            cur.execute("""INSERT INTO sources (name, category, provider, url, type, tier, auth, updated_at)
                           VALUES (%s,%s,%s,%s,'RAW_API','live_api','keyless', now())
                           ON CONFLICT (name) DO UPDATE SET updated_at=now() RETURNING id""",
                        (label, cat, dom, url))
            cur.execute("DELETE FROM data_records WHERE source_name=%s", (label,))
            execute_values(cur, "INSERT INTO data_records (source_name, category, fields) VALUES %s",
                           [(label, cat, json.dumps(r)) for r in rows if isinstance(r, dict)], page_size=1000)
            total_rows += len(rows); added += 1
    cur.execute("SELECT count(*) FROM data_records")
    print(f"Added {added} datasets, {total_rows} rows. data_records now {cur.fetchone()[0]} boxes.")
    cur.close(); c.close()
    return 0


if __name__ == "__main__":
    sys.exit(main())
