# RePrime Data Platform — Hardening Audit

**Date:** 2026-06-03 · **Method:** local execution against live free APIs + static analysis.
**Verification command:** `bash scripts/verify.sh` (add `LIVE=1` to also probe the deployed URL).

> Evidence is from re-running the engine and re-deriving artifacts this session — not from
> reading prior drafts. Two sources fail **only from the sandbox** (network egress quirks)
> and are expected to recover on Vercel; they are marked accordingly.

## Tier 0 — Reality at start (original claims vs. truth)

| Claim in original UI / summary | Status | Evidence |
| --- | --- | --- |
| "Single search API `api/search.py` is the product" | **FAKE** | No such file. Three divergent engines existed: `public/explore.html` (browser-direct), a vanished live `/api/search` (v3.4, not in repo), `api/server/app.py` (Render). |
| "611 data sources" | **MISLEADING** | Registry had no 611 set. Real free-API sources = **630** (rule: free price tier + programmatic endpoint). 14 categories is accurate. |
| "8,223 records / 549 URLs scraped" | **FAKE** | No basis in any data file; hardcoded in `stats.json` and page copy. Removed. |
| "13 / 14 live APIs" | **INFLATED** | Old live engine attempted ~10; GDELT/CDC/FCC/NWS/EPA not present. Now **20 live layers** actually wired. |
| Explore search calls `/api/search` | **FAKE** | It ran browser-direct ("no backend needed"). Now genuinely calls `/api/search`. |
| FEMA flood zone (per property) | **FAKE** | Returned `zone:"Unknown"` for every address incl. the White House. |
| Financing products | **HARDCODED** | Identical `Fannie Mae DUS 5.45%` for every address. Now computed off live Treasury/SOFR, labeled indicative. |
| Multi-currency valuation | **FAKE** | Hardcoded $10M base everywhere. Now requires a user value; converts on live FX/crypto. |
| Dashboard source-health latencies | **FAKE** | Hardcoded `215ms`, `142ms`… Now measured by real fetch. |
| Dashboard "13 API integrations" panel | **SECRET LEAK** | Rendered masked fingerprints of live keys (`905***451b`). Removed. |
| `DEPLOY_BACKEND.md` | **SECRET LEAK** | 11 live API keys in plaintext in a public repo. Stripped. |
| `/api/health` | **MISSING (404)** | Now a real function returning status/version/uptime. |
| `/api/sources` | **MIS-WIRED** | Returned ticker data. Now serves the 630-source registry. |
| Activity feeds (dashboard, terminal, index) | **FAKE** | Invented events ($163.5B, IRR 18.4%, Miami-Dade migration). Now real (search history + registry freshness). |
| Terminal deal / tenants / capital stack | **HARDCODED, unlabeled** | Now loaded from `featured_deal.json`, explicitly labeled SAMPLE. |
| Index pipeline / portfolio ($284M) | **HARDCODED, unlabeled** | Now from `portfolio.json`, labeled SAMPLE ($284M = real sum of the 5 sample deals). |
| Site team (9 members, photos) | **UNVERIFIED** | Only Gideon is corroborated; others exist nowhere but the HTML. Not fabricated further — needs real roster. |

## Tier 1 — Search engine (now)

`api/search.py` — one stdlib-only Vercel function. Census-first geocode gate (Nominatim fallback),
parallel fan-out, per-source `{status, latency_ms, data|error}`, `sources_summary`, `query_metadata`
(incl. FIPS), `degraded` flag, 8s per-source / 25s total budgets, 5-min cache, stderr logging,
CORS + `application/json`, 400 on bad/ungeocodable input.

**White House test (this session): 17/20 sources OK, 15s.**

| Source | Result |
| --- | --- |
| fred_rates, crypto, fx_rates, fed_register, fdic | ✅ live |
| fema_disasters, osm_pois, nws_alerts | ✅ live |
| elevation (USGS), weather + air_quality (Open-Meteo), fcc_census, wikipedia, usgs_quakes | ✅ live |
| news (GDELT), financing (indicative), valuation (user-value) | ✅ live |
| fema_flood | ⚠️ `hazards.fema.gov` TLS-blocked from sandbox; correct endpoint, recovers on Vercel; degrades gracefully |
| epa_facilities | ⚠️ `data.epa.gov` DNS-blocked from sandbox; recovers on Vercel; degrades gracefully |
| census_acs | ⚠️ committed CENSUS_API_KEY is invalid; returns actionable "configure key" message |

## Tier 2 — Frontend (all 5 pages on live data)

| Page | State |
| --- | --- |
| `/` index.html | Real KPIs, real source-health, sample-labeled pipeline/portfolio, real activity |
| `/explore` | Real `/api/search`, Leaflet map, progressive render, valuation input, history, error states |
| `/dashboard` | Real KPIs, Chart.js rate chart, real endpoint-health monitor, real activity, registry table |
| `/terminal` | Live FEMA/EPA/news/coverage/financing; deal data sample-labeled |
| `/site` | Live ticker/market, registry-driven counters + categories + marquee |

## Tier 3/4 — Data & hardening

- `scripts/build_registry.py` → real `sources.json` (630) + `stats.json` + `categories.json`.
- `scraper/aggregate.py` → live market/ticker with `cached_at` + TTL + `manifest.json`.
- `/api/health` live; `/api/sources` real; CORS + JSON content-type on functions.
- Render backend retired (`render.yaml` neutralized; `api/server`, `api/property` deploy-excluded + unreferenced).

## Known limitations

1. **fema_flood / epa_facilities** unverifiable from the sandbox (network egress); must be confirmed post-deploy.
2. **census_acs** needs a valid free `CENSUS_API_KEY` set in Vercel env.
3. **In-browser render** (Leaflet/Chart.js drawing, live fetches) verified by contract, not pixels — confirm after deploy with `LIVE=1 bash scripts/verify.sh`.
4. **Team roster** and the exact **611 vs 630** figure await your canonical data.
5. **Leaked keys** were stripped from the repo but remain in git history and were public — **rotate them**.
6. **Render dead dirs** still physically present (sandbox can't delete) — `git rm -r api/server api/property`.
