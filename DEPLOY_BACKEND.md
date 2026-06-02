# Backend Deployment Guide — Real 24/7 Scrapers

The static Vercel frontend works alone, but the **live property search** + **24/7 scrapers** need a real Python backend.

## What You Get When Deployed

- `/api/property/search?q=<any address>` — geocodes + fans out to 8 sources
- 24/7 APScheduler running market data refresh hourly + full 611-source scrape daily
- All existing /api/* endpoints (live, market, deal, sources)

## Option 1: Render (Recommended — Free Tier)

1. Sign up at https://render.com
2. New → Web Service → Connect `github.com/kazi-reprime/reprime-data-platform`
3. Settings:
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `python -m uvicorn api.server.app:app --host 0.0.0.0 --port $PORT`
   - **Plan**: Free
4. Environment Variables (copy from `api/.env`):
   - `FRED_API_KEY`, `CENSUS_API_KEY`, `BLS_API_KEY`, `WALK_SCORE_API_KEY`, `OPENWEATHER_API_KEY`, `EIA_API_KEY`, `FINNHUB_API_KEY`, `COINGECKO_API_KEY`, `TWELVE_DATA_API_KEY`, `ALPHA_VANTAGE_API_KEY`, `DATA_GOV_API_KEY`
5. Deploy. Takes ~3 min. URL: `https://reprime-data-platform.onrender.com`
6. Update frontend: in `public/explore.html` change `BACKEND = 'https://reprime-data-platform.onrender.com'`

⚠️ Render free tier sleeps after 15min idle. Background scheduler stops too. Upgrade to Starter ($7/mo) for true 24/7.

## Option 2: Railway ($5/mo)
1. Sign up at https://railway.app
2. New Project → Deploy from GitHub → kazi-reprime/reprime-data-platform
3. Add environment variables (same list as Render)
4. Railway auto-detects Python and starts uvicorn
5. Always-on. URL: `https://<project>.railway.app`

## Option 3: Fly.io (Free generous tier)
```bash
flyctl launch --name reprime-data
flyctl secrets set FRED_API_KEY=... CENSUS_API_KEY=... [...]
flyctl deploy
```

## Option 4: Run Locally + ngrok (Quick test)
```bash
# Terminal 1
python3 -m uvicorn api.server.app:app --port 8001

# Terminal 2 — expose to internet
ngrok http 8001
# Use the https://xxx.ngrok.io URL in your frontend
```

## Optional API Keys to Unlock More

The current setup uses **only free APIs**. To get richer property data, get these keys:

| Service | What It Unlocks | Free Tier? | Cost |
|---------|----------------|------------|------|
| **Mapbox** | Satellite imagery, street view, geocoding | Yes (50K/mo) | Set `MAPBOX_API_KEY` |
| **ATTOM Data** | Real property records (owner, sale history, deed) | No | ~$0.05/lookup |
| **Estated** | Property records + valuation | No | $300+/mo |
| **Google Maps Static** | Street View images | $200 credit | $0.007/image |
| **Zillow GetSearchResults** | Public listings (limited) | Deprecated | — |
| **Realty Mole / Rentcast** | Rent estimates, comps | Yes (50/mo) | $74/mo+ |
| **Walk Score** ✓ | Already configured | Yes | Free |
| **PropertyShark** | NYC/NJ/FL listings | No | $50+/mo |

## What Currently Works (Free)

- ✅ **Geocoding** any address worldwide (Nominatim/OSM)
- ✅ **Walk Score** (you have key) 
- ✅ **OpenWeather** (you have key)
- ✅ **Census ACS** demographics (you have key)
- ✅ **FEMA Flood Zones** (no key needed)
- ✅ **EPA Envirofacts** (no key needed)
- ✅ **OSM Overpass** for nearby POIs (no key)
- ✅ **Wikipedia GeoSearch** context (no key)
- ✅ **FRED** macro indicators (you have key)
- ✅ **Finnhub** REIT prices (you have key)

## Database (Optional — for scraper persistence)

By default scrapers save to JSON files. To use a real DB:

**Vercel KV (free hobby tier)**:
```bash
vercel kv create reprime-cache
```

**Supabase (free PostgreSQL)**:
- Sign up at supabase.com
- Add `SUPABASE_URL` and `SUPABASE_KEY` to env vars

The scheduler will automatically use the DB if env vars are set.
