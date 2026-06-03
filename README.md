# RePrime Data Platform

> Commercial-real-estate intelligence. A live web platform that (1) searches any US
> address against ~18 government & market APIs in real time, and (2) continuously
> ingests data from a catalog of **~611 free sources** into a database and shows it
> live across every page.

**Live:** https://reprime-data-platform.vercel.app
**Stack:** static HTML + Python serverless (Vercel) · ingestion pipeline (GitHub Actions) · Postgres (Supabase)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fkazi-reprime%2Freprime-data-platform)

---

## What it does

1. **Address search** — `/explore`: enter any US address; one server-side call
   (`/api/search`) geocodes it and fans out to live free APIs (FRED, CoinGecko,
   FEMA, NWS, USGS, OSM, GDELT, FCC, Open-Meteo, …) returning risk, market,
   demographic, and location data with per-source status.
2. **Data warehouse** — a scheduled pipeline ingests the free-source catalog into
   Supabase; every page shows the live records via a shared data layer (`sb.js`),
   and `/data` is a full coverage view.

## Architecture

```
Browser
  ├── public/*.html ............ 5 pages (index, explore, dashboard, terminal, site) + data-coverage
  │      └── sb.js ............. shared live data layer → reads Supabase via anon key (RLS read-only)
  ├── /api/search (api/search.py) .. live per-address fan-out (Vercel Python function)
  └── /api/health, /api/sources, /api/stats, /api/live/* .. JSON endpoints

Ingestion (GitHub Actions, daily cron — non-IP-blocked, no time limit)
  pipeline/triage.py ....... classify ~696 free sources into tiers (live_api/rss/bulk/scrape/inspect)
  pipeline/connectors.py ... typed fetch by family (ArcGIS, Socrata, FDSN, OpenFEMA, generic) + true counts
  pipeline/run_ingest.py ... run connectors, write per-source results + coverage report
  pipeline/load_to_db.py ... bulk-load results into Postgres
        │
        ▼
Supabase (Postgres)  ── schema in pipeline/schema.sql (sources, source_data, ingest_runs, views, RLS)
        │
        ▼
Vercel pages read it live via the publishable/anon key
```

## Current data (live)

- **696** sources cataloged across **14** categories (`/api/sources`).
- **~30** sources currently ingesting real data; true totals reach into the
  millions per source (e.g. Chicago 8.5M rows, EPA 67,610) — populated by the cron.
- Records are stored in Supabase and displayed on every page via the
  **Live Data Warehouse** panel; full breakdown at **`/data`**.

> Coverage is measured as *sources returning real data*, not catalog size. The
> registry is mostly landing pages; the machine-ingestible subset (~146 live APIs
> + 52 bulk + 33 RSS) is the real target, grown sprint by sprint
> (see `docs/DATA_PIPELINE_PLAN.md`).

## Repo layout

| Path | Purpose |
|------|---------|
| `public/` | The 5 pages + `sb.js` + cached JSON (`public/data/**`) |
| `api/search.py`, `api/health.py` | Vercel Python functions |
| `pipeline/` | Ingestion: triage, connectors, runner, DB loader, schema |
| `.github/workflows/ingest.yml` | Daily ingestion cron |
| `scripts/` | `build_registry.py` (registry/stats), `verify.sh` (audit) |
| `scraper/aggregate.py` | Cached market/ticker refresh |
| `docs/` | ADR-001, implementation plan, status report, architecture |
| `tests/test_search.py` | Backend contract tests |

## Run it

```bash
# search engine (live APIs)
python3 api/search.py "350 5th Ave, New York, NY 10118"

# ingestion pipeline
python3 pipeline/triage.py                                           # tier the sources
python3 pipeline/run_ingest.py --tier live_api --auth keyless --limit 100
DATABASE_URL="postgresql://..." python3 pipeline/load_to_db.py       # load into Supabase

# proofs
bash scripts/verify.sh        # re-runnable audit (exit 0 = pass)
pytest tests/test_search.py -v
```

## Deployment

- **Vercel** auto-deploys on every push to `main` (static pages + Python functions).
- **GitHub Actions** runs `ingest.yml` daily (manual run via the Actions tab).

### Configuration (GitHub repo secrets / Vercel env)

| Secret | Used for |
|--------|----------|
| `DATABASE_URL` | Postgres connection (Supabase pooler) — lets the cron load data |
| `CENSUS_API_KEY`, `FRED_API_KEY`, … | optional keyed sources |

The Supabase **publishable (anon) key** is embedded in `sb.js` for read-only
serving — that is safe by design; row-level security blocks writes.

## Security

- No secrets in the repo. Keys live only in GitHub/Vercel secrets and local `.env`
  (gitignored). The DB password and service key never go in source.
- RLS: the anon key can only read; all writes go through the password-protected loader.

## Known limitations

- `fema_flood` / `epa_facilities` are IP-blocked from Vercel's serverless runtime
  (they work from GitHub's runners); both degrade gracefully.
- True per-source totals populate from the GitHub cron, not from local runs.
- See `docs/FEATURE_CHECKLIST.md` and `docs/PHASES_AND_PROGRESS.md` for full status.
