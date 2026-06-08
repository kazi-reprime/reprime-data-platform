#!/usr/bin/env python3
"""Keyed live-market connectors — EIA (energy), BEA (GDP), and REIT/market quotes
(Finnhub / Alpha Vantage / Twelve Data). Writes cached JSON to public/data/market/
so the site shows it WITHOUT needing the Supabase warehouse (no DATABASE_URL
required) — the daily cron commits public/data/ back to the repo.

Keys are read from the ENVIRONMENT only (never hardcoded). On the GitHub Actions
cron they come from repo secrets; locally from api/.env. Any source whose key is
absent (or that errors) is skipped cleanly — this never breaks CI.

Usage:  EIA_API_KEY=… BEA_API_KEY=… FINNHUB_API_KEY=… python3 pipeline/keyed_sources.py
"""
import json
import os
import ssl
import urllib.parse
import urllib.request
from datetime import datetime, timezone

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "public", "data", "market")
UA = {"User-Agent": "RePrime-DataPlatform/1.0"}
CTX = ssl.create_default_context()


def env(name):
    v = os.environ.get(name, "").strip()
    return v or None


def get(url, timeout=15):
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=timeout, context=CTX) as r:
        return json.loads(r.read().decode("utf-8", "replace"))


def write(name, obj):
    os.makedirs(OUT, exist_ok=True)
    obj["_cached_at"] = datetime.now(timezone.utc).isoformat()
    with open(os.path.join(OUT, name), "w", encoding="utf-8") as f:
        json.dump(obj, f, ensure_ascii=False, indent=2)
    print("keyed_sources: wrote market/%s" % name)


# ---- EIA v2: energy benchmarks relevant to CRE operating costs --------------
def eia():
    key = env("EIA_API_KEY")
    if not key:
        print("keyed_sources: EIA_API_KEY not set — skipping EIA")
        return
    series = {
        "natural_gas_henry_hub": "natural-gas/pri/fut/data/?frequency=monthly&data[0]=value&facets[series][]=RNGWHHD&sort[0][column]=period&sort[0][direction]=desc&length=1",
        "electricity_price_commercial": "electricity/retail-sales/data/?frequency=monthly&data[0]=price&facets[sectorid][]=COM&sort[0][column]=period&sort[0][direction]=desc&length=1",
    }
    out = {"source": "EIA v2", "series": {}}
    for label, path in series.items():
        try:
            url = "https://api.eia.gov/v2/" + path + "&api_key=" + key
            d = get(url)
            rows = (((d or {}).get("response") or {}).get("data")) or []
            if rows:
                row = rows[0]
                out["series"][label] = {"value": row.get("value") or row.get("price"), "period": row.get("period"), "units": row.get("units") or row.get("price-units")}
        except Exception as e:
            print("keyed_sources: EIA %s failed: %s" % (label, e))
    if out["series"]:
        write("energy.json", out)


# ---- BEA: U.S. GDP (NIPA T10101, latest quarter) ----------------------------
def bea():
    key = env("BEA_API_KEY")
    if not key:
        print("keyed_sources: BEA_API_KEY not set — skipping BEA")
        return
    try:
        params = {"UserID": key, "method": "GetData", "datasetname": "NIPA", "TableName": "T10101",
                  "Frequency": "Q", "Year": "LAST5", "ResultFormat": "JSON"}
        d = get("https://apps.bea.gov/api/data?" + urllib.parse.urlencode(params))
        data = ((((d or {}).get("BEAAPI") or {}).get("Results") or {}).get("Data")) or []
        # LineNumber 1 = real GDP % change
        gdp = [x for x in data if x.get("LineNumber") == "1"]
        if gdp:
            last = gdp[-1]
            write("bea_gdp.json", {"source": "BEA NIPA T10101", "metric": "Real GDP, % change (annualized)",
                                   "value": last.get("DataValue"), "period": last.get("TimePeriod")})
    except Exception as e:
        print("keyed_sources: BEA failed: %s" % e)


# ---- REIT / market quotes: Finnhub → Alpha Vantage → Twelve Data ------------
REITS = ["O", "SPG", "PLD", "AMT", "EQIX", "PSA", "VICI", "WELL"]  # major U.S. REIT tickers


def quotes():
    fh, av, td = env("FINNHUB_API_KEY"), env("ALPHA_VANTAGE_API_KEY"), env("TWELVE_DATA_API_KEY")
    out = {"source": None, "quotes": {}}
    if fh:
        out["source"] = "Finnhub"
        for sym in REITS:
            try:
                d = get("https://finnhub.io/api/v1/quote?symbol=%s&token=%s" % (sym, fh))
                if d and d.get("c"):
                    out["quotes"][sym] = {"price": d.get("c"), "change_pct": d.get("dp"), "high": d.get("h"), "low": d.get("l")}
            except Exception as e:
                print("keyed_sources: Finnhub %s failed: %s" % (sym, e))
    elif td:
        out["source"] = "Twelve Data"
        try:
            d = get("https://api.twelvedata.com/quote?symbol=%s&apikey=%s" % (",".join(REITS), td))
            for sym in REITS:
                q = (d or {}).get(sym) if isinstance(d, dict) and sym in (d or {}) else None
                if q and q.get("close"):
                    out["quotes"][sym] = {"price": float(q["close"]), "change_pct": float(q.get("percent_change") or 0)}
        except Exception as e:
            print("keyed_sources: Twelve Data failed: %s" % e)
    elif av:
        out["source"] = "Alpha Vantage"
        for sym in REITS[:4]:  # AV free tier is rate-limited; cap calls
            try:
                d = get("https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=%s&apikey=%s" % (sym, av))
                q = (d or {}).get("Global Quote") or {}
                if q.get("05. price"):
                    out["quotes"][sym] = {"price": float(q["05. price"]), "change_pct": float((q.get("10. change percent") or "0").replace("%", ""))}
            except Exception as e:
                print("keyed_sources: Alpha Vantage %s failed: %s" % (sym, e))
    else:
        print("keyed_sources: no equities key (Finnhub/AV/TD) — skipping REIT quotes")
        return
    if out["quotes"]:
        write("reit_quotes.json", out)


def main():
    eia()
    bea()
    quotes()
    print("keyed_sources: done")


if __name__ == "__main__":
    main()
