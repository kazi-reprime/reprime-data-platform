#!/usr/bin/env python3
"""Deep-pull rows from the big working Socrata/ArcGIS datasets straight into the
`data_records` table (up to N rows each) so the Data Wall scales into the
thousands without bloating source_data. Replaces each source's record rows.

Usage:  DATABASE_URL="postgresql://..." python3 pipeline/deep_records.py [N]
"""
import json
import os
import ssl
import sys
import urllib.request
from concurrent.futures import ThreadPoolExecutor

UA = {"User-Agent": "RePrime-DataPlatform/1.0"}
CTX = ssl.create_default_context()
N = int(sys.argv[1]) if len(sys.argv) > 1 else 2000


def fetch_rows(url, n=N):
    low = url.lower()
    try:
        if "/resource/" in low and ".json" in low:
            u = url.split("?")[0] + f"?$limit={n}"
        elif "arcgis" in low or "/rest/services/" in low:
            base = url.split("?")[0].rstrip("/")
            if not base.lower().endswith("/query"):
                tail = base.split("/")[-1]
                base = base + ("/query" if tail.isdigit() else "/0/query")
            u = f"{base}?where=1%3D1&outFields=*&resultRecordCount={n}&f=json"
        else:
            return []
        raw = urllib.request.urlopen(urllib.request.Request(u, headers=UA), timeout=20, context=CTX).read().decode("utf-8", "replace")
        j = json.loads(raw)
        rows = j if isinstance(j, list) else (j.get("features") or j.get("results") or j.get("data") or [])
        return [r.get("attributes", r) if isinstance(r, dict) else r for r in rows if isinstance(r, dict)]
    except Exception:  # noqa: BLE001
        return []


def main():
    dsn = os.environ.get("DATABASE_URL")
    if not dsn:
        print("DATABASE_URL not set"); return 1
    import psycopg2
    from psycopg2.extras import execute_values
    c = psycopg2.connect(dsn, connect_timeout=15); c.autocommit = True; cur = c.cursor()
    cur.execute("""SELECT DISTINCT s.name, s.category, s.url FROM sources s
                   JOIN source_data sd ON sd.source_id=s.id AND sd.status='ok'
                   WHERE s.url ILIKE '%/resource/%' OR s.url ILIKE '%arcgis%' OR s.url ILIKE '%/rest/services/%'""")
    targets = cur.fetchall()

    def work(t):
        name, cat, url = t
        return name, cat, fetch_rows(url)
    total = 0
    with ThreadPoolExecutor(max_workers=10) as ex:
        for name, cat, rows in ex.map(work, targets):
            if not rows:
                continue
            cur.execute("DELETE FROM data_records WHERE source_name=%s", (name,))
            execute_values(cur, "INSERT INTO data_records (source_name, category, fields) VALUES %s",
                           [(name, cat, json.dumps(r)) for r in rows], page_size=1000)
            total += len(rows)
            print(f"  {len(rows):>5}  {name[:46]}")
    cur.execute("SELECT count(*) FROM data_records")
    print(f"Deep-pulled {total} rows; data_records now {cur.fetchone()[0]} boxes.")
    cur.close(); c.close()
    return 0


if __name__ == "__main__":
    sys.exit(main())
