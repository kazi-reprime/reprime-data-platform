/* RePrime data-visualization layer — stunning, reusable charts in the brand
   theme, inspired by TradingView (treemap heatmap), Kaspersky (live counters +
   activity), Cloudflare Radar (chart-card grid), Highcharts (donut/radar/gauge/
   bubble) and Observable (interactive marks).

   Renders into any anchor present on the page:
     #viz-counters #viz-heatmap #viz-donut #viz-radar #viz-ranked
     #viz-bubble #viz-gauge #viz-activity
   Uses Chart.js + D3 (loaded on demand from cdnjs). Reads our real data
   (/api/stats, Supabase coverage/datasets, /data/portfolio.json). Each
   component renders independently and degrades gracefully. */
(function () {
  "use strict";
  // Phase 2.3 — use centralized config; defensive fallback if not loaded.
  var CFG = window.RP_SB || { URL: "https://gugcmsqrscqqqltdtgkz.supabase.co", KEY: "sb_publishable_J5zIiHNf1VqpQ7r14SevFw__MbvlEpm" };
  var SB = CFG.URL;
  var KEY = CFG.KEY;
  var H = { apikey: KEY, Authorization: "Bearer " + KEY };
  var $ = function (id) { return document.getElementById(id); };
  var has = function (id) { return !!$(id); };
  var fmt = function (n) { return Number(n || 0).toLocaleString(); };
  function css(v, f) { return (getComputedStyle(document.documentElement).getPropertyValue(v) || f).trim() || f; }
  function palette() { return [css("--gold", "#BC9C45"), css("--blue", "#1D5FB8"), css("--bright", "#00A1FF"), css("--teal", "#009080"), css("--amber", "#FFBC7D"), css("--navy", "#0E3470"), css("--green", "#00A980"), css("--red", "#FF7474")]; }
  // Phase 2.10 — SRI map for known CDN scripts; dynamic loads of OTHER urls
  // pass without integrity (the map gates which scripts get verified).
  var SRI = {
    "https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.min.js":
      "sha384-bs/nf9FbdNouRbMiFcrcZfLXYPKiPaGVGplVbv7dLGECccEXDW+S3zjqSKR5ZEaD",
    "https://cdnjs.cloudflare.com/ajax/libs/d3/7.9.0/d3.min.js":
      "sha384-CjloA8y00+1SDAUkjs099PVfnY2KmDC2BZnws9kh8D/lX1s46w6EPhpXdqMfjK6i"
  };
  function load(src) {
    return new Promise(function (res) {
      var s = document.createElement("script"); s.src = src;
      if (SRI[src]) { s.integrity = SRI[src]; s.crossOrigin = "anonymous"; s.referrerPolicy = "no-referrer"; }
      s.onload = res; s.onerror = res; document.head.appendChild(s);
    });
  }
  function getJSON(u, opts) { return fetch(u, opts).then(function (r) { return r.json(); }).catch(function () { return null; }); }
  function sb(path) { return getJSON(SB + "/rest/v1/" + path, { headers: H }); }

  var CAT_LABEL = {
    economic: "Economic", demographic: "Demographics", housing_re: "Housing & RE",
    hazard_environmental: "Hazard & Env", infrastructure: "Infrastructure",
    capital_markets: "Capital Markets", other: "Other", insurance_climate: "Insurance",
    zoning_parcel: "Zoning & Parcel", news_sentiment: "News", israeli: "Israeli",
    construction_pipeline: "Construction", macro_indicator: "Macro", energy: "Energy"
  };
  var lab = function (k) { return CAT_LABEL[k] || String(k).replace(/_/g, " "); };

  /* ---------- shared card chrome ---------- */
  function tools() {
    var b = 'background:var(--surface);border:1px solid var(--border);border-radius:8px;color:var(--muted);font-family:inherit;font-size:11px;font-weight:600;padding:6px 10px;cursor:pointer;transition:.2s';
    return '<div style="display:flex;gap:6px;flex-shrink:0">' +
      '<button onclick="__rpExport(this)" title="Download as image" style="' + b + '">⤓ Export</button>' +
      '<button onclick="__rpShare(this)" title="Copy shareable link" style="' + b + '">⎘ Share</button></div>';
  }
  function block(el, label, title, bodyHTML, h) {
    el.innerHTML =
      '<div style="max-width:1280px;margin:56px auto 0">' +
      '<div style="display:flex;justify-content:space-between;align-items:flex-end;gap:12px;margin-bottom:18px;flex-wrap:wrap">' +
      '<div><div style="font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.1em;color:var(--gold);margin-bottom:8px">' + label + '</div>' +
      '<div style="font-size:clamp(22px,3vw,30px);font-weight:700;color:var(--text);line-height:1.15">' + title + '</div></div>' +
      tools() + '</div>' +
      '<div class="rp-glass rp-rise" style="padding:20px' + (h ? ';min-height:' + h + 'px' : "") + '">' + bodyHTML + '</div></div>';
    reveal();
  }
  window.__rpExport = function (btn) {
    var box = btn.parentNode.parentNode.parentNode; // toolbar -> header row -> container
    var cv = box.querySelector("canvas"), svg = box.querySelector("svg"), a = document.createElement("a");
    if (cv) { try { a.download = "reprime-chart.png"; a.href = cv.toDataURL("image/png"); a.click(); } catch (e) { } }
    else if (svg) { var xml = new XMLSerializer().serializeToString(svg); var url = URL.createObjectURL(new Blob([xml], { type: "image/svg+xml" })); a.download = "reprime-chart.svg"; a.href = url; a.click(); setTimeout(function () { URL.revokeObjectURL(url); }, 1000); }
    else { __rpShare(btn); }
  };
  window.__rpShare = function (btn) { var t = btn.textContent; try { navigator.clipboard.writeText(location.href); btn.textContent = "✓ Copied"; setTimeout(function () { btn.textContent = t; }, 1500); } catch (e) { } };
  function chartCanvas(id, height) { return '<div style="position:relative;height:' + (height || 320) + 'px"><canvas id="' + id + '"></canvas></div>'; }
  var _obs;
  function reveal() {
    if (!_obs) _obs = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); _obs.unobserve(e.target); } }); }, { threshold: .08, rootMargin: "0px 0px -40px 0px" });
    document.querySelectorAll(".rp-rise:not(.in)").forEach(function (el) { _obs.observe(el); });
  }

  function chartDefaults() {
    if (!window.Chart) return;
    window.Chart.defaults.color = css("--muted", "#8a919c");
    window.Chart.defaults.borderColor = css("--border", "rgba(188,156,69,.1)");
    window.Chart.defaults.font.family = "'Poppins',Arial,sans-serif";
  }

  /* ---------- KASPERSKY-style live counters ---------- */
  function animateCount(el, target) {
    var start = 0, t0 = performance.now(), dur = 1400;
    function step(now) {
      var p = Math.min((now - t0) / dur, 1), e = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt(Math.floor(e * target));
      if (p < 1) requestAnimationFrame(step); else el.textContent = fmt(target);
    }
    requestAnimationFrame(step);
  }
  function renderCounters(el, d) {
    var items = [
      { k: "records", l: "Records Ingested", c: "var(--gold)" },
      { k: "sources", l: "Sources Cataloged", c: "var(--bright)" },
      { k: "datasets", l: "Live Datasets", c: "var(--green)" },
      { k: "categories", l: "Categories", c: "var(--teal)" },
      { k: "layers", l: "Live Search Layers", c: "var(--amber)" }
    ];
    var cells = items.map(function (i) {
      return '<div style="flex:1;min-width:150px;text-align:center;padding:10px 8px">' +
        '<div style="display:flex;align-items:center;justify-content:center;gap:6px;margin-bottom:6px"><span style="width:6px;height:6px;border-radius:50%;background:' + i.c + ';box-shadow:0 0 8px ' + i.c + ';animation:vizpulse 2s infinite"></span><span style="font-size:10px;text-transform:uppercase;letter-spacing:.08em;color:var(--muted)">' + i.l + '</span></div>' +
        '<div id="vc-' + i.k + '" style="font-family:\'JetBrains Mono\',monospace;font-size:clamp(22px,3.2vw,34px);font-weight:800;color:' + i.c + '">0</div></div>';
    }).join('<div style="width:1px;background:var(--border);align-self:stretch"></div>');
    el.innerHTML =
      '<style>@keyframes vizpulse{0%,100%{opacity:.4;transform:scale(.85)}50%{opacity:1;transform:scale(1.25)}}</style>' +
      '<div class="rp-glass rp-rise" style="max-width:1280px;margin:56px auto 0;overflow:hidden">' +
      '<div style="display:flex;align-items:center;justify-content:space-between;padding:14px 20px;border-bottom:1px solid var(--border)">' +
      '<div style="font-size:12px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:var(--gold)">⚡ Live Data Warehouse</div>' +
      '<span style="display:inline-flex;align-items:center;gap:5px;font-size:10px;font-weight:600;color:var(--green);text-transform:uppercase;letter-spacing:.06em"><span style="width:5px;height:5px;border-radius:50%;background:var(--green);animation:vizpulse 2s infinite"></span>Live · Supabase</span></div>' +
      '<div style="display:flex;flex-wrap:wrap;padding:8px 12px">' + cells + '</div></div>';
    animateCount($("vc-records"), d.records); animateCount($("vc-sources"), d.sources);
    animateCount($("vc-datasets"), d.datasets); animateCount($("vc-categories"), d.categories);
    animateCount($("vc-layers"), d.layers);
    reveal();
  }

  /* ---------- TRADINGVIEW-style treemap heatmap (D3) ---------- */
  function heatColor(ratio) {
    // low coverage -> red, mid -> amber, high -> green
    var r = Math.max(0, Math.min(1, ratio));
    var red = [255, 116, 116], amb = [255, 188, 125], grn = [0, 169, 128];
    function mix(a, b, t) { return [Math.round(a[0] + (b[0] - a[0]) * t), Math.round(a[1] + (b[1] - a[1]) * t), Math.round(a[2] + (b[2] - a[2]) * t)]; }
    var c = r < 0.5 ? mix(red, amb, r / 0.5) : mix(amb, grn, (r - 0.5) / 0.5);
    return "rgb(" + c[0] + "," + c[1] + "," + c[2] + ")";
  }
  function renderHeatmap(el, nodes) {
    if (!window.d3 || !nodes.length) return;
    var W = Math.min(1240, (el.clientWidth || 1240) - 42), Hh = 460;
    block(el, "Coverage Map", "Data warehouse — by category", '<div id="viz-treemap-svg"></div><div style="display:flex;gap:16px;align-items:center;justify-content:flex-end;margin-top:10px;font-size:10px;color:var(--muted)"><span>Coverage</span><span style="width:90px;height:8px;border-radius:4px;background:linear-gradient(90deg,#FF7474,#FFBC7D,#00A980);display:inline-block"></span><span>Low → High</span></div>');
    var host = $("viz-treemap-svg");
    var root = window.d3.hierarchy({ children: nodes }).sum(function (n) { return n.value; }).sort(function (a, b) { return b.value - a.value; });
    window.d3.treemap().size([W, Hh]).paddingInner(3)(root);
    var svg = window.d3.select(host).append("svg").attr("width", "100%").attr("viewBox", "0 0 " + W + " " + Hh).style("font-family", "'Poppins',Arial,sans-serif");
    var g = svg.selectAll("g").data(root.leaves()).enter().append("g").attr("transform", function (d) { return "translate(" + d.x0 + "," + d.y0 + ")"; });
    g.append("rect")
      .attr("width", function (d) { return d.x1 - d.x0; })
      .attr("height", function (d) { return d.y1 - d.y0; })
      .attr("rx", 6).attr("fill", function (d) { return heatColor(d.data.ratio); }).attr("fill-opacity", 0.88)
      .append("title").text(function (d) { return d.data.name + " — " + fmt(d.data.value) + " sources · " + Math.round(d.data.ratio * 100) + "% live API"; });
    g.append("text").attr("x", 8).attr("y", 18).attr("fill", "#06121f").style("font-size", "12px").style("font-weight", "700")
      .text(function (d) { return (d.x1 - d.x0) > 70 ? d.data.name : ""; });
    g.append("text").attr("x", 8).attr("y", 34).attr("fill", "rgba(6,18,31,.75)").style("font-size", "11px").style("font-weight", "600")
      .text(function (d) { return (d.x1 - d.x0) > 70 && (d.y1 - d.y0) > 40 ? fmt(d.data.value) : ""; });
  }

  /* ---------- CLOUDFLARE-style donut ---------- */
  function renderDonut(el, entries) {
    block(el, "Distribution", "Sources by category", chartCanvas("viz-donut-c", 320));
    var top = entries.slice(0, 8), pal = palette();
    new window.Chart($("viz-donut-c"), {
      type: "doughnut",
      data: { labels: top.map(function (e) { return lab(e[0]); }), datasets: [{ data: top.map(function (e) { return e[1]; }), backgroundColor: top.map(function (_, i) { return pal[i % pal.length]; }), borderColor: css("--card-bg", "#0a0d14"), borderWidth: 2 }] },
      options: { responsive: true, maintainAspectRatio: false, cutout: "62%", plugins: { legend: { position: "right", labels: { boxWidth: 12, font: { size: 11 } } } } }
    });
  }

  /* ---------- coverage radar ---------- */
  function renderRadar(el, cov) {
    block(el, "Coverage", "Live-API coverage by category", chartCanvas("viz-radar-c", 360));
    var top = cov.slice(0, 8), gold = css("--gold", "#BC9C45");
    new window.Chart($("viz-radar-c"), {
      type: "radar",
      data: { labels: top.map(function (c) { return lab(c.category); }), datasets: [{ label: "% live API", data: top.map(function (c) { return c.sources ? Math.round((c.live_api / c.sources) * 100) : 0; }), borderColor: gold, backgroundColor: "rgba(188,156,69,.18)", pointBackgroundColor: gold }] },
      options: { responsive: true, maintainAspectRatio: false, scales: { r: { suggestedMin: 0, suggestedMax: 100, angleLines: { color: css("--border", "rgba(255,255,255,.1)") }, grid: { color: css("--border", "rgba(255,255,255,.1)") }, pointLabels: { font: { size: 10 } } } }, plugins: { legend: { display: false } } }
    });
  }

  /* ---------- CLOUDFLARE-style ranked bars ---------- */
  function renderRanked(el, entries) {
    var top = entries.slice(0, 10), max = Math.max.apply(null, top.map(function (e) { return e[1]; }).concat(1)), pal = palette();
    var rows = top.map(function (e, i) {
      var pct = Math.round((e[1] / max) * 100);
      return '<div style="display:flex;align-items:center;gap:12px;margin-bottom:9px">' +
        '<div style="width:130px;text-align:right;font-size:12px;color:var(--muted)">' + lab(e[0]) + '</div>' +
        '<div style="flex:1;background:var(--surface);border-radius:6px;height:22px;overflow:hidden"><div style="height:100%;width:' + pct + '%;background:' + pal[i % pal.length] + ';border-radius:6px;transition:width 1s ease-out"></div></div>' +
        '<div style="width:56px;font-family:\'JetBrains Mono\',monospace;font-weight:700;color:var(--text);font-size:13px">' + fmt(e[1]) + '</div></div>';
    }).join("");
    block(el, "Leaderboard", "Top categories by source count", rows);
  }

  /* ---------- OBSERVABLE/Highcharts-style deal bubble ---------- */
  function renderBubble(el, deals) {
    block(el, "Portfolio", "Deal map — cap rate × DSCR (sample)", chartCanvas("viz-bubble-c", 360));
    var pal = palette();
    var pts = deals.map(function (d, i) {
      return { x: d.cap, y: d.dscr, r: Math.max(6, Math.min(40, d.value / 3)), label: d.name, _c: pal[i % pal.length] };
    });
    new window.Chart($("viz-bubble-c"), {
      type: "bubble",
      data: { datasets: pts.map(function (p) { return { label: p.label, data: [p], backgroundColor: p._c + "cc", borderColor: p._c }; }) },
      options: {
        responsive: true, maintainAspectRatio: false,
        scales: { x: { title: { display: true, text: "Cap rate %" }, grid: { color: css("--border", "rgba(255,255,255,.08)") } }, y: { title: { display: true, text: "DSCR (x)" }, grid: { color: css("--border", "rgba(255,255,255,.08)") } } },
        plugins: { legend: { position: "bottom", labels: { boxWidth: 10, font: { size: 10 } } }, tooltip: { callbacks: { label: function (c) { return c.dataset.label + " · cap " + c.raw.x + "% · DSCR " + c.raw.y; } } } }
      }
    });
  }

  /* ---------- solid gauge (Chart.js doughnut) ---------- */
  function renderGauge(el, pct) {
    block(el, "Live Coverage", "Sources returning live API data", chartCanvas("viz-gauge-c", 240) + '<div style="text-align:center;margin-top:-150px;font-family:\'JetBrains Mono\',monospace;font-size:40px;font-weight:800;color:var(--gold)">' + pct + '%</div>');
    var gold = css("--gold", "#BC9C45");
    new window.Chart($("viz-gauge-c"), {
      type: "doughnut",
      data: { datasets: [{ data: [pct, 100 - pct], backgroundColor: [gold, css("--surface", "rgba(255,255,255,.06)")], borderWidth: 0, circumference: 180, rotation: 270 }] },
      options: { responsive: true, maintainAspectRatio: false, cutout: "78%", plugins: { legend: { display: false }, tooltip: { enabled: false } } }
    });
  }

  /* ---------- Kaspersky-style activity stream ---------- */
  function renderActivity(el, datasets) {
    var rows = datasets.slice(0, 12).map(function (x) {
      return '<div style="display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid var(--border)">' +
        '<span style="width:6px;height:6px;border-radius:50%;background:var(--green);box-shadow:0 0 6px var(--green)"></span>' +
        '<span style="flex:1;font-size:12px;color:var(--text2,var(--text));overflow:hidden;text-overflow:ellipsis;white-space:nowrap">' + (x.name || "source") + '</span>' +
        '<span style="font-size:10px;color:var(--muted)">' + lab(x.category || "") + '</span>' +
        '<span style="font-family:\'JetBrains Mono\',monospace;font-size:12px;font-weight:700;color:var(--green)">' + fmt(x.record_count) + '</span></div>';
    }).join("");
    block(el, "Live Feed", "Most recent ingested datasets", rows || '<div style="color:var(--muted);font-size:12px">Feed unavailable.</div>');
  }

  /* ---------- stacked bar: sources vs live API ---------- */
  function renderStacked(el, cov) {
    block(el, "Coverage Depth", "Total sources vs. live APIs", chartCanvas("viz-stacked-c", 340));
    var top = cov.slice().sort(function (a, b) { return b.sources - a.sources; }).slice(0, 12);
    new window.Chart($("viz-stacked-c"), {
      type: "bar",
      data: { labels: top.map(function (c) { return lab(c.category); }), datasets: [
        { label: "Live API", data: top.map(function (c) { return c.live_api; }), backgroundColor: css("--green", "#00A980"), borderRadius: 4 },
        { label: "Other sources", data: top.map(function (c) { return Math.max(0, c.sources - c.live_api); }), backgroundColor: css("--blue", "#1D5FB8"), borderRadius: 4 }
      ] },
      options: { responsive: true, maintainAspectRatio: false, scales: { x: { stacked: true, grid: { display: false }, ticks: { font: { size: 10 } } }, y: { stacked: true, grid: { color: css("--border", "rgba(255,255,255,.08)") } } }, plugins: { legend: { position: "bottom", labels: { boxWidth: 12, font: { size: 11 } } } } }
    });
  }

  /* ---------- polar area: category mix ---------- */
  function renderPolar(el, entries) {
    block(el, "Category Mix", "Source distribution (polar)", chartCanvas("viz-polar-c", 340));
    var top = entries.slice(0, 8), pal = palette();
    new window.Chart($("viz-polar-c"), {
      type: "polarArea",
      data: { labels: top.map(function (e) { return lab(e[0]); }), datasets: [{ data: top.map(function (e) { return e[1]; }), backgroundColor: top.map(function (_, i) { return pal[i % pal.length] + "cc"; }) }] },
      options: { responsive: true, maintainAspectRatio: false, scales: { r: { grid: { color: css("--border", "rgba(255,255,255,.1)") }, ticks: { display: false } } }, plugins: { legend: { position: "right", labels: { boxWidth: 12, font: { size: 10 } } } } }
    });
  }

  /* ---------- category landscape (bubble) ---------- */
  function renderCatBubble(el, cov) {
    block(el, "Landscape", "Categories — scale × live coverage", chartCanvas("viz-catbubble-c", 360));
    var pal = palette();
    var pts = cov.slice(0, 14).map(function (c, i) { return { label: lab(c.category), x: c.sources, y: c.sources ? Math.round(c.live_api / c.sources * 100) : 0, r: Math.max(6, Math.min(46, c.sources / 5)), _c: pal[i % pal.length] }; });
    new window.Chart($("viz-catbubble-c"), {
      type: "bubble",
      data: { datasets: pts.map(function (p) { return { label: p.label, data: [p], backgroundColor: p._c + "cc", borderColor: p._c }; }) },
      options: { responsive: true, maintainAspectRatio: false, scales: { x: { title: { display: true, text: "Total sources" }, grid: { color: css("--border", "rgba(255,255,255,.08)") } }, y: { title: { display: true, text: "% live API" }, grid: { color: css("--border", "rgba(255,255,255,.08)") } } }, plugins: { legend: { display: false }, tooltip: { callbacks: { label: function (c) { return c.dataset.label + " · " + c.raw.x + " src · " + c.raw.y + "% live"; } } } } }
    });
  }

  /* ---------- treasury yields ---------- */
  function renderYields(el, t) {
    var y = t && t.yields; if (!y) return;
    var keys = Object.keys(y);
    block(el, "Rates", "U.S. Treasury average yields", chartCanvas("viz-yields-c", 300));
    new window.Chart($("viz-yields-c"), {
      type: "bar",
      data: { labels: keys.map(function (k) { return k.replace("Treasury ", "").replace("Inflation-Indexed ", "TIPS "); }), datasets: [{ data: keys.map(function (k) { return y[k]; }), backgroundColor: css("--gold", "#BC9C45"), borderRadius: 6 }] },
      options: { indexAxis: "y", responsive: true, maintainAspectRatio: false, scales: { x: { grid: { color: css("--border", "rgba(255,255,255,.08)") }, ticks: { callback: function (v) { return v + "%"; } } }, y: { grid: { display: false }, ticks: { font: { size: 10 } } } }, plugins: { legend: { display: false } } }
    });
  }

  /* ---------- benchmark rates (SOFR/EFFR) ---------- */
  function renderRates(el, s) {
    if (!s) return;
    var items = [["SOFR 30D", s.sofr_30d_avg], ["SOFR 90D", s.sofr_90d_avg], ["SOFR 180D", s.sofr_180d_avg], ["EFFR", s.effr], ["OBFR", s.obfr]];
    var cards = items.filter(function (i) { return i[1] != null; }).map(function (i) {
      return '<div class="rp-glass" style="flex:1;min-width:120px;padding:16px;text-align:center"><div style="font-family:\'JetBrains Mono\',monospace;font-size:26px;font-weight:800;color:var(--gold)">' + Number(i[1]).toFixed(2) + '%</div><div style="font-size:10px;color:var(--muted);text-transform:uppercase;letter-spacing:.06em;margin-top:4px">' + i[0] + '</div></div>';
    }).join("");
    block(el, "Benchmark Rates", "SOFR & federal funds", '<div style="display:flex;gap:12px;flex-wrap:wrap">' + cards + '</div>');
  }

  /* ---------- KPI metric strip ---------- */
  function renderKpis(el, kpis) {
    if (!kpis.length) return;
    var cards = kpis.map(function (k) {
      return '<div class="rp-glass" style="flex:1;min-width:150px;padding:20px;text-align:center"><div style="font-family:\'JetBrains Mono\',monospace;font-size:clamp(24px,3vw,34px);font-weight:800;color:var(--gold)">' + k.v + '</div><div style="font-size:11px;color:var(--muted);text-transform:uppercase;letter-spacing:.05em;margin-top:6px">' + k.l + '</div></div>';
    }).join("");
    block(el, "At a Glance", "Platform metrics", '<div style="display:flex;gap:12px;flex-wrap:wrap">' + cards + '</div>');
  }

  /* ---------- orchestration ---------- */
  var ALL = ["viz-counters", "viz-heatmap", "viz-donut", "viz-radar", "viz-ranked", "viz-bubble", "viz-gauge", "viz-activity", "viz-stacked", "viz-polar", "viz-catbubble", "viz-yields", "viz-rates", "viz-kpis"];
  function skel(id) {
    var e = $(id); if (!e || e.children.length) return;
    var h = (id === "viz-counters" || id === "viz-kpis" || id === "viz-rates") ? 110 : 320;
    e.innerHTML = '<div style="max-width:1280px;margin:56px auto 0"><div class="rp-skel" style="height:' + h + 'px"></div></div>';
  }
  function init() {
    if (!ALL.some(has)) return;
    ALL.forEach(skel);
    var needChart = ["viz-donut", "viz-radar", "viz-bubble", "viz-gauge", "viz-stacked", "viz-polar", "viz-catbubble", "viz-yields"].some(has);
    var needD3 = has("viz-heatmap");
    var libs = [];
    if (needChart && !window.Chart) libs.push(load("https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.min.js"));
    if (needD3 && !window.d3) libs.push(load("https://cdnjs.cloudflare.com/ajax/libs/d3/7.9.0/d3.min.js"));

    var P = {
      stats: getJSON("/api/stats"),
      cov: sb("v_coverage?select=category,sources,live_api"),
      ds: sb("v_latest_source_data?select=name,category,record_count,fetched_at&status=eq.ok&order=record_count.desc&limit=40"),
      recs: fetch(SB + "/rest/v1/data_records?select=count", { headers: Object.assign({ Prefer: "count=exact" }, H) }).then(function (r) { return r.json(); }).then(function (j) { return (j && j[0] && j[0].count) || 0; }).catch(function () { return 0; }),
      port: getJSON("/data/portfolio.json"),
      treasury: getJSON("/data/market/treasury.json"),
      sofr: getJSON("/data/market/sofr.json"),
      rep: getJSON("/data/reprime.json"),
      cat: getJSON("/data/sources_all.json")
    };

    Promise.all([Promise.all(libs), P.stats, P.cov, P.ds, P.recs, P.port, P.treasury, P.sofr, P.rep, P.cat]).then(function (r) {
      var stats = r[1] || {}, cov = r[2] || [], ds = r[3] || [], recs = r[4] || 0, port = r[5] || {}, treasury = r[6] || {}, sofr = r[7] || {}, rep = r[8] || {}, catData = r[9] || {};
      chartDefaults();
      var byCat = stats.by_category || {};
      var entries = Object.keys(byCat).map(function (k) { return [k, byCat[k]]; }).sort(function (a, b) { return b[1] - a[1]; });
      // Full catalog total (1,900+) from the static registry — the source of truth shown site-wide
      var catalog = ((catData && (catData.sources || catData)) || []).length || stats.cataloged_sources || 630;
      function safe(id, fn) { if (!has(id)) return; try { fn(); } catch (e) { /* one component failing never kills the others */ } }

      safe("viz-counters", function () {
        renderCounters($("viz-counters"), {
          records: recs || ds.reduce(function (a, x) { return a + (+x.record_count || 0); }, 0),
          sources: catalog,
          datasets: ds.length, categories: stats.category_count || entries.length, layers: stats.live_search_layers || 20
        });
      });
      safe("viz-heatmap", function () {
        if (!window.d3) return;
        var nodes = cov.length
          ? cov.map(function (c) { return { name: lab(c.category), value: +c.sources || 1, ratio: c.sources ? (c.live_api / c.sources) : 0.5 }; })
          : entries.map(function (e) { return { name: lab(e[0]), value: e[1], ratio: 0.5 }; });
        renderHeatmap($("viz-heatmap"), nodes);
      });
      safe("viz-donut", function () { if (window.Chart) renderDonut($("viz-donut"), entries); });
      safe("viz-radar", function () { if (window.Chart) renderRadar($("viz-radar"), cov.length ? cov.slice().sort(function (a, b) { return b.sources - a.sources; }) : entries.map(function (e) { return { category: e[0], sources: e[1], live_api: Math.round(e[1] / 2) }; })); });
      safe("viz-ranked", function () { renderRanked($("viz-ranked"), entries); });
      safe("viz-gauge", function () {
        if (!window.Chart) return;
        var tot = cov.reduce(function (a, c) { return a + (+c.sources || 0); }, 0), liv = cov.reduce(function (a, c) { return a + (+c.live_api || 0); }, 0);
        renderGauge($("viz-gauge"), tot ? Math.round((liv / tot) * 100) : 0);
      });
      safe("viz-activity", function () { renderActivity($("viz-activity"), ds); });
      safe("viz-bubble", function () {
        if (!window.Chart) return;
        var deals = (port.deals || []).map(function (d) {
          return { name: (d.name || "").replace("The ", ""), cap: parseFloat(String(d.cap || "0")) || 0, dscr: parseFloat(String(d.dscr || "0")) || 0, value: parseFloat(String(d.value || "0").replace(/[^0-9.]/g, "")) || 10 };
        }).filter(function (d) { return d.cap && d.dscr; });
        if (deals.length) renderBubble($("viz-bubble"), deals);
      });
      safe("viz-stacked", function () { if (window.Chart && cov.length) renderStacked($("viz-stacked"), cov); });
      safe("viz-polar", function () { if (window.Chart) renderPolar($("viz-polar"), entries); });
      safe("viz-catbubble", function () { if (window.Chart && cov.length) renderCatBubble($("viz-catbubble"), cov); });
      safe("viz-yields", function () { if (window.Chart) renderYields($("viz-yields"), treasury); });
      safe("viz-rates", function () { renderRates($("viz-rates"), sofr); });
      safe("viz-kpis", function () {
        var k = [];
        (((rep.terminal || {}).track_record) || (rep.stats) || []).forEach(function (s) { k.push({ v: s.v || s.value, l: s.l || s.label }); });
        if (recs) k.unshift({ v: fmt(recs), l: "Records Ingested" });
        k.push({ v: fmt(catalog), l: "Sources Cataloged" });
        renderKpis($("viz-kpis"), k.slice(0, 6));
      });

      // live, moving: refresh the counters periodically
      if (has("viz-counters")) setInterval(function () {
        Promise.all([getJSON("/api/stats"), P.recs && fetch(SB + "/rest/v1/data_records?select=count", { headers: Object.assign({ Prefer: "count=exact" }, H) }).then(function (x) { return x.json(); }).then(function (j) { return (j && j[0] && j[0].count) || recs; }).catch(function () { return recs; })]).then(function (rr) {
          var st = rr[0] || stats, rc = rr[1] || recs;
          try {
            renderCounters($("viz-counters"), { records: rc, sources: catalog, datasets: ds.length, categories: st.category_count || entries.length, layers: st.live_search_layers || 20 });
          } catch (e) { }
        });
      }, 60000);
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
