/* RePrime institutional-data panels — Treasury yield curve, REIT financials,
   CRE macro indicators. Reads live from Supabase (anon key), self-loads Chart.js,
   theme-aware. Renders into #reprime-panels if present, else appends to the main
   container. Loaded by Terminal / Site / Homepage (Dashboard has its own inline).
*/
(function () {
  const SB = "https://gugcmsqrscqqqltdtgkz.supabase.co";
  const KEY = "sb_publishable_J5zIiHNf1VqpQ7r14SevFw__MbvlEpm";
  const H = { apikey: KEY, Authorization: "Bearer " + KEY };
  const css = (v, f) => (getComputedStyle(document.documentElement).getPropertyValue(v) || f).trim();
  const fmtB = (v) => (v ? "$" + (v / 1e9).toFixed(1) + "B" : "—");

  function loadChart() {
    return new Promise((res) => {
      if (window.Chart) return res();
      const s = document.createElement("script");
      s.src = "https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.min.js";
      s.onload = res; s.onerror = res; document.head.appendChild(s);
    });
  }
  const get = async (name) => {
    try {
      const r = await fetch(SB + "/rest/v1/v_latest_source_data?select=payload&status=eq.ok&name=eq." + encodeURIComponent(name) + "&limit=1", { headers: H });
      return ((await r.json())[0] || {}).payload;
    } catch (e) { return null; }
  };

  async function init() {
    const [curve, reits, macro] = await Promise.all([
      get("U.S. Treasury Yield Curve"), get("REIT Financials (SEC EDGAR)"), get("CRE Macro Indicators (FRED)"),
    ]);
    if (!curve && !reits && !macro) return;
    await loadChart();

    const muted = css("--muted", "#94a3b8"), text = css("--text", "#e2e8f0"), border = css("--border", "rgba(255,255,255,.12)"), accent = css("--gold", "#BC9C45");
    let anchor = document.getElementById("reprime-panels");
    if (!anchor) {
      anchor = document.createElement("div");
      const foot = document.querySelector("footer.rp-footer");
      if (foot && foot.parentNode === document.body) document.body.insertBefore(anchor, foot);
      else (document.querySelector(".container, .wrap, main, .term-content, .dash, .head") || document.body).appendChild(anchor);
    }

    const macroGrid = macro && macro.length
      ? '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:10px;margin-top:8px">'
        + macro.slice(0, 12).map((m) => `<div style="background:var(--surface,rgba(255,255,255,.05));border:1px solid ${border};border-radius:10px;padding:10px"><div style="font-family:'JetBrains Mono',monospace;font-size:18px;font-weight:800;color:${text}">${m.value}${m.unit === "%" ? "%" : ""}</div><div style="font-size:10px;color:${muted};margin-top:3px">${m.indicator}</div></div>`).join("")
        + "</div>" : "";
    const reitTable = reits && reits.length
      ? '<div style="overflow-x:auto"><table style="width:100%;font-size:12px;border-collapse:collapse">'
        + `<thead><tr><th style="text-align:left;padding:6px 8px;color:${muted};border-bottom:1px solid ${border}">Ticker</th><th style="text-align:left;padding:6px 8px;color:${muted};border-bottom:1px solid ${border}">Company</th><th style="text-align:right;padding:6px 8px;color:${muted};border-bottom:1px solid ${border}">Total Assets</th><th style="text-align:right;padding:6px 8px;color:${muted};border-bottom:1px solid ${border}">Revenues</th></tr></thead><tbody>`
        + [...reits].sort((a, b) => (b.total_assets_usd || 0) - (a.total_assets_usd || 0)).map((r) => `<tr><td style="padding:5px 8px;border-bottom:1px solid ${border};font-weight:700">${r.ticker}</td><td style="padding:5px 8px;border-bottom:1px solid ${border};color:${muted}">${(r.company || "").slice(0, 28)}</td><td style="padding:5px 8px;border-bottom:1px solid ${border};text-align:right;font-family:monospace">${fmtB(r.total_assets_usd)}</td><td style="padding:5px 8px;border-bottom:1px solid ${border};text-align:right;font-family:monospace">${fmtB(r.revenues_usd)}</td></tr>`).join("")
        + "</tbody></table></div>" : "";

    anchor.innerHTML = `
    <div style="background:var(--card-bg,var(--glass-bg,rgba(255,255,255,.04)));border:1px solid var(--border,${border});border-radius:16px;padding:22px;margin:18px auto;max-width:1280px;color:${text};font-family:'Poppins',Arial,sans-serif">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;flex-wrap:wrap;gap:8px">
        <div style="font-family:'Poppins',Arial,sans-serif;font-size:15px;font-weight:700">📊 Capital Markets Intelligence</div>
        <span style="font-size:10px;font-weight:700;padding:3px 9px;border-radius:99px;background:rgba(34,197,94,.12);color:var(--green,#22c55e);border:1px solid rgba(34,197,94,.25)">LIVE · FRED · SEC EDGAR</span>
      </div>
      ${curve && curve.length ? `<div style="font-size:11px;color:${muted};text-transform:uppercase;letter-spacing:.5px;margin-bottom:6px">U.S. Treasury Yield Curve</div><div style="height:220px;margin-bottom:18px"><canvas id="rp-yc"></canvas></div>` : ""}
      ${macroGrid ? `<div style="font-size:11px;color:${muted};text-transform:uppercase;letter-spacing:.5px;margin-bottom:4px">CRE Macro Indicators</div>${macroGrid}` : ""}
      ${reitTable ? `<div style="font-size:11px;color:${muted};text-transform:uppercase;letter-spacing:.5px;margin:18px 0 6px">REIT Financials · SEC EDGAR</div>${reitTable}` : ""}
      <div style="text-align:right;margin-top:10px"><a href="/data" style="color:var(--accent,#3b82f6);font-size:12px;text-decoration:none">All datasets →</a></div>
    </div>`;

    if (curve && curve.length && window.Chart) {
      new window.Chart(document.getElementById("rp-yc"), {
        type: "line",
        data: { labels: curve.map((p) => p.tenor), datasets: [{ label: "Yield %", data: curve.map((p) => p.yield_pct), borderColor: accent, backgroundColor: "rgba(188,156,69,.14)", fill: true, tension: 0.35, pointRadius: 3 }] },
        options: { plugins: { legend: { display: false } }, scales: { y: { ticks: { color: muted, callback: (v) => v + "%" } }, x: { ticks: { color: muted } } } },
      });
    }
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
