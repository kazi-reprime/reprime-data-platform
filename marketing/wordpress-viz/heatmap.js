/* ============================================================================
   heatmap.js — U.S. CRE Heatmap  (TradingView stock-heatmap technique)
   ----------------------------------------------------------------------------
   Technique replicated (tradingview.com/heatmap/stock):
     • HTML5 CANVAS treemap (not SVG) — fast for many blocks, redraw on change
     • Squarified treemap layout via d3.treemap (Bruls algorithm)
     • Block AREA = sector exposure;  COLOR = a metric (cap rate OR vacancy)
       on a diverging HSL scale (TradingView's green↔red idea, in brand hues)
     • Hover tooltip (ticker/values) as a DOM overlay over the canvas
     • Toggle modes; the chosen mode is stored in the URL hash → shareable
       (window.location.hash = config, exactly like TradingView)
   Performance: lazy (IntersectionObserver), defer-loaded; canvas redraw only on
   toggle/resize (no animation loop). Depends on: window.d3 (d3 v7, enqueued).
   Data: REAL CBRE/CoStar Q1-2026 vacancy + indicative cap rates by sub-sector.
   ============================================================================ */
(function () {
  "use strict";
  var host = document.getElementById("reprime-heatmap");
  if (!host) return;
  host.innerHTML = '<div class="rpv-skel rpv-heatmap-host"></div>';

  var cv = function (n, f) { return (getComputedStyle(document.documentElement).getPropertyValue(n) || f).trim() || f; };
  var MUTED = cv("--rpv-muted", "#8a919c");

  // ---- REAL sector / sub-sector data ------------------------------------
  // size = relative U.S. market exposure (illustrative allocation weight);
  // vacancy = CBRE/CoStar Q1 2026; cap = indicative cap rate (CBRE/Avison Young)
  var SECTORS = [
    { name: "Multifamily", children: [
      { sub: "Class A", size: 14, cap: 5.3, vacancy: 5.6 }, { sub: "Class B", size: 16, cap: 5.8, vacancy: 4.8 }, { sub: "Class C", size: 9, cap: 6.4, vacancy: 4.2 }
    ]},
    { name: "Industrial", children: [
      { sub: "Warehouse", size: 15, cap: 6.0, vacancy: 7.5 }, { sub: "Flex", size: 6, cap: 6.6, vacancy: 8.4 }, { sub: "Cold Storage", size: 4, cap: 6.1, vacancy: 5.1 }
    ]},
    { name: "Retail", children: [
      { sub: "Grocery-Anchored", size: 11, cap: 6.5, vacancy: 3.9 }, { sub: "Power Center", size: 6, cap: 7.2, vacancy: 5.1 }, { sub: "Strip / Unanchored", size: 5, cap: 7.6, vacancy: 4.4 }
    ]},
    { name: "Office", children: [
      { sub: "CBD", size: 8, cap: 8.4, vacancy: 20.1 }, { sub: "Suburban", size: 7, cap: 8.0, vacancy: 17.2 }, { sub: "Medical Office", size: 5, cap: 6.9, vacancy: 9.3 }
    ]},
    { name: "Specialty", children: [
      { sub: "Self-Storage", size: 5, cap: 6.2, vacancy: 9.0 }, { sub: "Data Center", size: 4, cap: 6.8, vacancy: 3.1 }
    ]}
  ];

  var MODE = (location.hash.match(/mode=(cap|vacancy)/) || [])[1] || "vacancy"; // URL-hash state

  // ---- diverging color scales (brand hues) ------------------------------
  function clamp(t) { return Math.max(0, Math.min(1, t)); }
  function colorFor(d) {
    if (MODE === "vacancy") { // low vacancy = green (healthy), high = red (distress)
      var t = clamp((d.vacancy - 3) / (20 - 3)); var hue = (1 - t) * 140; // 140=green → 0=red
      return "hsl(" + hue + ",58%," + (40 - t * 8) + "%)";
    }
    var c = clamp((d.cap - 5) / (9 - 5)); // higher cap rate = more gold/amber (higher yield / more distress)
    return "hsl(" + (44 - c * 14) + "," + (55 + c * 20) + "%," + (38 + c * 10) + "%)";
  }

  function draw(canvas, root, dpr) {
    var ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.scale(dpr, dpr);
    // leaf blocks
    root.leaves().forEach(function (n) {
      var w = n.x1 - n.x0, h = n.y1 - n.y0;
      ctx.fillStyle = colorFor(n.data); ctx.fillRect(n.x0, n.y0, w - 2, h - 2);
      if (w > 60 && h > 30) {
        ctx.fillStyle = "rgba(6,14,28,.92)"; ctx.font = "700 11px 'Poppins',sans-serif"; ctx.fillText(n.data.sub, n.x0 + 7, n.y0 + 17);
        ctx.font = "700 13px 'JetBrains Mono',monospace";
        ctx.fillText(MODE === "vacancy" ? n.data.vacancy + "%" : n.data.cap + "%", n.x0 + 7, n.y0 + 34);
      }
    });
    // sector group labels (depth-1 parents)
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    root.children.forEach(function (s) {
      ctx.fillStyle = "rgba(255,255,255,.92)"; ctx.font = "700 12px 'Poppins',sans-serif";
      ctx.fillText(s.data.name.toUpperCase(), s.x0 + 2, s.y0 + 12);
    });
    ctx.setTransform(1, 0, 0, 1, 0, 0);
  }

  function layout(W, H) {
    var root = d3.hierarchy({ children: SECTORS.map(function (s) { return { name: s.name, children: s.children.map(function (c) { return Object.assign({ sector: s.name }, c); }) }; }) })
      .sum(function (d) { return d.size || 0; })
      .sort(function (a, b) { return b.value - a.value; });
    d3.treemap().size([W, H]).paddingInner(2).paddingTop(16).round(true)(root);
    return root;
  }

  function build() {
    if (!window.d3) { host.innerHTML = '<div class="rpv-glass rpv-glass-pad">Heatmap requires D3.</div>'; return; }
    host.innerHTML =
      '<div class="rpv-glass rpv-glass-pad rpv-rise rpv-in">' +
        '<div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;margin-bottom:14px">' +
          '<div><div class="rpv-eyebrow" style="margin-bottom:2px">Sector Map</div><div style="font-size:15px;font-weight:700;color:var(--rpv-text)">U.S. CRE Heatmap — block size = exposure, color = ' + (MODE === "vacancy" ? "vacancy" : "cap rate") + '</div></div>' +
          '<div><button class="rpv-btn" data-mode="vacancy">Vacancy</button> <button class="rpv-btn" data-mode="cap">Cap Rate</button></div>' +
        '</div>' +
        '<div class="rpv-canvas-host rpv-heatmap-host"><canvas style="width:100%;height:100%;display:block;border-radius:10px"></canvas></div>' +
        '<div style="display:flex;gap:14px;align-items:center;justify-content:flex-end;margin-top:10px;font-size:10px;color:var(--rpv-muted)"><span>' + (MODE === "vacancy" ? "Low vacancy" : "Lower cap") + '</span><span style="width:120px;height:8px;border-radius:4px;display:inline-block;background:linear-gradient(90deg,#2bbf6e,#d9b53d,#e0594a)"></span><span>' + (MODE === "vacancy" ? "High vacancy" : "Higher cap") + '</span></div>' +
      '</div>';

    var canvas = host.querySelector("canvas"), tip = host.querySelector(".rpv-tip") || (function () { var t = document.createElement("div"); t.className = "rpv-tip"; document.body.appendChild(t); return t; })();
    var root;
    function size() {
      var box = canvas.parentNode.getBoundingClientRect(), dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = box.width * dpr; canvas.height = box.height * dpr;
      root = layout(box.width, box.height); draw(canvas, root, dpr);
    }
    size();
    window.addEventListener("resize", size);

    // hover tooltip (DOM overlay)
    canvas.addEventListener("mousemove", function (e) {
      var box = canvas.getBoundingClientRect(), mx = e.clientX - box.left, my = e.clientY - box.top, hit = null;
      root.leaves().forEach(function (n) { if (mx >= n.x0 && mx <= n.x1 && my >= n.y0 && my <= n.y1) hit = n; });
      if (hit) { tip.style.display = "block"; tip.style.left = (e.clientX + 14) + "px"; tip.style.top = (e.clientY + 14) + "px"; tip.innerHTML = "<b>" + hit.data.sector + " · " + hit.data.sub + "</b><br>Cap rate: " + hit.data.cap + "%<br>Vacancy: " + hit.data.vacancy + "%<br>Exposure: " + hit.data.size + "%"; }
      else tip.style.display = "none";
    });
    canvas.addEventListener("mouseleave", function () { tip.style.display = "none"; });

    // mode toggle → recolor + URL-hash state
    host.querySelectorAll("[data-mode]").forEach(function (b) {
      b.classList.toggle("rpv-active", b.dataset.mode === MODE);
      b.addEventListener("click", function () {
        MODE = b.dataset.mode;
        history.replaceState(null, "", "#mode=" + MODE);
        build(); // rebuild header/legend + redraw with new mode
      });
    });
  }

  var io = new IntersectionObserver(function (e) { if (e[0].isIntersecting && window.d3) { io.disconnect(); build(); } }, { rootMargin: "200px" });
  io.observe(host);
})();
