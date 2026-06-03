# RePrime Data Platform — Architecture

_How the pieces fit together. As of `8c0800a`._

---

## Topology

One Vercel project. No backend server, no database.

```
                          ┌─────────────────────────────────────────┐
   Browser  ──────────▶   │            Vercel (single project)        │
                          │                                           │
   /, /explore,           │  Static:  public/*.html  +  public/data/**│
   /dashboard,            │                                           │
   /terminal, /site       │  Functions (Python, @vercel/python):      │
                          │     api/search.py   → /api/search         │
   /api/search ───────────▶    api/health.py   → /api/health         │
                          │                                           │
   /api/sources ──────────▶  rewrite → public/data/sources.json      │
   /api/stats   ──────────▶  rewrite → public/data/stats.json        │
   /api/live/* ───────────▶  rewrite → public/data/live/*.json       │
                          └─────────────────┬─────────────────────────┘
                                            │  (search fan-out, server-side)
                                            ▼
        Free gov + market APIs: Census · FRED · NY Fed · CoinGecko · ECB ·
        OpenFEMA · OSM Overpass · NWS · USGS · Open-Meteo · FCC · Wikipedia ·
        GDELT · FDIC   (FEMA-NFHL / EPA blocked from Vercel IPs)
```

---

## Routing (`vercel.json`)

- `outputDirectory: public` — static site root.
- `functions` block sets `maxDuration` (search 30s, health 10s).
- **Rewrites** map clean URLs to files: `/site`→`/site.html`, etc.; and map
  data endpoints to static JSON: `/api/sources`, `/api/stats`,
  `/api/categories`, `/api/live/:metric`, `/api/market/:metric`,
  `/api/deal/:metric`.
- `/api/search` and `/api/health` are **not** rewritten — Vercel auto-detects
  them as Python functions and serves them directly.

---

## Request lifecycle — `/api/search?address=&value=`

```
1. handler.do_GET → parse address + optional value
2. run_search():
     a. validate length            → 400 if bad
     b. geocode (Census→Nominatim)  → 400 if ungeocodable
     c. build ctx (coords, FIPS, state)
     d. ThreadPoolExecutor(max_workers=12) submits 18 sources
        cf_wait(timeout = 13s budget)        ← hard cap
        collect done; mark not_done as error
        ex.shutdown(wait=False, cancel_futures=True)   ← never hangs
     e. derived sources (financing, valuation) from collected data
     f. assemble: query_metadata + sources_summary + sources + degraded?
3. respond 200 JSON  (CORS, application/json, Cache-Control: max-age=300)
```

**Two reliability patterns worth noting:**

- **Rates via cache, not live.** `fred_rates` first reads the platform's own
  `/api/live/ticker` (same-origin, edge-cached, refreshed by the aggregator)
  because FRED is slow/blocked from Vercel's IPs. Falls back to live FRED.
- **Hard latency cap.** The non-blocking shutdown + 13s budget guarantee the
  function returns even if FEMA/EPA sockets hang — they simply report `error`.

---

## Data flow for cached market data

```
scraper/aggregate.py  (run on a schedule — currently manual)
   │  fetches keyless market endpoints (FRED CSV, NY Fed, CoinGecko, ECB, …)
   ▼
public/data/live/ticker.json, market.json  (+ cached_at, ttl, manifest.json)
   │  served via /api/live/* rewrites
   ▼
Dashboard, Terminal, Site, Homepage  +  the search engine's fred_rates
```

```
scripts/build_registry.py   (run when the source list changes)
   │  reads _extraction/master.csv → dedupe → filter free+API
   ▼
public/data/sources.json (630), stats.json, categories.json
   │  served via /api/sources, /api/stats, /api/categories
   ▼
Explore (category bars), Dashboard (table + KPIs), Site (counters/marquee)
```

---

## Source-of-truth ownership (avoids the earlier clobbering bug)

| File | Owned by | Never written by |
|------|----------|------------------|
| `sources.json`, `stats.json`, `categories.json` | `build_registry.py` | the aggregator |
| `live/ticker.json`, `live/market.json`, `manifest.json` | `aggregate.py` | the registry builder |
| `featured_deal.json`, `portfolio.json` | hand-maintained (SAMPLE) | — |

---

## Frontend pattern

Each page is a single self-contained HTML file (inline CSS + JS, no build step).
On load it `fetch()`es the relevant endpoints and renders. Shared conventions:

- 4-theme switcher (Dark/Light/Midnight/Gold) persisted in `localStorage`.
- Search history shared across Explore/Dashboard/Homepage via the
  `reprime:history` localStorage key.
- Graceful degradation: a failed source renders an "unavailable" notice, never a
  blank panel or a fabricated value.

---

## Why this architecture

- **No server to keep warm** → no Render cold-start tax; static pages are instant.
- **Stdlib-only function** → fastest Python cold start, zero dependency risk.
- **Cache-first for macro data** → reliable rates despite gov-API IP blocking.
- **Single engine** → ends the previous three-way divergence; one place to fix.
