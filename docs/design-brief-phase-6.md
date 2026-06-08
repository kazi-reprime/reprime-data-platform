# Design Brief — Phase 6: Visual + Data-Density Upgrade

**Date:** 2026-06-09
**Audit reference:** AUDIT-2026-06-08.md §17 (extended)
**Status:** In execution (this session)

## North star

> A visitor lands on `/dashboard` or `/terminal` and feels like they're looking at a Bloomberg Terminal for commercial real estate. Dense. Live. Numeric. Honest. The data does the persuasion — design serves data, not the other way around.

Visual references:

- **CoStar** for the data-grid + map-driven workflow.
- **TradingView** for live charts, multi-pane layouts, draggable widgets feel.
- **Reonomy / CompStak** for parcel-level deep links + transaction history.
- **Linear** for dark-theme typography + spacing rigor.
- **Cloudflare Radar** for the "live network heartbeat" visualization style.
- **Kaspersky CyberMap + globe.gl** for the 3D earth + arcs aesthetic.

## Competitive reference deep-dive

### Bloomberg Terminal — concepts
| Pattern | Adopt |
|---|---|
| 4-pane grid every screen | ✅ already in `term-main` |
| Mono-numerics with delta arrows | ✅ already in viz.js KPIs |
| Live tickers across the top | ✅ rp-shell ticker — upgrade to 2 rows w/ more channels |
| Color-coded volatility on tables | ⏳ adopt for tenant roster + financing |

### CoStar
| Pattern | Adopt |
|---|---|
| Map-first navigation | ⏳ Phase 7 — needs Mapbox/Leaflet city tiles |
| Comparable-sales table with sortable columns + sticky header | ✅ adopt for `/wall` |

### TradingView
| Pattern | Adopt |
|---|---|
| Multiple watch-lists side-by-side | ✅ already pattern in dashboard |
| Live socket-driven price flashes on tick | ✅ adopt for ticker |
| Compact dropdown for time range (1D / 5D / 1M / 3M / 1Y) | ✅ adopt for FRED treasury chart |

### Reonomy + CompStak
| Pattern | Adopt |
|---|---|
| Parcel cards with photo + address + key metrics + comparables link | ✅ already pattern in /site featured deal |
| Recent-transactions feed | ✅ **deal-feed component this phase** |

### Cloudflare Radar
| Pattern | Adopt |
|---|---|
| Animated globe with traffic arcs | ✅ already pattern in globe.js — add second w/ deal-flow |
| "Right now" live counters | ✅ already pattern in viz.js |

## 3D + visualization playbook

Current stack: vanilla JS + Three.js on-demand. Realistic 3D budget:

| Tier | Possible on vanilla JS | Needs React/Next |
|---|---|---|
| Tier 1 (shipped) | One 3D globe per page | — |
| Tier 2 (this phase) | A second 3D scene; canvas heatmap; CSS-3D floating cards layer | — |
| Tier 3 (needs framework) | 10+ live 3D scenes per page; physics; declarative R3F | Phase 5 prerequisite |

**Decision: stay in Tier 2.** "10-15 globes" on vanilla JS would tank performance (WebGL context limit ~16/page) and produce visual noise rather than density. We ship 1 additional 3D globe + a high-quality 2D-driven viz layer with animated glass that **feels** 3D.

**Blender/CAD pre-renders** (Phase 7+):
- Hero loops on `/site` (mp4 backgrounds — 5-15s loops, no perf cost)
- Static property exterior renders
- *Not* live-interactive 3D — that needs WebGL + React.

### 3D scene budget per page

| Page | 3D scenes | 2D viz | Notes |
|---|---|---|---|
| `/` | 1 (existing globe) | KPI strip, treemap, donut, gauge | Current sufficient |
| `/dashboard` | 1 (existing) + 1 NEW (deal-flow globe) | + Heatmap, live deal feed, panels | Phase 6 target |
| `/terminal` | 1 (existing) | Tabbed pane | Phase 6 target |
| `/wall` | 0 | Heatmap, ranked bars, live feed | Phase 6 target |
| `/explore` | 0 | Leaflet map (existing) | Keep |
| Others | 0 | minimal | Marketing pages, lean |

## Execution plan for this session (Phase 6)

| # | Deliverable | File | Risk |
|---|---|---|---|
| 6.1 | Design brief (this file) | `docs/design-brief-phase-6.md` | none |
| 6.2 | Deal-flow globe — 2nd 3D scene, capital arcs between markets | `public/deal-flow-globe.js` | Three.js context limit per page |
| 6.3 | US property heatmap — D3 + canvas county-level signals | `public/property-heatmap.js` | Need US topojson |
| 6.4 | Bloomberg-style live deal feed — floating cards | `public/deal-feed.js` | none |
| 6.5 | Terminal-page tabs — Overview / Pipeline / Capital / Market / Risk | `public/terminal-tabs.js` + edit `terminal.html` | additive |
| 6.6 | Wire components | edits to `dashboard.html`, `terminal.html`, `wall.html` | small; defensive checks |
| 6.7 | Premium CSS upgrades — motion tokens, glass tier-2 | `public/rp-shell.css` additions | additive only |
| 6.8 | Update CLAUDE.md to mark Phase 6 | `CLAUDE.md` | trivial |

## Out of scope for this session (Phase 7+)

- Mapbox/Leaflet city-tile maps in dashboard
- Full property-detail pages (needs routes/state)
- AI-generated property exterior images
- Owner-graph network visualization
- Blender pre-renders + loops on hero sections

## Acceptance criteria

When Phase 6 lands and Vercel auto-deploys:

1. `/dashboard` — **deal-flow globe** renders alongside existing data globe, animated arcs between cities.
2. `/dashboard` and `/wall` — **property heatmap** renders US map colored by signals, hover tooltips show county values.
3. Applicable pages — **deal feed** streams 4-6 floating cards from below with recent transactions.
4. `/terminal` — existing panel layout organized under 5 tabs (Overview / Pipeline / Capital / Market / Risk), state in URL hash.
5. Phase 1-4 features keep working (globe, viz, sources catalog, NL discovery).

## Visual language

### Palette anchors (already in rp-shell.css)
- `--gold` `#BC9C45` — accents, key data
- `--green` `#22c55e` — positive deltas, live indicators
- `--red` `#ef4444` — negative deltas, errors
- `--gold-glow` (new) — radial behind hero numbers

### Motion (new tokens)
- `--ease-data: cubic-bezier(0.16, 1, 0.3, 1)` — number tickers, KPI flips
- `--ease-glass: cubic-bezier(0.4, 0, 0.2, 1)` — panel hover, card lift
- All motion respects `prefers-reduced-motion` (Phase 3 pattern)

### Type
- Display: **Fraunces** (on `/site` only)
- UI: **Poppins** (current)
- Data: **JetBrains Mono** with `tabular-nums slashed-zero` (apply consistently)

## Sequencing

| Phase | Theme | Pre-req |
|---|---|---|
| 6 (this session) | Visual + data-density on vanilla JS | Phase 1-4 deployed |
| 7 | City-tile maps + interactive parcels | Phase 6 + framework decision |
| 8 | Framework migration (if greenlit) | Phase 7 stable |
| 9 | AI-generated visuals | Phase 8 |
