# CRE Investment Platform — Complete JavaScript Widget Library Guide
**Stack: React 18 · Next.js 15 · Tailwind CSS · Tremor.js | Theme: #0E3470 Navy / #BC9C45 Gold**

***

## Executive Summary

This guide covers 40+ free, open-source JavaScript libraries across 12 widget categories for your commercial real estate investment platform. All entries are MIT/Apache-2.0 licensed unless noted. Bundle sizes are gzipped unless otherwise stated. React 18 compatibility is confirmed for all primary recommendations. Next.js 15 supports both React 18 and React 19; the App Router requires React 19, but the Pages Router runs fine on React 18 — verify peer dependencies before installing.[^1]

***

## Category 1 — Ticker & Marquee

The go-to recommendation is **react-fast-marquee**. It uses pure CSS animations (no JS scroll loops), making it buttery smooth and the lightest in class.[^2]

| Library | npm Package | gzip | `direction` prop | `pauseOnHover` | RTL | React 18 | License | Live Demo |
|---------|------------|------|-----------------|---------------|-----|---------|---------|-----------|
| **react-fast-marquee** | `react-fast-marquee` | ~3.4 kB | `left/right/up/down` | ✅ | ⚠️ Flip via `direction="right"` | ✅ | MIT | [Demo](https://react-fast-marquee.com) |
| react-ticker | `react-ticker` | ~5 kB | `direction` | ✅ | ⚠️ Manual | ✅ | MIT | [Demo](https://andreasfaust.github.io/react-ticker/) |
| react-marquee-slider | `react-marquee-slider` | ~8 kB | `"ltr"/"rtl"` | ✅ | ✅ Native `"rtl"` prop[^3] | ✅ | MIT | [Demo](https://react-marquee-slider.netlify.app) |
| vanilla-marquee | `vanilla-marquee` | ~2 kB | `direction` | ✅ | ⚠️ Manual | ✅ (wrapper needed) | MIT | N/A |

**Winner for your stack:** `react-fast-marquee` at ~3.4 kB gzipped. It supports `pauseOnHover`, `pauseOnClick`, variable `speed` (pixels/second), `loop`, and gradient fade-edges. For RTL Hebrew tickers, set `direction="right"` — the CSS animation flips cleanly. Note: Snyk marks its maintenance as "Inactive" as of 2024, but the library is stable and widely used (362k weekly downloads).[^4][^5][^2]

**RTL note:** `react-marquee-slider` is the only one with a native `"rtl"` direction string. Use it for the Hebrew version.[^3]

***

## Category 2 — Financial Charts

The financial charting space has clear tiers: TradingView's `lightweight-charts` for institutional-grade OHLC, and `recharts` for everything else.

| Library | npm Package | gzip | Candlestick | Sparkline | Free? | Looks Premium? | React 18 | License |
|---------|------------|------|------------|----------|-------|---------------|---------|---------|
| **lightweight-charts** | `lightweight-charts` | **~35 kB** | ✅ | ✅ | ✅ Fully free[^6] | ⭐⭐⭐⭐⭐ | ✅ (use wrapper) | Apache 2.0 |
| recharts | `recharts` | ~136 kB | ❌ (line/area/bar) | ✅ | ✅ | ⭐⭐⭐⭐ | ✅ | MIT |
| react-financial-charts | `react-financial-charts` | ~180 kB | ✅ | ✅ | ✅ | ⭐⭐⭐⭐ | ✅ | MIT |
| klinecharts | `klinecharts` | ~60 kB | ✅ | ✅ | ✅ | ⭐⭐⭐⭐⭐ | ✅ (vanilla wrap) | Apache 2.0 |
| apexcharts | `apexcharts` | ~141 kB[^7] | ✅ | ✅ | ✅ | ⭐⭐⭐⭐ | ✅ | MIT |
| visx | `@visx/visx` | ~20 kB (modular) | ✅ (build it) | ✅ | ✅ | ⭐⭐⭐ (DIY) | ✅ | MIT |
| victory | `victory` | ~95 kB | ❌ | ✅ | ✅ | ⭐⭐⭐ | ✅ | MIT |
| react-stockcharts | `react-stockcharts` | ~230 kB | ✅ | ✅ | ✅ | ⭐⭐⭐ | ⚠️ Unmaintained | MIT |

**Tier 1 Picks:**

- **lightweight-charts** by TradingView: Only ~35 kB gzipped, Apache 2.0, fully free with no usage limits. Has native candlestick, line, area, histogram, and baseline series. Looks elite out of the box — same engine powering TradingView.com. For React, use `lightweight-charts-react-components` as the declarative wrapper. Pair with your navy/gold CSS variables for near-zero customization effort.[^8][^6][^9]
- **klinecharts**: Canvas-based, ~60 kB, purpose-built for financial terminals with 20+ built-in indicators (MA, EMA, MACD, KDJ, Bollinger). Professional appearance rivaling Bloomberg terminals.[^10]
- **recharts**: Best for non-OHLC charts (line, area, sparkline) in your property-level KPI widgets. 48.9M weekly downloads as of 2026. At 136 kB gzipped, it's larger but offers the cleanest React API.[^11][^12]
- **react-financial-charts**: A maintained fork of the abandoned `react-stockcharts`, TypeScript rewrite, with candlestick + drawing tools.[^13]

**No library has a free-tier limit** — all are fully open-source. `lightweight-charts` is Apache 2.0; the rest are MIT.[^6]

**RTL:** Recharts requires a workaround — wrap the chart in `direction: ltr` CSS and reverse the axis orientation props. `lightweight-charts` and `klinecharts` are LTR-native; layout direction is irrelevant for canvas-rendered charts.[^14]

***

## Category 3 — Gauges, Meters & KPI

Animated radial gauges for cap rates (0–15%), vacancy % (0–100%), and risk scores (0–10).

| Library | npm Package | gzip | Animation | D3 Dep | React 18 | Best For |
|---------|------------|------|----------|--------|---------|---------|
| **react-gauge-component** | `react-gauge-component` | ~45 kB | ✅ Smooth | No | ✅[^15] | Multi-arc, KPI, cap rates |
| react-gauge-chart | `react-gauge-chart` | ~55 kB | ✅ | D3 | ✅[^16] | Simple semicircle |
| react-d3-speedometer | `react-d3-speedometer` | ~60 kB | ✅ CSS | D3 | ✅ v2.x[^17] | Speedometer dials |
| react-circular-progressbar | `react-circular-progressbar` | **~4 kB** | ✅ | No | ✅ | Circular %, vacancy |
| react-liquid-gauge | `react-liquid-gauge` | ~22 kB | ✅ Liquid | D3 | ⚠️ Stale | Animated fill effect |

**Recommendations:**
- **react-gauge-component** for cap rate / risk score dials — supports multiple arcs with gradient color zones, needle animation, custom labels. No D3 dependency.[^15]
- **react-circular-progressbar** at only ~4 kB is perfect for vacancy % rings. Pure SVG, no dependencies, fully styleable via CSS custom properties — trivial to theme in your gold palette.
- **react-d3-speedometer** v3.x is compatible with React 19 and v2.x with React 18, making it a solid upgrade path. Use for risk score speedometers.[^17]

**RTL:** All gauge components render SVG/Canvas rotated shapes — RTL layout direction does not affect them.

***

## Category 4 — Maps & Choropleths

For a US state/county choropleth on an institutional platform, the choice splits between lightweight SVG and GPU-powered WebGL.

| Library | npm Package | gzip | Choropleth | Free Tier | API Key | React 18 | Best For |
|---------|------------|------|-----------|-----------|---------|---------|---------|
| **react-simple-maps** | `react-simple-maps` | ~50 kB | ✅ State & County[^18] | ✅ Unlimited | ❌ Not needed | ✅[^19] | Lightweight SVG choropleth |
| deck.gl | `@deck.gl/react` | ~200 kB | ✅ via GeoJSON layer | ✅ Free[^20] | ❌ Not needed | ✅[^21] | GPU-powered, 1M+ points |
| react-leaflet | `react-leaflet` | ~30 kB | ✅ via GeoJSON | ✅ Unlimited | ❌ Not needed | ✅ | Interactive tile maps |
| mapbox-gl | `mapbox-gl` | ~300 kB | ✅ | ⚠️ 50k free loads/mo[^22] | ✅ Required | ✅ | Premium base maps |
| kepler.gl | `@kepler.gl/components` | ~900 kB | ✅ Advanced | ✅ | ❌ | ✅[^23] | Geospatial analytics |
| react-usa-map | `react-usa-map` | ~15 kB | ✅ US-states only | ✅ | ❌ | ✅ | US-only, quick start |
| react-simple-maps visx-geo | `@visx/geo` | ~5 kB | ✅ (low-level) | ✅ | ❌ | ✅ | D3-level control |

**Institutional-grade recommendation: deck.gl**[^20][^21]
- GPU-accelerated WebGL, renders millions of data points.
- `GeoJsonLayer` with fill accessor handles county/state choropleth natively.
- No API key required — tile layer optional.
- Actively maintained by vis.gl / Linux Foundation.[^21]
- Pair with `react-map-gl` and `maplibre-gl` (open-source Mapbox fork, free, no token for self-hosted tiles).

**Lightweight recommendation: react-simple-maps**[^24][^19]
- Pure SVG, ~50 kB, no API key, topojson-powered.
- Has a live county-level choropleth example and integrates with `react-spring` for animated transitions.[^18]
- Works perfectly with Tailwind for fill colors.

**Mapbox free tier:** 50,000 map loads/month — sufficient for development but may hit limits in production with thousands of daily CRE users.[^22]

**RTL:** SVG maps are direction-agnostic. deck.gl and react-simple-maps are both RTL-safe. React-leaflet tooltip positioning may require CSS `direction: rtl` adjustments.

***

## Category 5 — 3D Globes

For cross-border capital flow arcs on a rotating globe — your standout hero widget.

| Library | npm Package | gzip | Arcs | Auto-Rotate | React 18 | Framework-Agnostic |
|---------|------------|------|------|------------|---------|-----------------|
| **cobe** | `cobe` | **~5 kB**[^25] | ❌ (dots/markers) | ✅ | ✅ (hook-based) | ✅ |
| react-globe.gl | `react-globe.gl` | ~600 kB | ✅ Native arcs[^26] | ✅ | ✅[^26] | React |
| globe.gl | `globe.gl` | ~600 kB | ✅ | ✅ | ✅ (vanilla wrap) | Vanilla JS |
| @react-three/fiber | `@react-three/fiber` | ~120 kB | ✅ (build it) | ✅ | ✅[^27] | React |
| three-globe | `three-globe` | ~550 kB | ✅ | ✅ | ✅ (wrap) | Three.js |

**Winners by use case:**

- **For arc lines (capital flows): react-globe.gl** — supports `arcsData`, `arcColor`, `arcDashLength`, `arcDashGap`, animated arc flows out of the box. Uses Three.js under the hood. ~600 kB gzip is large but the visual impact is unmatched for an institutional platform's hero widget. Requires `dynamic` import in Next.js to disable SSR.[^26][^28][^29]
- **For pure aesthetic globe (no arcs): cobe** — just 5 kB gzipped, WebGL-based, blazing performance, beautiful by default. Add markers for capital hubs. Cannot draw arc lines natively but perfect for a background globe widget.[^30][^25][^31]
- **For maximum custom control: @react-three/fiber** with Three.js — build custom arc geometries, shader materials, your navy/gold color scheme in GLSL. Bundle is ~120 kB for the React renderer + Three.js peer dep adds ~600 kB.[^32][^27]

**RTL:** All globe components use WebGL/Canvas — fully direction-agnostic.

***

## Category 6 — Data Tables

For 200+ row property deal tables with column resize, sticky headers, and virtualization.

| Library | npm Package | gzip | Virtualization | Column Resize | Sticky Header | RTL | Free Tier | License |
|---------|------------|------|--------------|--------------|--------------|-----|----------|---------|
| **@tanstack/react-table** | `@tanstack/react-table` | **~15 kB** | ✅ (with react-virtual) | ✅ | ✅ | ✅ Full | Unlimited | MIT |
| ag-grid-community | `ag-grid-community` | ~280 kB | ✅ Built-in | ✅ | ✅ | ✅ `enableRtl`[^33][^34] | Unlimited | MIT |
| @mui/x-data-grid | `@mui/x-data-grid` | ~120 kB | ✅ Built-in | ✅ (Pro only) | ✅ | ✅ | Free: 100 col sort/filter | MIT (Community) |
| react-data-grid | `react-data-grid` | ~40 kB | ✅ Built-in | ✅ | ✅ | ⚠️ Manual | Unlimited | MIT |

**Recommendations:**

- **TanStack Table v8** (formerly React Table) — headless library at only ~15 kB. Combine with `@tanstack/react-virtual` for virtualization. Full control over rendering means perfect Tailwind integration with your navy/gold theme. Best for 200–10,000 rows. No free-tier restrictions.[^35][^36][^37]
- **AG Grid Community** — fully free under MIT, includes built-in row virtualization, column resize, sorting, filtering. The enterprise features (row grouping, pivoting, Excel export) require a license, but the community edition handles your 200+ row requirement with ease. Native `enableRtl` prop — the best RTL support in the group.[^33][^34][^38]
- **MUI X Data Grid free tier** restricts advanced sorting/filtering to `DataGridPro` (paid). For a CRE platform with custom theming, TanStack + custom render is superior.[^39]

**RTL winner: ag-grid-community** with `enableRtl={true}` — flip all column headers, freeze panes, and scrolling direction without a single manual CSS rule.[^34][^33]

***

## Category 7 — Counters & Number Animations

Animating `$0 → $4,200,000` on a deal card or dashboard KPI tile.

| Library | npm Package | gzip | Easing | Format ($, %) | React 18 | Hook API |
|---------|------------|------|-------|--------------|---------|---------|
| **react-countup** | `react-countup` | **~4.2 kB**[^40] | ✅ Custom | ✅ `formattingFn` | ✅ | ✅ `useCountUp` |
| framer-motion (numeric) | `motion` | ~42 kB (with LazyMotion)[^41][^42] | ✅ Spring/Tween | ✅ Manual wrap | ✅ | `useMotionValue` |
| react-spring (numeric) | `@react-spring/web` | ~30 kB | ✅ Physics | ✅ Manual wrap | ✅[^43] | `useSpring` |
| countup.js | `countup.js` | ~3 kB | ✅ Easing | ✅ | ✅ (vanilla) | No |

**Winner: react-countup** at 4.2 kB gzipped. It's the smallest with the most purpose-built API. Configuration for `$4,200,000`:[^40]

```jsx
import CountUp from 'react-countup';
<CountUp
  end={4200000}
  prefix="$"
  separator=","
  duration={2.5}
  useEasing={true}
  easingFn={(t, b, c, d) => c * t / d + b} // linear or use easeOut
/>
```

For scroll-triggered counting, use the `useCountUp` hook with an `IntersectionObserver`. React-spring and framer-motion can also animate numbers but require wrapping a transform and formatting function — significantly more code for the same result.

**RTL:** `react-countup` outputs a number string — RTL just requires wrapping in a `<span dir="rtl">` for Hebrew context.

***

## Category 8 — CSS & WebGL Background Effects

Dark animated backgrounds with gold particle flow for your navy theme.

| Library | npm Package | gzip | Particle Flow | Dark Mode | Prefers-Reduced-Motion | React 18 |
|---------|------------|------|--------------|----------|----------------------|---------|
| **@tsparticles/react** | `@tsparticles/react` | ~30 kB (slim) | ✅ Gold palette[^44] | ✅ | ✅ Manual check | ✅[^45] |
| vanta.js | `vanta` | ~70 kB | ✅ NET/BIRDS effects | ✅ | ⚠️ Manual | ✅[^46] |
| granim.js | `granim` | ~10 kB | ❌ (gradient anim) | ✅ | ⚠️ Manual | ✅ (vanilla) |
| shader-gradient | `shader-gradient` | ~45 kB | ❌ (mesh gradient) | ✅ | ⚠️ Manual | ✅ |

**Recommendations:**

- **@tsparticles/react** (tsParticles): Modular, use the `@tsparticles/slim` build for ~30 kB. Has a native **Gold palette** (`@tsparticles/palette-gold`) — loads gold-colored smoke/amber particles. Configure `particles.move.speed` low for subtle drift. Fully supports `prefers-reduced-motion`:[^44][^47][^45]

```js
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
// Pass speed: 0 and opacity animation disabled if reducedMotion is true
```

- **vanta.js**: BIRDS or NET effects in WebGL — stunning on dark navy. Heavier at ~70 kB. Respects `prefers-reduced-motion` via manual check, then fall back to a static dark gradient.[^46]
- **granim.js**: Tiny at ~10 kB, handles multi-step gradient animations between your navy and gold tones. No particles — but zero motion concern.

**Accessibility requirement:** None of these libraries handle `prefers-reduced-motion` automatically. You must wrap initialization:[^48][^49]

```js
const query = window.matchMedia('(prefers-reduced-motion: reduce)');
if (!query.matches) { initParticles(); }
```

**RTL:** Particle/WebGL backgrounds are spatial, not directional — fully RTL-safe.

***

## Category 9 — Skeleton Loaders

Financial widget-shaped skeletons, not generic gray boxes.

| Library | npm Package | gzip | SVG Shape Control | Animated | React 18 | Theming |
|---------|------------|------|-----------------|---------|---------|--------|
| **react-content-loader** | `react-content-loader` | **~2 kB** | ✅ Full SVG | ✅ Pulse | ✅ | ✅ Color props |
| react-loading-skeleton | `react-loading-skeleton` | ~4 kB | ❌ Box-only | ✅ Wave | ✅[^50] | ✅ CSS vars |

**Winner for financial widgets: react-content-loader**[^51]
- Lets you draw your skeleton as SVG shapes — render a candlestick chart skeleton, a gauge dial outline, a KPI card with exact layout proportions. No other library offers this.[^51]
- 2 kB gzipped. Zero dependencies.
- Use the [Create Content Loader](https://skeletonreact.com) playground to generate code from visual drag-and-drop.
- Dark navy theme: set `backgroundColor="#1a2d5a"` and `foregroundColor="#2a4070"`.

**react-loading-skeleton** is better for tables and lists where rectangular shapes suffice. For your platform's chart/gauge widgets, `react-content-loader` wins by design fidelity.[^50]

**RTL:** SVG skeletons are direction-agnostic.

***

## Category 10 — Micro-Interactions

Scroll-triggered animations, hover-lift, smooth expand/collapse.

| Library | npm Package | gzip | Scroll Trigger | Hover Lift | Layout Anim | React 18 | Notes |
|---------|------------|------|--------------|-----------|------------|---------|-------|
| **motion** (Framer) | `motion` | **~4.6 kB initial**[^41] | ✅ | ✅ | ✅ | ✅ | LazyMotion brings to 4.6 kB |
| @react-spring/web | `@react-spring/web` | ~30 kB | ⚠️ Manual | ✅ Physics | ⚠️ Manual | ✅[^43] | Best for physics-feel |
| @formkit/auto-animate | `@formkit/auto-animate` | **~2.6 kB**[^52][^53] | ❌ | ❌ | ✅ Add/remove | ✅ | Zero-config, parent-level |
| motion one | `motion` (standalone) | ~4 kB | ✅ | ✅ | ❌ | ✅[^54] | WAAPI-based, no React dep |

**Analysis:**

- **@formkit/auto-animate** at ~2.6 kB is the **smallest** and simplest — one line of code animates list adds/removes/moves. Perfect for deal pipeline card shuffling and table row changes. No scroll-trigger.[^52][^53]
- **motion (Framer Motion)** with `LazyMotion + m` import reduces initial bundle to just ~4.6 kB. Full scroll-trigger via `whileInView`, `useScroll`, hover effects via `whileHover={{ scale: 1.02, y: -4 }}`, layout animations with `layoutId`. Best comprehensive choice for institutional-grade UI polish.[^41][^55][^43]
- **@react-spring/web** excels at physics-based animations (spring mass/tension) — use for the "weight" feel when opening a deal drawer or a fund allocation meter needle moving. ~30 kB is larger.[^43][^56]

**Recommendation:** Use both — `@formkit/auto-animate` for automatic list/table animations, `motion` for explicit scroll-reveal and hover-lift on cards.

**RTL:** `motion` and `@formkit/auto-animate` are layout-direction agnostic. `react-spring` works with RTL without issues.

***

## Category 11 — Sound Design (Optional)

Subtle tick sounds on live ticker updates.

| Library | npm Package | gzip | Use Case | React Hook | Latency | React 18 |
|---------|------------|------|---------|-----------|---------|---------|
| **use-sound** | `use-sound` | ~1 kB | Declarative UI sounds | ✅ `useSound` | Low | ✅[^57] |
| howler.js | `howler` | ~10 kB | Full audio control | ❌ (wrap it) | Low | ✅[^58][^59] |
| tone.js | `tone` | ~160 kB | Synthesis, sequences | ❌ (wrap it) | Medium | ✅ | 

**Winner: use-sound**[^57]

`use-sound` is a React wrapper around `howler.js` — it gives you a declarative hook API at only ~1 kB overhead. For a subtle "tick" on ticker updates:[^57]

```js
import useSound from 'use-sound';
const [playTick] = useSound('/sounds/tick.mp3', { volume: 0.15, sprite: { tick: [0, 100] } });
// Call playTick() whenever a price update arrives
```

**howler.js** directly (~10 kB) is the choice if you need audio sprites, precise timing, or multiple simultaneous sounds. `tone.js` at ~160 kB is overkill for UI ticks — it's built for synthesis and sequencing.[^60][^58][^59]

Respect `prefers-reduced-motion` for sound too — some users with vestibular conditions also disable audio feedback. Add a user toggle.

***

## Category 12 — RTL / Hebrew Support Summary

| Category | Winner | RTL Status | Notes |
|---------|-------|-----------|-------|
| Ticker | `react-marquee-slider` | ✅ Native | `direction="rtl"` prop[^3] |
| Charts | `lightweight-charts` / `klinecharts` | ✅ N/A (canvas) | Canvas ignores CSS dir |
| Charts (SVG) | recharts | ⚠️ Workaround | Set `direction: ltr` on wrapper + reverse axes[^14] |
| Gauges | All | ✅ N/A | Radial/SVG, dir-agnostic |
| Maps | `deck.gl`, `react-simple-maps` | ✅ N/A | Canvas/SVG, dir-agnostic |
| Globes | All | ✅ N/A | WebGL, dir-agnostic |
| Data Tables | `ag-grid-community` | ✅ Native | `enableRtl` prop[^33][^34] |
| Data Tables | `@tanstack/react-table` | ✅ Manual | CSS `direction: rtl` on container |
| Counters | `react-countup` | ✅ Wrap | `<span dir="rtl">` |
| Animations | `motion`, `auto-animate` | ✅ Full | Layout-direction safe |
| Backgrounds | `tsparticles`, `vanta` | ✅ N/A | WebGL/Canvas |
| Skeletons | `react-content-loader` | ✅ SVG mirror | Mirror SVG shapes for RTL |
| Sound | `use-sound` | ✅ N/A | Audio is directionless |

**Libraries that break on RTL (flag 🚩):**
- `recharts` — chart layout breaks when a parent `dir="rtl"` is set; must manually override with `direction: ltr` CSS on `.recharts-wrapper`[^14]
- `react-simple-maps` — tooltip/annotation overlays may misalign; test in RTL context
- `react-loading-skeleton` — box skeletons may appear reversed; manually set `direction: ltr` on the skeleton container

***

## Recommended Core Stack (Your Platform)

| Role | Library | Bundle | Notes |
|------|---------|--------|-------|
| Ticker | `react-fast-marquee` | 3.4 kB | Best for English; use `react-marquee-slider` for Hebrew |
| Financial Charts | `lightweight-charts` + `react-financial-charts` | 35 kB + 180 kB | LW for OHLC; RFC for drawing tools |
| KPI Charts | `recharts` | 136 kB | Line/area/sparkline in deal dashboards |
| Gauges | `react-gauge-component` + `react-circular-progressbar` | 45 kB + 4 kB | Dials + rings |
| Choropleth | `react-simple-maps` or `deck.gl` | 50 kB / 200 kB | Simple vs GPU-powered |
| 3D Globe | `react-globe.gl` (arcs) + `cobe` (aesthetic) | 600 kB / 5 kB | Separate widgets |
| Data Table | `@tanstack/react-table` + `ag-grid-community` | 15 kB / 280 kB | Headless + full-featured |
| Counters | `react-countup` | 4.2 kB | All KPI numbers |
| Backgrounds | `@tsparticles/react` (slim) | 30 kB | Gold particle flow |
| Skeletons | `react-content-loader` | 2 kB | Chart/gauge shaped |
| Micro-anim | `motion` (LazyMotion) + `@formkit/auto-animate` | 4.6 kB + 2.6 kB | Scroll-reveal + list anim |
| Sound | `use-sound` | 1 kB | Ticker tick sounds |

**Total gzipped (primary picks only):** ~553 kB. With Next.js 15 route-level code splitting, the per-page impact is a fraction of this total.

***

## Implementation Tips for #0E3470 / #BC9C45 Theme

1. **lightweight-charts**: Set `layout.background.color: '#0E3470'`, `layout.textColor: '#BC9C45'`, `grid.vertLines.color: '#1a3f80'`, `upColor: '#BC9C45'`, `downColor: '#e05858'`.
2. **react-gauge-component**: Use `arc.colorArray: ['#e05858', '#BC9C45', '#2ecc71']` for risk-zone coloring on a navy `#0E3470` background.
3. **tsparticles gold palette**: Load `@tsparticles/palette-gold` and set `particles.color.value: '#BC9C45'`, `opacity.value: 0.4`, `move.speed: 1.5`.[^44]
4. **react-content-loader skeletons**: `backgroundColor="#0a2555"` `foregroundColor="#1a3f80"` — matches your navy palette with a subtle shimmer.
5. **react-simple-maps choropleth**: Use D3's `scaleQuantile` with a gold-to-dark-navy color scale for deal density by state.
6. **cobe globe**: Set `baseColor: [0.06, 0.2, 0.44]` (navy) and `markerColor: [0.74, 0.61, 0.27]` (gold) — converts `#0E3470` and `#BC9C45` to 0–1 RGB.

---

## References

1. [Can React 18 be used with Next.js version 15? #72795 - GitHub](https://github.com/vercel/next.js/discussions/72795) - I would like to use Next.js version 15. According to the documentation, it says to use React 19. How...

2. [react-fast-marquee - NPM](https://www.npmjs.com/package/react-fast-marquee) - React Fast Marquee is a lightweight React component that harnesses the power of CSS animations to cr...

3. [The marquee slider of your deepest dreams. Only for React.js - Now ...](https://github.com/ndom91/react-marquee-slider-emotion) - Marquee ; direction, "rtl", String, Can be either "ltr" or "rtl" ; velocity, 30, Number, Determines ...

4. [react-fast-marquee - Snyk Vulnerability Database](https://security.snyk.io/package/npm/react-fast-marquee) - The npm package react-fast-marquee receives a total of 362,867 downloads a week. As such, we scored ...

5. [react-fast-marquee-test - Yarn Classic](https://classic.yarnpkg.com/en/package/react-fast-marquee-test) - # React Fast Marquee

React Fast Marquee is a lightweight React component that utilizes the power of...

6. [Lightweight Charts™ library - TradingView](https://www.tradingview.com/lightweight-charts/) - Top performance in a tiny package. Free, open-source and feature-rich. At just 45 kilobytes, the dre...

7. [apexcharts v5.12.0 Bundlephobia](https://bundlephobia.com/package/apexcharts) - Size of apexcharts v5.12.0 is 523.4 kB (minified), and 140.8 kB when compressed using GZIP. Bundleph...

8. [tradingview/lightweight-charts - GitHub](https://github.com/tradingview/lightweight-charts) - TradingView Lightweight Charts are one of the smallest and fastest financial HTML5 charts. The Light...

9. [lightweight-charts-react-components - NPM](https://npmjs.com/package/lightweight-charts-react-components) - It provides a simple declarative way to use the Lightweight-charts library in your React application...

10. [Highly customizable lightweight financial chart - KLineChart](https://klinecharts.com/en-US/) - Built in multiple candlestick charts, multiple coordinate axes, dozens of commonly used indicators, ...

11. [The Best React Chart Libraries for 2026 - DataBrain](https://www.usedatabrain.com/blog/react-chart-libraries) - Compare the best React chart libraries — Recharts, Chart.js, ApexCharts, ECharts, Nivo, Visx, Victor...

12. [recharts v3.8.1 Bundlephobia](https://bundlephobia.com/package/recharts) - Size of recharts v3.8.1 is 515.1 kB (minified), and 136.0 kB when compressed using GZIP. Bundlephobi...

13. [React Financial Charts - GitHub](https://github.com/react-financial/react-financial-charts) - Charts dedicated to finance. The aim with this project is create financial charts that work out of t...

14. [Render recharts chart in RTL - Stack Overflow](https://stackoverflow.com/questions/48496151/render-recharts-chart-in-rtl) - When I'm using recharts to render a chart in in a wrapper which is RTL (for Arabic or Hebrew), the U...

15. [antoniolago/react-gauge-component - GitHub](https://github.com/antoniolago/react-gauge-component) - React gauge component for data visualization. Contribute to antoniolago/react-gauge-component develo...

16. [Martin36/react-gauge-chart - GitHub](https://github.com/Martin36/react-gauge-chart) - React component for displaying a gauge chart, using D3.js. Usage: Install it by running npm install ...

17. [GitHub - palerdot/react-d3-speedometer](https://github.com/palerdot/react-d3-speedometer) - React Speedometer component using d3.js ⚛️. Contribute to palerdot/react-d3-speedometer development ...

18. [US choropleth map (quantile) - React Simple Maps](https://www.react-simple-maps.io/examples/usa-counties-choropleth-quantile/) - Map with zoom and pan. US choropleth map (quantile). This map shows how to create a choropleth map c...

19. [react-simple-maps - NPM](https://www.npmjs.com/package/react-simple-maps) - React-simple-maps aims to make working with svg maps in react easier. It handles tasks such as panni...

20. [Home | deck.gl](https://deck.gl) - deck.gl is a GPU-powered framework for visual exploratory data analysis of large datasets. A Layered...

21. [The deck.gl ecosystem - Open Visualization](https://www.openvisualization.org/projects) - GPU powered, geospatially optimized visualization layers for large scale data. @kepler.gl. A framewo...

22. [How Mapbox's free tier works - Stockist Help](https://help.stockist.co/article/104-how-mapboxs-free-tier-works) - Each Mapbox account includes a free tier that's enough for around 10,000 views of your map every mon...

23. [Kepler.gl is a powerful open source geospatial analysis tool ... - GitHub](https://github.com/keplergl/kepler.gl) - Built on top of MapLibre GL and deck.gl, kepler.gl can render millions of points representing thousa...

24. [React Simple Maps](https://www.react-simple-maps.io) - React Simple Maps consists of isolated helper components that can be freely composed. Creating and s...

25. [Tiny WebGL Globe Library: Cobe | Ram Maheshwari posted on the ...](https://www.linkedin.com/posts/rammcodes_this-is-insane-and-its-only-5kb-cobe-activity-7440785017435430913-9kiP) - and it's only ~5KB Cobe is a tiny WebGL globe library that lets you render a beautiful animated eart...

26. [vasturiano/react-globe.gl - GitHub](https://github.com/vasturiano/react-globe.gl) - A React component to represent data visualization layers on a 3-dimensional globe in a spherical pro...

27. [React three fiber - 3D for the web](https://techhub.iodigital.com/articles/react-three-fiber-3d-for-the-web) - There is a small down side of cource bundle size. React three fiber tends to be larger than a plain ...

28. [200 lines of code for the best 3D map in frontend - Stackademic](https://blog.stackademic.com/200-lines-of-code-for-the-best-3d-map-in-frontend-84753398dff5) - I stumbled upon react-globe.gl library for maps in the front end. This simple library provides a 3D ...

29. [Working with 3D globe in frontend - DEV Community](https://dev.to/shreyvijayvargiya/working-with-react-globegl-getting-started-to-advance-in-200-lines-of-code-3oi3) - This simple library provides a 3D globe using Three.js under the hood. If you are new to three.js, a...

30. [COBE](https://cobe.vercel.app) - Updates globe state and triggers a re-render. Pass any options to update. destroy() function. Releas...

31. [This is insane… and it's only ~5KB Cobe is a tiny WebGL globe ...](https://www.instagram.com/reel/DWJUGpXDOGB/) - ... Cobe is a tiny WebGL globe library that lets you render a beautiful animated earth on a canvas w...

32. [React Three Fiber vs Three.js (2026): Key Differences & Which to Pick](https://www.creativedevjobs.com/blog/react-three-fiber-vs-threejs) - Side-by-side comparison of React Three Fiber and Three.js — code examples, bundle size, performance,...

33. [RTL support for ag-grid - Stack Overflow](https://stackoverflow.com/questions/70754844/rtl-support-for-ag-grid) - I am using ag-grid 22.2.1 with angular12. And trying enableRtl feature. I am not able to make it wor...

34. [Angular Grid: Community vs. Enterprise - AG Grid](https://www.ag-grid.com/angular-data-grid/community-vs-enterprise/) - AG Grid Community: Free for everyone, including production use - no licence required. · AG Grid Ente...

35. [TanStack Table vs AG Grid: Complete Comparison (2025)](https://www.simple-table.com/blog/tanstack-table-vs-ag-grid-comparison) - TanStack Table or AG Grid? We break down features, performance, pricing, and developer experience to...

36. [Best React Data Grid (Table) Libraries for 2025 - Peter Mbanugo](https://pmbanugo.me/blog/top-best-react-data-grid-table-library) - Formerly known as React Table, TanStack Table is a headless UI library for building powerful tables ...

37. [Build Tables in React: Data Grid Performance Guide - Strapi](https://strapi.io/blog/table-in-react-performance-guide) - Master tables in React with TanStack Table and AG-Grid. Handle 100K+ rows with virtualization, memoi...

38. [ag-grid/ag-grid: The best JavaScript Data Table for building ... - GitHub](https://github.com/ag-grid/ag-grid) - AG Grid is a fully-featured and highly customizable JavaScript Data Grid. It delivers outstanding pe...

39. [React Data Grid component - MUI X](https://mui.com/x/react-data-grid/) - The MUI X Data Grid is a TypeScript-based React component that presents information in a structured ...

40. [react-countup v6.5.3 Bundlephobia](https://bundlephobia.com/package/react-countup) - Size of react-countup v6.5.3 is 12.1 kB (minified), and 4.2 kB when compressed using GZIP. Bundlepho...

41. [Reduce bundle size of Framer Motion | Motion React](https://motion.dev/docs/react-reduce-bundle-size) - When measuring the gzipped and minified size of Motion for React using a bundle analysis website lik...

42. [motion v12.40.0 Bundlephobia](https://bundlephobia.com/package/motion) - Size of motion v12.40.0 is 128.0 kB (minified), and 42.8 kB when compressed using GZIP. Bundlephobia...

43. [Animating React UIs in 2025: Framer Motion 12 vs. React Spring 10](https://hookedonui.com/animating-react-uis-in-2025-framer-motion-12-vs-react-spring-10/) - Compare Framer Motion 12 and React Spring 10 for animating React apps—features, code recipes, perfor...

44. [Module tsParticles Gold Palette - v4.0.0-beta.16](https://particles.js.org/docs/modules/tsParticles_Gold_Palette.html) - A palette defines colors, not complete behavior, so pair it with a runtime package and particle opti...

45. [tsParticles 3.0.0 is out. Breaking changes ahead. - DEV Community](https://dev.to/tsparticles/tsparticles-300-is-out-breaking-changes-ahead-3hl1) - You can't use tsParticles options in pjs calls. Pjs package is no longer part of @tsparticles/slim b...

46. [Vanta.js - Animated 3D Backgrounds For Your Website](https://www.vantajs.com) - 3D & WebGL Background Animations For Your Website. ... Set a background image or color as a fallback...

47. [tsparticles - NPM](https://www.npmjs.com/package/tsparticles) - Easily create highly customizable particle animations and use them as animated backgrounds for your ...

48. [prefers-reduced-motion: Sometimes less movement is more | Articles](https://web.dev/articles/prefers-reduced-motion) - The prefers-reduced-motion media query detects whether the user has requested the operating system t...

49. [Adapting to user motion and theme preferences with CSS and ...](https://blog.logrocket.com/adapting-user-motion-theme-preferences-css-javascript/) - With the prefers-reduced-motion media query you can tone/slow down complex animations or disable the...

50. [react-loading-skeleton - NPM](https://www.npmjs.com/package/react-loading-skeleton) - Adapts to the styles you have defined. The Skeleton component should be used directly in your compon...

51. [The do's and dont's of Skeleton Loading in React - Ironeko](https://ironeko.com/posts/the-dos-and-donts-of-skeleton-loading-in-react) - Differences between the skeleton packages and how to use them. The example uses both react-content-l...

52. [AutoAnimate - Add motion to your apps with a single line of ... - FormKit](https://auto-animate.formkit.com) - A zero-config, drop-in animation utility that automatically adds smooth transitions to your web app....

53. [GitHub - formkit/auto-animate: A zero-config, drop-in animation utility ...](https://github.com/formkit/auto-animate) - Add motion to your apps with a single line of code. AutoAnimate is a zero-config, drop-in animation ...

54. [Framer Motion vs Motion One: Mobile Animation Performance in 2025](https://www.reactlibraries.com/blog/framer-motion-vs-motion-one-mobile-animation-performance-in-2025) - A technical comparison of Framer Motion and Motion One for React mobile apps, examining bundle size,...

55. [15 Best React Animation Libraries Compared (2025) - Spell UI](https://spell.sh/blog/best-react-animation-libraries) - A practical comparison of the top React animation libraries — Motion (formerly Framer Motion), React...

56. [framer-motion vs react-spring? : r/reactjs - Reddit](https://www.reddit.com/r/reactjs/comments/wxj48i/framermotion_vs_reactspring/) - I see everyone talking about framer-motion but I recently discovered react-spring and it seems very ...

57. [use-sound - NPM](https://www.npmjs.com/package/use-sound) - A React Hook for Sound Effects. The web needs more (tasteful) sounds! Lets your website communicate ...

58. [goldfire/howler.js: Javascript audio library for the modern web. · GitHub](https://github.com/goldfire/howler.js/) - howler.js is an audio library for the modern web. It defaults to Web Audio API and falls back to HTM...

59. [howler.js - JavaScript audio library for the modern web](https://howlerjs.com) - Audio library for the modern web. howler.js makes working with audio in JavaScript easy and reliable...

60. [Tone.js vs Howler.js: Web Audio Library Guide - Supadark](https://supadark.com/notes/tone-js-vs-howler-js) - Tone.js and Howler.js both handle web audio. Here is how to choose the right library for your next p...

