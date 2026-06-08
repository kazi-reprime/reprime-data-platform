#!/usr/bin/env python3
"""Load the FULL data-source catalog into the Supabase `sources` table.

Reads public/data/sources_all.json (the ~1,900-source registry) and upserts every
source into `sources` (ON CONFLICT(name) DO UPDATE), enriching url/auth from the
curated public/data/sources.json where a name matches. Runs on the GitHub Actions
cron (which holds DATABASE_URL); no-ops cleanly if the DB is not configured so CI
never breaks.

Usage:  DATABASE_URL="postgresql://..." python3 pipeline/load_sources.py
Deps (CI):  pip install psycopg2-binary
"""
import json
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
# Prefer the rich dev-list catalog (endpoint/auth/tier); fall back to the bare list.
_CATALOG = os.path.join(ROOT, "public", "data", "sources_catalog.json")
ALL = _CATALOG if os.path.exists(_CATALOG) else os.path.join(ROOT, "public", "data", "sources_all.json")
CURATED = os.path.join(ROOT, "public", "data", "sources.json")


def load_json(p):
    try:
        d = json.load(open(p, encoding="utf-8"))
        return d.get("sources", d) if isinstance(d, dict) else d
    except Exception:
        return []


def main() -> int:
    dsn = os.environ.get("DATABASE_URL")
    if not dsn:
        print("DATABASE_URL not set — skipping source catalog load (no-op exit 0).")
        return 0
    try:
        import psycopg2
        import psycopg2.extras
    except ImportError:
        print("psycopg2 not installed (pip install psycopg2-binary). Skipping.", file=sys.stderr)
        return 0

    allsrc = load_json(ALL)
    curated = {s.get("name"): s for s in load_json(CURATED)}
    if not allsrc:
        print("No catalog found at %s — nothing to load." % ALL, file=sys.stderr)
        return 0

    rows, seen = [], set()
    for s in allsrc:
        name = (s.get("name") or "").strip()
        if not name or name in seen:
            continue
        seen.add(name)
        e = curated.get(name, {})
        rows.append((
            name[:500],
            s.get("category") or e.get("category"),
            s.get("provider") or e.get("provider") or "",
            s.get("endpoint") or e.get("url") or "",          # rich catalog endpoint → url
            s.get("type") or e.get("type") or "",
            s.get("tier") or "",                               # free / le10 / le50 …
            s.get("auth") or e.get("auth") or "",
        ))

    conn = psycopg2.connect(dsn)
    conn.autocommit = False
    cur = conn.cursor()
    psycopg2.extras.execute_values(
        cur,
        """INSERT INTO sources (name, category, provider, url, type, tier, auth)
           VALUES %s
           ON CONFLICT (name) DO UPDATE SET
             category = COALESCE(EXCLUDED.category, sources.category),
             provider = COALESCE(NULLIF(EXCLUDED.provider,''), sources.provider),
             url      = COALESCE(NULLIF(EXCLUDED.url,''), sources.url),
             type     = COALESCE(NULLIF(EXCLUDED.type,''), sources.type),
             tier     = COALESCE(NULLIF(EXCLUDED.tier,''), sources.tier),
             auth     = COALESCE(NULLIF(EXCLUDED.auth,''), sources.auth),
             updated_at = now()""",
        rows, page_size=500,
    )
    conn.commit()
    cur.execute("SELECT COUNT(*) FROM sources")
    total = cur.fetchone()[0]
    cur.close()
    conn.close()
    print("load_sources: upserted %d catalog rows; sources table now %d total." % (len(rows), total))
    return 0


if __name__ == "__main__":
    sys.exit(main())
