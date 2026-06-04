#!/usr/bin/env python3
"""Flatten every ingested dataset's sample rows into a paginatable `data_records`
table — one row per record — so the Data Wall can render (and page through)
thousands of individual record boxes efficiently.

Usage:  DATABASE_URL="postgresql://..." python3 pipeline/flatten_records.py
"""
import json
import os
import sys

PER_SOURCE = 500  # cap rows kept per source (keeps the table bounded)


def flat(p):
    if isinstance(p, list):
        return [r.get("attributes", r) if isinstance(r, dict) else r for r in p]
    if isinstance(p, dict):
        for k in ("features", "results", "data", "items", "records"):
            if isinstance(p.get(k), list):
                return [r.get("attributes", r) if isinstance(r, dict) else r for r in p[k]]
    return []


def main():
    dsn = os.environ.get("DATABASE_URL")
    if not dsn:
        print("DATABASE_URL not set"); return 1
    import psycopg2
    from psycopg2.extras import execute_values
    c = psycopg2.connect(dsn, connect_timeout=15); c.autocommit = True; cur = c.cursor()
    cur.execute("""CREATE TABLE IF NOT EXISTS data_records (
        id BIGSERIAL PRIMARY KEY, source_name TEXT, category TEXT, fields JSONB)""")
    cur.execute("ALTER TABLE data_records ENABLE ROW LEVEL SECURITY")
    cur.execute("DROP POLICY IF EXISTS anon_read_records ON data_records")
    cur.execute("CREATE POLICY anon_read_records ON data_records FOR SELECT TO anon USING (true)")
    cur.execute("GRANT SELECT ON data_records TO anon")
    cur.execute("TRUNCATE data_records")

    cur.execute("""SELECT DISTINCT ON (sd.source_id) s.name, s.category, sd.payload
                   FROM source_data sd JOIN sources s ON s.id = sd.source_id
                   WHERE sd.status='ok' ORDER BY sd.source_id, sd.fetched_at DESC""")
    rows = []
    for name, cat, payload in cur.fetchall():
        recs = flat(payload)
        for r in recs[:PER_SOURCE]:
            if isinstance(r, dict) and r:
                rows.append((name, cat, json.dumps(r)))
    if rows:
        execute_values(cur, "INSERT INTO data_records (source_name, category, fields) VALUES %s",
                       rows, page_size=1000)
    cur.execute("SELECT count(*) FROM data_records")
    print(f"Flattened {cur.fetchone()[0]} individual record boxes into data_records.")
    cur.close(); c.close()
    return 0


if __name__ == "__main__":
    sys.exit(main())
