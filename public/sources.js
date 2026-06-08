/* RePrime Data Source Catalog explorer — renders the full 1,900+ source
   registry into #rp-sources: searchable, filterable (category / type), paginated,
   glassmorphic. Reads /data/sources_all.json (full catalog) enriched by
   /data/sources.json (curated set, adds URLs). Brand-themed, drop-in on any page. */
(function () {
  "use strict";
  var el = document.getElementById("rp-sources");
  if (!el) return;
  var esc = function (s) { return String(s == null ? "" : s).replace(/[<>&"]/g, function (c) { return { "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;" }[c]; }); };
  var lab = function (k) { return String(k || "other").replace(/_/g, " ").replace(/\b\w/g, function (m) { return m.toUpperCase(); }); };
  var PAGE = 60, shown = PAGE, ALL = [], FILT = [];
  var pal = ["#BC9C45", "#1D5FB8", "#00A1FF", "#009080", "#FFBC7D", "#0E3470", "#00A980", "#FF7474"];
  var catColor = {};

  function build(all, emap) {
    ALL = all.map(function (s) {
      var e = emap[s.name] || {};
      return { name: s.name, category: s.category || "other", provider: s.provider || e.provider || "", type: s.type || e.type || "", url: e.url || "", use: e.cre_use || "" };
    });
    var cats = {}; ALL.forEach(function (s) { cats[s.category] = (cats[s.category] || 0) + 1; });
    var catKeys = Object.keys(cats).sort(function (a, b) { return cats[b] - cats[a]; });
    catKeys.forEach(function (k, i) { catColor[k] = pal[i % pal.length]; });
    var types = {}; ALL.forEach(function (s) { if (s.type) types[s.type] = (types[s.type] || 0) + 1; });
    var typeKeys = Object.keys(types).sort();

    el.innerHTML =
      '<div style="max-width:1280px;margin:56px auto 0">' +
      '<div style="font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.1em;color:var(--gold);margin-bottom:8px">Data Source Catalog</div>' +
      '<div style="font-size:clamp(22px,3vw,30px);font-weight:700;color:var(--text);line-height:1.15;margin-bottom:6px">Every source we track</div>' +
      '<div style="font-size:13px;color:var(--muted);font-weight:300;margin-bottom:18px"><span id="src-count" style="color:var(--gold);font-family:\'JetBrains Mono\',monospace;font-weight:700">' + ALL.length + '</span> data sources across ' + catKeys.length + ' categories · search, filter, explore.</div>' +
      '<div class="rp-glass rp-rise" style="padding:18px">' +
        '<div style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:14px">' +
          '<input id="src-q" placeholder="🔍 Search by name, provider, category…" style="flex:1;min-width:240px;background:var(--surface);border:1px solid var(--border);border-radius:10px;padding:11px 14px;color:var(--text);font-size:13px;font-family:inherit;outline:none">' +
          '<select id="src-cat" style="background:var(--surface);border:1px solid var(--border);border-radius:10px;padding:11px 12px;color:var(--text);font-size:13px;font-family:inherit"><option value="">All categories</option>' + catKeys.map(function (k) { return '<option value="' + esc(k) + '">' + esc(lab(k)) + " (" + cats[k] + ")</option>"; }).join("") + '</select>' +
          '<select id="src-type" style="background:var(--surface);border:1px solid var(--border);border-radius:10px;padding:11px 12px;color:var(--text);font-size:13px;font-family:inherit"><option value="">All types</option>' + typeKeys.map(function (k) { return '<option value="' + esc(k) + '">' + esc(k) + " (" + types[k] + ")</option>"; }).join("") + '</select>' +
        '</div>' +
        '<div id="src-grid" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:10px"></div>' +
        '<div style="text-align:center;margin-top:16px"><button id="src-more" style="background:var(--grad-gold);color:#000;border:none;border-radius:10px;padding:11px 26px;font-family:inherit;font-weight:600;font-size:13px;cursor:pointer">Show more</button><div id="src-status" style="font-size:11px;color:var(--muted);margin-top:8px"></div></div>' +
      '</div></div>';

    document.getElementById("src-q").addEventListener("input", apply);
    document.getElementById("src-cat").addEventListener("change", apply);
    document.getElementById("src-type").addEventListener("change", apply);
    document.getElementById("src-more").addEventListener("click", function () { shown += PAGE; paint(); });
    // restore filters from URL hash (shareable view)
    var hp = {}; location.hash.replace(/^#/, "").split("&").forEach(function (kv) { var p = kv.split("="); if (p[0]) hp[p[0]] = decodeURIComponent(p[1] || ""); });
    if (hp.q) document.getElementById("src-q").value = hp.q;
    if (hp.cat) document.getElementById("src-cat").value = hp.cat;
    if (hp.type) document.getElementById("src-type").value = hp.type;
    apply();
  }

  function apply() {
    var qraw = document.getElementById("src-q").value || "";
    var q = qraw.toLowerCase();
    var c = document.getElementById("src-cat").value;
    var t = document.getElementById("src-type").value;
    // reflect filters in URL hash, preserving other params (e.g. theme)
    try {
      var o = {}; location.hash.replace(/^#/, "").split("&").forEach(function (kv) { var p = kv.split("="); if (p[0]) o[p[0]] = decodeURIComponent(p[1] || ""); });
      delete o.q; delete o.cat; delete o.type;
      if (qraw) o.q = qraw; if (c) o.cat = c; if (t) o.type = t;
      history.replaceState(null, "", "#" + Object.keys(o).map(function (k) { return k + "=" + encodeURIComponent(o[k]); }).join("&"));
    } catch (e) { }
    FILT = ALL.filter(function (s) {
      if (c && s.category !== c) return false;
      if (t && s.type !== t) return false;
      if (q && (s.name + " " + s.provider + " " + s.category).toLowerCase().indexOf(q) < 0) return false;
      return true;
    });
    shown = PAGE; paint();
  }

  function paint() {
    var grid = document.getElementById("src-grid");
    var slice = FILT.slice(0, shown);
    grid.innerHTML = slice.map(function (s) {
      var col = catColor[s.category] || "#BC9C45";
      var title = s.url ? '<a href="' + esc(s.url) + '" target="_blank" rel="noopener" style="color:var(--text)">' + esc(s.name) + " ↗</a>" : esc(s.name);
      return '<div class="rp-glass" style="padding:13px 14px;border-left:3px solid ' + col + '">' +
        '<div style="font-size:12.5px;font-weight:600;color:var(--text);line-height:1.3;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden">' + title + '</div>' +
        (s.provider ? '<div style="font-size:11px;color:var(--muted);margin-top:4px">' + esc(s.provider) + '</div>' : "") +
        '<div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:7px">' +
          '<span style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.04em;color:' + col + ';background:var(--surface);padding:2px 7px;border-radius:99px">' + esc(lab(s.category)) + "</span>" +
          (s.type ? '<span style="font-size:9px;font-weight:600;color:var(--muted);background:var(--surface);padding:2px 7px;border-radius:99px">' + esc(s.type) + "</span>" : "") +
        "</div></div>";
    }).join("");
    document.getElementById("src-count").textContent = FILT.length.toLocaleString();
    var more = document.getElementById("src-more"), st = document.getElementById("src-status");
    if (shown < FILT.length) { more.style.display = ""; st.textContent = "Showing " + slice.length.toLocaleString() + " of " + FILT.length.toLocaleString(); }
    else { more.style.display = "none"; st.textContent = FILT.length.toLocaleString() + " sources"; }
  }

  fetch("/data/sources_all.json").then(function (r) { return r.json(); }).then(function (d) {
    var all = d.sources || d;
    fetch("/data/sources.json").then(function (r) { return r.json(); }).then(function (e) {
      var emap = {}; (e.sources || []).forEach(function (s) { emap[s.name] = s; });
      build(all, emap);
    }).catch(function () { build(all, {}); });
  }).catch(function () { el.innerHTML = '<div style="max-width:1280px;margin:56px auto;color:var(--muted);font-size:13px">Source catalog unavailable.</div>'; });
})();
