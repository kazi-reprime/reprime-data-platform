/* ============================================================================
   charts.js — RePrime Market Intelligence Dashboard  (Highcharts technique)
   ----------------------------------------------------------------------------
   Technique replicated (highcharts.com/demo):
     • Pure-SVG charts, dark theme via CSS custom properties
     • 1000ms entrance animation (Highcharts `Fx` tweening) + 150ms hover
     • 6-chart responsive grid; each chart is its own widget
   Performance rules honored:
     • CRE market data = HARDCODED JS CONSTANTS below (no API calls) — real
       figures from MBA / CBRE / Avison Young / Trepp (sourced inline)
     • ONLY the 10-Yr Treasury + SOFR series fetch LIVE, via the WordPress REST
       proxy /wp-json/reprime/v1/rates (FRED key kept server-side; see functions.php)
     • Lazy: each chart initializes only when scrolled into view (IntersectionObserver)
     • Falls back to last-known constants if the live fetch fails — never blank
   NOTE: Highcharts is a COMMERCIAL product — a license is required for a
         business site. (Swap to Chart.js/ApexCharts on request — both MIT/free.)
   Depends on: window.Highcharts (enqueued by functions.php)
   ============================================================================ */
(function () {
  "use strict";
  var host = document.getElementById("reprime-charts");
  if (!host) return;

  // ---- Brand palette from CSS vars --------------------------------------
  var cv = function (n, f) { return (getComputedStyle(document.documentElement).getPropertyValue(n) || f).trim() || f; };
  var GOLD = cv("--rpv-gold", "#BC9C45"), NAVY = cv("--rpv-navy", "#0E3470"), BLUE = cv("--rpv-blue", "#1D5FB8"),
      BRIGHT = cv("--rpv-bright", "#00A1FF"), TEAL = cv("--rpv-teal", "#009080"), AMBER = cv("--rpv-amber", "#FFBC7D"),
      GREEN = cv("--rpv-green", "#00A980"), RED = cv("--rpv-red", "#FF7474"), MUTED = cv("--rpv-muted", "#8a919c"),
      GRID = "rgba(255,255,255,.06)", MONO = "'JetBrains Mono',monospace";

  // ---- REAL CRE market data (hardcoded constants per performance rules) --
  var MATURITY_WALL = { // MBA — $2.2T CRE debt maturities by year ($B)
    cats: ["2024", "2025", "2026", "2027"], data: [441, 486, 891, 382]
  };
  var SECTOR_VACANCY = { // CBRE / CoStar Q1 2026 vacancy by asset class (%)
    cats: ["Office", "Industrial", "Retail", "Multifamily"], data: [18.6, 7.5, 4.4, 4.8]
  };
  var SECTOR_CAP = { // indicative cap rates by sector (CBRE / Avison Young)
    cats: ["Office", "Retail", "Industrial", "Multifamily"], data: [8.1, 6.9, 6.2, 5.8]
  };
  var DISTRESS = { // completed trophy distressed sales — % discount to peak
    cats: ["311 S. Wacker", "Market Center", "One Financial Ctr", "1221 Ave Americas", "600 W. Chicago"],
    data: [-85, -76, -64, -60, -82]
  };
  var INVEST_FORECAST = { // MBA / CBRE investment sales + forecast ($B)
    cats: ["Q1 Sales", "2026 Forecast"], data: [112.6, 562] // Avison Young Q1, CBRE 2026
  };
  var RATES_FALLBACK = { // last-known if live FRED proxy is unavailable (never blank)
    treasury: [{ x: "2025", y: 4.45 }, { x: "Now", y: 4.67 }],
    sofr: [{ x: "30D", y: 3.59 }, { x: "90D", y: 3.64 }, { x: "180D", y: 3.69 }]
  };

  // ---- Shared dark Highcharts theme -------------------------------------
  function baseOpts(extra) {
    var o = {
      chart: { backgroundColor: "transparent", style: { fontFamily: "'Poppins',sans-serif" }, animation: { duration: 1000 } },
      title: { text: null }, credits: { enabled: false }, legend: { itemStyle: { color: MUTED } },
      xAxis: { lineColor: GRID, tickColor: GRID, labels: { style: { color: MUTED, fontSize: "11px" } }, gridLineColor: GRID },
      yAxis: { gridLineColor: GRID, title: { text: null }, labels: { style: { color: MUTED } } },
      tooltip: { backgroundColor: "rgba(10,13,20,.92)", borderColor: GOLD, style: { color: "#f0f2f5", fontFamily: MONO }, animation: true },
      plotOptions: { series: { animation: { duration: 1000 }, states: { hover: { animation: { duration: 150 } } } } }
    };
    return Object.assign(o, extra);
  }
  function card(id, label, title, source) {
    return '<div class="rpv-glass rpv-glass-pad rpv-rise">' +
      '<div class="rpv-eyebrow" style="margin-bottom:4px">' + label + '</div>' +
      '<div style="font-size:15px;font-weight:700;color:var(--rpv-text);margin-bottom:10px">' + title + '</div>' +
      '<div id="' + id + '" class="rpv-chart"></div>' +
      '<div style="font-size:10px;color:var(--rpv-dim);margin-top:6px;font-family:' + "'JetBrains Mono',monospace" + '">' + source + '</div></div>';
  }

  function build() {
    host.innerHTML =
      '<div class="rpv-grid rpv-grid-3">' +
        card("rpc-maturity", "Debt Maturities", "The $2.2T Maturity Wall ($B)", "Source: MBA") +
        card("rpc-treasury", "Live · FRED", "10-Yr Treasury Yield", "Source: FRED · DGS10 (live)") +
        card("rpc-sofr", "Live · FRED", "SOFR Term Averages", "Source: NY Fed SOFR (live)") +
        card("rpc-vacancy", "Vacancy", "CRE Vacancy by Sector (%)", "Source: CBRE · CoStar Q1 2026") +
        card("rpc-cap", "Cap Rates", "Cap Rate by Sector (%)", "Source: CBRE · Avison Young") +
        card("rpc-distress", "Distress", "Trophy Sales · % Below Peak", "Source: Public transaction records") +
      '</div>';

    // column — maturity wall (2026 highlighted gold = "the tsunami year")
    Highcharts.chart("rpc-maturity", baseOpts({
      xAxis: { categories: MATURITY_WALL.cats, lineColor: GRID, labels: { style: { color: MUTED } } },
      series: [{ type: "column", name: "Maturities", data: MATURITY_WALL.data.map(function (v, i) { return { y: v, color: i === 2 ? GOLD : BLUE }; }), borderRadius: 4, dataLabels: { enabled: true, format: "${y}B", style: { color: "#f0f2f5", fontFamily: MONO, textOutline: "none" } } }],
      tooltip: { pointFormat: "<b>${point.y}B</b> maturing" }
    }));

    // area — vacancy by sector
    Highcharts.chart("rpc-vacancy", baseOpts({
      xAxis: { categories: SECTOR_VACANCY.cats }, yAxis: { labels: { format: "{value}%" } },
      series: [{ type: "column", name: "Vacancy", data: SECTOR_VACANCY.data.map(function (v) { return { y: v, color: v > 10 ? RED : v > 6 ? AMBER : GREEN }; }), borderRadius: 4, dataLabels: { enabled: true, format: "{y}%", style: { color: "#f0f2f5", fontFamily: MONO, textOutline: "none" } } }],
      tooltip: { pointFormat: "<b>{point.y}%</b> vacancy" }
    }));

    // bar — cap rates
    Highcharts.chart("rpc-cap", baseOpts({
      xAxis: { categories: SECTOR_CAP.cats }, yAxis: { labels: { format: "{value}%" } },
      series: [{ type: "bar", name: "Cap rate", color: GOLD, data: SECTOR_CAP.data, borderRadius: 4, dataLabels: { enabled: true, format: "{y}%", style: { color: "#f0f2f5", fontFamily: MONO, textOutline: "none" } } }],
      tooltip: { pointFormat: "<b>{point.y}%</b> cap rate" }
    }));

    // bar — distress discounts (negative, red)
    Highcharts.chart("rpc-distress", baseOpts({
      xAxis: { categories: DISTRESS.cats }, yAxis: { labels: { format: "{value}%" }, max: 0 },
      series: [{ type: "bar", name: "Discount to peak", color: RED, data: DISTRESS.data, borderRadius: 4, dataLabels: { enabled: true, format: "{y}%", style: { color: RED, fontFamily: MONO, textOutline: "none" } } }],
      tooltip: { pointFormat: "<b>{point.y}%</b> below peak" }
    }));

    // line — live treasury + sofr (from WP FRED proxy; fallback to constants)
    drawRates(RATES_FALLBACK);
    fetch("/wp-json/reprime/v1/rates").then(function (r) { return r.json(); }).then(function (d) {
      if (d && (d.treasury || d.sofr)) drawRates({
        treasury: (d.treasury || RATES_FALLBACK.treasury),
        sofr: (d.sofr || RATES_FALLBACK.sofr)
      });
    }).catch(function () { /* keep fallback render */ });
  }

  function drawRates(d) {
    if (document.getElementById("rpc-treasury")) Highcharts.chart("rpc-treasury", baseOpts({
      xAxis: { categories: d.treasury.map(function (p) { return p.x; }) }, yAxis: { labels: { format: "{value}%" } },
      series: [{ type: "areaspline", name: "10Y", color: BRIGHT, fillOpacity: 0.15, data: d.treasury.map(function (p) { return p.y; }), marker: { enabled: true } }],
      tooltip: { pointFormat: "<b>{point.y}%</b>" }
    }));
    if (document.getElementById("rpc-sofr")) Highcharts.chart("rpc-sofr", baseOpts({
      xAxis: { categories: d.sofr.map(function (p) { return p.x; }) }, yAxis: { labels: { format: "{value}%" } },
      series: [{ type: "spline", name: "SOFR", color: TEAL, data: d.sofr.map(function (p) { return p.y; }), marker: { enabled: true } }],
      tooltip: { pointFormat: "<b>{point.y}%</b>" }
    }));
  }

  // ---- Skeleton until in view, then lazy build (never blocks load) -------
  host.innerHTML = '<div class="rpv-grid rpv-grid-3"><div class="rpv-skel"></div><div class="rpv-skel"></div><div class="rpv-skel"></div></div>';
  var io = new IntersectionObserver(function (e) {
    if (e[0].isIntersecting && window.Highcharts) { io.disconnect(); build(); reveal(); }
  }, { rootMargin: "200px" });
  io.observe(host);
  function reveal() { host.querySelectorAll(".rpv-rise").forEach(function (el, i) { setTimeout(function () { el.classList.add("rpv-in"); }, i * 70); }); }
})();
