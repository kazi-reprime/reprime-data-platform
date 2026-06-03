#!/usr/bin/env python3
"""Load ingested data into Postgres/Supabase (Option A storage layer).

Reads the triage manifest + per-source results written by run_ingest.py and
upserts into the schema in pipeline/schema.sql. Safe to run with no DB: if
DATABASE_URL is unset it prints a notice and exits 0 (so CI never breaks before
the database is provisioned).

Usage:
  DATABASE_URL="postgresql://..." python3 pipeline/load_to_db.py
Dependencies (CI):  pip install psycopg2-binary
"""
import glob
import json
import os
import sys
from datetime import datetime, timezone

HERE = os.path.dirname(os.path.abspath(__file__))
MANIFEST = os.path.join(HERE, "ingest_manifest.json")
REPORT = os.path.join(HERE, "ingest_report.json")
DATA_DIR = os.path.join(HERE, "data")


def main() -> int:
    dsn = os.environ.get("DATABASE_URL")
    if not dsn:
        print("DATABASE_URL not set — skipping DB load (provision Supabase, then "
              "add DATABASE_URL secret). No-op exit 0.")
        return 0
    try:
        import psycopg2
        import psycopg2.extras
    except ImportError:
        print("psycopg2 not installed (pip install psycopg2-binary). Skipping.", file=sys.stderr)
        return 0

    manifest = json.load(open(MANIFEST, encoding="utf-8"))
    report = json.load(open(REPORT, encoding="utf-8")) if os.path.exists(REPORT) else {}
    now = datetime.now(timezone.utc)

    from psycopg2.extras import execute_values
    conn = psycopg2.connect(dsn)
    conn.autocommit = False
    cur = conn.cursor()

    # 1) bulk upsert sources (one round-trip)
    rows = [(s["name"], s.get("category"), s.get("provider"), s.get("url"),
             s.get("type"), s.get("tier"), s.get("auth")) for s in manifest["sources"]]
    execute_values(cur,
        """INSERT INTO sources (name, category, provider, url, type, tier, auth)
           VALUES %s
           ON CONFLICT (name) DO UPDATE SET
             category=EXCLUDED.category, provider=EXCLUDED.provider, url=EXCLUDED.url,
             type=EXCLUDED.type, tier=EXCLUDED.tier, auth=EXCLUDED.auth, updated_at=now()""",
        rows, page_size=1000)

    # 2) map name -> id (one query)
    cur.execute("SELECT id, name FROM sources")
    src_ids = {n: i for i, n in cur.fetchall()}

    # 3) record the run
    cur.execute(
        """INSERT INTO ingest_runs (run_at, tier, attempted, succeeded, errors, records_total)
           VALUES (%s,%s,%s,%s,%s,%s) RETURNING id""",
        (now, (report.get("filter") or {}).get("tier"), report.get("attempted", 0),
         report.get("succeeded", 0), report.get("errors", 0),
         report.get("sample_records_pulled", 0)),
    )
    run_id = cur.fetchone()[0]

    # 4) bulk insert payloads (one round-trip)
    data_rows = []
    for path in glob.glob(os.path.join(DATA_DIR, "*", "*.json")):
        try:
            doc = json.load(open(path, encoding="utf-8"))
        except Exception:  # noqa: BLE001
            continue
        src = doc.get("source", {}); res = doc.get("result", {})
        sid = src_ids.get(src.get("name"))
        if not sid:
            continue
        data_rows.append((sid, run_id, res.get("status"), res.get("record_count", 0),
                          res.get("latency_ms"), json.dumps(res.get("sample")), res.get("error")))
    if data_rows:
        execute_values(cur,
            """INSERT INTO source_data
                 (source_id, run_id, status, record_count, latency_ms, payload, error)
               VALUES %s""", data_rows, page_size=500)

    conn.commit()
    cur.close()
    conn.close()
    print(f"DB load OK — sources={len(src_ids)} run_id={run_id} payloads={len(data_rows)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
