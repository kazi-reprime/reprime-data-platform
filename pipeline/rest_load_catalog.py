#!/usr/bin/env python3
"""Load the source catalog into Supabase via the PostgREST Data API using the
SERVICE-ROLE key — no Postgres password / DATABASE_URL required.

Reads public/data/sources_catalog.json and UPSERTS every source into the
`sources` table (ON CONFLICT name → merge). Idempotent; never deletes.

Credentials come from the ENVIRONMENT only (never hardcoded / committed):
  SUPABASE_URL          e.g. https://<ref>.supabase.co
  SUPABASE_SERVICE_KEY  the service-role secret (bypasses RLS — server-side only)

Usage:  SUPABASE_URL=… SUPABASE_SERVICE_KEY=… python3 pipeline/rest_load_catalog.py
"""
import json
import os
import ssl
import sys
import urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CATALOG = os.path.join(ROOT, "public", "data", "sources_catalog.json")
CTX = ssl.create_default_context()
BATCH = 200


def main() -> int:
    url = (os.environ.get("SUPABASE_URL") or "").rstrip("/")
    key = os.environ.get("SUPABASE_SERVICE_KEY") or ""
    if not url or not key:
        print("SUPABASE_URL / SUPABASE_SERVICE_KEY not set — skipping (no-op exit 0).")
        return 0
    try:
        cat = json.load(open(CATALOG, encoding="utf-8"))
        rows_in = cat.get("sources", cat) if isinstance(cat, dict) else cat
    except Exception as e:
        print("Could not read catalog: %s" % e, file=sys.stderr)
        return 0

    # dedupe by name (the table's unique key) + map to columns
    seen, rows = set(), []
    for s in rows_in:
        name = (s.get("name") or "").strip()[:500]
        if not name or name in seen:
            continue
        seen.add(name)
        rows.append({
            "name": name,
            "category": s.get("category") or "other",
            "provider": s.get("provider") or "",
            "url": s.get("endpoint") or "",
            "type": s.get("type") or "REST API",
            "tier": s.get("tier") or "",
            "auth": s.get("auth") or "",
        })

    endpoint = url + "/rest/v1/sources?on_conflict=name"
    headers = {
        "apikey": key, "Authorization": "Bearer " + key,
        "Content-Type": "application/json",
        "Prefer": "resolution=merge-duplicates,return=minimal",
    }
    ok = 0
    for i in range(0, len(rows), BATCH):
        chunk = rows[i:i + BATCH]
        body = json.dumps(chunk).encode("utf-8")
        req = urllib.request.Request(endpoint, data=body, headers=headers, method="POST")
        try:
            with urllib.request.urlopen(req, timeout=30, context=CTX) as r:
                if r.status in (200, 201, 204):
                    ok += len(chunk)
        except Exception as e:
            print("batch %d failed: %s" % (i // BATCH, e), file=sys.stderr)
    print("rest_load_catalog: upserted %d / %d catalog rows into Supabase sources." % (ok, len(rows)))
    return 0


if __name__ == "__main__":
    sys.exit(main())
