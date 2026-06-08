# ADR-003 — Performance: Phase 3 baseline + JSON chunking strategy

**Status:** Accepted (Phase 3 baseline) · Chunking strategy: deferred
**Date:** 2026-06-09
**Audit reference:** AUDIT-2026-06-08.md §17 (Phase 3)

## Context

Audit Phase 3 calls out:

- **JSON payload size.** `public/data/sources_catalog.json` is **661 KB** shipped to every visitor of `/sources`, `/data-coverage`, and any page rendering the catalog. Over 3G that's 5+ seconds before the explorer renders.
- **Indefinite counter polling.** `public/viz.js:380-387` polled every 60s in every open tab, even when hidden — burns Supabase quota and device battery.
- **Heavy WebGL globe.** Three.js r128 is ~600 KB, runs continuous WebGL animation. Users on slow devices or with `prefers-reduced-motion` get no benefit.
- **Cold-start `/api/search`.** Stdlib-only, so already minimal.

## Decisions

### 1. Visibility-gated polling (DONE this commit)

`viz.js` counter refresh now skips when `document.visibilityState === 'hidden'` and fires immediately on visibility-resume. No more background-tab polling.

### 2. `prefers-reduced-motion` short-circuit on globe (DONE this commit)

`globe.js` checks `matchMedia('(prefers-reduced-motion: reduce)')` before any work — renders a static text card with a "view the data warehouse" link instead. Saves the 600 KB Three.js download and ~16ms/frame for users who asked for reduced motion.

### 3. JSON chunking for `sources_catalog.json` (DEFERRED)

Three viable paths considered:

| Approach | Pro | Con | Verdict |
|---|---|---|---|
| **a. Server-side pagination via Supabase** | Already have data in DB; pages get tiny payloads (1-2 KB) | Requires rewriting `sources.js` from "fetch all + filter client-side" to "fetch on filter-change" — UX changes | Best long-term, but invasive |
| **b. Split JSON file by category** | Static; no server changes; lazy-load category | 14 small files instead of 1, still need an index file | Middle ground |
| **c. gzip + HTTP/2 + Cache-Control** | Zero code change; just tighten headers | Doesn't reduce parse time; still 661 KB on first hit | Quick win, partial fix |

**Decision:** Apply (c) now (Phase 2.1 vercel.json already caches `/data/*.json` for 5min+SWR, browsers gzip). Defer (a) until catalog grows past 2 MB or `/sources` LCP exceeds 2.5s in real-user metrics.

### 4. Cold-start optimization

Verified: `api/search.py` imports are stdlib only. Cold start is already as fast as Vercel Python can deliver. The 13s `TOTAL_BUDGET` is throughput governance, not start-up.

## Open monitoring

Add Vercel Analytics + Speed Insights. Without RUM data we're guessing at where time actually goes.

## Consequences

- Background-tab polling stops → Supabase request count drops for users with multiple tabs open.
- Reduced-motion users get a 600 KB lighter page.
- `sources_catalog.json` keeps its current strategy until measurements prompt change.
