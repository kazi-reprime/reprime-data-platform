/* ============================================================================
   deal-analyzer.js — Reactive Deal Analyzer  (Observable Plot technique)
   ----------------------------------------------------------------------------
   Technique replicated (observablehq.com):
     • Observable Plot grammar-of-graphics (Plot.plot / Plot.barY / Plot.line…)
     • Reactive cells: change any input → every dependent chart re-renders
       instantly (the spreadsheet-style dataflow Observable is built on)
     • SVG output, easily themed via CSS
   This is RePrime's real Seller-Mezzanine model (from the Terminal deal analyzer):
     interest-only mezz with balloon at maturity → dramatic cash-on-cash lift.
   Performance: lazy (IntersectionObserver), defer-loaded, never blocks page.
   Defaults are RePrime's published example ($10M retail, 8.5% cap, 75% LTV,
   20% mezz @ 5%). Depends on: window.Plot (@observablehq/plot UMD, enqueued).
   ============================================================================ */
(function () {
  "use strict";
  var host = document.getElementById("reprime-analyzer");
  if (!host) return;
  host.innerHTML = '<div class="rpv-skel" style="min-height:420px"></div>';

  var cv = function (n, f) { return (getComputedStyle(document.documentElement).getPropertyValue(n) || f).trim() || f; };
  var GOLD = cv("--rpv-gold", "#BC9C45"), BLUE = cv("--rpv-blue", "#1D5FB8"), TEAL = cv("--rpv-teal", "#009080"),
      RED = cv("--rpv-red", "#FF7474"), GREEN = cv("--rpv-green", "#00A980"), MUTED = cv("--rpv-muted", "#8a919c");

  // ---- reactive state (RePrime published example defaults) ---------------
  var S = { price: 10, noi: 0.85, ltv: 75, srate: 6, mezzPct: 20, mrate: 5 }; // $M, $M, %, %, %, %

  function amortAnnual(principalM, ratePct) { // 30-yr amortizing annual debt service ($M)
    var r = ratePct / 100 / 12, n = 360; if (r === 0) return principalM / 30;
    return (principalM * r / (1 - Math.pow(1 + r, -n))) * 12;
  }
  function model() {
    var price = S.price, noi = S.noi, cap = noi / price * 100;
    var senior = price * S.ltv / 100, seniorDS = amortAnnual(senior, S.srate);
    var mezz = price * S.mezzPct / 100, mezzIO = mezz * S.mrate / 100; // interest-only
    var eqNo = price - senior, eqYes = Math.max(0.01, price - senior - mezz);
    var cfNo = noi - seniorDS, cfYes = noi - seniorDS - mezzIO;
    return {
      cap: cap, senior: senior, mezz: mezz, eqNo: eqNo, eqYes: eqYes, seniorDS: seniorDS, mezzIO: mezzIO,
      cocNo: cfNo / eqNo * 100, cocYes: cfYes / eqYes * 100, cfNo: cfNo, cfYes: cfYes, dscr: noi / (seniorDS + mezzIO)
    };
  }

  function render() {
    var P = window.Plot; if (!P) return;
    var m = model();
    var common = { width: 320, height: 200, marginLeft: 46, style: { background: "transparent", color: MUTED, fontFamily: "Poppins,sans-serif" }, y: { grid: true, label: null }, x: { label: null } };

    // 1) Capital stack ($M) — stacked single bar
    set("rpa-stack", P.plot(Object.assign({}, common, {
      x: { label: null }, color: { range: [BLUE, GOLD, TEAL], domain: ["Senior", "Mezz", "Equity"], legend: true },
      marks: [P.barY([
        { k: "Stack", t: "Senior", v: m.senior }, { k: "Stack", t: "Mezz", v: m.mezz }, { k: "Stack", t: "Equity", v: m.eqYes }
      ], { x: "k", y: "v", fill: "t" }), P.ruleY([0])]
    })));

    // 2) Cash-on-cash: with vs without seller mezz
    set("rpa-coc", P.plot(Object.assign({}, common, {
      y: { grid: true, label: "Cash-on-cash %" },
      marks: [P.barY([
        { t: "Without Mezz", v: m.cocNo }, { t: "With Seller Mezz", v: m.cocYes }
      ], { x: "t", y: "v", fill: function (d) { return d.t.indexOf("With") === 0 ? GOLD : BLUE; } }),
      P.text([{ t: "Without Mezz", v: m.cocNo }, { t: "With Seller Mezz", v: m.cocYes }], { x: "t", y: "v", text: function (d) { return d.v.toFixed(1) + "%"; }, dy: -8, fill: "#f0f2f5" }), P.ruleY([0])]
    })));

    // 3) Cash flow bridge ($M): NOI − debt service = cash flow
    set("rpa-cf", P.plot(Object.assign({}, common, {
      marks: [P.barY([
        { t: "NOI", v: S.noi }, { t: "Debt Svc", v: -(m.seniorDS + m.mezzIO) }, { t: "Cash Flow", v: m.cfYes }
      ], { x: "t", y: "v", fill: function (d) { return d.v < 0 ? RED : d.t === "Cash Flow" ? GREEN : TEAL; } }), P.ruleY([0])]
    })));

    // 4) CoC sensitivity to LTV (reactive line) at current mezz
    var sens = []; for (var l = 55; l <= 85; l += 5) { var sv = S.price * l / 100, ds = amortAnnual(sv, S.srate), eq = Math.max(0.01, S.price - sv - S.mezz0()); sens.push({ ltv: l, coc: (S.noi - ds - S.mezz0() * S.mrate / 100) / eq * 100 }); }
    set("rpa-sens", P.plot(Object.assign({}, common, {
      x: { label: "Senior LTV %" }, y: { grid: true, label: "CoC %" },
      marks: [P.areaY(sens, { x: "ltv", y: "coc", fill: GOLD, fillOpacity: .15 }), P.lineY(sens, { x: "ltv", y: "coc", stroke: GOLD, strokeWidth: 2 }), P.dot(sens, { x: "ltv", y: "coc", fill: GOLD, r: 3 }), P.ruleY([0])]
    })));

    // readouts
    txt("rpa-cap", m.cap.toFixed(2) + "%"); txt("rpa-dscr", m.dscr.toFixed(2) + "x");
    txt("rpa-lift", "+" + (m.cocYes - m.cocNo).toFixed(1) + "% CoC");
  }
  S.mezz0 = function () { return S.price * S.mezzPct / 100; };
  function set(id, node) { var e = document.getElementById(id); if (e) { e.innerHTML = ""; e.appendChild(node); } }
  function txt(id, v) { var e = document.getElementById(id); if (e) e.textContent = v; }

  function build() {
    var fields = [
      ["price", "Purchase Price", 2, 100, 1, "$%vM"], ["noi", "Net Operating Income", 0.1, 8, 0.05, "$%vM"],
      ["ltv", "Senior LTV", 50, 85, 1, "%v%"], ["srate", "Senior Rate", 4, 9, 0.25, "%v%"],
      ["mezzPct", "Seller Mezz", 0, 30, 1, "%v%"], ["mrate", "Mezz Rate", 3, 8, 0.25, "%v%"]
    ];
    var controls = fields.map(function (f) {
      var k = f[0];
      return '<div style="margin-bottom:12px"><label class="rpv-field-l"><span>' + f[1] + '</span><span class="rpv-field-v" id="rpa-l-' + k + '"></span></label>' +
        '<input class="rpv-range" type="range" data-k="' + k + '" min="' + f[2] + '" max="' + f[3] + '" step="' + f[4] + '" value="' + S[k] + '"></div>';
    }).join("");
    function chart(id, label) { return '<div class="rpv-glass rpv-glass-pad"><div class="rpv-eyebrow" style="margin-bottom:8px">' + label + '</div><div id="' + id + '"></div></div>'; }

    host.innerHTML =
      '<div class="rpv-grid" style="grid-template-columns:300px 1fr;gap:18px">' +
        '<div class="rpv-glass rpv-glass-pad"><div class="rpv-eyebrow">Inputs · reactive</div>' +
          '<div style="font-size:14px;font-weight:700;margin:6px 0 16px;color:var(--rpv-text)">Seller-Mezzanine Model</div>' + controls +
          '<div class="rpv-grid rpv-grid-3" style="gap:8px;margin-top:8px">' +
            '<div style="text-align:center"><div class="rpv-stat-v" id="rpa-cap" style="font-size:20px"></div><div class="rpv-stat-l">Cap</div></div>' +
            '<div style="text-align:center"><div class="rpv-stat-v" id="rpa-dscr" style="font-size:20px;color:var(--rpv-teal)"></div><div class="rpv-stat-l">DSCR</div></div>' +
            '<div style="text-align:center"><div class="rpv-stat-v" id="rpa-lift" style="font-size:16px;color:var(--rpv-green)"></div><div class="rpv-stat-l">Mezz lift</div></div>' +
          '</div>' +
          '<div style="font-size:10px;color:var(--rpv-dim);margin-top:12px">Interest-only mezz, balloon at maturity · IRC §453 installment treatment. Illustrative — not an offer.</div>' +
        '</div>' +
        '<div class="rpv-grid rpv-grid-2">' + chart("rpa-stack", "Capital Stack ($M)") + chart("rpa-coc", "Cash-on-Cash: With vs Without Mezz") + chart("rpa-cf", "Annual Cash Flow Bridge ($M)") + chart("rpa-sens", "CoC Sensitivity to LTV") + '</div>' +
      '</div>';

    // reactive wiring: any input → recompute + re-render all 4 charts
    host.querySelectorAll(".rpv-range").forEach(function (inp) {
      function sync() { S[inp.dataset.k] = parseFloat(inp.value); document.getElementById("rpa-l-" + inp.dataset.k).textContent = inp.value; render(); }
      inp.addEventListener("input", sync); sync();
    });
  }

  var io = new IntersectionObserver(function (e) { if (e[0].isIntersecting && window.Plot) { io.disconnect(); build(); } }, { rootMargin: "200px" });
  io.observe(host);
})();
