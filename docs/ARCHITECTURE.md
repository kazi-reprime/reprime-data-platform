# RePrime Data Platform — Architecture

> **Rewritten 2026-06-09 (Phase 1 task 1.10)** to reflect what's actually shipped: 13 pages, 2 serverless functions, Supabase warehouse, GitHub Actions cron, browser-direct Supabase reads via RLS-bound anon key.

---

## Topology

```
                                ┌────────────────────────────────────────────┐
   Browser ─────────────────────▶                Vercel project              │
                                │                                            │
   /, /site, /dashboard,        │  Static:    public/*.html  +  public/data/**│
   /explore, /sources, /data,   │             (served as-is, edge-cached)    │
   /wall, /data-coverage,       │                                            │
   /terminal, /about, /team,    │  Functions (Python, stdlib only):          │
   /partners, /help, /faq       │    api/search.py   → /api/search           │
                                │    api/health.py   → /api/health           │
   /api/search ─────────────────▶                                            │
   /api/health ─────────────────▶                                            │
                                │  Rewrites (in vercel.json):                │
   /api/sources, /api/stats,    │    /api/sources  → public/data/sources.json│
   /api/categories,             │    /api/stats    → public/data/stats.json  │
   /api/live/:metric ───────────▶    /api/live/*   → public/data/live/*.json │
                                │                                            │
                                │  Edge Middleware (Phase 2 task 2.7):       │
                                │    /api/search   → per-IP rate limit       │
                                └─────────────────┬──────────────────────────┘
                                                  │
                                                  │  (search fan-out, server-side)
                                                  ▼
                                ┌────────────────────────────────────────────┐
                                │  ~22 free gov + market APIs                │
                                │    Census · FRED · NY Fed · CoinGecko · ECB│
                                │    OpenFEMA · OSM Overpass · NWS · USGS    │
                                │    Open-Meteo · FCC · Wikipedia · GDELT    │
                                │    FDIC · Federal Register · EIA · BLS · BEA│
                                │    Finnhub · Alpha Vantage · Twelve Data   │
                                └────────────────────────────────────────────┘

   Browser ─────────────────────▶ Supabase (PostgREST, anon key, RLS-bound)
                                  ▲ ▲ ▲
                                  │ │ │ direct browser reads from these pages:
                                  │ │ │ data-coverage.html, dashboard.html,
                                  │ │ │ wall.html, panels.js, sb.js,
                                  │ │ │ globe.js, viz.js, sources.js
                                  │ │ └── reads `v_latest_source_data`
                                  │ └──── reads `sources` counts
                                  └────── reads `data_records` for /wall
                                                  ▲
                                                  │ writes (service-role)
                                                  │
                                ┌────────────────────────────────────────────┐
                                │  GitHub Actions cron (daily)               │
                                │    .github/workflows/ingest.yml            │
                                │    runs pipeline/run_ingest.py             │
                                │    → fetches ~22 sources, writes to Supabase│
                                └────────────────────────────────────────────┘
```

---

## What lives where

| Layer | Technology | Notes |
|---|---|---|
| **Frontend** | vanilla HTML + CSS + JS (no build step, no framework, no `package.json`) | 13 pages share `rp-shell.{js,css}`; per-page JS for viz |
| **API (serverless)** | Vercel Python, stdlib only | 2 endpoints: `search`, `health`. Cold start is the lightest possible. |
| **Static data API** | Vercel rewrites | `/api/sources`, `/api/stats`, `/api/categories`, `/api/live/*` map to JSON files in `public/data/` |
| **Browser → DB** | Supabase PostgREST with **anon key** (RLS-bound) | Centralized config: `public/supabase-config.js` (Phase 2 task 2.3) |
| **Ingestion → DB** | Supabase PostgREST with **service-role key** | Run only from GitHub Actions; never client-side |
| **Database** | Supabase Postgres | Schema in `pipeline/schema.sql`; 3 tables + 1 view + sanitized RLS policies |
| **Cron** | GitHub Actions | `ingest.yml`: daily 00:00 UTC + manual dispatch |
| **Deploy** | Vercel | Auto-deploys on push to `main` |

---

## Request lifecycle — `GET /api/search?address=&value=`

```
1. handler.do_GET
2. validate input (5-500 chars, sanitized)
3. apply Edge Middleware rate-limit check (Phase 2 task 2.7)
4. run_search():
     a. geocode (Census→Photon→Nominatim chain)   → 400 if ungeocodable
     b. build ctx (coords, FIPS, state, county)
     c. ThreadPoolExecutor(max_workers=12)
          submit each of ~18 source fetchers
          cf_wait(timeout = 13s budget)            ← hard cap
          collect completed; mark not_done as error
          ex.shutdown(wait=False, cancel_futures=True)  ← non-blocking
     d. derive sources (financing, valuation) from collected data
     e. assemble response:
          { query_metadata, sources_summary, sources: { <key>: {...} }, degraded }
5. respond 200 JSON
     CORS: production origin only (Phase 2 task 2.8 — was `*`)
     Content-Type: application/json
     Cache-Control: max-age=300
```

### Reliability patterns

- **Rates via cache, not live.** `fred_rates` reads the platform's own `/api/live/ticker` (edge-cached) before falling back to live FRED — FRED is slow/IP-blocked from Vercel's egress.
- **Hard latency cap.** Non-blocking shutdown + 13s budget guarantee the function returns even if FEMA/EPA sockets hang — they report `status: 'error'` rather than blocking the response.
- **Per-source status.** Every source returns `{ status: 'ok'|'partial'|'error', ...data }`. The dashboard probe relies on this for the Live Search Layers cards.

---

## Database schema (high-level)

```sql
sources              -- the curated source catalog (~1,932 rows)
  id                 BIGSERIAL PRIMARY KEY
  name               TEXT UNIQUE NOT NULL
  category           TEXT
  endpoint           TEXT
  auth_required      TEXT  -- 'none' | 'keyed' | 'oauth'
  cost_tier          TEXT  -- 'free' | '<=$10' | 'paid'
  embedding          VECTOR(1536)  -- Phase 4: pgvector for NL discovery
  ...metadata...

source_data          -- raw payloads keyed by source_id
  id                 BIGSERIAL PRIMARY KEY
  source_id          BIGINT REFERENCES sources(id)
  fetched_at         TIMESTAMPTZ DEFAULT now()
  status             TEXT
  payload            JSONB
  -- RLS: anon SELECT only via v_public_records view (Phase 2 task 2.4)

data_records         -- flattened records — schema in pipeline/schema.sql (Phase 2 task 2.5)
  id                 BIGSERIAL PRIMARY KEY
  source_name        TEXT
  category           TEXT
  fields             JSONB
  fetched_at         TIMESTAMPTZ DEFAULT now()

v_latest_source_data -- view: most recent row per source
v_public_records     -- sanitized view: id, source_name, category only (Phase 2 task 2.4)
```

Indexes (Phase 2 task 2.6):
- `source_data (source_id, fetched_at DESC)`
- `data_records (source_name)`, `data_records (category)`
- `sources USING ivfflat (embedding vector_cosine_ops)` (Phase 4 — NL discovery)

---

## Frontend pattern

Each page is a single self-contained HTML file (inline CSS + JS, no build step). On load it `fetch()`es relevant endpoints and renders.

Shared conventions:

- **4-theme switcher** (Dark / Light / Midnight / Gold) persisted in `localStorage`.
- **Search history** shared across Explore/Dashboard/Homepage via `reprime:history` localStorage key.
- **Graceful degradation** — a failed source renders an "unavailable" notice, never a blank panel or a fabricated value (Phase 1 task 1.6).
- **Sample badges** on any panel whose data is hardcoded — to make demo-vs-real obvious to the visitor (Phase 1 task 1.4).
- **XSS-safe rendering** — DOM construction + `textContent` for any string sourced from `/api/search`, `data_records`, or `sources_catalog.json` (Phase 2 task 2.9).

---

## Why this architecture

- **No server to keep warm** → no cold-start tax on static pages.
- **Stdlib-only functions** → fastest Python cold start, zero dependency risk.
- **Cache-first for macro data** → reliable rates despite gov-API IP blocking (FEMA/EPA).
- **RLS-bound browser reads** → no service-role key in client code, ever.
- **GitHub Actions cron** → no separate workflow runner to maintain.
- **Single schema file** → easier than migration churn; ADRs document structural changes.

---

## Trade-offs accepted

| Choice | Trade-off |
|---|---|
| Vanilla JS, no framework | Fast pages, but no built-in router/state mgmt. Bigger features (Phase 4 AI) press this. See Phase 5 (deferred). |
| Single `schema.sql` (no migrations) | Simpler today, harder once production has divergent state. Re-evaluate at 10+ schema changes. |
| Stdlib-only `api/` | No `requests` / `httpx` / `pydantic`. Fastest cold start, harder to write. |
| Direct browser → Supabase reads | One fewer hop, but every Supabase change is a deploy-coupling. Centralized via `supabase-config.js` so rotation is 1 file. |
| Two writers historically | Dual-writer bugs forced explicit ownership table (above). |

---

## Open architectural questions

1. **Framework migration?** Phase 5 (deferred). Pre-requisite: Phase 4 AI features need a real backend surface. Vanilla JS strains under richer client state.
2. **pgvector for source discovery?** Implementing in Phase 4. Add `vector` extension + `embedding` column on `sources`. Use Vercel AI Gateway for embedding generation. See `docs/adr/ADR-002-pgvector-nl-discovery.md`.
3. **Migrations vs single-file schema?** Re-evaluate at 10+ schema changes.
4. **`pre-commit` vs Vercel CI for secret scanning?** Both (Phase 2 task 2.13) — pre-commit catches local, CI catches the PR.
