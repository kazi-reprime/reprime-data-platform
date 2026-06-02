"""Vercel Serverless Function — Property Search (stdlib-only)

Accepts: GET /api/property?q=<address>
Returns: Property intelligence from 14 parallel data sources.
No third-party deps — uses urllib.request via threadpool for parallelism.
"""
from http.server import BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs, urlencode, quote
from urllib.request import Request, urlopen
from urllib.error import URLError
from concurrent.futures import ThreadPoolExecutor, as_completed
import json
import os
import ssl
from datetime import datetime

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

CTX = ssl.create_default_context()
CTX.check_hostname = False
CTX.verify_mode = ssl.CERT_NONE


def fetch(url, headers=None, data=None, method="GET", timeout=10):
    """Synchronous HTTP request using urllib stdlib."""
    h = {"User-Agent": "RePrime-Platform/1.0"}
    if headers: h.update(headers)
    if data and method == "POST":
        if isinstance(data, dict): data = json.dumps(data).encode()
        elif isinstance(data, str): data = data.encode()
    try:
        req = Request(url, data=data, headers=h, method=method)
        with urlopen(req, timeout=timeout, context=CTX) as r:
            body = r.read().decode("utf-8", errors="replace")
            return json.loads(body) if body.strip().startswith(("{", "[")) else {"raw": body}
    except URLError as e:
        return {"error": str(e)}
    except Exception as e:
        return {"error": str(e)}


def geocode(q):
    d = fetch(f"https://nominatim.openstreetmap.org/search?{urlencode({'q': q, 'format': 'json', 'limit': 1, 'addressdetails': 1, 'extratags': 1})}")
    if not isinstance(d, list) or not d: return None
    p = d[0]
    return {"lat": float(p["lat"]), "lng": float(p["lon"]), "address": p["display_name"],
            "type": p.get("type", ""), "bbox": p.get("boundingbox", []),
            "components": p.get("address", {}), "osm_id": p.get("osm_id")}


def walk_score(lat, lng, addr):
    if not WALK: return {}
    d = fetch(f"https://api.walkscore.com/score?{urlencode({'format': 'json', 'address': addr, 'lat': lat, 'lon': lng, 'wsapikey': WALK, 'transit': 1, 'bike': 1})}")
    return d if isinstance(d, dict) and "walkscore" in d else {}


def weather(lat, lng):
    if not WEATHER: return {}
    d = fetch(f"https://api.openweathermap.org/data/2.5/weather?{urlencode({'lat': lat, 'lon': lng, 'appid': WEATHER, 'units': 'imperial'})}")
    if "main" not in d: return {}
    return {"temp_f": d["main"].get("temp"), "feels_like": d["main"].get("feels_like"),
            "humidity": d["main"].get("humidity"), "wind_mph": d.get("wind", {}).get("speed"),
            "description": d.get("weather", [{}])[0].get("description"),
            "icon": d.get("weather", [{}])[0].get("icon"), "city": d.get("name")}


def census_demo(lat, lng):
    g = fetch(f"https://geocoding.geo.census.gov/geocoder/geographies/coordinates?{urlencode({'x': lng, 'y': lat, 'benchmark': 'Public_AR_Current', 'vintage': 'Current_Current', 'format': 'json'})}")
    tracts = g.get("result", {}).get("geographies", {}).get("Census Tracts", []) if isinstance(g, dict) else []
    if not tracts: return {}
    t = tracts[0]
    state, county, tract = t.get("STATE"), t.get("COUNTY"), t.get("TRACT")
    if not CENSUS: return {"state": state, "county": county, "tract": tract}
    d = fetch(f"https://api.census.gov/data/2022/acs/acs5?{urlencode({'get': 'NAME,B01003_001E,B19013_001E,B25077_001E,B25064_001E,B25003_001E,B25003_002E,B25003_003E,B15003_022E,B23025_005E,B25035_001E', 'for': f'tract:{tract}', 'in': f'state:{state} county:{county}', 'key': CENSUS})}")
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


def fema_flood(lat, lng):
    d = fetch(f"https://hazards.fema.gov/gis/nfhl/rest/services/public/NFHL/MapServer/28/query?{urlencode({'geometry': f'{lng},{lat}', 'geometryType': 'esriGeometryPoint', 'inSR': '4326', 'outFields': 'FLD_ZONE,FLD_AR_ID,STATIC_BFE,ZONE_SUBTY,SFHA_TF', 'returnGeometry': 'false', 'f': 'json'})}")
    if not isinstance(d, dict): return {}
    features = d.get("features", [])
    if not features: return {"in_floodplain": False, "zone": "X", "message": "Outside SFHA"}
    f = features[0]["attributes"]
    zone = f.get("FLD_ZONE", "")
    return {"in_floodplain": f.get("SFHA_TF") == "T", "zone": zone,
            "zone_subtype": f.get("ZONE_SUBTY"), "base_flood_elevation": f.get("STATIC_BFE"),
            "high_risk": zone.startswith(("A", "V"))}


def epa_facilities(lat, lng):
    d = fetch(f"https://data.epa.gov/efservice/FRS_PROGRAM_FACILITY/LATITUDE83/{lat-0.02}:{lat+0.02}/LONGITUDE83/{lng-0.02}:{lng+0.02}/JSON", timeout=12)
    if not isinstance(d, list): return []
    return [{"name": f.get("PRIMARY_NAME"), "type": f.get("PGM_SYS_ACRNM"),
             "address": f.get("LOCATION_ADDRESS"), "city": f.get("CITY_NAME"),
             "state": f.get("STATE_CODE")} for f in d[:15]]


def osm_pois(lat, lng):
    query = f"""[out:json][timeout:12];(node["amenity"](around:800,{lat},{lng});node["shop"](around:800,{lat},{lng});node["tourism"](around:800,{lat},{lng}););out body 30;"""
    d = fetch("https://overpass-api.de/api/interpreter", data=f"data={quote(query)}", method="POST",
              headers={"Content-Type": "application/x-www-form-urlencoded"}, timeout=15)
    if not isinstance(d, dict): return []
    return [{"name": el.get("tags", {}).get("name", "Unknown"),
             "category": el.get("tags", {}).get("amenity") or el.get("tags", {}).get("shop") or el.get("tags", {}).get("tourism") or "other"}
            for el in d.get("elements", [])[:25] if el.get("tags", {}).get("name")]


def mapbox_imagery(lat, lng):
    if not MAPBOX: return []
    return [
        {"source": "Mapbox Satellite", "type": "satellite",
         "url": f"https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v12/static/{lng},{lat},17/800x500@2x?access_token={MAPBOX}"},
        {"source": "Mapbox Streets", "type": "map",
         "url": f"https://api.mapbox.com/styles/v1/mapbox/streets-v12/static/{lng},{lat},16/800x500@2x?access_token={MAPBOX}"},
        {"source": "Mapbox Outdoors", "type": "terrain",
         "url": f"https://api.mapbox.com/styles/v1/mapbox/outdoors-v12/static/{lng},{lat},15/800x500@2x?access_token={MAPBOX}"},
    ]


def mapillary_streetview(lat, lng):
    if not MAPILLARY: return []
    d = fetch(f"https://graph.mapillary.com/images?{urlencode({'access_token': MAPILLARY, 'fields': 'id,thumb_1024_url,captured_at,compass_angle', 'bbox': f'{lng-0.002},{lat-0.002},{lng+0.002},{lat+0.002}', 'limit': 12})}")
    if not isinstance(d, dict): return []
    return [{"source": "Mapillary", "type": "street-view", "url": x.get("thumb_1024_url"),
             "captured": x.get("captured_at"), "id": x.get("id")}
            for x in d.get("data", []) if x.get("thumb_1024_url")]


def yelp_nearby(lat, lng):
    if not YELP: return []
    d = fetch(f"https://api.yelp.com/v3/businesses/search?{urlencode({'latitude': lat, 'longitude': lng, 'radius': 1000, 'limit': 20, 'sort_by': 'rating'})}",
              headers={"Authorization": f"Bearer {YELP}"})
    if not isinstance(d, dict): return []
    return [{"name": b.get("name"), "rating": b.get("rating"), "review_count": b.get("review_count"),
             "categories": [c.get("title") for c in b.get("categories", [])[:2]],
             "price": b.get("price"), "image": b.get("image_url"),
             "address": " ".join(b.get("location", {}).get("display_address", []))}
            for b in d.get("businesses", [])[:15]]


def serper_search(q):
    if not SERPER: return {}
    d = fetch("https://google.serper.dev/search", data=json.dumps({"q": q, "num": 10}), method="POST",
              headers={"X-API-KEY": SERPER, "Content-Type": "application/json"})
    if not isinstance(d, dict): return {}
    return {"organic": [{"title": x.get("title"), "link": x.get("link"), "snippet": x.get("snippet")}
                        for x in d.get("organic", [])[:8]],
            "places": d.get("places", [])[:5], "knowledge_graph": d.get("knowledgeGraph", {})}


def rentcast_lookup(addr):
    if not RENTCAST: return {}
    d = fetch(f"https://api.rentcast.io/v1/properties?{urlencode({'address': addr, 'limit': 1})}",
              headers={"X-Api-Key": RENTCAST})
    return d if isinstance(d, (dict, list)) else {}


def wiki_geosearch(lat, lng):
    d = fetch(f"https://en.wikipedia.org/w/api.php?{urlencode({'action': 'query', 'list': 'geosearch', 'gscoord': f'{lat}|{lng}', 'gsradius': 2000, 'gslimit': 8, 'format': 'json'})}")
    if not isinstance(d, dict): return []
    return [{"title": g.get("title"), "url": f"https://en.wikipedia.org/wiki/{g.get('title', '').replace(' ', '_')}",
             "distance_m": g.get("dist")} for g in d.get("query", {}).get("geosearch", [])[:6]]


def fred_macro():
    if not FRED: return {}
    series = {"DGS10": "10Y_Treasury", "MORTGAGE30US": "30Y_Mortgage", "FEDFUNDS": "Fed_Funds",
              "UNRATE": "Unemployment", "MSPUS": "Median_Home_Price", "CSUSHPISA": "Case_Shiller_HPI",
              "DRCRELEXFACBS": "CRE_Delinquency", "RRVRUSQ156N": "Rental_Vacancy", "SOFR": "SOFR_Rate"}
    out = {}
    with ThreadPoolExecutor(max_workers=9) as ex:
        futures = {ex.submit(fetch, f"https://api.stlouisfed.org/fred/series/observations?{urlencode({'series_id': sid, 'api_key': FRED, 'file_type': 'json', 'sort_order': 'desc', 'limit': 2})}", None, None, "GET", 8): label for sid, label in series.items()}
        for fut in as_completed(futures, timeout=10):
            label = futures[fut]
            try:
                d = fut.result()
                obs = d.get("observations", []) if isinstance(d, dict) else []
                if obs: out[label] = {"value": obs[0].get("value"), "date": obs[0].get("date")}
            except: pass
    return out


def finnhub_reits():
    if not FINNHUB: return {}
    tickers = ["O", "PLD", "AMT", "PSA", "SPG", "WELL", "DLR", "EQR", "VNO", "BXP"]
    out = {}
    with ThreadPoolExecutor(max_workers=10) as ex:
        futures = {ex.submit(fetch, f"https://finnhub.io/api/v1/quote?{urlencode({'symbol': t, 'token': FINNHUB})}", None, None, "GET", 8): t for t in tickers}
        for fut in as_completed(futures, timeout=10):
            t = futures[fut]
            try:
                q = fut.result()
                if isinstance(q, dict): out[t] = {"current": q.get("c"), "change": q.get("d"), "change_pct": q.get("dp")}
            except: pass
    return out


def do_search(q):
    """Run all 14 sources in parallel via threadpool."""
    geo = geocode(q)
    if not geo:
        return {"query": q, "error": "Address not found via Nominatim", "sources_queried": []}

    lat, lng, addr = geo["lat"], geo["lng"], geo["address"]

    # Define all the parallel jobs
    jobs = {
        "walk_score": lambda: walk_score(lat, lng, addr),
        "weather": lambda: weather(lat, lng),
        "census": lambda: census_demo(lat, lng),
        "fema_flood": lambda: fema_flood(lat, lng),
        "epa_facilities": lambda: epa_facilities(lat, lng),
        "osm_pois": lambda: osm_pois(lat, lng),
        "mapbox_imagery": lambda: mapbox_imagery(lat, lng),
        "mapillary_streetview": lambda: mapillary_streetview(lat, lng),
        "yelp_businesses": lambda: yelp_nearby(lat, lng),
        "web_results": lambda: serper_search(q + " property real estate"),
        "rentcast": lambda: rentcast_lookup(addr),
        "wikipedia": lambda: wiki_geosearch(lat, lng),
        "macro": lambda: fred_macro(),
        "reits": lambda: finnhub_reits(),
    }

    results = {}
    sources = ["Nominatim"]
    with ThreadPoolExecutor(max_workers=14) as ex:
        futures = {ex.submit(fn): name for name, fn in jobs.items()}
        for fut in as_completed(futures, timeout=25):
            name = futures[fut]
            try:
                results[name] = fut.result()
                val = results[name]
                if val and not (isinstance(val, dict) and "error" in val):
                    if isinstance(val, (list, dict)) and len(val) > 0:
                        sources.append(name.replace("_", " ").title())
            except Exception as e:
                results[name] = {"error": str(e)}

    return {
        "query": q, "address": addr, "lat": lat, "lng": lng,
        "place_type": geo.get("type"), "bbox": geo.get("bbox"),
        "address_components": geo.get("components", {}),
        **results,
        "sources_queried": sources,
        "fetched_at": datetime.utcnow().isoformat() + "Z",
    }


class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        url = urlparse(self.path)
        params = parse_qs(url.query)
        q = params.get("q", [""])[0].strip()

        if not q:
            result = {"error": "Provide ?q=<address>", "example": "/api/property?q=Empire State Building"}
        else:
            try:
                result = do_search(q)
            except Exception as e:
                result = {"error": str(e), "query": q}

        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Cache-Control", "public, s-maxage=300")
        self.end_headers()
        self.wfile.write(json.dumps(result, default=str).encode())
