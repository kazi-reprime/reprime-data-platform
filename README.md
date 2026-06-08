# RePrime Data Platform

> **Institutional commercial-real-estate intelligence.** A live web platform that
> (1) searches any U.S. address against ~20 government & market APIs in real time,
> (2) catalogs **1,932 free data sources** and ingests them into a warehouse, and
> (3) presents everything through a stunning, data-dense visualization layer —
> a 3D WebGL deal globe, treemap heatmaps, live charts, and a searchable source
> catalog — unified under one navy/gold institutional design system.

**Live:** https://reprime-data-platform.vercel.app
**Stack:** static HTML + a shared JS "shell" · Python serverless (Vercel) · ingestion pipeline (GitHub Actions) · Postgres (Supabase) · Three.js / Chart.js / D3

---

## Pages (13 routes)

| Route | Page | What it shows |
|-------|------|---------------|
| `/` | Dashboard | Executive command center — live KPIs, rate environment, pipeline, source health |
| `/site` | Platform | Marketing/company page — real RePrime team, services, partners, testimonials, FAQ, portals |
| `/terminal` | Terminal | Deal intelligence + the full RePrime Terminal investor layer (membership, process, maturity-wall thesis) |
| `/explore` | Explore | Address search — live API fan-out per property |
| `/data` | Data Coverage | Live Supabase warehouse coverage + viz console |
| `/wall` | Data Wall | Every cataloged source and ingested record as scrollable boxes |
| `/sources` | Sources | Searchable explorer over the full **1,932-source** catalog |
| `/about` `/team` `/partners` `/faq` `/help` | Company | Real RePrime content (scraped from reprime.com) |

Every page opens with a **visualization hero** at the top: live data-warehouse
counters, the 3D globe, and the chart suite — then page-specific content below.

---

## Architecture

```
Browser
  public/*.html (13 pages)
   ├── rp-shell.css / rp-shell.js ... SHARED SHELL — injects nav (header), ticker,
   │                                   footer, 4-theme toggle, background, AND
   │                                   relocates the viz suite to the top of every page
   ├── reprime.js ................... real RePrime content (team/services/partners/
   │                                   testimonials/portals/terminal) from /data/reprime.json
   ├── viz.js ....................... Chart.js + D3 viz suite (treemap heatmap, donut,
   │                                   radar, polar, stacked, bubble, gauge, counters, KPIs…)
   ├── globe.js ..................... Three.js 3D deal globe (starfield, arcs, hover)
   ├── sources.js ................... 1,932-source catalog explorer (search/filter)
   ├── sb.js / panels.js ............ live Supabase warehouse panel + market charts
   └── /api/* ....................... Python serverless (search, health, stats, live/*)

Ingestion (GitHub Actions, daily cron — .github/workflows/ingest.yml)
  pipeline/triage.py ......... tier ~696 sources (live_api/rss/bulk/scrape)
  pipeline/run_ingest.py ..... fetch by tier; write per-source results + coverage
  pipeline/load_to_db.py ..... bulk-load results into Postgres
  pipeline/load_sources.py ... upsert the full 1,932-source catalog into `sources`
  pipeline/scrape_reprime.py . refresh real reprime.com content into /data/reprime.json
  pipeline/{deep_records,socrata_discover,enrich_counts,…} . grow + enrich data_records
        |
        v
Supabase (Postgres) -- schema in pipeline/schema.sql (sources, source_data, views, RLS)
        |
        v
Vercel pages read it live via the publishable/anon key (read-only by RLS)
```

---

## Visualization suite (techniques)

Replicated natively (no framework rewrite) from best-in-class data sites:

- **3D WebGL deal globe** (`globe.js`, Three.js) — Kaspersky-style starfield, rotating
  dotted/wireframe sphere, animated arcs from HQ to real markets, hover tooltips.
- **Treemap heatmap** (`viz.js`, D3) — TradingView-style: categories sized by source
  count, colored red→amber→green by live-API coverage.
- **Chart suite** (`viz.js`, Chart.js) — donut, coverage radar, polar mix, stacked
  sources-vs-live, category-landscape bubble, deal bubble, solid gauge, treasury
  yields, SOFR/EFFR rates, KPI strips, ranked bars, live activity feed.
- **Glassmorphism + motion** — translucent blur cards, sheen sweep, scroll-reveal,
  count-up animations, 60-second auto-refresh, live pulse dots.
- **Skeleton loaders** (Cloudflare-style), **URL-hash shareable state** (theme +
  Sources filters), **per-chart Export (PNG/SVG) + Share** buttons.

---

## Data

- **1,932** sources cataloged (`public/data/sources_all.json`) across 14 categories.
- **Live warehouse** in Supabase (`v_coverage`, `v_latest_source_data`, `data_records`).
- **Live market** — FRED (Treasury/SOFR), CoinGecko, FEMA, BLS, etc. via `/api/live/*`.
- All displayed source counts reflect the full 1,932 catalog site-wide.

---

## WordPress deliverable — `wordpress-viz/`

A standalone, paste-ready visualization suite for the **reprime.com** WordPress +
Elementor marketing site (separate from this Vercel app, excluded from deploy):
`reprime-viz.css`, `globe.js`, `charts.js` (Highcharts), `radar-dashboard.js`
(React), `deal-analyzer.js` (Observable Plot), `heatmap.js` (Canvas/D3),
`functions-additions.php` (deferred enqueues + server-side FRED proxy), and
`elementor-widgets.html` (section snippets). See that folder's file headers.

---

## Repo layout

| Path | Purpose |
|------|---------|
| `public/` | The 13 pages + shared shell + viz/content JS + cached JSON (`public/data/**`) |
| `api/` | Vercel Python functions (`search.py`, `health.py`) |
| `pipeline/` | Ingestion: triage, connectors, runners, DB + catalog loaders, scrapers, schema |
| `.github/workflows/ingest.yml` | Daily ingestion + content-refresh cron |
| `scripts/`, `scraper/` | Registry build + cached market refresh |
| `wordpress-viz/` | Paste-ready viz suite for the reprime.com WordPress site |
| `docs/` | ADRs, pipeline plan, status reports |

---

## Deployment

- **Vercel** auto-deploys on every push to `main` (static pages + Python functions).
- **GitHub Actions** runs `ingest.yml` daily (or manually via the Actions tab).

### Configuration (GitHub repo secrets / Vercel env)

| Secret | Used for |
|--------|----------|
| `DATABASE_URL` | Postgres (Supabase pooler) — **required** for the cron to write the warehouse + load the 1,932-source catalog. **Not yet set**; until added, DB-write steps no-op and the warehouse stays at its last snapshot. |
| `FRED_API_KEY`, `CENSUS_API_KEY`, … | optional keyed live sources |

The Supabase publishable/anon key embedded in `sb.js` is read-only by design (RLS).

---

## Known limitations / notes

- **Supabase writes** require the `DATABASE_URL` secret in GitHub (above). The
  front end shows the full 1,932 catalog regardless, from the static registry.
- `fema_flood` / `epa_facilities` are IP-blocked from Vercel's runtime (work from
  GitHub runners); they degrade gracefully.
- The `wordpress-viz/` Highcharts file needs a commercial Highcharts license for
  production; swap to Chart.js/ApexCharts on request.
