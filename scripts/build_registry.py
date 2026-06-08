#!/usr/bin/env python3
"""Build public/data/sources.json — the canonical source registry consumed by
/api/sources (vercel.json rewrite) and the frontend category browser.

Dedupes _extraction/master.csv by source_name and keeps the fields the UI needs.
Run:  python3 scripts/build_registry.py
"""
import csv
import json
import os
from datetime import datetime, timezone

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "_extraction", "master.csv")
OUT = os.path.join(ROOT, "public", "data", "sources.json")

KEEP = {
    "source_name": "name", "category": "category", "provider": "provider",
    "type": "type", "endpoint_url": "url", "auth": "auth",
    "price_tier": "price_tier", "cors": "cors", "update_freq": "update_freq",
    "cre_use": "cre_use", "status_flag": "status",
}


# The "611" product set = FREE sources with a programmatic API endpoint
# (excludes RSS feeds, bulk downloads, dataset portals, scrape targets, connectors).
_NON_API = {"RSS_FEED", "BULK_DOWNLOAD", "DATASET_PORTAL", "SCRAPE_TARGET", "MCP_CONNECTOR"}


def _is_free_api(row: dict) -> bool:
    price = (row.get("price_tier") or "").lower()
    has_url = bool((row.get("endpoint_url") or "").strip())
    typ = (row.get("type") or "").strip().upper()
    return ("free" in price) and has_url and (typ not in _NON_API)


def main() -> None:
    seen: dict[str, dict] = {}
    with open(SRC, newline="", encoding="utf-8") as f:
        for row in csv.DictReader(f):
            name = (row.get("source_name") or "").strip()
            if not name:
                continue
            key = name.lower()
            if key in seen:
                continue
            if not _is_free_api(row):
                continue
            rec = {dst: (row.get(src) or "").strip() for src, dst in KEEP.items()}
            rec["name"] = rec["name"][:200]
            if not rec.get("category"):
                rec["category"] = "other"
            seen[key] = rec

    sources = sorted(seen.values(), key=lambda r: (r["category"], r["name"]))
    cats = sorted({r["category"] for r in sources})
    from collections import Counter
    by_cat = dict(Counter(r["category"] for r in sources).most_common())
    now = datetime.now(timezone.utc).isoformat()

    # live search-layer count, read straight from the engine (single source of truth)
    live_layers = 0
    try:
        import importlib.util
        spec = importlib.util.spec_from_file_location("rp_search", os.path.join(ROOT, "api", "search.py"))
        mod = importlib.util.module_from_spec(spec); spec.loader.exec_module(mod)
        live_layers = len(mod.SOURCES) + len(mod.DERIVED)
    except Exception:
        pass

    doc = {
        "count": len(sources), "category_count": len(cats), "categories": cats,
        "last_updated": now, "source": "RePrime source registry (free API sources)",
        "sources": sources,
    }
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    with open(OUT, "w", encoding="utf-8") as f:
        json.dump(doc, f, ensure_ascii=False, separators=(",", ":"))

    # real stats.json + categories.json (replace fabricated 611/8223/549)
    base = os.path.join(ROOT, "public", "data")
    # Phase 2.12: stats.json ownership consolidated to pipeline/import_catalog.py — write disabled here.

    # with open(os.path.join(base, "stats.json"), "w") as f:
        json.dump({
            "cataloged_sources": len(sources),
            "category_count": len(cats),
            "live_search_layers": live_layers,
            "all_free_api": True,
            "by_category": by_cat,
            "last_updated": now,
        }, f, indent=2)
    with open(os.path.join(base, "categories.json"), "w") as f:
        json.dump({"categories": by_cat, "last_updated": now}, f, indent=2)

    print(f"Wrote {OUT}: {len(sources)} sources, {len(cats)} categories, {live_layers} live layers")
    for cat, n in by_cat.items():
        print(f"  {cat:28} {n}")


if __name__ == "__main__":
    main()
