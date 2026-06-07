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
  var SB = "https://gugcmsqrscqqqltdtgkz.supabase.co";
  var KEY = "sb_publishable_J5zIiHNf1VqpQ7r14SevFw__MbvlEpm";
  var H = { apikey: KEY, Authorization: "Bearer " + KEY };
  var $ = function (id) { return document.getElementById(id); };
  var has = function (id) { return !!$(id); };
  var fmt = function (n) { return Number(n || 0).toLocaleString(); };
  function css(v, f) { return (getComputedStyle(document.documentElement).getPropertyValue(v) || f).trim() || f; }
  function palette() { return [css("--gold", "#BC9C45"), css("--blue", "#1D5FB8"), css("--bright", "#00A1FF"), css("--teal", "#009080"), css("--amber", "#FFBC7D"), css("--navy", "#0E3470"), css("--green", "#00A980"), css("--red", "#FF7474")]; }
  function load(src) { return new Promise(function (res) { var s = document.createElement("script"); s.src = src; s.onload = res; s.onerror = res; document.head.appendChild(s); }); }
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
  function block(el, label, title, bodyHTML, h) {
    el.innerHTML =
      '<div style="max-width:1280px;margin:64px auto 0">' +
      '<div style="font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.1em;color:var(--gold);margin-bottom:8px">' + label + '</div>' +
      '<div style="font-size:clamp(22px,3vw,30px);font-weight:700;color:var(--text);line-height:1.15;margin-bottom:18px">' + title + '</div>' +
      '<div style="background:var(--card-bg);border:1px solid var(--border);border-radius:16px;padding:20px' + (h ? ';min-height:' + h + 'px' : "") + '">' + bodyHTML + '</div></div>';
  }
  function chartCanvas(id, height) { return '<div style="position:relative;height:' + (height || 320) + 'px"><canvas id="' + id + '"></canvas></div>'; }

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
      '<div style="max-width:1280px;margin:64px auto 0;background:var(--card-bg);border:1px solid var(--border);border-radius:16px;overflow:hidden">' +
      '<div style="display:flex;align-items:center;justify-content:space-between;padding:14px 20px;border-bottom:1px solid var(--border)">' +
      '<div style="font-size:12px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:var(--gold)">⚡ Live Data Warehouse</div>' +
      '<span style="display:inline-flex;align-items:center;gap:5px;font-size:10px;font-weight:600;color:var(--green);text-transform:uppercase;letter-spacing:.06em"><span style="width:5px;height:5px;border-radius:50%;background:var(--green);animation:vizpulse 2s infinite"></span>Live · Supabase</span></div>' +
      '<div style="display:flex;flex-wrap:wrap;padding:8px 12px">' + cells + '</div></div>';
    animateCount($("vc-records"), d.records); animateCount($("vc-sources"), d.sources);
    animateCount($("vc-datasets"), d.datasets); animateCount($("vc-categories"), d.categories);
    animateCount($("vc-layers"), d.layers);
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

  /* ---------- orchestration ---------- */
  function init() {
    var need = ["viz-counters", "viz-heatmap", "viz-donut", "viz-radar", "viz-ranked", "viz-bubble", "viz-gauge", "viz-activity"].some(has);
    if (!need) return;
    var needChart = ["viz-donut", "viz-radar", "viz-bubble", "viz-gauge"].some(has);
    var needD3 = has("viz-heatmap");
    var libs = [];
    if (needChart && !window.Chart) libs.push(load("https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.min.js"));
    if (needD3 && !window.d3) libs.push(load("https://cdnjs.cloudflare.com/ajax/libs/d3/7.9.0/d3.min.js"));

    var P = {
      stats: getJSON("/api/stats"),
      cov: sb("v_coverage?select=category,sources,live_api"),
      ds: sb("v_latest_source_data?select=name,category,record_count,fetched_at&status=eq.ok&order=record_count.desc&limit=40"),
      recs: fetch(SB + "/rest/v1/data_records?select=count", { headers: Object.assign({ Prefer: "count=exact" }, H) }).then(function (r) { return r.json(); }).then(function (j) { return (j && j[0] && j[0].count) || 0; }).catch(function () { return 0; }),
      port: getJSON("/data/portfolio.json")
    };

    Promise.all([Promise.all(libs), P.stats, P.cov, P.ds, P.recs, P.port]).then(function (r) {
      var stats = r[1] || {}, cov = r[2] || [], ds = r[3] || [], recs = r[4] || 0, port = r[5] || {};
      chartDefaults();
      var byCat = stats.by_category || {};
      var entries = Object.keys(byCat).map(function (k) { return [k, byCat[k]]; }).sort(function (a, b) { return b[1] - a[1]; });
      function safe(id, fn) { if (!has(id)) return; try { fn(); } catch (e) { /* one component failing never kills the others */ } }

      safe("viz-counters", function () {
        renderCounters($("viz-counters"), {
          records: recs || ds.reduce(function (a, x) { return a + (+x.record_count || 0); }, 0),
          sources: stats.cataloged_sources || cov.reduce(function (a, c) { return a + (+c.sources || 0); }, 0),
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
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
