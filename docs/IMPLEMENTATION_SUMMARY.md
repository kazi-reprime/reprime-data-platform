# RePrime Data Platform — Implementation Summary

_Ground-truth scan of the repository as deployed. Generated 2026-06-03._
_Commit `8c0800a` on `main`. Live: https://reprime-data-platform.vercel.app_

---

## What this platform is

A commercial-real-estate intelligence web app. A user enters any US address and
the platform makes **one server-side call** that geocodes the address and fans
out in parallel to free government and market APIs, returning a single JSON
document of risk, demographic, market, and location data. Around that engine sit
four more pages (homepage, dashboard, terminal, company site) and a browsable
catalog of **630 free API sources**.

It is a single Vercel project: static HTML pages + two Python serverless
functions + cached JSON. There is no separate backend, no database, and no paid
API keys required for the core search.

---

## The actual file inventory (75 tracked files + 30 images)

| Area | Files | Purpose |
|------|-------|---------|
| **Serverless functions** | `api/search.py` (690 lines), `api/health.py` (34) | The live search engine + a health/liveness endpoint |
| **Pages** | `public/index.html`, `explore.html`, `dashboard.html`, `terminal.html`, `site.html` | The 5 UI pages |
| **Cached data** | `public/data/**` (stats, sources, categories, live/*, market/*, deal/*, portfolio, featured_deal) | JSON the pages read |
| **Data tooling** | `scripts/build_registry.py` (100), `scraper/aggregate.py` (202) | Build the 630-source registry; refresh cached market data |
| **Tests / proof** | `tests/test_search.py` (7 tests), `scripts/verify.sh` (8 sections) | Backend contract tests + re-runnable audit |
| **Config** | `vercel.json`, `.gitignore`, `.vercelignore` | Routing, function limits, ignore rules |
| **Docs** | `README.md`, `AUDIT.md`, `DEPLOY_BACKEND.md`, `CLAUDE.md`, `docs/*` | Documentation |
| **Registry source** | `_extraction/master.csv` | Raw source list the registry is built from |

The repo was cleaned from **819 tracked files (98 MB)** to **75 files (33 MB)** —
research docs, slide decks, presentations, and a dead Render/FastAPI backend
(`api/server`, `api/property`) were removed.

---

## The search engine (`api/search.py`)

The heart of the product. Standard-library only (no `requests`, no heavy deps)
for the fastest possible cold start on Vercel.

**Request lifecycle:**
1. **Validate** the address (length ≥ 5, ≤ 500) → `400` with a clear reason if bad.
2. **Geocode gate** — Census Geocoder first (returns coords + FIPS), Nominatim
   fallback. If both fail → `400` (no silent fan-out into a wall of errors).
3. **Parallel fan-out** to 18 sources via a thread pool, hard-capped at a
   **13-second budget** with **non-blocking shutdown** (a stuck source can never
   hang the whole function).
4. **Derived sources** (`financing`, `valuation`) compute from the fetched data.
5. **Assemble** `sources_summary` (every source: ok/error + latency),
   `query_metadata` (geocode + FIPS + counts + timestamp), and `degraded:true`
   if fewer than 3 sources succeed.
6. Return JSON with CORS + `application/json`; 5-minute in-memory + edge cache.

**The 20 layers** (18 fetched + 2 derived):

| Working reliably | Address-specific or context |
|---|---|
| `fred_rates` (rates, via cached ticker) | `osm_pois`, `wikipedia`, `fcc_census` |
| `crypto` (CoinGecko BTC/ETH) | `elevation` (USGS), `weather` + `air_quality` (Open-Meteo) |
| `fx_rates` (ECB/Frankfurter) | `usgs_quakes`, `nws_alerts` |
| `fed_register` | `fema_disasters` (OpenFEMA) |
| `news` (GDELT + sentiment) | — |
| `financing` (indicative, off live rates) | `valuation` (multi-currency, user value) |

**Known-failing from Vercel** (datacenter-IP blocking, exactly as the brief
warned): `fema_flood` (FEMA NFHL), `epa_facilities` (EPA Envirofacts),
sometimes `fdic`. Plus `census_acs` which needs a valid free `CENSUS_API_KEY`.
All four degrade gracefully in the UI. **Live status today: 16 of 20 succeed in
~14s cold, instant when edge-cached.**

---

## The five pages (all on live data)

| Page | Route | Reads from | What it shows |
|------|-------|-----------|---------------|
| **Homepage** | `/` | `/api/search`, `/api/live/*`, `/api/stats`, `portfolio.json` | KPIs, rate panel, real source-health monitor, real activity feed, sample-labeled deal pipeline |
| **Explore** | `/explore` | `/api/search`, `/api/sources` | The core product: address search, Leaflet map, progressive panels, valuation input, search history, error states |
| **Dashboard** | `/dashboard` | `/api/stats`, `/api/sources`, `/api/live/*`, `/api/categories` | Registry KPIs, Chart.js rate chart, real endpoint-health monitor, registry table |
| **Terminal** | `/terminal` | `/api/search`, `/api/live/*`, `featured_deal.json` | Single-property terminal; live FEMA/news/coverage/financing; deal data sample-labeled |
| **Company site** | `/site` | `/api/live/*`, `/api/sources`, `/api/stats` | Live ticker, registry-driven counters + categories + provider marquee |

Every fabricated literal that existed before (a $163.5B figure, invented news
headlines, hardcoded tenant rosters, fake API latencies, masked API-key
fingerprints, an 8,223-records counter) has been removed. Deal-specific data that
no public API provides (`featured_deal.json`, `portfolio.json`) is explicitly
labeled **SAMPLE**.

---

## The 630-source registry

`scripts/build_registry.py` reads `_extraction/master.csv`, dedupes, and filters
to **free price-tier sources with a programmatic API endpoint** → 630 sources
across 14 categories, written to `public/data/sources.json` and served at
`/api/sources`. It also writes the real `stats.json` (630 / 14 / 20) and
`categories.json`. This replaced the fabricated "611 / 8,223 records" figures.

> The "611" you referred to is the curated free set; the extraction yields 630.
> They reconcile exactly once you supply the canonical source list.

---

## Endpoints (live, all returning 200)

| Endpoint | Type | Returns |
|----------|------|---------|
| `/api/search?address=&value=` | Python function | Live fan-out result |
| `/api/health` | Python function | `{status, version, uptime, region, timestamp}` |
| `/api/sources` | static rewrite | 630-source registry |
| `/api/stats` | static rewrite | Real counts |
| `/api/categories` | static rewrite | Category counts |
| `/api/live/ticker`, `/api/live/market` | static rewrites | Cached market data |

---

## What is NOT done / known limitations

- `fema_flood` and `epa_facilities` are IP-blocked from Vercel; would need a
  server-side proxy or an unblocked endpoint to restore.
- `census_acs` needs a valid free `CENSUS_API_KEY` in Vercel env.
- The **leaked API keys** are out of the working tree but remain in git history
  and were public — **they must be rotated.**
- The **team section** on the company site uses placeholder names; needs your
  real roster + photos.
- In-browser rendering (Leaflet/Chart.js drawing) is verified by data contract,
  not by automated pixel/Playwright tests.

See `docs/FEATURE_CHECKLIST.md` for the item-by-item status and
`docs/PHASES_AND_PROGRESS.md` for how we got here and what's next.
