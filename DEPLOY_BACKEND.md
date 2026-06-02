# Backend Deployment — Consolidated Vercel Function

The platform is a single Vercel project: static pages in `public/` + one Python
serverless function at `api/search.py` (route `/api/search`). There is **no
separate backend** — Render and the FastAPI/uvicorn server have been retired.

## Architecture (v4.0)

```
public/*.html            → static pages (dashboard, explore, terminal, site)
api/search.py            → /api/search?address=<addr>[&value=<usd>]  (live fan-out)
public/data/*.json       → cached market/ticker JSON (refreshed by scraper/aggregate.py)
vercel.json              → routes /api/live/*, /api/sources, /api/health, /api/stats
```

`api/search.py` uses the Python standard library only (no `requests`, no heavy
deps) for the fastest possible cold start. Most sources are keyless
(FRED, CoinGecko, Frankfurter, OSM, Federal Register, NWS, FDIC, GDELT, FEMA,
Census Geocoder). A few optional sources read keys from environment variables.

## Deploy

Vercel auto-deploys on every push to `main` (the repo is already linked).
To deploy manually:

```bash
vercel --prod
```

## Environment variables (set in Vercel, never in the repo)

Set these in **Vercel → Project → Settings → Environment Variables**. They are
optional — the search works without them, but they enable extra sources.

| Key | Enables | Get a free key at |
|-----|---------|-------------------|
| `CENSUS_API_KEY` | Tract demographics (ACS) | https://api.census.gov/data/key_signup.html |
| `FRED_API_KEY` | (optional) authenticated FRED | https://fred.stlouisfed.org/docs/api/api_key.html |
| `BLS_API_KEY` | (optional) higher BLS limits | https://data.bls.gov/registrationEngine/ |

> **Security:** API keys must live only in Vercel env vars and your local
> `api/.env` (which is gitignored). Never commit them to the repo or to any
> markdown file. If a key was ever committed, rotate it at the provider.

## Local development

```bash
cd /Users/mkazi/Downloads/API
# run the search engine directly against the live APIs:
python3 api/search.py "1600 Pennsylvania Ave NW, Washington, DC 20500"
# or with a valuation to convert:
python3 api/search.py "350 5th Ave, New York, NY 10118" --value 12000000
```

## Refreshing cached market data

`scraper/aggregate.py` pulls the keyless market/rate endpoints and writes
`public/data/**`. Run it on a schedule (Vercel Cron or GitHub Action):

```bash
python3 scraper/aggregate.py
```
