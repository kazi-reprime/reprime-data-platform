#!/usr/bin/env python3
"""Build the canonical source catalog from the curated dev workbook.

Reads pipeline/sources_dev_list.xlsx (the "611 REPRIME_FINAL_DEV_LIST_v3" — 7
sheets, ALL-1155 superset, richly annotated: endpoint, auth, monthly cost, free
tier, signup URL, category, REPR-id) and emits:
  • public/data/sources_catalog.json  — full rich catalog (front-end explorer)
  • public/data/sources_all.json      — bare shape (back-compat count readers)
  • public/data/stats.json            — by_category / tier / keyless (drives viz)

Reproducible: re-run whenever the workbook changes. Deps: openpyxl.
Usage:  python3 pipeline/import_catalog.py
"""
import collections
import json
import os

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
XLSX = os.path.join(HERE, "sources_dev_list.xlsx")
OUT = os.path.join(ROOT, "public", "data")

_FIX = [("â€”", "—"), ("â€“", "–"),
        ("â€™", "’"), ("â€œ", "“"),
        ("â€", "”"), ("Â", "")]


def fix(s):
    if s is None:
        return ""
    s = str(s)
    for a, b in _FIX:
        s = s.replace(a, b)
    return s.strip()


def tier(cost):
    try:
        c = float(cost)
    except (TypeError, ValueError):
        c = 0.0
    if c <= 0:
        return "free"
    if c <= 10:
        return "le10"
    if c <= 50:
        return "le50"
    if c <= 100:
        return "le100"
    return "gt100"


def main():
    try:
        import openpyxl
    except ImportError:
        print("openpyxl not installed (pip install openpyxl). Skipping.")
        return 0
    wb = openpyxl.load_workbook(XLSX, read_only=True, data_only=True)

    def rows(sheet):
        ws = wb[sheet]
        data = list(ws.iter_rows(values_only=True))
        hdr = [fix(h) for h in data[0]]
        return [{hdr[i]: r[i] for i in range(len(hdr)) if i < len(r)} for r in data[1:] if any(r)]

    allrows = rows("ALL 1155")
    easy_ids = set(fix(x.get("ID")) for x in rows("EASY TO CONNECT — 611"))

    cat, seen = [], set()
    for r in allrows:
        rid = fix(r.get("ID")) or fix(r.get("Source Name"))
        if rid in seen:
            continue
        seen.add(rid)
        auth = fix(r.get("Auth Required"))
        cost = r.get("Monthly Cost (USD)")
        try:
            costf = float(cost)
        except (TypeError, ValueError):
            costf = 0.0
        cat.append({
            "id": fix(r.get("ID")), "name": fix(r.get("Source Name")), "provider": fix(r.get("Provider")),
            "category": fix(r.get("Category")) or "other", "type": fix(r.get("Source Type")) or "REST API",
            "provides": fix(r.get("What It Provides")), "cost": costf, "tier": tier(cost), "auth": auth,
            "keyless": auth.lower().startswith("no auth"), "free_tier": fix(r.get("Free Tier")),
            "endpoint": fix(r.get("Endpoint URL")), "homepage": fix(r.get("Provider Homepage")),
            "signup": fix(r.get("Pricing / Signup URL")), "update_freq": fix(r.get("Update Frequency")),
            "notes": fix(r.get("Notes")), "easy": fix(r.get("ID")) in easy_ids,
        })

    os.makedirs(OUT, exist_ok=True)
    with open(os.path.join(OUT, "sources_catalog.json"), "w", encoding="utf-8") as f:
        json.dump({"_source": "611 REPRIME_FINAL_DEV_LIST_v3.xlsx", "count": len(cat), "sources": cat}, f, ensure_ascii=False)
    with open(os.path.join(OUT, "sources_all.json"), "w", encoding="utf-8") as f:
        json.dump({"sources": [{"name": c["name"], "category": c["category"], "provider": c["provider"], "type": c["type"]} for c in cat]}, f, ensure_ascii=False)
    bycat = collections.Counter(c["category"] for c in cat)
    bytier = collections.Counter(c["tier"] for c in cat)
    with open(os.path.join(OUT, "stats.json"), "w", encoding="utf-8") as f:
        json.dump({"cataloged_sources": len(cat), "category_count": len(bycat), "live_search_layers": 20,
                   "all_free_api": False, "by_category": dict(bycat.most_common()), "by_tier": dict(bytier),
                   "keyless": sum(1 for c in cat if c["keyless"]), "easy_connect": sum(1 for c in cat if c["easy"]),
                   "last_updated": "2026-06-08T00:00:00Z"}, f, ensure_ascii=False, indent=2)
    print("import_catalog: %d sources (%d keyless, %d free, %d <=$10)" % (
        len(cat), sum(1 for c in cat if c["keyless"]), bytier["free"], bytier["le10"]))
    return 0


if __name__ == "__main__":
    main()
