#!/usr/bin/env python3
"""Enrich stored sources with their TRUE total record count.

Many ArcGIS/Socrata datasets hold thousands-to-millions of rows; the ingest
samples a page. This asks each source for its real total (ArcGIS returnCountOnly,
Socrata count(*)) and updates source_data.record_count in Postgres, so the
warehouse reflects the real data universe. Uses curl (subprocess) because some
gov hosts mis-handle Python's TLS — curl is reliable here and on CI.

Usage:  DATABASE_URL="postgresql://..." python3 pipeline/enrich_counts.py
"""
import json
import os
import subprocess
import sys


def curl_json(url, timeout=12):
    try:
        out = subprocess.run(["curl", "-sS", "--max-time", str(timeout),
                              "-H", "User-Agent: RePrime-Ingest/1.0", url],
                             capture_output=True, text=True, timeout=timeout + 3)
        return json.loads(out.stdout)
    except Exception:  # noqa: BLE001
        return None


def true_count(url, timeout=7):
    u = url.lower()
    if "/rest/services/" in u or "featureserver" in u or "mapserver" in u or "/arcgis/" in u:
        base = url.split("?")[0].rstrip("/")
        if not base.lower().endswith("/query"):
            tail = base.split("/")[-1]
            base = base + ("/query" if tail.isdigit() else "/0/query")
        j = curl_json(f"{base}?where=1%3D1&returnCountOnly=true&f=json", 7)
        return (j or {}).get("count")
    if "/resource/" in u and ".json" in u:
        base = url.split("?")[0]
        j = curl_json(f"{base}?%24select=count(%2A)", 7)
        if isinstance(j, list) and j:
            try:
                return int(list(j[0].values())[0])
            except Exception:  # noqa: BLE001
                return None
    return None


def main():
    dsn = os.environ.get("DATABASE_URL")
    if not dsn:
        print("DATABASE_URL not set"); return 1
    import psycopg2
    c = psycopg2.connect(dsn, connect_timeout=15); c.autocommit = True
    cur = c.cursor()
    cur.execute("""SELECT DISTINCT s.id, s.name, s.url FROM sources s
                   JOIN source_data sd ON sd.source_id=s.id AND sd.status='ok'
                   WHERE (s.url ILIKE '%/resource/%' OR s.url ILIKE '%arcgis%'
                          OR s.url ILIKE '%/rest/services/%')""")
    rows = cur.fetchall()
    updated = 0
    for sid, name, url in rows:
        n = true_count(url)
        if isinstance(n, int) and n > 0:
            cur.execute("""UPDATE source_data SET record_count=%s
                           WHERE id = (SELECT id FROM source_data WHERE source_id=%s
                                       ORDER BY fetched_at DESC LIMIT 1)""", (n, sid))
            print(f"  {n:>12,}  {name[:48]}")
            updated += 1
    cur.close(); c.close()
    print(f"Enriched {updated} sources with true totals.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
