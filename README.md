# RePrime Data Platform

Institutional commercial real estate intelligence platform. Live address fan-out against ~22 government + market APIs, a curated 1,932-source catalog, and a data-dense visualization layer.

**Live:** [reprime-data-platform.vercel.app](https://reprime-data-platform.vercel.app)

---

## Architecture

Static HTML/CSS/vanilla JS frontend with Python serverless API functions on Vercel. No build step, no bundler, no framework — intentional (see ADR-001).

| Layer | Tech | Notes |
|---|---|---|
| Frontend | HTML + CSS + vanilla JS | 4 pages in `public/` |
| API | Vercel Python functions | `api/health.py`, `api/search.py` |
| Database | Supabase Postgres | Schema in `pipeline/schema.sql` |
| Ingestion | Python pipeline + GH Actions cron | Daily data refresh |
| 3D/Viz | Three.js r128, Chart.js 4.4, D3 7.9, Leaflet | CDN-loaded |
| Deploy | Vercel | Auto-deploy from `main` |

## Pages

| Route | File | Description |
|---|---|---|
| `/` | `index.html` | Landing — hero, stats, pipeline, market grid, team, FAQ |
| `/terminal` | `terminal.html` | Bloomberg-style command deck — deal factory, US map, live feed |
| `/explore` | `explore.html` | Address search with `/api/search`, Leaflet map, source badges |
| `/dashboard` | `dashboard.html` | Executive command center — KPI panels, charts |

All pages share chrome (nav, footer, ticker, background effects) via `rp-shell.js` + `rp-shell.css`.

## Theme System

Four themes: **Dark** (default), **Light**, **Midnight**, **Gold**. Toggle in the nav bar. Persisted via `localStorage` key `rp-theme`. CSS custom properties on `[data-theme]` attribute.

## Data Flow

```
Government APIs (FRED, Census, BLS, BEA, EIA, SEC, FEMA, FDIC, ...)
  --> pipeline/ (Python, GH Actions daily cron)
    --> Supabase Postgres (sources, source_data, data_records)
      --> public/data/*.json (snapshot files, served as static API)
        --> Browser (fetch from /api/... or /data/...)
```

## Local Development

```bash
# Serve the static site
python3 -m http.server 8000 --directory public

# Run ingestion (needs env vars)
cp api/.env.example api/.env   # fill in real values
python3 pipeline/run_ingest.py

# Tests
python3 -m pytest tests/
```

## Environment Variables

All values live in Vercel env + GitHub Actions secrets. See `api/.env.example` for the full list with inline docs.

Key variables: `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_KEY`, `FRED_API_KEY`, `CENSUS_API_KEY`, `BLS_API_KEY`, `BEA_API_KEY`, `EIA_API_KEY`, `FINNHUB_API_KEY`.

## Project Structure

```
api/              Vercel Python serverless functions
public/           Static site (4 active pages + shared assets)
  data/           JSON snapshots from ingestion pipeline
  images/         Static assets
pipeline/         Daily ingestion (Python, GH Actions cron)
  schema.sql      Supabase schema (source of truth)
docs/             Architecture docs + ADRs
tests/            pytest suite
scripts/          Local utilities
.github/          CI/CD workflows
```

## Security

- Browser uses Supabase **anon key** only (RLS-bound)
- Service-role key restricted to GH Actions + Vercel functions
- No secrets in source — `.env` is gitignored
- CSP headers restrict script/connect sources
- All visible numbers are either live-bound or carry a "Sample" badge

## License

MIT
