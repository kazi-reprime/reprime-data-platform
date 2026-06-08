# RePrime Data Platform

> **Institutional commercial real estate intelligence.** Live address fan-out against ~22 government + market APIs, a curated ~1,932-source catalog, and a data-dense vanilla-JS visualization layer — all unified under one navy/gold institutional design system.

- **Live:** https://reprime-data-platform.vercel.app
- **Source of truth for current state:** [`AUDIT-2026-06-08.md`](./AUDIT-2026-06-08.md) (20-section comprehensive audit)
- **License:** MIT © 2026 RePrime Group

---

## Quick start (local dev)

```bash
git clone https://github.com/kazi-reprime/reprime-data-platform.git
cd reprime-data-platform

# 1. Front-end (static — no build step)
python3 -m http.server 8000 --directory public
# → open http://localhost:8000

# 2. Optional: serverless API locally
#    Requires `vercel dev` (npm i -g vercel)
vercel dev

# 3. Optional: run the ingestion pipeline (writes to Supabase)
cp api/.env.example api/.env       # fill in real values — never commit
python3 -m venv venv && source venv/bin/activate
pip install -r requirements.txt    # if file exists; pipeline scripts use stdlib mostly
python3 pipeline/run_ingest.py

# 4. Tests
python3 -m pytest tests/           # 9 tests, ~0.04s

# 5. Local smoke harness
bash scripts/verify.sh
```

---

## What it is

| Surface | Reality |
|---|---|
| **Public site** | 13 static HTML pages, vanilla JS + CSS, served from Vercel `public/` |
| **Live address search** | `GET /api/search?address=<addr>` — Python serverless (stdlib only), 13s budget, fan-out to ~22 sources |
| **System health** | `GET /api/health` — Python serverless |
| **Source catalog** | ~1,932 entries in `public/data/sources_catalog.json`, also loaded into Supabase `sources` table |
| **Data warehouse** | Supabase Postgres — `sources`, `source_data`, `data_records` tables + `v_latest_source_data` view |
| **Ingestion** | GitHub Actions cron — `.github/workflows/ingest.yml` (daily) |
| **Visualization** | Three.js WebGL globe, Chart.js + D3 charts, searchable source explorer |

**Per the 2026-06-08 audit, every visible number must be either live-bound or carry a "Sample" badge.** No fabricated values labeled `LIVE`. Phase 1 of the audit roadmap is currently closing the remaining gaps.

---

## Pages (13 routes)

| Route | Purpose |
|---|---|
| `/` (index.html) | Landing — KPIs, Rate Environment, Financing Landscape (all `—` until live, `Sample` badges where hardcoded) |
| `/site` | Composite — terminal layer + featured deal (bound to `/data/featured_deal.json`) |
| `/dashboard` | Executive command center with real `/api/search` probe per layer |
| `/explore` | Address search UI for `/api/search` |
| `/sources` | Searchable explorer over the full ~1,932-source catalog |
| `/data`, `/wall`, `/data-coverage` | Supabase-backed data surfaces |
| `/terminal` | Investor-access layer (membership tiers, process, thesis) — Sample badges on deal data |
| `/about`, `/team`, `/partners`, `/faq`, `/help` | Marketing/company pages, content from scraped reprime.com |

---

## Repo layout

```
api/                              Vercel serverless Python (stdlib only)
  search.py                       GET /api/search — fan-out to ~22 live APIs
  health.py                       GET /api/health
  .env.example                    Env var template — names only, never values
public/                           Static site (Vercel serves this)
  *.html                          13 page templates
  rp-shell.{js,css}               Shared chrome (nav, footer, ticker)
  globe.js                        Three.js 3D data globe
  viz.js                          Chart.js + D3 viz layer
  panels.js                       Dashboard live panels
  reprime.js                      Terminal page renderer
  sb.js                           Supabase browser client (anon key, RLS-bound)
  sources.js                      Catalog explorer
  data/                           JSON snapshots written by the ingestion pipeline
  images/                         Static assets
pipeline/                         Daily ingestion (Python, run by GitHub Actions cron)
  schema.sql                      Source of truth for Supabase schema
  run_ingest.py                   Orchestrator
  rest_load_catalog.py            PostgREST loader for `sources` (service-role key)
  rest_load_records.py            PostgREST loader for `data_records`
  fred_cre.py, sec_reits.py, treasury_curve.py, credit_spreads.py
                                  Domain modules per data family
  socrata_discover.py, keyed_sources.py, scrape_reprime.py
  flatten_records.py, enrich_counts.py, deep_records.py
  load_to_db.py, load_sources.py, import_catalog.py, connectors.py, triage.py
docs/                             Architecture + ADRs
  ARCHITECTURE.md                 System architecture (rewritten 2026-06-09)
  adr/                            Architecture Decision Records
  FEATURE_CHECKLIST.md            (stale — see banner)
  PHASES_AND_PROGRESS.md          (stale — see banner)
  DATA_PIPELINE_PLAN.md           (stale — see banner)
tests/                            pytest suite (9 tests; not yet wired into CI)
scripts/                          Local utilities (verify.sh, build_registry.py)
scraper/                          Cached market refresh
.github/workflows/                ingest.yml — daily cron
  security.yml                    (added Phase 2 task 2.13 — gitleaks)
marketing/                        Non-deployed assets (excluded via .vercelignore)
  wordpress-viz/                  Paste-ready viz suite for reprime.com WordPress site
vercel.json                       Deploy config
AUDIT.md                          Initial self-audit (2026-06-03, stale)
AUDIT-2026-06-08.md               Comprehensive multi-agent audit — current source of truth
```

---

## Environment variables

| Name | Used by | Required? | Purpose |
|---|---|---|---|
| `SUPABASE_URL` | pipeline + browser | yes | Supabase project URL |
| `SUPABASE_ANON_KEY` | browser (sb.js etc) | yes | RLS-bound public client; centralized via `public/supabase-config.js` (Phase 2 task 2.3) |
| `SUPABASE_SERVICE_KEY` | GH Actions only | yes | Bypass-RLS writes from ingestion. **Never** in client JS. |
| `FRED_API_KEY` | pipeline | yes | St. Louis Fed series |
| `CENSUS_API_KEY` | pipeline + /api/search | yes | ACS demographics + geocoder |
| `BLS_API_KEY` | pipeline | yes | Bureau of Labor Statistics |
| `BEA_API_KEY` | pipeline | yes | Bureau of Economic Analysis |
| `EIA_API_KEY` | pipeline | yes | Energy Information Admin |
| `FINNHUB_API_KEY` | pipeline | optional | REIT quotes |
| `ALPHA_VANTAGE_API_KEY` | pipeline | optional | Equity / FX |
| `TWELVE_DATA_API_KEY` | pipeline | optional | Market data |
| `MAPILLARY_TOKEN` | /api/search | optional | Street imagery (Phase 2 task 2.2 — env-only, no defaults) |

**Removed as unused** (no Python references after audit): `COINGECKO_API_KEY`, `MASSIVE_API_KEY`, `WALK_SCORE_API_KEY`, `OPENWEATHER_API_KEY`, `DATA_GOV_API_KEY`. Do not re-add.

All values live in **Vercel project env** + **GitHub Actions repo secrets**. `api/.env` is for local-only and is `.gitignore`'d. Do not commit it.

---

## Deployment

### Vercel (production site + serverless functions)

- Auto-deploys on every push to `main`.
- Static `public/` is served as-is.
- Functions in `api/` are detected automatically (Python runtime).
- Security headers (CSP, HSTS, X-Frame-Options, etc.) are set in `vercel.json` (Phase 2 task 2.1).
- Rate limiting on `/api/search` via Edge Middleware (Phase 2 task 2.7).

### GitHub Actions (daily ingestion)

`.github/workflows/ingest.yml` runs daily at midnight UTC, with manual trigger via the Actions tab. Repository secrets required:

- `SUPABASE_URL`, `SUPABASE_SERVICE_KEY`
- `FRED_API_KEY`, `CENSUS_API_KEY`, `BLS_API_KEY`, `BEA_API_KEY`, `EIA_API_KEY`

The workflow runs `pipeline/run_ingest.py` which orchestrates per-domain loaders and writes to Supabase via PostgREST.

### `gitleaks` security check (Phase 2 task 2.13)

`.github/workflows/security.yml` runs `gitleaks` on every push and PR. A pre-commit hook (`.pre-commit-config.yaml`) catches secret leaks before they hit the remote.

---

## Active audit roadmap

| Phase | Status |
|---|---|
| 0 — Secret rotation + on-disk hygiene | ✅ Done 2026-06-09 |
| 1 — Honest UI + doc reconciliation | 🟡 In progress (14 tasks, ~9 done at last commit) |
| 2 — Security & data hardening | ⏸ Queued |
| 3 — Performance + observability | ⏸ Queued |
| 4 — AI surface round 1 (NL source discovery) | ⏸ Queued |
| 5 — Framework migration + AI round 2 | ⏸ Open decision |

See `AUDIT-2026-06-08.md` §17 for the canonical task list per phase.

---

## Testing

```bash
python3 -m pytest tests/                # all tests
python3 -m pytest tests/test_search.py  # API tests only
bash scripts/verify.sh                  # 8-section local smoke harness
```

Test coverage today is ~6 unit + 3 integration on `api/search.py`. Phase 2 task 2.13 wires these into CI so a red test blocks merge.

---

## Contributing

This is a private working repo. Before any commit:

- [ ] No hardcoded numbers in `public/*.html` labeled `LIVE` — either bind to an endpoint or add a `Sample` badge.
- [ ] No `innerHTML` with strings derived from `/api/search`, `data_records`, or `sources_catalog.json` without escaping (Phase 2 task 2.9).
- [ ] No new Supabase calls from client JS using anything other than the anon key.
- [ ] No `api/.env` or any file matching `*.env` staged for commit. `gitleaks` will catch it; the pre-commit hook will catch it first.
- [ ] If schema changed: `pipeline/schema.sql` updated, ADR added if structural.
- [ ] Tests added/updated for any pipeline change.
