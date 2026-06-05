#!/usr/bin/env python3
"""Refresh public/data/reprime.json from the live reprime.com homepage.

Runs on the GitHub Actions cron (NOT IP-blocked, no time limit). The existing
public/data/reprime.json is the curated, verified baseline; this script overlays
the volatile, live parts (market ticker stats, team photo URLs, freshness stamp)
on top of it and writes it back. It is conservative by design: a field is only
updated when parsing yields a confident result, otherwise the curated baseline
is preserved — a markup change on reprime.com can never blank the site.

Usage:  python3 pipeline/scrape_reprime.py
"""
import json
import os
import re
import ssl
import sys
import urllib.request
from datetime import datetime, timezone

URL = "https://reprime.com/"
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "public", "data", "reprime.json")
UA = {"User-Agent": "RePrime-DataPlatform/1.0 (+https://reprime-data-platform.vercel.app)"}
CTX = ssl.create_default_context()


def fetch(url):
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=25, context=CTX) as r:
        return r.read().decode("utf-8", "replace")


def strip_tags(html):
    html = re.sub(r"<(script|style)[^>]*>.*?</\1>", " ", html, flags=re.S | re.I)
    return re.sub(r"<[^>]+>", " ", html)


def parse_market(html):
    """The ticker is a run of 'Label **Value**' pairs near the top of the page.
    Pull bolded value tokens with their preceding label text."""
    text = re.sub(r"\s+", " ", strip_tags(html))
    # values look like $875B, 18.6%, 4.67%, $112.6B ▲18% YoY, 7.55% ▲41bps ...
    pat = re.compile(r"([A-Za-z][A-Za-z0-9 ./'\-]{3,45}?)\s*(\$?[0-9][0-9.,]*\s*(?:B|T|%|/SF|bps)?[^A-Za-z<]{0,18}?(?:YoY|QoQ|bps|Record High)?)")
    out = []
    for m in pat.finditer(text):
        label = m.group(1).strip(" -·")
        value = m.group(2).strip()
        if len(label) < 4 or not re.search(r"[0-9]", value):
            continue
        if any(k in label for k in ("Vacancy", "Treasury", "Cap Rate", "CMBS", "Debt", "Investment", "Rents", "Default", "Delinquenc", "Maturities", "Forecast")):
            out.append({"label": label, "value": value, "source": ""})
        if len(out) >= 16:
            break
    return out


def parse_team_photos(html, team):
    """Update each team member's photo URL if the same filename stem is still
    present on the live page (defends against CDN path changes)."""
    imgs = re.findall(r'https://reprime\.com/wp-content/uploads/[^\s"\')]+\.(?:png|jpg|jpeg|webp)', html)
    by_stem = {}
    for u in imgs:
        by_stem[u.rsplit("/", 1)[-1].split("-modified")[0][:16]] = u
    for m in team:
        stem = m.get("photo", "").rsplit("/", 1)[-1].split("-modified")[0][:16]
        if stem and stem in by_stem:
            m["photo"] = by_stem[stem]
    return team


def main():
    try:
        data = json.load(open(OUT, encoding="utf-8"))
    except Exception:
        data = {}

    status = "ok"
    try:
        html = fetch(URL)
        mk = parse_market(html)
        if len(mk) >= 8:
            # keep curated sources where labels match, else take parsed
            cur = {x["label"]: x.get("source", "") for x in data.get("market", [])}
            for x in mk:
                if x["label"] in cur:
                    x["source"] = cur[x["label"]]
            data["market"] = mk
        if data.get("team"):
            data["team"] = parse_team_photos(html, data["team"])
    except Exception as e:
        status = "fetch-failed: %s" % e
        print("scrape_reprime: %s (baseline preserved)" % status, file=sys.stderr)

    data["_source"] = URL.rstrip("/")
    data["_scraped_at"] = datetime.now(timezone.utc).isoformat()
    data["_source_status"] = status

    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    with open(OUT, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print("scrape_reprime: wrote %s (status=%s, market=%d, team=%d)" % (
        OUT, status, len(data.get("market", [])), len(data.get("team", []))))


if __name__ == "__main__":
    main()
