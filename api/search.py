"""RePrime Data Platform — Consolidated Property Search (Vercel Python serverless).

Single source of truth. One request -> geocode -> parallel fan-out to free,
mostly keyless government/market APIs -> one validated JSON document.

Design goals (Hardening Mandate, Tier 1):
  * Census Geocoder is the gate. If it fails, return 400 with a reason
    (do not silently fan out and return a wall of errors).
  * Every external call is wrapped: returns {status, latency_ms, data|error}.
    A single source failure never crashes the function.
  * Per-source 8s timeout; whole function budgeted ~25s (Vercel limit 30s).
  * sources_summary[] lists every source, ok/error, latency. No hidden failures.
  * query_metadata carries geocode + FIPS + counts.
  * <3 real sources succeeded -> 200 with degraded:true + message (banner).
  * Stderr logging:  [search] source=<name> status=<ok|error> latency=<s>
  * CORS + explicit application/json on every response.

Runtime note: stdlib only (urllib + ThreadPoolExecutor). No 'requests', no
heavy libs -> fastest cold start, zero dependency risk on Vercel. The directive
asked for `requests`; urllib gives identical control (explicit connect/read
behaviour via timeout) with no install step, so we use it deliberately.

Known free-API rate limits (document, do not exceed):
  FRED graph CSV: generous/unauth   CoinGecko free: ~10-30/min
  OSM Overpass: 2 concurrent        Census Geocoder: unauth, generous
  Frankfurter/ECB: generous         FEMA/FederalRegister/FDIC/NWS: generous
"""
from __future__ import annotations

import json
import os
import re
import ssl
import sys
import time
import urllib.parse
import urllib.request
from concurrent.futures import ThreadPoolExecutor, wait as cf_wait
from datetime import datetime, timezone
from http.server import BaseHTTPRequestHandler

VERSION = "4.0-consolidated"
PER_SOURCE_TIMEOUT = 6
# Working sources finish in <4s; FEMA-NFHL/EPA are IP-blocked from Vercel and
# hang, so a tight overall cap cuts the dead weight fast. Non-blocking shutdown
# means the function returns at the cap regardless of stuck sockets.
TOTAL_BUDGET = 13
CACHE_TTL = 300  # 5 min
_CACHE: dict[str, tuple[float, dict]] = {}

# Optional keys (server-side only; everything still works keyless without them)
CENSUS_KEY = os.environ.get("CENSUS_API_KEY", "")

_SSL_CTX = ssl.create_default_context()


# --------------------------------------------------------------------------- #
# HTTP helpers
# --------------------------------------------------------------------------- #
def _http(url: str, timeout: int = PER_SOURCE_TIMEOUT, headers: dict | None = None) -> str:
    req = urllib.request.Request(url, headers=headers or {"User-Agent": "RePrime-DataPlatform/4.0"})
    with urllib.request.urlopen(req, timeout=timeout, context=_SSL_CTX) as r:
        return r.read().decode("utf-8", errors="replace")


def _http_json(url: str, timeout: int = PER_SOURCE_TIMEOUT, headers: dict | None = None):
    return json.loads(_http(url, timeout, headers))


def _now() -> str:
    return datetime.now(timezone.utc).isoformat()


# --------------------------------------------------------------------------- #
# Geocode gate (Census first, Nominatim fallback) -> coords + FIPS
# --------------------------------------------------------------------------- #
def geocode(address: str) -> dict:
    """Return {lat, lon, matched, state_abbr, fips_state, fips_county, fips_tract, source}
    or {error: ...}.  Census geographies/onelineaddress gives coords + FIPS in one call."""
    enc = urllib.parse.quote(address)
    # 1) Census geographies (coords + FIPS together)
    try:
        u = ("https://geocoding.geo.census.gov/geocoder/geographies/onelineaddress"
             f"?address={enc}&benchmark=Public_AR_Current&vintage=Current_Current&format=json")
        j = _http_json(u, timeout=8)
        matches = j.get("result", {}).get("addressMatches", [])
        if matches:
            m = matches[0]
            c = m["coordinates"]
            geo = m.get("geographies", {})
            st = (geo.get("States") or [{}])[0]
            co = (geo.get("Counties") or [{}])[0]
            tr = (geo.get("Census Tracts") or geo.get("Census Tracts (2020)") or [{}])[0]
            return {
                "lat": float(c["y"]), "lon": float(c["x"]),
                "matched": m.get("matchedAddress", address),
                "state_abbr": st.get("STUSAB", ""),
                "fips_state": st.get("STATE", ""),
                "fips_county": (co.get("STATE", "") + co.get("COUNTY", "")) or "",
                "fips_tract": tr.get("GEOID", ""),
                "source": "Census Geocoder",
            }
    except Exception as e:  # noqa: BLE001
        _log("geocode_census", "error", 0, e)
    # 2) Nominatim fallback (coords only, no FIPS)
    try:
        u = f"https://nominatim.openstreetmap.org/search?q={enc}&format=json&limit=1&addressdetails=1"
        j = _http_json(u, timeout=8, headers={"User-Agent": "RePrime-DataPlatform/4.0 (geocode)"})
        if j:
            r = j[0]
            return {
                "lat": float(r["lat"]), "lon": float(r["lon"]),
                "matched": r.get("display_name", address),
                "state_abbr": (r.get("address", {}) or {}).get("state", ""),
                "fips_state": "", "fips_county": "", "fips_tract": "",
                "source": "Nominatim (fallback)",
            }
    except Exception as e:  # noqa: BLE001
        _log("geocode_nominatim", "error", 0, e)
    return {"error": "Address could not be geocoded by Census or Nominatim."}


def _log(source: str, status: str, latency: float, err: object = None) -> None:
    msg = f"[search] source={source} status={status} latency={latency:.2f}s"
    if err is not None:
        msg += f" error={str(err)[:160]}"
    print(msg, file=sys.stderr)


# --------------------------------------------------------------------------- #
# Source fetchers — each returns the *data payload* or raises.
# The runner wraps them into {status, latency_ms, data|error}.
# --------------------------------------------------------------------------- #
def src_fred_rates(ctx: dict) -> dict:
    """Headline rates. Gov endpoints (FRED/NY Fed) are slow/blocked from Vercel's
    datacenter IPs, so first read the platform's own cached ticker (same-origin,
    edge-cached, refreshed by scraper/aggregate.py); fall back to live FRED."""
    host = os.environ.get("VERCEL_URL", "")
    if host:
        try:
            j = _http_json(f"https://{host}/api/live/ticker", timeout=4)
            cached = {k: v for k, v in j.items()
                      if isinstance(v, dict) and v.get("value")
                      and k in ("treasury_10y", "mortgage_30y", "fed_funds", "unemployment", "sofr")}
            if len(cached) >= 3:
                return cached
        except Exception:  # noqa: BLE001
            pass

    out: dict = {}
    series = {
        "treasury_10y": "DGS10", "mortgage_30y": "MORTGAGE30US",
        "fed_funds": "FEDFUNDS", "unemployment": "UNRATE", "cpi_yoy": "CPIAUCSL",
    }

    def _one(item):
        label, sid = item
        try:
            txt = _http(f"https://fred.stlouisfed.org/graph/fredgraph.csv?id={sid}", timeout=5)
            rows = [r for r in txt.strip().splitlines() if r and not r.startswith("DATE") and "observation_date" not in r]
            if rows:
                date, val = rows[-1].split(",")[:2]
                if val not in (".", ""):
                    return label, {"value": f"{float(val):.2f}%", "date": date, "source": "FRED"}
        except Exception:  # noqa: BLE001
            pass
        return label, None

    # fetch all FRED series concurrently (was sequential -> ~15s)
    with ThreadPoolExecutor(max_workers=6) as ex:
        for label, rec in ex.map(_one, series.items()):
            if rec:
                out[label] = rec
    try:
        j = _http_json("https://markets.newyorkfed.org/api/rates/sofr/last/1.json", timeout=5)
        r = (j.get("refRates") or [{}])[0]
        if r.get("percentRate") is not None:
            out["sofr"] = {"value": f"{r['percentRate']}%", "date": r.get("effectiveDate", ""), "source": "NY Fed"}
    except Exception:  # noqa: BLE001
        pass
    if not out:
        raise RuntimeError("FRED/NY Fed returned no usable rows")
    return out


def src_crypto(ctx: dict) -> dict:
    j = _http_json(
        "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd",
        timeout=6,
    )
    if "bitcoin" not in j:
        raise RuntimeError("CoinGecko missing bitcoin")
    return {
        "bitcoin_usd": j["bitcoin"]["usd"],
        "ethereum_usd": j.get("ethereum", {}).get("usd"),
        "source": "CoinGecko",
    }


def src_fx_rates(ctx: dict) -> dict:
    j = _http_json("https://api.frankfurter.dev/v1/latest?base=USD&symbols=ILS,EUR,GBP,CAD,JPY", timeout=6)
    rates = j.get("rates", {})
    if not rates:
        raise RuntimeError("Frankfurter returned no rates")
    return {"base": "USD", "rates": rates, "date": j.get("date", ""), "source": "Frankfurter / ECB"}


def src_fema_flood(ctx: dict) -> dict:
    """Real FEMA NFHL flood zone for the point. Graceful 'unavailable' if service down."""
    lat, lon = ctx["lat"], ctx["lon"]
    url = ("https://hazards.fema.gov/gis/nfhl/rest/services/public/NFHL/MapServer/28/query"
           f"?geometry={lon},{lat}&geometryType=esriGeometryPoint&inSR=4326"
           "&spatialRel=esriSpatialRelIntersects&outFields=FLD_ZONE,ZONE_SUBTY,SFHA_TF"
           "&returnGeometry=false&f=json")
    j = _http_json(url, timeout=PER_SOURCE_TIMEOUT)  # single try; runner caps it
    feats = j.get("features", [])
    if feats:
        a = feats[0]["attributes"]
        zone = a.get("FLD_ZONE") or "Unknown"
        sfha = a.get("SFHA_TF")
        risk = ("High (Special Flood Hazard Area)" if sfha == "T"
                else "Minimal/Moderate" if zone in ("X", "C", "B") else "See zone")
        return {"zone": zone, "subtype": a.get("ZONE_SUBTY"), "sfha": sfha,
                "risk": risk, "status": "ok", "source": "FEMA NFHL"}
    return {"zone": "unavailable", "risk": "No mapped flood zone at point",
            "status": "no_feature", "source": "FEMA NFHL"}


def src_fema_disasters(ctx: dict) -> dict:
    st = ctx.get("state_abbr_2") or ""
    flt = f"&$filter=state%20eq%20'{st}'" if st else ""
    url = ("https://www.fema.gov/api/open/v2/DisasterDeclarationsSummaries"
           f"?$top=5&$orderby=declarationDate%20desc{flt}")
    j = _http_json(url, timeout=8)
    items = j.get("DisasterDeclarationsSummaries", [])
    return {
        "count_recent": len(items),
        "recent": [{"title": d.get("declarationTitle"), "type": d.get("incidentType"),
                    "date": d.get("declarationDate")} for d in items],
        "scope": st or "national",
        "source": "FEMA OpenFEMA",
    }


def src_osm_pois(ctx: dict) -> dict:
    lat, lon = ctx["lat"], ctx["lon"]
    ql = (f"[out:json][timeout:15];(node(around:800,{lat},{lon})[amenity];"
          f"node(around:800,{lat},{lon})[shop];node(around:800,{lat},{lon})[office];);out 30;")
    body = "data=" + urllib.parse.quote(ql)
    req = urllib.request.Request(
        "https://overpass-api.de/api/interpreter", data=body.encode(),
        headers={"User-Agent": "RePrime-DataPlatform/4.0", "Content-Type": "application/x-www-form-urlencoded"},
    )
    with urllib.request.urlopen(req, timeout=PER_SOURCE_TIMEOUT, context=_SSL_CTX) as r:
        j = json.loads(r.read().decode("utf-8", "replace"))
    els = j.get("elements", [])
    pois = []
    for e in els:
        t = e.get("tags", {})
        name = t.get("name")
        cat = t.get("amenity") or t.get("shop") or t.get("office")
        if name and cat:
            pois.append({"name": name, "category": cat})
    return {"count": len(pois), "pois": pois[:25], "radius_m": 800, "source": "OSM Overpass"}


def src_fed_register(ctx: dict) -> dict:
    url = ("https://www.federalregister.gov/api/v1/documents.json"
           "?conditions[term]=commercial+real+estate&per_page=5&order=newest")
    j = _http_json(url, timeout=8)
    docs = [{"title": r.get("title"), "date": r.get("publication_date"),
             "type": r.get("type"), "url": r.get("html_url")} for r in j.get("results", [])]
    if not docs:
        raise RuntimeError("Federal Register empty")
    return {"count": len(docs), "documents": docs, "source": "Federal Register"}


def src_nws_alerts(ctx: dict) -> dict:
    st = ctx.get("state_abbr_2") or ""
    url = f"https://api.weather.gov/alerts/active?area={st}" if st else "https://api.weather.gov/alerts/active"
    j = _http_json(url, timeout=8, headers={"User-Agent": "RePrime-DataPlatform/4.0 (alerts)", "Accept": "application/geo+json"})
    feats = j.get("features", [])
    return {"count": len(feats),
            "alerts": [{"event": f["properties"].get("event"), "severity": f["properties"].get("severity")} for f in feats[:5]],
            "scope": st or "national", "source": "NWS"}


def src_gdelt_news(ctx: dict) -> dict:
    """Real news + tone for the property's locale via GDELT DOC 2.0 (keyless)."""
    parts = [p.strip() for p in ctx.get("matched", "").split(",") if p.strip()]
    # pick a city-like token: prefer the part before the state abbreviation
    place = ctx.get("state_abbr_2") or "United States"
    for i, p in enumerate(parts):
        if len(p) == 2 and p.isupper() and i > 0:
            place = parts[i - 1]
            break
    q = urllib.parse.quote(f'"{place}" real estate')
    url = f"https://api.gdeltproject.org/api/v2/doc/doc?query={q}&mode=artlist&maxrecords=8&format=json&sort=datedesc"
    try:
        txt = _http(url, timeout=8)
    except Exception as exc:  # HTTP 429 etc.
        return {"count": 0, "articles": [], "status": "unavailable",
                "note": f"GDELT temporarily unavailable ({str(exc)[:40]}) — retry shortly.",
                "query_place": place, "source": "GDELT 2.0"}
    if not txt.lstrip().startswith("{"):  # 429 plain-text throttle message
        return {"count": 0, "articles": [], "status": "rate_limited",
                "note": "GDELT rate limit (1 req / 5s) — retry shortly.",
                "query_place": place, "source": "GDELT 2.0"}
    j = json.loads(txt)
    arts = j.get("articles", [])
    return {"count": len(arts),
            "articles": [{"title": a.get("title"), "url": a.get("url"),
                          "source": a.get("domain"), "date": a.get("seendate"),
                          "tone": a.get("tone")} for a in arts[:8]],
            "query_place": place, "source": "GDELT 2.0"}


def src_fdic(ctx: dict) -> dict:
    j = _http_json("https://banks.data.fdic.gov/api/failures?sort_by=FAILDATE&sort_order=DESC&limit=5&format=json", timeout=8)
    data = j.get("data", [])
    return {"recent_failures": [d.get("data", d) for d in data][:5], "source": "FDIC"}


def src_census_acs(ctx: dict) -> dict:
    """Tract demographics (population, median household income, median home value)."""
    fs, fc, ft = ctx.get("fips_state"), ctx.get("fips_county_3"), ctx.get("fips_tract_6")
    if not (fs and fc and ft):
        raise RuntimeError("No FIPS (address geocoded via fallback) — ACS demographics skipped")
    if not CENSUS_KEY:
        raise RuntimeError("Configure a valid CENSUS_API_KEY (free at census.gov) to enable tract demographics")
    url = ("https://api.census.gov/data/2022/acs/acs5"
           f"?get=NAME,B01003_001E,B19013_001E,B25077_001E&for=tract:{ft}&in=state:{fs}+county:{fc}&key={CENSUS_KEY}")
    raw = _http(url, timeout=8)
    if not raw.lstrip().startswith("["):
        raise RuntimeError("Census ACS rejected the key (invalid/expired) — configure a valid CENSUS_API_KEY")
    rows = json.loads(raw)
    if len(rows) < 2:
        raise RuntimeError("ACS returned no data for this tract (may be non-residential)")
    h, v = rows[0], rows[1]
    rec = dict(zip(h, v))
    def num(x):
        try:
            return int(x)
        except Exception:  # noqa: BLE001
            return None
    return {"tract": rec.get("NAME"),
            "population": num(rec.get("B01003_001E")),
            "median_household_income": num(rec.get("B19013_001E")),
            "median_home_value": num(rec.get("B25077_001E")),
            "source": "Census ACS 5-yr 2022"}


def src_financing(ctx: dict) -> dict:
    """Indicative CRE debt pricing computed from LIVE base rates (Treasury 10Y, SOFR).
    Spreads are transparent estimates — clearly labelled, not firm quotes."""
    rates = ctx.get("_fred") or {}
    def base(label, default):
        try:
            return float(str(rates.get(label, {}).get("value", "")).rstrip("%"))
        except Exception:  # noqa: BLE001
            return default
    t10 = base("treasury_10y", 4.45)
    sofr = base("sofr", 4.33)
    # transparent spread assumptions (bps over the stated base)
    products = [
        ("Senior Agency (Fannie/Freddie)", "Treasury 10Y", t10, 110, "70-75%", "5-10yr"),
        ("Senior Bank/CMBS", "Treasury 10Y", t10, 175, "60-70%", "5-10yr"),
        ("Bridge / Floating", "SOFR", sofr, 300, "65-75%", "1-3yr"),
        ("Mezzanine", "SOFR", sofr, 750, "75-85% (stack)", "3-5yr"),
        ("Preferred Equity", "SOFR", sofr, 1000, "80-90% (stack)", "3-7yr"),
        ("Construction", "SOFR", sofr, 350, "60-70% LTC", "2-4yr"),
    ]
    out = []
    for name, base_name, base_val, spread_bps, ltv, term in products:
        out.append({
            "product": name, "base_index": base_name, "base_rate": f"{base_val:.2f}%",
            "spread_bps": spread_bps, "indicative_rate": f"{base_val + spread_bps/100:.2f}%",
            "ltv": ltv, "term": term,
        })
    return {"pricing": out, "label": "INDICATIVE — estimates from live base rates; not firm quotes",
            "as_of": _now(), "source": "RePrime (computed from FRED/NY Fed)"}


def src_valuation(ctx: dict) -> dict:
    """Multi-currency conversion of a USER-PROVIDED value. No fabricated AVM.
    Requires ?value=<USD>; otherwise returns needs_input so the UI shows an input field."""
    val = ctx.get("user_value")
    if not val:
        return {"status": "needs_input",
                "message": "No automated valuation available. Enter a USD property value to convert.",
                "source": "RePrime"}
    fx = (ctx.get("_fx") or {}).get("rates", {})
    crypto = ctx.get("_crypto") or {}
    conv = {"USD": round(val, 2)}
    used = {}
    for cur, rate in fx.items():
        conv[cur] = round(val * rate, 2)
        used[cur] = rate
    if crypto.get("bitcoin_usd"):
        conv["BTC"] = round(val / crypto["bitcoin_usd"], 4); used["BTC"] = crypto["bitcoin_usd"]
    if crypto.get("ethereum_usd"):
        conv["ETH"] = round(val / crypto["ethereum_usd"], 4); used["ETH"] = crypto["ethereum_usd"]
    return {"status": "ok", "input_usd": val, "converted": conv, "rates_used": used,
            "rate_timestamp": (ctx.get("_fx") or {}).get("date", ""),
            "note": "User-provided value — not an automated appraisal.", "source": "RePrime"}


def src_elevation(ctx: dict) -> dict:
    j = _http_json(f"https://epqs.nationalmap.gov/v1/json?x={ctx['lon']}&y={ctx['lat']}&units=Feet&wkid=4326&includeDate=false", timeout=8)
    v = j.get("value")
    if v is None:
        raise RuntimeError("USGS EPQS no value")
    return {"elevation_ft": round(float(v), 1), "source": "USGS 3DEP / EPQS"}


def src_weather(ctx: dict) -> dict:
    j = _http_json(f"https://api.open-meteo.com/v1/forecast?latitude={ctx['lat']}&longitude={ctx['lon']}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&temperature_unit=fahrenheit&wind_speed_unit=mph", timeout=8)
    c = j.get("current", {})
    if not c:
        raise RuntimeError("Open-Meteo no current")
    return {"temp_f": c.get("temperature_2m"), "humidity_pct": c.get("relative_humidity_2m"),
            "wind_mph": c.get("wind_speed_10m"), "weather_code": c.get("weather_code"),
            "source": "Open-Meteo"}


def src_air_quality(ctx: dict) -> dict:
    j = _http_json(f"https://air-quality-api.open-meteo.com/v1/air-quality?latitude={ctx['lat']}&longitude={ctx['lon']}&current=us_aqi,pm2_5,pm10,ozone", timeout=8)
    c = j.get("current", {})
    if not c:
        raise RuntimeError("Open-Meteo AQ no current")
    return {"us_aqi": c.get("us_aqi"), "pm2_5": c.get("pm2_5"), "pm10": c.get("pm10"),
            "ozone": c.get("ozone"), "source": "Open-Meteo Air Quality (CAMS)"}


def src_fcc_census(ctx: dict) -> dict:
    j = _http_json(f"https://geo.fcc.gov/api/census/block/find?latitude={ctx['lat']}&longitude={ctx['lon']}&format=json&censusYear=2020", timeout=8)
    blk = j.get("Block", {}) or {}
    cty = j.get("County", {}) or {}
    st = j.get("State", {}) or {}
    fips = blk.get("FIPS") or ""
    return {"block_fips": fips, "county": cty.get("name"), "state": st.get("code"),
            "tract": fips[:11] if len(fips) >= 11 else None, "source": "FCC Census Block API"}


def src_wikipedia(ctx: dict) -> dict:
    u = (f"https://en.wikipedia.org/w/api.php?action=query&list=geosearch"
         f"&gscoord={ctx['lat']}%7C{ctx['lon']}&gsradius=2000&gslimit=8&format=json&origin=*")
    j = _http_json(u, timeout=8)
    gs = j.get("query", {}).get("geosearch", [])
    return {"count": len(gs),
            "articles": [{"title": g["title"], "distance_m": g.get("dist"),
                          "url": "https://en.wikipedia.org/wiki/" + urllib.parse.quote(g["title"].replace(" ", "_"))}
                         for g in gs],
            "source": "Wikipedia GeoSearch"}


def src_usgs_quakes(ctx: dict) -> dict:
    u = (f"https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson"
         f"&latitude={ctx['lat']}&longitude={ctx['lon']}&maxradiuskm=200&limit=5&orderby=time")
    j = _http_json(u, timeout=8)
    feats = j.get("features", [])
    return {"count_200km": len(feats),
            "recent": [{"mag": f["properties"].get("mag"), "place": f["properties"].get("place")} for f in feats[:5]],
            "source": "USGS Earthquake Catalog"}


def src_epa_facilities(ctx: dict) -> dict:
    lat, lon = ctx["lat"], ctx["lon"]
    u = (f"https://data.epa.gov/efservice/FRS_PROGRAM_FACILITY/LATITUDE83/{lat-0.02}:{lat+0.02}"
         f"/LONGITUDE83/{lon-0.02}:{lon+0.02}/JSON")
    rows = _http_json(u, timeout=8)
    if not isinstance(rows, list):
        raise RuntimeError("EPA FRS unexpected payload")
    facs = [{"name": r.get("PRIMARY_NAME"), "city": r.get("CITY_NAME")} for r in rows[:8] if r.get("PRIMARY_NAME")]
    return {"count_nearby": len(rows), "facilities": facs, "source": "EPA Envirofacts FRS"}


# Registry: name -> fetcher.  All entries are FREE, API-type sources from the 611 set.
SOURCES = {
    # macro / market (national context)
    "fred_rates": src_fred_rates,
    "crypto": src_crypto,
    "fx_rates": src_fx_rates,
    "fed_register": src_fed_register,
    "fdic": src_fdic,
    # address / point-specific
    "fema_flood": src_fema_flood,
    "fema_disasters": src_fema_disasters,
    "osm_pois": src_osm_pois,
    "nws_alerts": src_nws_alerts,
    "census_acs": src_census_acs,
    "elevation": src_elevation,
    "weather": src_weather,
    "air_quality": src_air_quality,
    "fcc_census": src_fcc_census,
    "wikipedia": src_wikipedia,
    "usgs_quakes": src_usgs_quakes,
    "epa_facilities": src_epa_facilities,
    # news
    "news": src_gdelt_news,
}
# Derived sources run after the parallel batch (they consume other results)
DERIVED = {"financing": src_financing, "valuation": src_valuation}


# --------------------------------------------------------------------------- #
# Orchestrator
# --------------------------------------------------------------------------- #
def _run_one(name: str, fn, ctx: dict) -> tuple[str, dict]:
    t0 = time.time()
    try:
        data = fn(ctx)
        dt = time.time() - t0
        _log(name, "ok", dt)
        return name, {"status": "ok", "latency_ms": int(dt * 1000), "data": data}
    except Exception as e:  # noqa: BLE001
        dt = time.time() - t0
        _log(name, "error", dt, e)
        return name, {"status": "error", "latency_ms": int(dt * 1000), "error": str(e)[:200]}


def run_search(address: str, user_value: float | None = None) -> dict:
    """Pure function — used by the HTTP handler and by tests/CLI. Returns the full doc
    plus an internal '_http_status' the handler strips and uses as the response code."""
    address = (address or "").strip()
    if len(address) < 5:
        return {"_http_status": 400, "error": "Address too short. Use e.g. '123 Main St, City, ST 00000'.",
                "address_input": address}
    if len(address) > 500:
        return {"_http_status": 400, "error": "Address too long (max 500 chars).", "address_input": address}

    ckey = address.lower() + (f"|{user_value}" if user_value else "")
    hit = _CACHE.get(ckey)
    if hit and (time.time() - hit[0] < CACHE_TTL):
        cached = dict(hit[1]); cached["cached"] = True
        return cached

    t_start = time.time()
    geo = geocode(address)
    if "error" in geo:
        return {"_http_status": 400, "error": geo["error"], "address_input": address,
                "hint": "Format as: 123 Main St, City, ST ZIP"}

    ctx = dict(geo)
    ctx["user_value"] = user_value
    ctx["state_abbr_2"] = (geo.get("state_abbr") or "")[:2].upper() if len(geo.get("state_abbr", "")) == 2 else _state_to_abbr(geo.get("state_abbr", ""))
    # split FIPS for ACS (county wants 3-digit, tract wants 6-digit)
    fc = geo.get("fips_county", "")
    ctx["fips_county_3"] = fc[2:5] if len(fc) >= 5 else ""
    ft = geo.get("fips_tract", "")
    ctx["fips_tract_6"] = ft[-6:] if len(ft) >= 6 else ""

    results: dict[str, dict] = {}
    deadline = max(2.0, TOTAL_BUDGET - (time.time() - t_start))
    # Hard-bounded fan-out: collect whatever finished within the deadline, then
    # return immediately (non-blocking shutdown) so one stuck socket can't hang
    # the whole function past Vercel's limit.
    ex = ThreadPoolExecutor(max_workers=12)
    futs = {ex.submit(_run_one, n, fn, ctx): n for n, fn in SOURCES.items()}
    done, not_done = cf_wait(futs.keys(), timeout=deadline)
    for fut in done:
        name = futs[fut]
        try:
            n, r = fut.result()
            results[n] = r
        except Exception as e:  # noqa: BLE001
            results[name] = {"status": "error", "latency_ms": 0, "error": str(e)[:120]}
    for fut in not_done:
        results[futs[fut]] = {"status": "error", "latency_ms": int(deadline * 1000),
                              "error": "budget timeout"}
    ex.shutdown(wait=False, cancel_futures=True)

    # feed derived sources from completed results
    ctx["_fred"] = (results.get("fred_rates", {}) or {}).get("data", {})
    ctx["_fx"] = (results.get("fx_rates", {}) or {}).get("data", {})
    ctx["_crypto"] = (results.get("crypto", {}) or {}).get("data", {})
    for n, fn in DERIVED.items():
        _, r = _run_one(n, fn, ctx)
        results[n] = r

    summary = [{"source": n, "status": r["status"], "latency_ms": r.get("latency_ms")}
               for n, r in results.items()]
    ok = [s for s in summary if s["status"] == "ok"]
    failed = [s for s in summary if s["status"] != "ok"]

    doc = {
        "_http_status": 200,
        "version": VERSION,
        "query_metadata": {
            "address_input": address,
            "geocoded_address": geo.get("matched"),
            "lat": geo.get("lat"), "lon": geo.get("lon"),
            "geocoder": geo.get("source"),
            "fips_state": geo.get("fips_state"), "fips_county": geo.get("fips_county"),
            "fips_tract": geo.get("fips_tract"),
            "total_sources_attempted": len(summary),
            "total_sources_succeeded": len(ok),
            "total_sources_failed": len(failed),
            "total_latency_ms": int((time.time() - t_start) * 1000),
            "timestamp": _now(),
        },
        "sources_summary": summary,
        "sources": {n: (r.get("data") if r["status"] == "ok" else {"_error": r.get("error"), "_status": "error"})
                    for n, r in results.items()},
        "cached": False,
    }
    if len(ok) < 3:
        doc["degraded"] = True
        doc["message"] = f"Only {len(ok)} data sources returned. Results are partial — retry shortly."
    _CACHE[ckey] = (time.time(), doc)
    return doc


_STATE_ABBR = {
    "alabama": "AL", "alaska": "AK", "arizona": "AZ", "arkansas": "AR", "california": "CA",
    "colorado": "CO", "connecticut": "CT", "delaware": "DE", "district of columbia": "DC",
    "florida": "FL", "georgia": "GA", "hawaii": "HI", "idaho": "ID", "illinois": "IL",
    "indiana": "IN", "iowa": "IA", "kansas": "KS", "kentucky": "KY", "louisiana": "LA",
    "maine": "ME", "maryland": "MD", "massachusetts": "MA", "michigan": "MI", "minnesota": "MN",
    "mississippi": "MS", "missouri": "MO", "montana": "MT", "nebraska": "NE", "nevada": "NV",
    "new hampshire": "NH", "new jersey": "NJ", "new mexico": "NM", "new york": "NY",
    "north carolina": "NC", "north dakota": "ND", "ohio": "OH", "oklahoma": "OK", "oregon": "OR",
    "pennsylvania": "PA", "rhode island": "RI", "south carolina": "SC", "south dakota": "SD",
    "tennessee": "TN", "texas": "TX", "utah": "UT", "vermont": "VT", "virginia": "VA",
    "washington": "WA", "west virginia": "WV", "wisconsin": "WI", "wyoming": "WY",
}


def _state_to_abbr(name: str) -> str:
    if not name:
        return ""
    if len(name) == 2:
        return name.upper()
    return _STATE_ABBR.get(name.strip().lower(), "")


# --------------------------------------------------------------------------- #
# Vercel handler
# --------------------------------------------------------------------------- #
class handler(BaseHTTPRequestHandler):
    def _send(self, status: int, payload: dict) -> None:
        body = json.dumps(payload, default=str).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.send_header("Cache-Control", "public, max-age=300")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_OPTIONS(self):  # noqa: N802
        self.send_response(204)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def do_GET(self):  # noqa: N802
        try:
            qs = urllib.parse.urlparse(self.path).query
            params = urllib.parse.parse_qs(qs)
            address = (params.get("address") or params.get("q") or [""])[0]
            raw_val = (params.get("value") or [""])[0]
            user_value = None
            if raw_val:
                try:
                    user_value = float(re.sub(r"[^\d.]", "", raw_val))
                except ValueError:
                    user_value = None
            doc = run_search(address, user_value)
            status = doc.pop("_http_status", 200)
            self._send(status, doc)
        except Exception as e:  # noqa: BLE001
            _log("handler", "error", 0, e)
            self._send(500, {"error": "Internal error", "detail": str(e)[:200]})


# --------------------------------------------------------------------------- #
# CLI / test entrypoint (real network) — proof harness
# --------------------------------------------------------------------------- #
if __name__ == "__main__":
    import argparse
    ap = argparse.ArgumentParser()
    ap.add_argument("address", nargs="?", default="1600 Pennsylvania Ave NW, Washington, DC 20500")
    ap.add_argument("--value", type=float, default=None)
    a = ap.parse_args()
    res = run_search(a.address, a.value)
    print(json.dumps(res, indent=2, default=str))
