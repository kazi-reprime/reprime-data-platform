# RePrime Data Platform

> Commercial real-estate intelligence. Enter any US address and one server-side call fans out to
> **20 live free data layers** (government + market APIs), backed by a catalog of **630 free API
> sources** across 14 categories. No paid keys required for the core search.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fkazi-reprime%2Freprime-data-platform)

---

## Architecture

Single Vercel project — static pages + two Python serverless functions. No separate backend.

```
public/
  index.html        /            Executive command center
  explore.html      /explore     Address search (the core product)
  dashboard.html    /dashboard   Data operations console
  terminal.html     /terminal    Single-property terminal
  site.html         /site        Company site
  data/             /api/live/*, /api/sources, /api/stats, /api/categories  (cached JSON)
api/
  search.py         /api/search?address=<addr>[&value=<usd>]   live fan-out engine
  health.py         /api/health                                 liveness + build info
scripts/build_registry.py   builds the 630-source registry + stats from the master extraction
scraper/aggregate.py        refreshes cached market/ticker JSON (cached_at + TTL + manifest)
tests/test_search.py        pytest backend contract tests
scripts/verify.sh           re-runnable Tier 0 audit (exit 0 = pass)
```

## Verified working

- **Live address search** (`/api/search`): Census-first geocoding, parallel fan-out, per-source
  status + latency, `degraded` flag, 400 on bad input, CORS + JSON. **17–18 of 20 layers return
  real data per address** in ~6–15s. Layers: FRED/NY-Fed rates, CoinGecko, ECB FX, Federal Register,
  FDIC, FEMA disasters, OSM POIs, NWS alerts, USGS elevation, Open-Meteo weather + air quality,
  FCC census/FIPS, Wikipedia, USGS seismic, GDELT news, plus computed indicative financing and
  user-value multi-currency valuation.
- **All five pages run on live data** — no hardcoded market/risk/news literals. Deal-specific data
  (`featured_deal.json`, `portfolio.json`) is explicitly labeled **SAMPLE**.
- **`/api/sources`** serves the real 630-source registry; **`/api/health`** is a real function;
  **`/api/stats`** drives the counters and category coverage.
- **Real source-health monitors** (dashboard + index) — measured latency, not hardcoded.

Run the proof:

```bash
bash scripts/verify.sh          # local engine + artifacts
LIVE=1 bash scripts/verify.sh   # also probe the deployed URL
pytest tests/test_search.py -v  # backend contract tests
```

## Environment variables (set in Vercel, never in the repo)

Core search works keyless. Optional:

| Key | Enables |
| --- | --- |
| `CENSUS_API_KEY` | Tract demographics (ACS). Free at census.gov. |

> **Security:** keys live only in Vercel env + local `api/.env` (gitignored). If a key was ever
> committed, rotate it at the provider.

## Known limitations

- `fema_flood` and `epa_facilities` can be blocked by some network egress (incl. CI sandboxes);
  they degrade gracefully and should be confirmed on the deployed runtime.
- `census_acs` requires a valid free `CENSUS_API_KEY`.
- The "611" headline is the curated free-source figure; the extraction yields **630** — they
  reconcile once a canonical source list is supplied (the count flows everywhere automatically).
- The team section needs the real RePrime roster + photos.
- Legacy Render backend (`api/server`, `api/property`) is retired and deploy-excluded; remove with
  `git rm -r api/server api/property render.yaml`.
