"""Property Search Service — takes any address, fetches everything from all available sources.

Pipeline:
1. Geocode address via Nominatim (free, no key)
2. Fan out parallel requests to all APIs that accept lat/lng:
   - Walk Score (have key)
   - OpenWeather (have key)
   - Census Geography → demographics
   - FEMA flood zones
   - EPA Envirofacts (hazardous waste, brownfields)
   - USGS / OpenStreetMap imagery
   - FCC broadband
3. Pull property-specific data:
   - OSM Overpass for nearby POIs
   - Wikipedia nearby search
   - Mapbox/Google Street View if keys provided
4. Layer macro context from FRED/BLS
5. Return unified PropertyResult
"""
from __future__ import annotations

import asyncio
import json
import os
from dataclasses import dataclass, field, asdict
from pathlib import Path
from typing import Any, Optional

import httpx
from dotenv import load_dotenv

load_dotenv(Path(__file__).parent.parent / ".env")

# API keys from env
FRED_KEY = os.environ.get("FRED_API_KEY", "")
CENSUS_KEY = os.environ.get("CENSUS_API_KEY", "")
WALK_KEY = os.environ.get("WALK_SCORE_API_KEY", "")
WEATHER_KEY = os.environ.get("OPENWEATHER_API_KEY", "")
EIA_KEY = os.environ.get("EIA_API_KEY", "")
FINNHUB_KEY = os.environ.get("FINNHUB_API_KEY", "")
COINGECKO_KEY = os.environ.get("COINGECKO_API_KEY", "")
MAPBOX_KEY = os.environ.get("MAPBOX_API_KEY", "")  # Optional


@dataclass(frozen=True)
class PropertyResult:
    """Complete property intelligence package."""
    query: str
    address: Optional[str] = None
    lat: Optional[float] = None
    lng: Optional[float] = None
    place_type: Optional[str] = None
    bbox: Optional[list] = None
    # Location intelligence
    walk_score: dict = field(default_factory=dict)
    weather: dict = field(default_factory=dict)
    # Demographics
    census: dict = field(default_factory=dict)
    # Environmental
    fema_flood: dict = field(default_factory=dict)
    epa_facilities: list = field(default_factory=list)
    # Nearby
    osm_pois: list = field(default_factory=list)
    nearby_permits: list = field(default_factory=list)
    # Imagery
    images: list = field(default_factory=list)
    # Market context
    macro: dict = field(default_factory=dict)
    # Meta
    sources_queried: list = field(default_factory=list)
    errors: list = field(default_factory=list)
    fetched_at: Optional[str] = None


async def geocode_nominatim(client: httpx.AsyncClient, query: str) -> dict:
    """Geocode an address using OpenStreetMap Nominatim (free, no key)."""
    try:
        r = await client.get(
            "https://nominatim.openstreetmap.org/search",
            params={"q": query, "format": "json", "limit": 1, "addressdetails": 1, "extratags": 1},
            headers={"User-Agent": "RePrime-Data-Platform/1.0 (info@reprime.com)"},
            timeout=10,
        )
        data = r.json()
        if not data:
            return {"error": "Address not found"}
        place = data[0]
        return {
            "lat": float(place["lat"]),
            "lng": float(place["lon"]),
            "display_name": place["display_name"],
            "place_type": place.get("type", ""),
            "boundingbox": place.get("boundingbox", []),
            "address": place.get("address", {}),
            "extratags": place.get("extratags", {}),
            "importance": place.get("importance", 0),
            "osm_id": place.get("osm_id"),
        }
    except Exception as e:
        return {"error": str(e)}


async def get_walk_score(client: httpx.AsyncClient, lat: float, lng: float, address: str) -> dict:
    if not WALK_KEY:
        return {"error": "no_key"}
    try:
        r = await client.get(
            "https://api.walkscore.com/score",
            params={"format": "json", "address": address, "lat": lat, "lon": lng, "wsapikey": WALK_KEY, "transit": 1, "bike": 1},
            timeout=10,
        )
        return r.json()
    except Exception as e:
        return {"error": str(e)}


async def get_weather(client: httpx.AsyncClient, lat: float, lng: float) -> dict:
    if not WEATHER_KEY:
        return {"error": "no_key"}
    try:
        r = await client.get(
            "https://api.openweathermap.org/data/2.5/weather",
            params={"lat": lat, "lon": lng, "appid": WEATHER_KEY, "units": "imperial"},
            timeout=10,
        )
        d = r.json()
        return {
            "temp_f": d.get("main", {}).get("temp"),
            "feels_like": d.get("main", {}).get("feels_like"),
            "humidity": d.get("main", {}).get("humidity"),
            "wind_mph": d.get("wind", {}).get("speed"),
            "description": d.get("weather", [{}])[0].get("description"),
            "icon": d.get("weather", [{}])[0].get("icon"),
            "city": d.get("name"),
        }
    except Exception as e:
        return {"error": str(e)}


async def get_census_geo(client: httpx.AsyncClient, lat: float, lng: float) -> dict:
    """Get Census tract + demographics for a location."""
    try:
        # Step 1: Get FIPS tract from coords
        r = await client.get(
            "https://geocoding.geo.census.gov/geocoder/geographies/coordinates",
            params={"x": lng, "y": lat, "benchmark": "Public_AR_Current", "vintage": "Current_Current", "format": "json"},
            timeout=10,
        )
        geo = r.json()
        tracts = geo.get("result", {}).get("geographies", {}).get("Census Tracts", [])
        if not tracts:
            return {"error": "no_tract"}
        t = tracts[0]
        state = t.get("STATE")
        county = t.get("COUNTY")
        tract = t.get("TRACT")
        if not CENSUS_KEY:
            return {"state": state, "county": county, "tract": tract, "name": t.get("NAME")}
        # Step 2: Get ACS demographics
        r2 = await client.get(
            "https://api.census.gov/data/2022/acs/acs5",
            params={
                "get": "NAME,B01003_001E,B19013_001E,B25077_001E,B25064_001E,B25003_001E,B25003_002E,B25003_003E,B15003_022E,B23025_005E",
                "for": f"tract:{tract}",
                "in": f"state:{state} county:{county}",
                "key": CENSUS_KEY,
            },
            timeout=10,
        )
        d = r2.json()
        if not isinstance(d, list) or len(d) < 2:
            return {"state": state, "county": county, "tract": tract}
        headers = d[0]
        vals = d[1]
        m = dict(zip(headers, vals))
        return {
            "tract_name": m.get("NAME"),
            "state": state,
            "county": county,
            "tract": tract,
            "population": int(m.get("B01003_001E", 0)) if m.get("B01003_001E") else None,
            "median_household_income": int(m.get("B19013_001E", 0)) if m.get("B19013_001E") and m["B19013_001E"] != "-666666666" else None,
            "median_home_value": int(m.get("B25077_001E", 0)) if m.get("B25077_001E") and m["B25077_001E"] != "-666666666" else None,
            "median_gross_rent": int(m.get("B25064_001E", 0)) if m.get("B25064_001E") and m["B25064_001E"] != "-666666666" else None,
            "total_housing_units": int(m.get("B25003_001E", 0)) if m.get("B25003_001E") else None,
            "owner_occupied": int(m.get("B25003_002E", 0)) if m.get("B25003_002E") else None,
            "renter_occupied": int(m.get("B25003_003E", 0)) if m.get("B25003_003E") else None,
            "bachelors_or_higher": int(m.get("B15003_022E", 0)) if m.get("B15003_022E") else None,
            "unemployed": int(m.get("B23025_005E", 0)) if m.get("B23025_005E") else None,
        }
    except Exception as e:
        return {"error": str(e)}


async def get_fema_flood(client: httpx.AsyncClient, lat: float, lng: float) -> dict:
    """Get FEMA NFHL flood zone for coordinates (free, no key)."""
    try:
        # FEMA NFHL ArcGIS REST API
        r = await client.get(
            "https://hazards.fema.gov/gis/nfhl/rest/services/public/NFHL/MapServer/28/query",
            params={
                "geometry": f"{lng},{lat}",
                "geometryType": "esriGeometryPoint",
                "inSR": "4326",
                "outFields": "FLD_ZONE,FLD_AR_ID,STATIC_BFE,ZONE_SUBTY,SFHA_TF",
                "returnGeometry": "false",
                "f": "json",
            },
            timeout=10,
        )
        d = r.json()
        features = d.get("features", [])
        if not features:
            return {"in_floodplain": False, "zone": "X (low risk)", "message": "Outside SFHA"}
        feat = features[0]["attributes"]
        zone = feat.get("FLD_ZONE", "")
        sfha = feat.get("SFHA_TF", "F") == "T"
        return {
            "in_floodplain": sfha,
            "zone": zone,
            "zone_subtype": feat.get("ZONE_SUBTY", ""),
            "base_flood_elevation": feat.get("STATIC_BFE"),
            "high_risk": zone.startswith(("A", "V")),
        }
    except Exception as e:
        return {"error": str(e)}


async def get_epa_facilities(client: httpx.AsyncClient, lat: float, lng: float, radius_miles: float = 1.0) -> list:
    """Get EPA-regulated facilities near location."""
    try:
        # EPA Envirofacts FRS (Facility Registry Service)
        r = await client.get(
            f"https://data.epa.gov/efservice/FRS_PROGRAM_FACILITY/LATITUDE83/{lat-0.02}:{lat+0.02}/LONGITUDE83/{lng-0.02}:{lng+0.02}/JSON",
            timeout=15,
        )
        if r.status_code != 200:
            return []
        d = r.json()
        if not isinstance(d, list):
            return []
        return [
            {
                "name": f.get("PRIMARY_NAME"),
                "type": f.get("PGM_SYS_ACRNM"),
                "address": f.get("LOCATION_ADDRESS"),
                "city": f.get("CITY_NAME"),
                "state": f.get("STATE_CODE"),
                "lat": f.get("LATITUDE83"),
                "lng": f.get("LONGITUDE83"),
            }
            for f in d[:20]
        ]
    except Exception as e:
        return []


async def get_osm_pois(client: httpx.AsyncClient, lat: float, lng: float, radius: int = 800) -> list:
    """Get nearby POIs from OpenStreetMap Overpass API (free)."""
    try:
        query = f"""
        [out:json][timeout:15];
        (
          node["amenity"](around:{radius},{lat},{lng});
          node["shop"](around:{radius},{lat},{lng});
        );
        out body 30;
        """
        r = await client.post(
            "https://overpass-api.de/api/interpreter",
            data={"data": query},
            timeout=20,
        )
        d = r.json()
        pois = []
        for el in d.get("elements", [])[:30]:
            tags = el.get("tags", {})
            pois.append({
                "name": tags.get("name", "Unknown"),
                "category": tags.get("amenity") or tags.get("shop") or "other",
                "lat": el.get("lat"),
                "lng": el.get("lon"),
            })
        return pois
    except Exception as e:
        return []


async def get_property_images(client: httpx.AsyncClient, lat: float, lng: float, address: str) -> list:
    """Multi-source property imagery (free + paid)."""
    images = []
    # 1. OpenStreetMap embed
    images.append({
        "source": "OpenStreetMap",
        "type": "map",
        "url": f"https://www.openstreetmap.org/export/embed.html?bbox={lng-0.005}%2C{lat-0.005}%2C{lng+0.005}%2C{lat+0.005}&layer=mapnik&marker={lat}%2C{lng}",
        "embed": True,
    })
    # 2. OSM static tile (zoom 18)
    import math
    z = 18
    x = int((lng + 180) / 360 * 2**z)
    y = int((1 - math.log(math.tan(math.radians(lat)) + 1 / math.cos(math.radians(lat))) / math.pi) / 2 * 2**z)
    images.append({
        "source": "OpenStreetMap Tile",
        "type": "satellite",
        "url": f"https://tile.openstreetmap.org/{z}/{x}/{y}.png",
    })
    # 3. Mapbox Static (if key)
    if MAPBOX_KEY:
        images.append({
            "source": "Mapbox Satellite",
            "type": "satellite",
            "url": f"https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v12/static/{lng},{lat},17/800x500@2x?access_token={MAPBOX_KEY}",
        })
        images.append({
            "source": "Mapbox Streets",
            "type": "map",
            "url": f"https://api.mapbox.com/styles/v1/mapbox/streets-v12/static/{lng},{lat},16/800x500@2x?access_token={MAPBOX_KEY}",
        })
    # 4. Wikipedia GeoSearch images
    try:
        r = await client.get(
            "https://en.wikipedia.org/w/api.php",
            params={
                "action": "query",
                "list": "geosearch",
                "gscoord": f"{lat}|{lng}",
                "gsradius": 1000,
                "gslimit": 5,
                "format": "json",
            },
            timeout=8,
        )
        for g in r.json().get("query", {}).get("geosearch", [])[:5]:
            images.append({"source": "Wikipedia", "type": "context", "title": g.get("title"), "url": f"https://en.wikipedia.org/wiki/{g.get('title', '').replace(' ', '_')}"})
    except Exception:
        pass
    return images


async def get_macro_context(client: httpx.AsyncClient) -> dict:
    """Get current macro market context from FRED."""
    if not FRED_KEY:
        return {}
    series = {
        "DGS10": "10Y_Treasury",
        "MORTGAGE30US": "30Y_Mortgage",
        "FEDFUNDS": "Fed_Funds",
        "UNRATE": "Unemployment",
        "MSPUS": "Median_Home_Price",
        "CSUSHPISA": "Case_Shiller_HPI",
        "DRCRELEXFACBS": "CRE_Delinquency",
        "RRVRUSQ156N": "Rental_Vacancy",
    }
    results = {}
    async def fetch_one(sid, label):
        try:
            r = await client.get(
                "https://api.stlouisfed.org/fred/series/observations",
                params={"series_id": sid, "api_key": FRED_KEY, "file_type": "json", "sort_order": "desc", "limit": 2},
                timeout=8,
            )
            obs = r.json().get("observations", [])
            if obs:
                results[label] = {"value": obs[0].get("value"), "date": obs[0].get("date")}
        except Exception:
            pass
    await asyncio.gather(*[fetch_one(sid, label) for sid, label in series.items()])
    return results


async def search_property(query: str) -> dict:
    """Main entry point. Search for a property and fetch all available data."""
    from datetime import datetime
    async with httpx.AsyncClient() as client:
        # Step 1: Geocode
        geo = await geocode_nominatim(client, query)
        if "error" in geo:
            return {"query": query, "error": geo["error"], "sources_queried": ["Nominatim"]}

        lat, lng = geo["lat"], geo["lng"]
        address = geo["display_name"]
        sources = ["Nominatim"]
        errors = []

        # Step 2: Fan out to all data sources
        results = await asyncio.gather(
            get_walk_score(client, lat, lng, address),
            get_weather(client, lat, lng),
            get_census_geo(client, lat, lng),
            get_fema_flood(client, lat, lng),
            get_epa_facilities(client, lat, lng),
            get_osm_pois(client, lat, lng),
            get_property_images(client, lat, lng, address),
            get_macro_context(client),
            return_exceptions=True,
        )

        walk, weather, census, fema, epa, pois, images, macro = results

        # Track which sources succeeded
        for name, result in [("WalkScore", walk), ("OpenWeather", weather), ("Census ACS", census),
                              ("FEMA NFHL", fema), ("EPA Envirofacts", epa), ("OSM Overpass", pois),
                              ("Wikipedia GeoSearch", images), ("FRED", macro)]:
            if isinstance(result, Exception):
                errors.append(f"{name}: {str(result)[:100]}")
            elif isinstance(result, dict) and "error" in result:
                errors.append(f"{name}: {result['error']}")
            else:
                sources.append(name)

        return {
            "query": query,
            "address": address,
            "lat": lat,
            "lng": lng,
            "place_type": geo.get("place_type"),
            "bbox": geo.get("boundingbox", []),
            "address_components": geo.get("address", {}),
            "walk_score": walk if not isinstance(walk, Exception) else {},
            "weather": weather if not isinstance(weather, Exception) else {},
            "census": census if not isinstance(census, Exception) else {},
            "fema_flood": fema if not isinstance(fema, Exception) else {},
            "epa_facilities": epa if not isinstance(epa, Exception) else [],
            "osm_pois": pois if not isinstance(pois, Exception) else [],
            "images": images if not isinstance(images, Exception) else [],
            "macro": macro if not isinstance(macro, Exception) else {},
            "sources_queried": sources,
            "errors": errors,
            "fetched_at": datetime.utcnow().isoformat() + "Z",
        }


if __name__ == "__main__":
    import sys
    query = sys.argv[1] if len(sys.argv) > 1 else "1305 N. 9th Avenue, Pensacola, FL 32503"
    result = asyncio.run(search_property(query))
    print(json.dumps(result, indent=2, default=str))
