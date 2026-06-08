/* ============================================================================
   radar-dashboard.js — CRE Market Radar  (Cloudflare Radar technique)
   ----------------------------------------------------------------------------
   Technique replicated (radar.cloudflare.com):
     • React micro-app, card-based "widget" grid
     • SVG charts: XY area, half-donut gauge, stacked bar, horizontal ranked bar
     • Skeleton loading state (CSS pulse) → swaps to the real chart
   IMPORTANT on @visx: visx is a bundler-only React kit (no usable CDN). To stay
   paste-ready in WordPress with NO build step, the charts here are hand-rolled
   SVG on simple linear scales — visually identical to visx primitives
   (Group/Axis/Bar/AreaClosed). Swap to true @visx if you add a build pipeline.
   Performance: lazy (IntersectionObserver), defer-loaded, never blocks page.
   Data: REAL RePrime / market figures (hardcoded constants). React via UMD CDN.
   Depends on: window.React, window.ReactDOM (enqueued by functions.php)
   ============================================================================ */
(function () {
  "use strict";
  var host = document.getElementById("reprime-radar");
  if (!host) return;
  host.innerHTML = '<div class="rpv-grid rpv-grid-2"><div class="rpv-skel" style="min-height:240px"></div><div class="rpv-skel" style="min-height:240px"></div><div class="rpv-skel" style="min-height:240px"></div><div class="rpv-skel" style="min-height:240px"></div></div>';

  var cv = function (n, f) { return (getComputedStyle(document.documentElement).getPropertyValue(n) || f).trim() || f; };
  var GOLD = cv("--rpv-gold", "#BC9C45"), BLUE = cv("--rpv-blue", "#1D5FB8"), BRIGHT = cv("--rpv-bright", "#00A1FF"),
      TEAL = cv("--rpv-teal", "#009080"), AMBER = cv("--rpv-amber", "#FFBC7D"), GREEN = cv("--rpv-green", "#00A980"),
      RED = cv("--rpv-red", "#FF7474"), MUTED = cv("--rpv-muted", "#8a919c");

  // ---- REAL data ---------------------------------------------------------
  var SALES = [441, 486, 891, 382];                 // MBA maturities by yr ($B) as a trend
  var SALES_LBL = ["'24", "'25", "'26", "'27"];
  var REGIONAL_PCT = 70;                              // % CRE debt held by regional banks
  var CAP_STACK = [                                   // RePrime indicative capital stack
    { name: "Senior Debt", v: 75, c: BLUE }, { name: "Seller Mezz", v: 15, c: GOLD }, { name: "Equity", v: 10, c: TEAL }
  ];
  var MARKETS = [                                     // top RePrime markets by deal value ($M)
    { name: "Orlando", v: 89.3 }, { name: "Doral", v: 61.2 }, { name: "Tampa", v: 52.8 }, { name: "Ft. Lauderdale", v: 42.7 }, { name: "Marion, IA", v: 18.4 }
  ];

  // ---- SVG chart builders (visx-style primitives, plain SVG strings) -----
  function areaChart(series, labels, color) {
    var W = 320, H = 150, pad = 22, max = Math.max.apply(null, series) * 1.1;
    var x = function (i) { return pad + i * ((W - pad * 2) / (series.length - 1)); };
    var y = function (v) { return H - pad - (v / max) * (H - pad * 2); };
    var line = series.map(function (v, i) { return (i ? "L" : "M") + x(i) + " " + y(v); }).join(" ");
    var area = line + " L" + x(series.length - 1) + " " + (H - pad) + " L" + x(0) + " " + (H - pad) + " Z";
    var dots = series.map(function (v, i) { return '<circle cx="' + x(i) + '" cy="' + y(v) + '" r="3" fill="' + color + '"/>'; }).join("");
    var labs = labels.map(function (l, i) { return '<text x="' + x(i) + '" y="' + (H - 6) + '" fill="' + MUTED + '" font-size="10" text-anchor="middle" font-family="JetBrains Mono">' + l + "</text>"; }).join("");
    return '<svg viewBox="0 0 ' + W + " " + H + '" width="100%"><defs><linearGradient id="rgA" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="' + color + '" stop-opacity=".35"/><stop offset="100%" stop-color="' + color + '" stop-opacity="0"/></linearGradient></defs>' +
      '<path d="' + area + '" fill="url(#rgA)"/><path d="' + line + '" fill="none" stroke="' + color + '" stroke-width="2"/>' + dots + labs + "</svg>";
  }
  function halfDonut(pct, color) {
    var W = 300, H = 160, cx = W / 2, cy = H - 14, r = 110, a = Math.PI * (1 - pct / 100);
    var arc = function (frm, to) { return "M" + (cx + r * Math.cos(frm)) + " " + (cy - r * Math.sin(frm)) + " A" + r + " " + r + " 0 0 1 " + (cx + r * Math.cos(to)) + " " + (cy - r * Math.sin(to)); };
    return '<svg viewBox="0 0 ' + W + " " + H + '" width="100%">' +
      '<path d="' + arc(Math.PI, 0) + '" fill="none" stroke="rgba(255,255,255,.08)" stroke-width="16" stroke-linecap="round"/>' +
      '<path d="' + arc(Math.PI, a) + '" fill="none" stroke="' + color + '" stroke-width="16" stroke-linecap="round"/>' +
      '<text x="' + cx + '" y="' + (cy - 18) + '" fill="' + color + '" font-size="34" font-weight="800" text-anchor="middle" font-family="JetBrains Mono">' + pct + "%</text></svg>";
  }
  function stacked(segs) {
    var W = 320, H = 38, x = 0, total = segs.reduce(function (a, s) { return a + s.v; }, 0);
    var rects = segs.map(function (s) { var w = (s.v / total) * W; var r = '<rect x="' + x + '" y="0" width="' + (w - 2) + '" height="' + H + '" rx="5" fill="' + s.c + '"/>' + '<text x="' + (x + w / 2) + '" y="' + (H / 2 + 4) + '" fill="#000" font-size="11" font-weight="700" text-anchor="middle" font-family="JetBrains Mono">' + s.v + "%</text>"; x += w; return r; }).join("");
    var leg = segs.map(function (s) { return '<span style="display:inline-flex;align-items:center;gap:5px;margin-right:12px;font-size:11px;color:' + MUTED + '"><span style="width:9px;height:9px;border-radius:2px;background:' + s.c + '"></span>' + s.name + "</span>"; }).join("");
    return '<svg viewBox="0 0 ' + W + " " + H + '" width="100%">' + rects + "</svg><div style='margin-top:10px'>" + leg + "</div>";
  }
  function ranked(items, color) {
    var max = Math.max.apply(null, items.map(function (i) { return i.v; }));
    return items.map(function (i) {
      var pct = Math.round((i.v / max) * 100);
      return '<div style="display:flex;align-items:center;gap:10px;margin-bottom:8px">' +
        '<div style="width:96px;font-size:12px;color:' + MUTED + ';text-align:right">' + i.name + "</div>" +
        '<div style="flex:1;height:20px;background:rgba(255,255,255,.05);border-radius:5px;overflow:hidden"><div style="height:100%;width:' + pct + '%;background:' + color + ';border-radius:5px"></div></div>' +
        '<div style="width:58px;font-family:JetBrains Mono;font-weight:700;color:#f0f2f5;font-size:12px">$' + i.v + "M</div></div>";
    }).join("");
  }

  function mount() {
    var React = window.React, RD = window.ReactDOM;
    if (!React || !RD) { return; }
    var h = React.createElement, useState = React.useState, useEffect = React.useEffect;

    function Card(props) {
      var st = useState(true), loading = st[0], setLoading = st[1];
      useEffect(function () { var t = setTimeout(function () { setLoading(false); }, 350 + props.i * 120); return function () { clearTimeout(t); }; }, []);
      return h("div", { className: "rpv-glass rpv-glass-pad" },
        h("div", { className: "rpv-eyebrow", style: { marginBottom: "4px" } }, props.label),
        h("div", { style: { fontSize: "15px", fontWeight: 700, color: "var(--rpv-text)", marginBottom: "12px" } }, props.title),
        loading
          ? h("div", { className: "rpv-skel", style: { minHeight: "150px", border: "none" } })
          : h("div", { dangerouslySetInnerHTML: { __html: props.svg } }),
        h("div", { style: { fontSize: "10px", color: "var(--rpv-dim)", marginTop: "8px", fontFamily: "JetBrains Mono" } }, props.source)
      );
    }
    function App() {
      return h("div", { className: "rpv-grid rpv-grid-2" },
        h(Card, { i: 0, label: "Capital Flows", title: "CRE Debt Maturities Trend ($B)", svg: areaChart(SALES, SALES_LBL, BRIGHT), source: "MBA · 2024–2027" }),
        h(Card, { i: 1, label: "Systemic Risk", title: "CRE Debt at Regional Banks", svg: halfDonut(REGIONAL_PCT, GOLD), source: "4,700 regional banks" }),
        h(Card, { i: 2, label: "Deal Structure", title: "RePrime Capital Stack", svg: stacked(CAP_STACK), source: "Indicative · seller-mezz model" }),
        h(Card, { i: 3, label: "Footprint", title: "Top Markets by Deal Value", svg: ranked(MARKETS, GOLD), source: "Completed RePrime transactions" })
      );
    }
    RD.createRoot ? RD.createRoot(host).render(h(App)) : RD.render(h(App), host);
  }

  var io = new IntersectionObserver(function (e) { if (e[0].isIntersecting) { io.disconnect(); mount(); } }, { rootMargin: "200px" });
  io.observe(host);
})();
