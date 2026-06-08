> ⚠️ **Stale — snapshot at commit `8c0800a` (2026-06-03).** Current source of truth is `AUDIT-2026-06-08.md` + the live `README.md`. Compare before relying on anything in this file.

# RePrime Data Platform — Feature Checklist

_Item-by-item status, verified against the deployed code on `8c0800a`._
_Legend: ✅ done & verified · ⚠️ works with a caveat · ❌ not working / blocked · 🔲 not started_

---

## Search engine (`/api/search`)

| # | Item | Status | Evidence / note |
|---|------|--------|-----------------|
| 1 | Single consolidated search function | ✅ | `api/search.py`, stdlib-only, deployed |
| 2 | Address validation → 400 on bad input | ✅ | empty/short/ungeocodable return 400 |
| 3 | Census-first geocoding + Nominatim fallback | ✅ | returns coords + FIPS |
| 4 | Per-source `{status, latency_ms, data/error}` | ✅ | `sources_summary` in every response |
| 5 | `query_metadata` (geocode, FIPS, counts, timestamp) | ✅ | present |
| 6 | `degraded` flag when < 3 sources | ✅ | implemented |
| 7 | Per-source 6s timeout + 13s overall budget | ✅ | tuned for Vercel limits |
| 8 | Non-blocking executor (no hangs) | ✅ | fixed the 42s hang bug |
| 9 | 5-min in-memory + edge cache | ✅ | repeat queries instant via CDN |
| 10 | CORS + `application/json` + maxDuration config | ✅ | `vercel.json` functions block |
| 11 | ≥ 8 real sources per address | ✅ | **16/20 live today** |

### Source layers (18 fetched + 2 derived)

| Source | Status | Note |
|--------|--------|------|
| fred_rates (rates) | ✅ | via same-origin cached ticker (reliable) |
| crypto (CoinGecko) | ✅ | BTC/ETH live |
| fx_rates (ECB/Frankfurter) | ✅ | live |
| fed_register | ✅ | live |
| fema_disasters (OpenFEMA) | ✅ | live |
| osm_pois | ✅ | live, varies by location |
| nws_alerts | ✅ | live |
| elevation (USGS) | ✅ | live |
| weather (Open-Meteo) | ✅ | live |
| air_quality (Open-Meteo) | ✅ | live |
| fcc_census | ✅ | live |
| wikipedia | ✅ | live |
| usgs_quakes | ✅ | live |
| news (GDELT + sentiment) | ✅ | live |
| financing (indicative) | ✅ | computed off live rates, labeled indicative |
| valuation (multi-currency) | ✅ | requires user value; no fabricated AVM |
| fema_flood (NFHL) | ❌ | IP-blocked from Vercel; degrades to "unavailable" |
| epa_facilities | ❌ | IP-blocked from Vercel; degrades gracefully |
| fdic | ⚠️ | intermittent from Vercel IPs |
| census_acs | ⚠️ | needs valid free `CENSUS_API_KEY` |

---

## Pages

### Homepage `/`
| Item | Status |
|------|--------|
| Live KPIs (rates, BTC, registry count) | ✅ |
| Real source-health monitor (measured latency) | ✅ |
| Real activity feed (search history + registry) | ✅ |
| Rate panel from live ticker | ✅ |
| Deal pipeline / portfolio — labeled SAMPLE | ✅ |
| Quick-action links work | ✅ |
| No fabricated literals | ✅ |

### Explore `/explore` (core product)
| Item | Status |
|------|--------|
| Search calls `/api/search` (not browser-direct) | ✅ |
| Leaflet map + marker + flood label | ✅ |
| Progressive panel rendering | ✅ |
| Per-source status badges | ✅ |
| Error states (HTTP code + retry) | ✅ |
| Multi-currency valuation input (no fake $10M) | ✅ |
| Search history chips (localStorage) | ✅ |
| Category bars from real registry | ✅ |

### Dashboard `/dashboard`
| Item | Status |
|------|--------|
| KPIs from real registry/stats | ✅ |
| Chart.js rate chart from live data | ✅ |
| Real endpoint-health monitor | ✅ |
| Real activity feed | ✅ |
| Searchable 630-source registry table | ✅ |
| API-key fingerprints removed | ✅ |

### Terminal `/terminal`
| Item | Status |
|------|--------|
| Live FEMA/EPA/news/coverage/financing from search | ✅ (FEMA/EPA degrade) |
| Deal/tenant/capital-stack from `featured_deal.json`, labeled SAMPLE | ✅ |
| KPIs + sidebar from live endpoints | ✅ |
| Hero/gallery images load (no 404s) | ✅ |
| No fabricated literals | ✅ |

### Company site `/site`
| Item | Status |
|------|--------|
| Live ticker + market grid | ✅ |
| Counters from real registry (630/14/20) | ✅ |
| Category grid from real `by_category` | ✅ |
| Source marquee = real providers (paid ones removed) | ✅ |
| Counters 8,223 / 549 removed | ✅ |
| Team section (9 real members + photos) | ⚠️ placeholder names; needs real roster |

---

## Data layer & infrastructure

| Item | Status | Note |
|------|--------|------|
| 630-source registry built + served | ✅ | `/api/sources` |
| Real `stats.json` / `categories.json` | ✅ | replaced fabricated figures |
| Aggregator with `cached_at` + TTL + manifest | ✅ | `scraper/aggregate.py` |
| `/api/health` real function | ✅ | deployed |
| CORS on functions | ✅ | |
| No secrets in working tree | ✅ | stripped |
| Render/dead backend retired | ✅ | removed from repo |
| Backend pytest tests | ✅ | 7 tests (`tests/test_search.py`) |
| `scripts/verify.sh` re-runnable audit | ✅ | 8 sections, exits non-zero on failure |
| `AUDIT.md` truth table | ✅ | |
| README reflects reality | ✅ | |
| Pushed to GitHub `main` + auto-deploy | ✅ | `8c0800a`, Vercel connected |
| Old v4.0 line preserved | ✅ | `backup/v4-line` branch |

---

## Outstanding (your action or future work)

| Item | Status | Owner |
|------|--------|-------|
| Rotate the 11 leaked API keys (in git history, were public) | 🔲 | **You** |
| Set valid `CENSUS_API_KEY` in Vercel env | 🔲 | **You** |
| Provide canonical 611 source list (to match the number exactly) | 🔲 | **You** |
| Provide real team roster + photos | 🔲 | **You** |
| Proxy FEMA-NFHL / EPA to bypass Vercel IP block | 🔲 | future |
| Automated browser (Playwright) tests | 🔲 | future |
| Scheduled aggregator run (cron) to keep cache fresh | 🔲 | future |
| Delete dead dirs from git history (`git rm -r api/server api/property`) — already gone from tree | 🔲 | optional |
