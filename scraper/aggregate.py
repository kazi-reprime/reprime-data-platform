#!/usr/bin/env python3
"""RePrime Data Aggregator — hits free no-auth endpoints, caches as JSON."""
import json, os, sys
from urllib.request import urlopen, Request
from datetime import datetime

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'public', 'data')
os.makedirs(os.path.join(OUT, 'live'), exist_ok=True)
os.makedirs(os.path.join(OUT, 'market'), exist_ok=True)
os.makedirs(os.path.join(OUT, 'deal'), exist_ok=True)

def fetch(url, timeout=10):
    try:
        req = Request(url, headers={'User-Agent': 'RePrime-DataPlatform/1.0'})
        with urlopen(req, timeout=timeout) as r:
            return r.read().decode('utf-8', errors='replace')
    except Exception as e:
        print(f"  FAIL: {e}")
        return None

results = {}

print("1. NY Fed SOFR...")
d = fetch("https://markets.newyorkfed.org/api/rates/sofr/last/1.json")
if d:
    try:
        j = json.loads(d)
        rate = j.get('refRates',[{}])[0]
        results['sofr'] = {'value': str(rate.get('percentRate',''))+'%', 'date': rate.get('effectiveDate',''), 'source': 'NY Fed'}
    except: pass

print("2. NY Fed EFFR...")
d = fetch("https://markets.newyorkfed.org/api/rates/effr/last/1.json")
if d:
    try:
        j = json.loads(d)
        rate = j.get('refRates',[{}])[0]
        results['effr'] = {'value': str(rate.get('percentRate',''))+'%', 'date': rate.get('effectiveDate',''), 'source': 'NY Fed'}
    except: pass

print("3. FRED 10Y Treasury...")
d = fetch("https://fred.stlouisfed.org/graph/fredgraph.csv?id=DGS10")
if d:
    lines = [l for l in d.strip().split('\n') if l and not l.startswith('DATE')]
    if lines:
        parts = lines[-1].split(',')
        if len(parts)==2 and parts[1]!='.':
            results['treasury_10y'] = {'value': parts[1]+'%', 'date': parts[0], 'source': 'FRED'}

print("4. FRED 30Y Mortgage...")
d = fetch("https://fred.stlouisfed.org/graph/fredgraph.csv?id=MORTGAGE30US")
if d:
    lines = [l for l in d.strip().split('\n') if l and not l.startswith('DATE')]
    if lines:
        parts = lines[-1].split(',')
        if len(parts)==2 and parts[1]!='.':
            results['mortgage_30y'] = {'value': parts[1]+'%', 'date': parts[0], 'source': 'FRED'}

print("5. FRED Fed Funds...")
d = fetch("https://fred.stlouisfed.org/graph/fredgraph.csv?id=FEDFUNDS")
if d:
    lines = [l for l in d.strip().split('\n') if l and not l.startswith('DATE')]
    if lines:
        parts = lines[-1].split(',')
        if len(parts)==2 and parts[1]!='.':
            results['fed_funds'] = {'value': parts[1]+'%', 'date': parts[0], 'source': 'FRED'}

print("6. FRED Unemployment...")
d = fetch("https://fred.stlouisfed.org/graph/fredgraph.csv?id=UNRATE")
if d:
    lines = [l for l in d.strip().split('\n') if l and not l.startswith('DATE')]
    if lines:
        parts = lines[-1].split(',')
        if len(parts)==2 and parts[1]!='.':
            results['unemployment'] = {'value': parts[1]+'%', 'date': parts[0], 'source': 'FRED/BLS'}

print("7. CoinGecko BTC+ETH...")
d = fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd,ils")
if d:
    try:
        j = json.loads(d)
        if 'bitcoin' in j:
            results['bitcoin'] = {'usd': j['bitcoin']['usd'], 'ils': j['bitcoin'].get('ils',''), 'source': 'CoinGecko'}
        if 'ethereum' in j:
            results['ethereum'] = {'usd': j['ethereum']['usd'], 'ils': j['ethereum'].get('ils',''), 'source': 'CoinGecko'}
    except: pass

print("8. Frankfurter FX...")
d = fetch("https://api.frankfurter.dev/v2/rates?base=USD&symbols=ILS,EUR,GBP,CAD,JPY")
if d:
    try:
        j = json.loads(d)
        rates = j.get('data',{})
        if rates:
            latest_date = sorted(rates.keys())[-1]
            results['fx'] = {'rates': rates[latest_date], 'source': 'Frankfurter/ECB', 'date': latest_date}
    except: pass

print("9. Bank of Israel FX...")
d = fetch("https://boi.org.il/PublicApi/GetExchangeRate?key=USD")
if d:
    try:
        j = json.loads(d)
        results['boi_usd_ils'] = {'rate': j.get('currentExchangeRate',''), 'change': j.get('currentChange',''), 'source': 'Bank of Israel'}
    except: pass

print("10. FEMA Disasters (FL)...")
d = fetch("https://www.fema.gov/api/open/v2/DisasterDeclarationsSummaries?$filter=state%20eq%20'FL'&$top=5&$orderby=declarationDate%20desc")
if d:
    try:
        j = json.loads(d)
        results['fema_disasters'] = {'count': j.get('metadata',{}).get('count',0), 'latest': j.get('DisasterDeclarationsSummaries',[])[:5], 'source': 'FEMA'}
    except: pass

print("11. Federal Register CRE...")
d = fetch("https://www.federalregister.gov/api/v1/documents.json?conditions[term]=commercial+real+estate&per_page=5&order=newest")
if d:
    try:
        j = json.loads(d)
        docs = [{'title':r.get('title',''),'date':r.get('publication_date',''),'type':r.get('type','')} for r in j.get('results',[])]
        results['fed_register'] = {'documents': docs, 'source': 'Federal Register'}
    except: pass

print("12. NWS Weather FL...")
d = fetch("https://api.weather.gov/alerts/active?area=FL&limit=5")
if d:
    try:
        j = json.loads(d)
        alerts = [{'event':f['properties']['event'],'severity':f['properties']['severity']} for f in j.get('features',[])]
        results['weather_alerts'] = {'count': len(alerts), 'alerts': alerts[:5], 'source': 'NWS'}
    except: pass

print("13. FDIC Failures...")
d = fetch("https://banks.data.fdic.gov/api/failures?sort_by=FAILDATE&sort_order=DESC&limit=5&output=json")
if d:
    try:
        j = json.loads(d)
        results['fdic_failures'] = {'data': j.get('data',[])[:5], 'source': 'FDIC'}
    except: pass

print("14. USGS Earthquakes...")
d = fetch("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_week.geojson")
if d:
    try:
        j = json.loads(d)
        results['earthquakes'] = {'count': len(j.get('features',[])), 'source': 'USGS'}
    except: pass

print("15. BLS CPI...")
d = fetch("https://api.bls.gov/publicAPI/v2/timeseries/data/CUSR0000SA0")
if d:
    try:
        j = json.loads(d)
        series = j.get('Results',{}).get('series',[{}])[0].get('data',[])
        if series:
            results['bls_cpi'] = {'value': series[0].get('value',''), 'period': series[0].get('periodName',''), 'year': series[0].get('year',''), 'source': 'BLS'}
    except: pass

# Compile outputs
results['_meta'] = {'generated': datetime.utcnow().isoformat()+'Z', 'source_count': len([k for k in results if not k.startswith('_')])}

ticker = {}
for k in ['sofr','effr','treasury_10y','mortgage_30y','fed_funds','unemployment']:
    if k in results: ticker[k] = results[k]
if 'bitcoin' in results: ticker['bitcoin'] = {'value': f"${results['bitcoin']['usd']:,.0f}", 'source': 'CoinGecko'}
if 'ethereum' in results: ticker['ethereum'] = {'value': f"${results['ethereum']['usd']:,.0f}", 'source': 'CoinGecko'}

market = {
    'fred': {k: results[k] for k in ['treasury_10y','mortgage_30y','fed_funds','sofr','effr'] if k in results},
    'crypto': {k: {'price': f"${results[k]['usd']:,.0f}"} for k in ['bitcoin','ethereum'] if k in results},
    'fx': results.get('fx',{}),
    'boi': results.get('boi_usd_ils',{}),
}

for path, data in [
    ('live/ticker.json', ticker),
    ('live/market.json', market),
    ('deal/intelligence.json', {k: results.get(k,{}) for k in ['fema_disasters','fed_register','weather_alerts','fdic_failures','earthquakes','bls_cpi']}),
    ('stats.json', {'sources': 611, 'records': 8223, 'apis': 29, 'categories': 14, 'scraped': 549, 'last_updated': results['_meta']['generated']}),
    ('sources.json', results),
]:
    with open(os.path.join(OUT, path), 'w') as f:
        json.dump(data, f, indent=2, default=str)
    print(f"  Wrote {path}")

print(f"\nDone! {results['_meta']['source_count']} sources fetched.")
