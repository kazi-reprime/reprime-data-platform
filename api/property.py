"""Vercel Serverless Function — Property Search

Accepts: GET /api/property?q=<address>
Returns: Property intelligence from 10+ data sources in parallel.

Designed to be a Vercel serverless function — standalone, no imports from /api/server.
"""
from http.server import BaseHTTPRequestHandler
import asyncio
import json
import os
import math
from urllib.parse import urlparse, parse_qs

import httpx

FRED = os.environ.get("FRED_API_KEY", "")
CENSUS = os.environ.get("CENSUS_API_KEY", "")
WALK = os.environ.get("WALK_SCORE_API_KEY", "")
WEATHER = os.environ.get("OPENWEATHER_API_KEY", "")
FINNHUB = os.environ.get("FINNHUB_API_KEY", "")
MAPBOX = os.environ.get("MAPBOX_API_KEY", "")
MAPILLARY = os.environ.get("MAPILLARY_API_KEY", "")
YELP = os.environ.get("YELP_API_KEY", "")
SERPER = os.environ.get("SERPER_API_KEY", "")
RENTCAST = os.environ.get("RENTCAST_API_KEY", "")
RAPIDAPI = os.environ.get("RAPIDAPI_KEY", "")


async def geocode(c, q):
    try:
        r = await c.get("https://nominatim.openstreetmap.org/search",
            params={"q": q, "format": "json", "limit": 1, "addressdetails": 1, "extratags": 1},
            headers={"User-Agent": "RePrime-Platform/1.0"}, timeout=10)
        d = r.json()
        if not d: return None
        p = d[0]
        return {"lat": float(p["lat"]), "lng": float(p["lon"]), "address": p["display_name"],
                "type": p.get("type", ""), "bbox": p.get("boundingbox", []),
                "components": p.get("address", {}), "osm_id": p.get("osm_id")}
    except Exception as e:
        return None


async def walk_score(c, lat, lng, addr):
    if not WALK: return {}
    try:
        r = await c.get("https://api.walkscore.com/score",
            params={"format": "json", "address": addr, "lat": lat, "lon": lng, "wsapikey": WALK, "transit": 1, "bike": 1},
            timeout=8)
        return r.json()
    except: return {}


async def weather(c, lat, lng):
    if not WEATHER: return {}
    try:
        r = await c.get("https://api.openweathermap.org/data/2.5/weather",
            params={"lat": lat, "lon": lng, "appid": WEATHER, "units": "imperial"}, timeout=8)
        d = r.json()
        return {"temp_f": d.get("main", {}).get("temp"), "feels_like": d.get("main", {}).get("feels_like"),
                "humidity": d.get("main", {}).get("humidity"), "wind_mph": d.get("wind", {}).get("speed"),
                "description": d.get("weather", [{}])[0].get("description"),
                "icon": d.get("weather", [{}])[0].get("icon"), "city": d.get("name")}
    except: return {}


async def census_demo(c, lat, lng):
    try:
        r = await c.get("https://geocoding.geo.census.gov/geocoder/geographies/coordinates",
            params={"x": lng, "y": lat, "benchmark": "Public_AR_Current", "vintage": "Current_Current", "format": "json"},
            timeout=10)
        tracts = r.json().get("result", {}).get("geographies", {}).get("Census Tracts", [])
        if not tracts: return {}
        t = tracts[0]
        state, county, tract = t.get("STATE"), t.get("COUNTY"), t.get("TRACT")
        if not CENSUS: return {"state": state, "county": county, "tract": tract, "name": t.get("NAME")}
        r2 = await c.get("https://api.census.gov/data/2022/acs/acs5",
            params={"get": "NAME,B01003_001E,B19013_001E,B25077_001E,B25064_001E,B25003_001E,B25003_002E,B25003_003E,B15003_022E,B23025_005E,B25035_001E",
                    "for": f"tract:{tract}", "in": f"state:{state} county:{county}", "key": CENSUS}, timeout=10)
        d = r2.json()
        if not isinstance(d, list) or len(d) < 2: return {"state": state, "county": county, "tract": tract}
        m = dict(zip(d[0], d[1]))
        def i(k):
            v = m.get(k)
            if v and v != "-666666666":
                try: return int(v)
                except: return None
            return None
        return {"tract_name": m.get("NAME"), "state": state, "county": county, "tract": tract,
                "population": i("B01003_001E"), "median_household_income": i("B19013_001E"),
                "median_home_value": i("B25077_001E"), "median_gross_rent": i("B25064_001E"),
                "total_housing_units": i("B25003_001E"), "owner_occupied": i("B25003_002E"),
                "renter_occupied": i("B25003_003E"), "bachelors_or_higher": i("B15003_022E"),
                "unemployed": i("B23025_005E"), "median_year_built": i("B25035_001E")}
    except Exception as e:
        return {}


async def fema_flood(c, lat, lng):
    try:
        r = await c.get("https://hazards.fema.gov/gis/nfhl/rest/services/public/NFHL/MapServer/28/query",
            params={"geometry": f"{lng},{lat}", "geometryType": "esriGeometryPoint", "inSR": "4326",
                    "outFields": "FLD_ZONE,FLD_AR_ID,STATIC_BFE,ZONE_SUBTY,SFHA_TF",
                    "returnGeometry": "false", "f": "json"}, timeout=10)
        features = r.json().get("features", [])
        if not features: return {"in_floodplain": False, "zone": "X", "message": "Outside SFHA — low risk"}
        f = features[0]["attributes"]
        zone = f.get("FLD_ZONE", "")
        return {"in_floodplain": f.get("SFHA_TF") == "T", "zone": zone,
                "zone_subtype": f.get("ZONE_SUBTY"), "base_flood_elevation": f.get("STATIC_BFE"),
                "high_risk": zone.startswith(("A", "V"))}
    except: return {}


async def epa_facilities(c, lat, lng):
    try:
        r = await c.get(f"https://data.epa.gov/efservice/FRS_PROGRAM_FACILITY/LATITUDE83/{lat-0.02}:{lat+0.02}/LONGITUDE83/{lng-0.02}:{lng+0.02}/JSON", timeout=12)
        if r.status_code != 200: return []
        d = r.json()
        if not isinstance(d, list): return []
        return [{"name": f.get("PRIMARY_NAME"), "type": f.get("PGM_SYS_ACRNM"),
                 "address": f.get("LOCATION_ADDRESS"), "city": f.get("CITY_NAME"),
                 "state": f.get("STATE_CODE")} for f in d[:15]]
    except: return []


async def osm_pois(c, lat, lng):
    try:
        query = f"""[out:json][timeout:15];
        (node["amenity"](around:800,{lat},{lng});
         node["shop"](around:800,{lat},{lng});
         node["tourism"](around:800,{lat},{lng}););
        out body 30;"""
        r = await c.post("https://overpass-api.de/api/interpreter", data={"data": query}, timeout=18)
        d = r.json()
        return [{"name": el.get("tags", {}).get("name", "Unknown"),
                 "category": el.get("tags", {}).get("amenity") or el.get("tags", {}).get("shop") or el.get("tags", {}).get("tourism") or "other",
                 "lat": el.get("lat"), "lng": el.get("lon")}
                for el in d.get("elements", [])[:25] if el.get("tags", {}).get("name")]
    except: return []


async def mapbox_imagery(c, lat, lng):
    if not MAPBOX: return []
    return [
        {"source": "Mapbox Satellite", "type": "satellite",
         "url": f"https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v12/static/{lng},{lat},17/800x500@2x?access_token={MAPBOX}"},
        {"source": "Mapbox Streets", "type": "map",
         "url": f"https://api.mapbox.com/styles/v1/mapbox/streets-v12/static/{lng},{lat},16/800x500@2x?access_token={MAPBOX}"},
        {"source": "Mapbox Dark", "type": "dark-map",
         "url": f"https://api.mapbox.com/styles/v1/mapbox/dark-v11/static/{lng},{lat},15/800x500@2x?access_token={MAPBOX}"},
    ]


async def mapillary_streetview(c, lat, lng):
    if not MAPILLARY: return []
    try:
        r = await c.get("https://graph.mapillary.com/images",
            params={"access_token": MAPILLARY, "fields": "id,thumb_1024_url,captured_at,compass_angle",
                    "bbox": f"{lng-0.002},{lat-0.002},{lng+0.002},{lat+0.002}", "limit": 12}, timeout=10)
        return [{"source": "Mapillary", "type": "street-view", "url": d.get("thumb_1024_url"),
                 "captured": d.get("captured_at"), "id": d.get("id")}
                for d in r.json().get("data", []) if d.get("thumb_1024_url")]
    except: return []


async def yelp_nearby(c, lat, lng):
    if not YELP: return []
    try:
        r = await c.get("https://api.yelp.com/v3/businesses/search",
            params={"latitude": lat, "longitude": lng, "radius": 1000, "limit": 20, "sort_by": "rating"},
            headers={"Authorization": f"Bearer {YELP}"}, timeout=10)
        return [{"name": b.get("name"), "rating": b.get("rating"), "review_count": b.get("review_count"),
                 "categories": [c.get("title") for c in b.get("categories", [])[:2]],
                 "price": b.get("price"), "image": b.get("image_url"),
                 "address": " ".join(b.get("location", {}).get("display_address", []))}
                for b in r.json().get("businesses", [])[:15]]
    except: return []


async def serper_search(c, q):
    if not SERPER: return {}
    try:
        r = await c.post("https://google.serper.dev/search",
            json={"q": q, "num": 10},
            headers={"X-API-KEY": SERPER, "Content-Type": "application/json"}, timeout=10)
        d = r.json()
        return {"organic": [{"title": x.get("title"), "link": x.get("link"), "snippet": x.get("snippet")}
                            for x in d.get("organic", [])[:8]],
                "places": d.get("places", [])[:5],
                "knowledge_graph": d.get("knowledgeGraph", {})}
    except: return {}


async def rentcast_estimate(c, addr, lat, lng):
    if not RENTCAST: return {}
    try:
        # Property records lookup
        r = await c.get("https://api.rentcast.io/v1/properties",
            params={"address": addr, "limit": 1},
            headers={"X-Api-Key": RENTCAST}, timeout=10)
        return r.json() if r.status_code == 200 else {}
    except: return {}


async def wiki_geosearch(c, lat, lng):
    try:
        r = await c.get("https://en.wikipedia.org/w/api.php",
            params={"action": "query", "list": "geosearch", "gscoord": f"{lat}|{lng}",
                    "gsradius": 2000, "gslimit": 8, "format": "json"}, timeout=8)
        return [{"title": g.get("title"), "url": f"https://en.wikipedia.org/wiki/{g.get('title', '').replace(' ', '_')}",
                 "distance_m": g.get("dist")} for g in r.json().get("query", {}).get("geosearch", [])[:6]]
    except: return []


async def fred_macro(c):
    if not FRED: return {}
    series = {"DGS10": "10Y_Treasury", "MORTGAGE30US": "30Y_Mortgage", "FEDFUNDS": "Fed_Funds",
              "UNRATE": "Unemployment", "MSPUS": "Median_Home_Price", "CSUSHPISA": "Case_Shiller_HPI",
              "DRCRELEXFACBS": "CRE_Delinquency", "RRVRUSQ156N": "Rental_Vacancy", "SOFR": "SOFR_Rate"}
    out = {}
    async def fetch(sid, label):
        try:
            r = await c.get("https://api.stlouisfed.org/fred/series/observations",
                params={"series_id": sid, "api_key": FRED, "file_type": "json", "sort_order": "desc", "limit": 2},
                timeout=8)
            obs = r.json().get("observations", [])
            if obs: out[label] = {"value": obs[0].get("value"), "date": obs[0].get("date")}
        except: pass
    await asyncio.gather(*[fetch(sid, label) for sid, label in series.items()])
    return out


async def finnhub_reits(c):
    if not FINNHUB: return {}
    tickers = ["O", "PLD", "AMT", "PSA", "SPG", "WELL", "DLR", "EQR", "VNO", "BXP"]
    out = {}
    async def fetch(t):
        try:
            r = await c.get("https://finnhub.io/api/v1/quote", params={"symbol": t, "token": FINNHUB}, timeout=8)
            q = r.json()
            out[t] = {"current": q.get("c"), "change": q.get("d"), "change_pct": q.get("dp")}
        except: pass
    await asyncio.gather(*[fetch(t) for t in tickers])
    return out


async def do_search(q):
    """Main search orchestrator — runs 12 sources in parallel."""
    from datetime import datetime
    async with httpx.AsyncClient() as c:
        geo = await geocode(c, q)
        if not geo:
            return {"query": q, "error": "Address not found", "sources_queried": ["Nominatim (failed)"]}

        lat, lng, addr = geo["lat"], geo["lng"], geo["address"]

        # Parallel fan-out
        results = await asyncio.gather(
            walk_score(c, lat, lng, addr), weather(c, lat, lng), census_demo(c, lat, lng),
            fema_flood(c, lat, lng), epa_facilities(c, lat, lng), osm_pois(c, lat, lng),
            mapbox_imagery(c, lat, lng), mapillary_streetview(c, lat, lng),
            yelp_nearby(c, lat, lng), serper_search(c, q + " property real estate"),
            rentcast_estimate(c, addr, lat, lng), wiki_geosearch(c, lat, lng),
            fred_macro(c), finnhub_reits(c),
            return_exceptions=True
        )

        walk, wx, census, fema, epa, pois, mapbox_img, mapillary_img, yelp_biz, web, rentcast, wiki, macro, reits = results

        def safe(x): return x if not isinstance(x, Exception) else (type(x).__name__ + ": " + str(x)[:80])

        sources = ["Nominatim"]
        for name, val in [("Walk Score", walk), ("OpenWeather", wx), ("Census ACS", census),
                          ("FEMA NFHL", fema), ("EPA FRS", epa), ("OSM Overpass", pois),
                          ("Mapbox", mapbox_img), ("Mapillary", mapillary_img), ("Yelp", yelp_biz),
                          ("Serper/Google", web), ("RentCast", rentcast), ("Wikipedia", wiki),
                          ("FRED", macro), ("Finnhub", reits)]:
            if val and not isinstance(val, Exception):
                if isinstance(val, (list, dict)) and len(val) > 0:
                    sources.append(name)

        return {
            "query": q, "address": addr, "lat": lat, "lng": lng,
            "place_type": geo.get("type"), "bbox": geo.get("bbox"),
            "address_components": geo.get("components", {}),
            "walk_score": safe(walk), "weather": safe(wx), "census": safe(census),
            "fema_flood": safe(fema), "epa_facilities": safe(epa), "osm_pois": safe(pois),
            "mapbox_imagery": safe(mapbox_img), "mapillary_streetview": safe(mapillary_img),
            "yelp_businesses": safe(yelp_biz), "web_results": safe(web),
            "rentcast": safe(rentcast), "wikipedia": safe(wiki),
            "macro": safe(macro), "reits": safe(reits),
            "sources_queried": sources, "fetched_at": datetime.utcnow().isoformat() + "Z",
            "keys_active": [k for k in ["FRED", "CENSUS", "WALK_SCORE", "OPENWEATHER", "FINNHUB",
                                        "MAPBOX", "MAPILLARY", "YELP", "SERPER", "RENTCAST", "RAPIDAPI"]
                            if os.environ.get(k.replace("WALK_SCORE", "WALK_SCORE_API") + "_API_KEY") or os.environ.get(k + "_API_KEY")],
        }


class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        url = urlparse(self.path)
        params = parse_qs(url.query)
        q = params.get("q", [""])[0].strip()

        if not q:
            result = {"error": "Provide ?q=<address> query parameter", "example": "/api/property?q=Empire State Building"}
        else:
            try:
                result = asyncio.run(do_search(q))
            except Exception as e:
                result = {"error": str(e), "query": q}

        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Cache-Control", "public, s-maxage=300")
        self.end_headers()
        self.wfile.write(json.dumps(result, default=str).encode())

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, OPTIONS")
        self.end_headers()
