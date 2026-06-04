/* RePrime shared Supabase data layer — loaded by every page.
   Reads live ingested records via the public (anon) key, RLS keeps it read-only.
   - Auto-injects a "Live Data Warehouse" panel (into #reprime-live-data if present,
     else appends to the main container).
   - Each dataset is expandable to view its real records (lazy-fetched on click).
   - Fills any KPI placeholders: #sb-records, #sb-sources, #sb-datasets.
   - Exposes window.RP for the Explore page to query stored data on search.
*/
(function () {
  const SB = "https://gugcmsqrscqqqltdtgkz.supabase.co";
  const KEY = "sb_publishable_J5zIiHNf1VqpQ7r14SevFw__MbvlEpm"; // publishable/anon — safe, read-only via RLS
  const H = { apikey: KEY, Authorization: "Bearer " + KEY };
  const fmt = (n) => Number(n || 0).toLocaleString();
  let _cache = null;

  async function sb(path) {
    const r = await fetch(SB + "/rest/v1/" + path, { headers: H });
    if (!r.ok) throw new Error("sb " + r.status);
    return r.json();
  }

  async function load() {
    if (_cache) return _cache;
    const [coverage, datasets] = await Promise.all([
      sb("v_coverage?select=category,sources,live_api,keyless"),
      sb("v_latest_source_data?select=name,category,status,record_count,fetched_at&status=eq.ok&order=record_count.desc&limit=60"),
    ]);
    const records = datasets.reduce((a, d) => a + (+d.record_count || 0), 0);
    const sources = coverage.reduce((a, c) => a + (+c.sources || 0), 0);
    _cache = { coverage, datasets, records, sources, categories: coverage.length, ingesting: datasets.length };
    return _cache;
  }

  function flattenRows(p) {
    if (!p) return [];
    if (Array.isArray(p)) return p.map((r) => (r && r.attributes ? r.attributes : r)).filter((x) => x && typeof x === "object");
    if (typeof p === "object") {
      for (const k of ["features", "results", "data", "items", "records"]) {
        if (Array.isArray(p[k])) return p[k].map((r) => (r && r.attributes ? r.attributes : r)).filter((x) => x && typeof x === "object");
      }
    }
    return [];
  }

  window.RP = {
    load,
    datasetsByCategory: async (cat) => { const d = await load(); return cat ? d.datasets.filter((x) => x.category === cat) : d.datasets; },
  };

  // Lazy-load + render the real records for one dataset (by name) on expand.
  window.__rpToggle = async function (i, name) {
    const det = document.getElementById("rpdet-" + i); if (!det) return;
    if (det.style.display !== "none") { det.style.display = "none"; return; }
    det.style.display = "block";
    if (det.dataset.done) return;
    det.innerHTML = '<div style="color:var(--muted,#94a3b8);font-size:11px;padding:6px">Loading records…</div>';
    try {
      const r = await sb("v_latest_source_data?select=payload&status=eq.ok&name=eq." + encodeURIComponent(name) + "&limit=1");
      const rows = flattenRows((r[0] || {}).payload).slice(0, 25);
      if (!rows.length) { det.innerHTML = '<div style="color:var(--muted,#94a3b8);font-size:11px;padding:6px">No sample rows stored.</div>'; det.dataset.done = "1"; return; }
      const cols = [...new Set(rows.flatMap((x) => Object.keys(x)))].filter((c) => !String(c).startsWith("_")).slice(0, 6);
      const esc = (v) => { v = v == null ? "" : String(typeof v === "object" ? JSON.stringify(v) : v); return v.length > 36 ? v.slice(0, 36) + "…" : v; };
      det.innerHTML =
        '<div style="overflow-x:auto;border:1px solid var(--border,rgba(255,255,255,.12));border-radius:8px;margin-top:6px"><table style="width:100%;font-size:11px;border-collapse:collapse">' +
        "<thead><tr>" + cols.map((c) => `<th style="text-align:left;padding:5px 8px;color:var(--muted,#94a3b8);border-bottom:1px solid var(--border,rgba(255,255,255,.12));white-space:nowrap">${c}</th>`).join("") + "</tr></thead><tbody>" +
        rows.map((x) => "<tr>" + cols.map((c) => `<td style="padding:4px 8px;border-bottom:1px solid var(--border,rgba(255,255,255,.08))">${esc(x[c])}</td>`).join("") + "</tr>").join("") +
        "</tbody></table></div><div style=\"color:var(--muted,#94a3b8);font-size:10px;margin-top:3px\">Live sample of " + rows.length + " real records.</div>";
      det.dataset.done = "1";
    } catch (e) { det.innerHTML = '<div style="color:var(--red,#ef4444);font-size:11px;padding:6px">Records unavailable.</div>'; }
  };

  function cardHTML(d) {
    const cl = ["#3b82f6", "#22c55e", "#8b5cf6", "#fbbf24", "#ef4444", "#06b6d4", "#fb923c", "#f472b6", "#14b8a6", "#a78bfa", "#6366f1", "#84cc16", "#f59e0b", "#10b981"];
    const max = Math.max(...d.coverage.map((c) => +c.sources || 0), 1);
    const bars = [...d.coverage].sort((a, b) => b.sources - a.sources).slice(0, 8).map((c, i) =>
      `<div style="display:flex;align-items:center;gap:8px;margin-bottom:5px">
         <div style="width:150px;text-align:right;color:var(--muted,#94a3b8);font-size:11px">${(c.category || "").replace(/_/g, " ")}</div>
         <div style="flex:1;background:var(--surface,rgba(255,255,255,.08));border-radius:5px;height:18px;overflow:hidden">
           <div style="height:100%;width:${Math.round((+c.sources / max) * 100)}%;background:${cl[i % 14]};border-radius:5px;display:flex;align-items:center;padding:0 7px;font-size:9px;font-weight:700;color:#fff">${c.sources}</div>
         </div></div>`).join("");
    const rows = d.datasets.slice(0, 12).map((x, i) => {
      const nm = (x.name || "").replace(/"/g, "&quot;");
      return `<div style="border-bottom:1px solid var(--border,rgba(255,255,255,.12));font-size:12px">
        <div onclick="__rpToggle(${i},'${nm.replace(/'/g, "\\'")}')" style="display:flex;justify-content:space-between;gap:10px;padding:5px 0;cursor:pointer">
          <span style="flex:1;color:var(--text,#e2e8f0)">▸ ${x.name}</span>
          <span style="font-family:'JetBrains Mono',monospace;font-weight:700;color:var(--green,#22c55e)">${fmt(x.record_count)}</span></div>
        <div id="rpdet-${i}" style="display:none;padding-bottom:6px"></div></div>`;
    }).join("");
    return `
    <div style="background:var(--glass-bg,rgba(255,255,255,.04));border:1px solid var(--glass-border,rgba(255,255,255,.12));border-radius:16px;padding:22px;margin:18px auto;max-width:1100px;font-family:'Inter',system-ui,sans-serif;color:var(--text,#f8fafc)">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;flex-wrap:wrap;gap:8px">
        <div style="font-family:'Space Grotesk','Inter',sans-serif;font-size:15px;font-weight:700">🗄️ Live Data Warehouse</div>
        <span style="font-size:10px;font-weight:700;padding:3px 9px;border-radius:99px;background:rgba(34,197,94,.12);color:var(--green,#22c55e);border:1px solid rgba(34,197,94,.25)">LIVE · Supabase</span>
      </div>
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:16px">
        <div style="text-align:center"><div style="font-family:'JetBrains Mono',monospace;font-size:26px;font-weight:800;color:var(--accent,#3b82f6)">${fmt(d.records)}</div><div style="font-size:10px;color:var(--muted,#94a3b8);text-transform:uppercase;letter-spacing:1px">Records</div></div>
        <div style="text-align:center"><div style="font-family:'JetBrains Mono',monospace;font-size:26px;font-weight:800;color:var(--green,#22c55e)">${d.ingesting}</div><div style="font-size:10px;color:var(--muted,#94a3b8);text-transform:uppercase;letter-spacing:1px">Sources w/ Data</div></div>
        <div style="text-align:center"><div style="font-family:'JetBrains Mono',monospace;font-size:26px;font-weight:800;color:var(--gold,#fbbf24)">${fmt(d.sources)}</div><div style="font-size:10px;color:var(--muted,#94a3b8);text-transform:uppercase;letter-spacing:1px">Cataloged</div></div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px">
        <div><div style="font-size:11px;color:var(--muted,#94a3b8);margin-bottom:8px;text-transform:uppercase;letter-spacing:.5px">Coverage by category</div>${bars}</div>
        <div><div style="font-size:11px;color:var(--muted,#94a3b8);margin-bottom:8px;text-transform:uppercase;letter-spacing:.5px">Ingested datasets — click to view records</div>${rows}</div>
      </div>
      <div style="text-align:right;margin-top:10px"><a href="/data" style="color:var(--accent,#3b82f6);font-size:12px;text-decoration:none">View full coverage →</a></div>
    </div>`;
  }

  function injectKPIs(d) {
    const set = (id, v) => { const e = document.getElementById(id); if (e) e.textContent = fmt(v); };
    set("sb-records", d.records); set("sb-sources", d.sources); set("sb-datasets", d.ingesting);
  }

  async function init() {
    let d;
    try { d = await load(); } catch (e) { return; }
    injectKPIs(d);
    let anchor = document.getElementById("reprime-live-data");
    if (!anchor) {
      anchor = document.createElement("div");
      const host = document.querySelector(".container, .wrap, main, .term-content") || document.body;
      host.appendChild(anchor);
    }
    anchor.innerHTML = cardHTML(d);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
