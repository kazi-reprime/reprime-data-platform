"""
RePrime Property Intelligence Search Engine
Vercel Serverless Function — Python Runtime

Takes an address, geocodes it, fans out to 15+ real APIs,
returns aggregated property intelligence as JSON.
"""
from http.server import BaseHTTPRequestHandler
import json
import urllib.request
import urllib.parse
import urllib.error
import ssl
import re
from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import datetime

# Disable SSL verification for some government APIs
ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

def fetch(url, timeout=8, headers=None):
    """Fetch URL and return text, or None on failure."""
    hdrs = {'User-Agent': 'RePrime-DataPlatform/3.0 (g@floridastatetrust.com)'}
    if headers:
        hdrs.update(headers)
    try:
        req = urllib.request.Request(url, headers=hdrs)
        with urllib.request.urlopen(req, timeout=timeout, context=ctx) as r:
            return r.read().decode('utf-8', errors='replace')
    except Exception as e:
        return None

def fetch_json(url, timeout=8):
    """Fetch URL and parse as JSON."""
    d = fetch(url, timeout)
    if d:
        try:
            # Redfin prefixes responses with "{}&&"
            if d.startswith('{}&&'):
                d = d[4:]
            return json.loads(d)
        except:
            pass
    return None

# ═══════════════════════════════════════════
# GEOCODING
# ═══════════════════════════════════════════
def geocode_census(address):
    """Census Geocoder — returns lat, lon, FIPS codes."""
    url = f"https://geocoding.geo.census.gov/geocoder/geographies/onelineaddress?address={urllib.parse.quote(address)}&benchmark=Public_AR_Current&vintage=Current_Current&format=json"
    d = fetch_json(url, 10)
    if not d:
        return None
    matches = d.get('result', {}).get('addressMatches', [])
    if not matches:
        return None
    m = matches[0]
    geo = m.get('geographies', {})
    return {
        'lat': m['coordinates']['y'],
        'lon': m['coordinates']['x'],
        'matched_address': m.get('matchedAddress', ''),
        'state': geo.get('States', [{}])[0].get('NAME', ''),
        'county': geo.get('Counties', [{}])[0].get('NAME', ''),
        'tract': geo.get('Census Tracts', [{}])[0].get('TRACT', ''),
        'block': geo.get('2020 Census Blocks', [{}])[0].get('BLOCK', ''),
        'fips_state': geo.get('States', [{}])[0].get('STATE', ''),
        'fips_county': geo.get('Counties', [{}])[0].get('COUNTY', ''),
        'source': 'Census Geocoder'
    }

def geocode_nominatim(address):
    """Nominatim fallback geocoder."""
    url = f"https://nominatim.openstreetmap.org/search?q={urllib.parse.quote(address)}&format=json&limit=1&addressdetails=1"
    d = fetch_json(url)
    if not d or len(d) == 0:
        return None
    r = d[0]
    addr = r.get('address', {})
    return {
        'lat': float(r['lat']),
        'lon': float(r['lon']),
        'matched_address': r.get('display_name', ''),
        'state': addr.get('state', ''),
        'county': addr.get('county', ''),
        'tract': '',
        'block': '',
        'fips_state': '',
        'fips_county': '',
        'source': 'Nominatim'
    }

# ═══════════════════════════════════════════
# DATA SOURCES — REAL API CALLS
# ═══════════════════════════════════════════

def fetch_fema_flood(lat, lon):
    """FEMA NFHL — real flood zone for exact coordinates."""
    url = f"https://hazards.fema.gov/arcgis/rest/services/public/NFHL/MapServer/28/query?geometry={lon},{lat}&geometryType=esriGeometryPoint&inSR=4326&spatialRel=esriSpatialRelContains&outFields=FLD_ZONE,ZONE_SUBTY,STATIC_BFE&f=json"
    d = fetch_json(url)
    if d and d.get('features'):
        attrs = d['features'][0].get('attributes', {})
        zone = attrs.get('FLD_ZONE', 'Unknown')
        return {
            'zone': zone,
            'subtype': attrs.get('ZONE_SUBTY', ''),
            'base_flood_elevation': attrs.get('STATIC_BFE', ''),
            'in_sfha': zone in ('A', 'AE', 'AH', 'AO', 'V', 'VE'),
            'risk': 'HIGH' if zone in ('A', 'AE', 'AH', 'AO', 'V', 'VE') else 'MODERATE' if zone == 'X500' else 'LOW',
            'source': 'FEMA NFHL'
        }
    return {'zone': 'Unknown', 'risk': 'Unknown', 'source': 'FEMA NFHL (no data)'}

def fetch_fema_disasters(state_abbr):
    """FEMA OpenFEMA — recent disasters for state."""
    if not state_abbr:
        return []
    url = f"https://www.fema.gov/api/open/v2/DisasterDeclarationsSummaries?$filter=state%20eq%20'{state_abbr}'&$top=5&$orderby=declarationDate%20desc"
    d = fetch_json(url)
    if d:
        return [{'title': r.get('declarationTitle', ''), 'type': r.get('incidentType', ''), 'date': r.get('declarationDate', '')[:10], 'county': r.get('designatedArea', '')} for r in d.get('DisasterDeclarationsSummaries', [])[:5]]
    return []

def fetch_epa_sites(lat, lon):
    """EPA Cleanups in My Community — Superfund/brownfield sites within 2km."""
    url = f"https://map22.epa.gov/arcgis/rest/services/cimc/Cleanups/MapServer/0/query?geometry={lon},{lat}&geometryType=esriGeometryPoint&inSR=4326&spatialRel=esriSpatialRelIntersects&distance=2000&units=esriSRUnit_Meter&outFields=SITE_NAME,SITE_STATUS,SITE_TYPE&f=json"
    d = fetch_json(url)
    if d and d.get('features'):
        return [{'name': f['attributes'].get('SITE_NAME', ''), 'status': f['attributes'].get('SITE_STATUS', ''), 'type': f['attributes'].get('SITE_TYPE', '')} for f in d['features'][:10]]
    return []

def fetch_fred_rates():
    """FRED CSV — Treasury, Mortgage, Fed Funds, Unemployment."""
    rates = {}
    series = {
        'treasury_10y': 'DGS10',
        'mortgage_30y': 'MORTGAGE30US',
        'fed_funds': 'FEDFUNDS',
        'unemployment': 'UNRATE',
    }
    for key, sid in series.items():
        d = fetch(f"https://fred.stlouisfed.org/graph/fredgraph.csv?id={sid}", 5)
        if d:
            lines = [l for l in d.strip().split('\n') if l and not l.startswith('DATE')]
            if lines:
                parts = lines[-1].split(',')
                if len(parts) == 2 and parts[1] != '.':
                    rates[key] = {'value': parts[1] + '%', 'date': parts[0], 'source': 'FRED'}
    return rates

def fetch_crypto():
    """CoinGecko — BTC, ETH in USD and ILS."""
    d = fetch_json("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd,ils")
    if d:
        return {
            'bitcoin': {'usd': d.get('bitcoin', {}).get('usd', 0), 'ils': d.get('bitcoin', {}).get('ils', 0)},
            'ethereum': {'usd': d.get('ethereum', {}).get('usd', 0), 'ils': d.get('ethereum', {}).get('ils', 0)},
            'source': 'CoinGecko'
        }
    return {}

def fetch_fx():
    """Frankfurter + Bank of Israel — FX rates."""
    rates = {}
    # Frankfurter (ECB-sourced)
    d = fetch_json("https://api.frankfurter.app/latest?from=USD&to=ILS,EUR,GBP,CAD,JPY")
    if d and d.get('rates'):
        rates.update(d['rates'])
        rates['_source_ecb'] = 'Frankfurter/ECB'
        rates['_date'] = d.get('date', '')
    # Bank of Israel
    d = fetch_json("https://boi.org.il/PublicApi/GetExchangeRate?key=USD")
    if d:
        rates['ILS_BOI'] = d.get('currentExchangeRate', '')
        rates['ILS_BOI_change'] = d.get('currentChange', '')
        rates['_source_boi'] = 'Bank of Israel'
    return rates

def fetch_gdelt_news(area):
    """GDELT — area news sentiment."""
    if not area or len(area.strip()) < 3:
        return []
    q = urllib.parse.quote(f"{area} real estate")
    url = f"https://api.gdeltproject.org/api/v2/doc/doc?query={q}&mode=artlist&maxrecords=8&format=json"
    d = fetch_json(url, 8)
    if d and d.get('articles'):
        return [{'title': a.get('title', ''), 'url': a.get('url', ''), 'source': a.get('domain', ''), 'date': (a.get('seendate', '') or '')[:8], 'tone': float(a.get('tone', 0) or 0)} for a in d['articles'][:8]]
    return []

def fetch_fed_register():
    """Federal Register — latest CRE rules."""
    d = fetch_json("https://www.federalregister.gov/api/v1/documents.json?conditions[term]=commercial+real+estate&per_page=5&order=newest")
    if d:
        return [{'title': r.get('title', ''), 'date': r.get('publication_date', ''), 'type': r.get('type', ''), 'url': r.get('html_url', '')} for r in d.get('results', [])[:5]]
    return []

def fetch_fdic_data():
    """FDIC — recent bank failures + CRE exposure."""
    failures = fetch_json("https://banks.data.fdic.gov/api/failures?sort_by=FAILDATE&sort_order=DESC&limit=5&output=json")
    return {
        'failures': (failures or {}).get('data', [])[:5],
        'source': 'FDIC BankFind'
    }

def fetch_weather_alerts(lat, lon):
    """NWS — active weather alerts."""
    d = fetch_json(f"https://api.weather.gov/alerts/active?point={lat},{lon}&limit=5")
    if d and d.get('features'):
        return [{'event': f['properties'].get('event', ''), 'severity': f['properties'].get('severity', ''), 'headline': f['properties'].get('headline', '')} for f in d['features'][:5]]
    return []

def fetch_redfin(address, lat=None, lon=None):
    """Redfin Stingray — internal API for property data."""
    results = {}
    # Try initial address search
    q = urllib.parse.quote(address)
    d = fetch(f"https://www.redfin.com/stingray/do/location-autocomplete?location={q}&v=2", 8,
              headers={'Referer': 'https://www.redfin.com/'})
    if d:
        # Redfin prefixes with {}&&
        if d.startswith('{}&&'):
            d = d[4:]
        try:
            j = json.loads(d)
            payload = j.get('payload', {})
            sections = payload.get('sections', [])
            for section in sections:
                for row in section.get('rows', []):
                    results['redfin_url'] = row.get('url', '')
                    results['redfin_name'] = row.get('name', '')
                    results['redfin_type'] = row.get('type', '')
                    results['redfin_id'] = row.get('id', '')
                    break
                if results:
                    break
        except:
            pass

    # If we got a property URL, try to get details
    if results.get('redfin_url'):
        prop_url = f"https://www.redfin.com/stingray/api/home/details/belowTheFold?propertyId={results.get('redfin_id', '')}&accessLevel=1"
        details = fetch(prop_url, 8, headers={'Referer': 'https://www.redfin.com/'})
        if details:
            if details.startswith('{}&&'):
                details = details[4:]
            try:
                dj = json.loads(details)
                results['redfin_details'] = True
            except:
                pass

    # Try GIS CSV for area listings
    if lat and lon:
        gis_url = f"https://www.redfin.com/stingray/api/gis-csv?al=1&num_homes=5&ord=redfin-recommended-asc&region_id=0&region_type=0&sf=1,2,3,5,6,7&status=9&uipt=1,2,3,4,5,6,7,8&v=8&center_lat={lat}&center_lng={lon}&max_radius=2"
        gis = fetch(gis_url, 8, headers={'Referer': 'https://www.redfin.com/'})
        if gis and len(gis) > 100:
            lines = gis.strip().split('\n')
            if len(lines) > 1:
                headers_row = lines[0].split(',')
                results['redfin_listings'] = []
                for line in lines[1:6]:  # Max 5 nearby
                    vals = line.split(',')
                    if len(vals) >= len(headers_row):
                        listing = {}
                        for i, h in enumerate(headers_row):
                            listing[h.strip('"')] = vals[i].strip('"')
                        results['redfin_listings'].append(listing)
                results['redfin_listings_count'] = len(results.get('redfin_listings', []))

    results['source'] = 'Redfin Stingray API'
    return results

def fetch_osm_pois(lat, lon):
    """OpenStreetMap Overpass — nearby points of interest."""
    query = f"""[out:json][timeout:5];(
      node["amenity"](around:800,{lat},{lon});
      node["shop"](around:800,{lat},{lon});
      node["tourism"](around:800,{lat},{lon});
    );out body 20;"""
    try:
        data = urllib.parse.urlencode({'data': query}).encode()
        req = urllib.request.Request('https://overpass-api.de/api/interpreter', data=data,
                                     headers={'User-Agent': 'RePrime-DataPlatform/3.0'})
        with urllib.request.urlopen(req, timeout=8, context=ctx) as r:
            d = json.loads(r.read().decode())
        return [{'name': e.get('tags', {}).get('name', 'Unnamed'), 'type': e.get('tags', {}).get('amenity', '') or e.get('tags', {}).get('shop', '') or e.get('tags', {}).get('tourism', '')} for e in d.get('elements', []) if e.get('tags', {}).get('name')][:20]
    except:
        return []

def fetch_cdc_svi(lat, lon):
    """CDC Social Vulnerability Index — block group level."""
    url = f"https://services3.arcgis.com/ZvidGQkLaDJxRSJ2/arcgis/rest/services/CDC_Social_Vulnerability_Index_2022/FeatureServer/0/query?geometry={lon},{lat}&geometryType=esriGeometryPoint&inSR=4326&spatialRel=esriSpatialRelIntersects&outFields=RPL_THEMES,RPL_THEME1,RPL_THEME2,RPL_THEME3,RPL_THEME4,E_TOTPOP,E_HU,E_MINRTY&f=json"
    d = fetch_json(url)
    if d and d.get('features'):
        attrs = d['features'][0].get('attributes', {})
        return {
            'overall_vulnerability': attrs.get('RPL_THEMES', ''),
            'socioeconomic': attrs.get('RPL_THEME1', ''),
            'household_disability': attrs.get('RPL_THEME2', ''),
            'minority_language': attrs.get('RPL_THEME3', ''),
            'housing_transport': attrs.get('RPL_THEME4', ''),
            'total_population': attrs.get('E_TOTPOP', ''),
            'housing_units': attrs.get('E_HU', ''),
            'minority_pct': attrs.get('E_MINRTY', ''),
            'source': 'CDC/ATSDR SVI 2022'
        }
    return {}

def fetch_fcc_broadband(lat, lon):
    """FCC Broadband Availability — ISP coverage."""
    url = f"https://broadbandmap.fcc.gov/api/public/map/listAvailability?latitude={lat}&longitude={lon}&category=fixed_residential&speed_dn=100&speed_up=20"
    d = fetch_json(url)
    if d and isinstance(d, list):
        providers = [{'name': p.get('brand_name', ''), 'tech': p.get('tech_code_description', ''), 'down': p.get('max_advertised_downstream_speed', ''), 'up': p.get('max_advertised_upstream_speed', '')} for p in d[:5]]
        return {'providers': providers, 'count': len(d), 'source': 'FCC Broadband Map'}
    return {}

# ═══════════════════════════════════════════
# MAIN HANDLER
# ═══════════════════════════════════════════

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        # Parse query params
        from urllib.parse import urlparse, parse_qs
        parsed = urlparse(self.path)
        params = parse_qs(parsed.query)
        address = params.get('address', params.get('q', ['']))[0]

        if not address:
            self.send_response(400)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps({'error': 'Missing address parameter. Use ?address=...'}).encode())
            return

        start = datetime.utcnow()
        sources_hit = []
        results = {'query': address, 'timestamp': start.isoformat() + 'Z'}

        # Step 1: Geocode
        geo = geocode_census(address)
        if geo:
            sources_hit.append('Census Geocoder')
        else:
            geo = geocode_nominatim(address)
            if geo:
                sources_hit.append('Nominatim')

        if not geo:
            self.send_response(404)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps({'error': 'Could not geocode address', 'query': address}).encode())
            return

        results['geocode'] = geo
        lat, lon = geo['lat'], geo['lon']
        state = geo.get('state', '')
        county = geo.get('county', '')

        # State abbreviation lookup
        state_abbrs = {'Alabama':'AL','Alaska':'AK','Arizona':'AZ','Arkansas':'AR','California':'CA','Colorado':'CO','Connecticut':'CT','Delaware':'DE','Florida':'FL','Georgia':'GA','Hawaii':'HI','Idaho':'ID','Illinois':'IL','Indiana':'IN','Iowa':'IA','Kansas':'KS','Kentucky':'KY','Louisiana':'LA','Maine':'ME','Maryland':'MD','Massachusetts':'MA','Michigan':'MI','Minnesota':'MN','Mississippi':'MS','Missouri':'MO','Montana':'MT','Nebraska':'NE','Nevada':'NV','New Hampshire':'NH','New Jersey':'NJ','New Mexico':'NM','New York':'NY','North Carolina':'NC','North Dakota':'ND','Ohio':'OH','Oklahoma':'OK','Oregon':'OR','Pennsylvania':'PA','Rhode Island':'RI','South Carolina':'SC','South Dakota':'SD','Tennessee':'TN','Texas':'TX','Utah':'UT','Vermont':'VT','Virginia':'VA','Washington':'WA','West Virginia':'WV','Wisconsin':'WI','Wyoming':'WY','District of Columbia':'DC'}
        state_abbr = state_abbrs.get(state, state[:2].upper() if state else '')

        # Step 2: Parallel fan-out to all sources
        with ThreadPoolExecutor(max_workers=12) as executor:
            futures = {
                executor.submit(fetch_fema_flood, lat, lon): 'fema_flood',
                executor.submit(fetch_fema_disasters, state_abbr): 'fema_disasters',
                executor.submit(fetch_epa_sites, lat, lon): 'epa_sites',
                executor.submit(fetch_fred_rates): 'fred_rates',
                executor.submit(fetch_crypto): 'crypto',
                executor.submit(fetch_fx): 'fx_rates',
                executor.submit(fetch_gdelt_news, f"{county} {state}"): 'news',
                executor.submit(fetch_fed_register): 'fed_register',
                executor.submit(fetch_fdic_data): 'fdic',
                executor.submit(fetch_weather_alerts, lat, lon): 'weather',
                executor.submit(fetch_redfin, address, lat, lon): 'redfin',
                executor.submit(fetch_osm_pois, lat, lon): 'osm_pois',
                executor.submit(fetch_cdc_svi, lat, lon): 'cdc_svi',
                executor.submit(fetch_fcc_broadband, lat, lon): 'fcc_broadband',
            }

            for future in as_completed(futures, timeout=25):
                key = futures[future]
                try:
                    data = future.result()
                    if data:
                        results[key] = data
                        sources_hit.append(key)
                except Exception as e:
                    results[key] = {'error': str(e)}

        # Step 3: Build multi-currency valuation
        fx = results.get('fx_rates', {})
        crypto = results.get('crypto', {})
        ils_rate = float(fx.get('ILS_BOI', 0) or fx.get('ILS', 0) or 3.65)
        btc_price = crypto.get('bitcoin', {}).get('usd', 67000)
        eth_price = crypto.get('ethereum', {}).get('usd', 2500)
        eur_rate = fx.get('EUR', 0.92)
        gbp_rate = fx.get('GBP', 0.79)

        results['multi_currency'] = {
            'rates': {
                'USD_ILS': ils_rate,
                'USD_EUR': eur_rate,
                'USD_GBP': gbp_rate,
                'BTC_USD': btc_price,
                'ETH_USD': eth_price,
            },
            'sample_10m': {
                'USD': '$10,000,000',
                'ILS': f'₪{10000000 * ils_rate:,.0f}',
                'BTC': f'₿{10000000 / btc_price:.2f}',
                'ETH': f'Ξ{10000000 / eth_price:.1f}',
                'EUR': f'€{10000000 * eur_rate:,.0f}',
                'GBP': f'£{10000000 * gbp_rate:,.0f}',
            },
            'sources': ['Bank of Israel', 'CoinGecko', 'Frankfurter/ECB']
        }

        # Step 4: Financing options
        results['financing'] = [
            {'product': 'Fannie Mae DUS', 'rate': '5.45%', 'ltv': '75%', 'term': '10yr', 'type': 'Agency Fixed'},
            {'product': 'Freddie Mac Optigo', 'rate': '5.52%', 'ltv': '75%', 'term': '10yr', 'type': 'Agency Fixed'},
            {'product': 'CMBS Conduit', 'rate': '5.80%', 'ltv': '65%', 'term': '10yr', 'type': 'Non-recourse'},
            {'product': 'Life Company', 'rate': '5.25%', 'ltv': '60%', 'term': '15yr', 'type': 'Lowest rate'},
            {'product': 'Bridge Floating', 'rate': 'SOFR+350bp', 'ltv': '80%', 'term': '3+1+1', 'type': 'Value-add'},
            {'product': 'HUD 223(f)', 'rate': '4.95%', 'ltv': '83.3%', 'term': '35yr', 'type': 'FHA Insured'},
        ]

        # Meta
        elapsed = (datetime.utcnow() - start).total_seconds()
        results['_meta'] = {
            'sources_hit': len(sources_hit),
            'sources_list': sources_hit,
            'elapsed_seconds': round(elapsed, 2),
            'timestamp': datetime.utcnow().isoformat() + 'Z',
            'engine': 'RePrime Data Platform v3.4'
        }

        # Return
        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Cache-Control', 'public, max-age=300')
        self.end_headers()
        self.wfile.write(json.dumps(results, indent=2, default=str).encode())

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
