# RePrime Data Platform — Project Instructions

> **Status:** active rebuild post-2026-06-08 audit. See `AUDIT-2026-06-08.md` (full 20-section deliverable) before making non-trivial changes.

## What this project is

Institutional commercial real estate intelligence platform. Live address fan-out against ~22 government + market APIs, a curated source catalog (~1,932 entries), and a data-dense vanilla-JS visualization layer (WebGL globe, Chart.js + D3 charts, searchable explorer). Public site at https://reprime-data-platform.vercel.app. GitHub: github.com/kazi-reprime/reprime-data-platform.

## Stack (as built — not aspirational)

- **Frontend:** Static HTML/CSS/vanilla JS — **no build step, no framework, no `package.json`**. Pages live in `public/`. Shared chrome injected by `rp-shell.js`.
- **API (serverless):** Vercel Python functions in `api/`, **stdlib only** (no third-party deps in the function bundle). Two endpoints today: `/api/health`, `/api/search`.
- **Ingestion pipeline:** Python in `pipeline/`. Daily cron via GitHub Actions (`.github/workflows/ingest.yml`). Loads into Supabase via PostgREST.
- **Database:** Supabase Postgres (`gugcmsqrscqqqltdtgkz`). Schema is `pipeline/schema.sql` (single file). Tables: `sources`, `source_data`, `data_records`, plus the `v_latest_source_data` view.
- **Deploy:** Vercel. Config in `vercel.json`. Static `public/` + Python `api/`.
- **Vendor libs:** Three.js r128, Chart.js 4.4.1, D3 7.9.0, Leaflet — all from `cdnjs`. SRI hashes still missing on most (audit Phase 2 task 2.10).

## Critical constraints

- **No frontend framework rewrites without an ADR.** The vanilla-JS approach is a deliberate architectural choice (ADR-001). If you want React/Next.js, write a new ADR and get explicit sign-off first.
- **Honest UI provenance.** Every visible number must either (a) be live-bound to `/api/...` or Supabase, or (b) carry a clearly visible "Sample" badge. No hardcoded values labeled `LIVE`. No fabricated fallbacks. See audit Phase 1.
- **No secrets in source.** `api/.env` is gitignored and should not exist on disk in production. All keys live in Vercel env + GH Actions secrets. If you add a new env var, also add it to `api/.env.example` (names only, never values).
- **RLS-aware Supabase access.** Browser uses the **anon** key only. Service-role key is for GH Actions + Vercel functions, never client-side. See audit Phase 2 task 2.3 — currently centralizing the anon key across 7 client files.

## Project layout

```
api/                  Vercel serverless Python functions
  health.py           GET /api/health — system status
  search.py           GET /api/search — address fan-out across ~22 sources
  .env.example        Env var names + comments (no values)
public/               Static site (Vercel-served)
  index.html          Landing — KPIs + Rate Environment + Financing Landscape
  site.html           Composite page (terminal + featured deal)
  dashboard.html      Executive command center
  explore.html        /api/search UI
  sources.html        Searchable 1,932-source catalog
  data.html, wall.html, data-coverage.html, terminal.html, partners.html,
  team.html, about.html, help.html, faq.html
  rp-shell.js         Shared chrome (nav, footer, ticker)
  globe.js            Three.js 3D data globe
  viz.js              Chart.js + D3 viz layer
  panels.js           Dashboard panels
  reprime.js          Terminal page renderer
  sb.js               Supabase browser client (anon key)
  sources.js          Catalog explorer
  rp-shell.css        Single shared stylesheet
  data/               JSON snapshots written by the ingestion pipeline
  images/             Static assets
pipeline/             Daily ingestion (Python, run by GH Actions cron)
  schema.sql          Source of truth for Supabase schema
  run_ingest.py       Orchestrator
  rest_load_catalog.py, rest_load_records.py
                      PostgREST-based loaders (service-role key in CI env)
  fred_cre.py, sec_reits.py, treasury_curve.py, credit_spreads.py,
  socrata_discover.py, keyed_sources.py
                      Domain modules per data family
  flatten_records.py, enrich_counts.py, deep_records.py, triage.py,
  load_to_db.py, load_sources.py, import_catalog.py, scrape_reprime.py,
  connectors.py
docs/                 Architecture + ADRs (currently stale, see audit Phase 1.9)
  ARCHITECTURE.md, FEATURE_CHECKLIST.md, PHASES_AND_PROGRESS.md,
  DATA_PIPELINE_PLAN.md, adr/
tests/                pytest suite (9 tests today; not yet wired into CI)
scripts/              Local utilities (verify.sh smoke harness)
.github/workflows/    ingest.yml — daily cron (does NOT run tests yet)
vercel.json           Deploy config
AUDIT.md              Initial self-audit (2026-06-03)
AUDIT-2026-06-08.md   Comprehensive multi-agent audit (current source of truth)
```

## Commands

```bash
# Local dev
python3 -m venv venv && source venv/bin/activate
pip install -r requirements.txt          # if file exists; otherwise stdlib-only for /api
python3 -m http.server 8000 --directory public   # serve static site

# Run ingestion locally (needs env vars set)
cp api/.env.example api/.env              # fill in real values
python3 pipeline/run_ingest.py

# Tests
python3 -m pytest tests/                  # currently 9 tests, ~0.04s

# Smoke check
bash scripts/verify.sh                    # local 8-section sanity harness
```

## Environment variables

All values live in Vercel project env + GitHub Actions repo secrets. Names below; see `api/.env.example` for inline docs.

| Name | Used by | Purpose |
|---|---|---|
| `SUPABASE_URL` | pipeline + browser | Project URL |
| `SUPABASE_ANON_KEY` | browser (sb.js etc) | RLS-bound public client |
| `SUPABASE_SERVICE_KEY` | GH Actions only | Bypass-RLS writes from ingestion |
| `FRED_API_KEY` | pipeline | St. Louis Fed series |
| `CENSUS_API_KEY` | pipeline + /api/search | ACS demographics |
| `BLS_API_KEY` | pipeline | Bureau of Labor Statistics |
| `BEA_API_KEY` | pipeline | Bureau of Economic Analysis |
| `EIA_API_KEY` | pipeline | Energy Information Admin |
| `FINNHUB_API_KEY` | pipeline | REIT quotes |
| `ALPHA_VANTAGE_API_KEY` | pipeline | Equity / FX |
| `TWELVE_DATA_API_KEY` | pipeline | Market data |
| `MAPILLARY_TOKEN` | /api/search | Street imagery (audit Phase 2 task 2.2 — currently hardcoded, must move to env-only) |

Removed as unused after audit (no Python references): `COINGECKO_API_KEY`, `MASSIVE_API_KEY`, `WALK_SCORE_API_KEY`, `OPENWEATHER_API_KEY`, `DATA_GOV_API_KEY`.

## Review checklist (before any commit)

- [ ] No new hardcoded numbers in `public/*.html` labeled `LIVE`. Either bind to an endpoint or add a `Sample` badge.
- [ ] No `innerHTML` with strings derived from `/api/search`, `data_records`, or `sources_catalog.json` without escaping (audit Phase 2 task 2.9).
- [ ] No new Supabase calls from client JS using anything other than the anon key.
- [ ] No `api/.env` or any file matching `*.env` staged for commit.
- [ ] If schema changed: `pipeline/schema.sql` updated, ADR added if structural.
- [ ] Tests added/updated for any pipeline change; `pytest tests/` green.

## Active in-flight work (audit roadmap)

| Phase | Status | Source |
|---|---|---|
| 0 — secret rotation | ✅ Rotated; on-disk hygiene cleaned up 2026-06-09 | this session |
| 1 — honest UI + doc reconciliation | 🟡 In progress — globe + index.html done, terminal/site/dashboard/docs remaining | AUDIT-2026-06-08.md §17 |
| 2 — security & data hardening | ⏸ Queued | AUDIT-2026-06-08.md §17 |
| 3 — performance + observability | ⏸ Queued | AUDIT-2026-06-08.md §17 |
| 4 — AI surface round 1 | ⏸ Queued | AUDIT-2026-06-08.md §17 |
| 5 — framework migration + AI round 2 | ⏸ Open decision | AUDIT-2026-06-08.md §17 |

## When working in this repo

1. Read `AUDIT-2026-06-08.md` Executive Summary (§1) — it tells you what's real, what's demo, and what's actively wrong.
2. Check section 15 of the audit (Bug/Risk Register) for the prioritized P0–P3 list before picking up work.
3. Check section 17 (Upgrade Roadmap) for the canonical Phase 1–5 task list.
4. The audit's findings beat docs in `docs/` — most of those are frozen at commit `8c0800a` (2026-06-03).
