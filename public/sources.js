/* RePrime Data Source Catalog explorer — renders the authoritative dev-list
   catalog (from 611 REPRIME_FINAL_DEV_LIST_v3.xlsx → /data/sources_catalog.json)
   into #rp-sources: searchable, filterable by category / cost tier / auth / type,
   paginated, glassmorphic. Each card links to the live endpoint + signup URL and
   shows cost, auth, and free-tier. Brand-themed, drop-in on any page. */
(function () {
  "use strict";
  var el = document.getElementById("rp-sources");
  if (!el) return;
  var esc = function (s) { return String(s == null ? "" : s).replace(/[<>&"]/g, function (c) { return { "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;" }[c]; }); };
  var lab = function (k) { return String(k || "other").replace(/_/g, " ").replace(/\b\w/g, function (m) { return m.toUpperCase(); }); };
  var PAGE = 60, shown = PAGE, ALL = [], FILT = [];
  var pal = ["#BC9C45", "#1D5FB8", "#00A1FF", "#009080", "#FFBC7D", "#0E3470", "#00A980", "#FF7474"];
  var catColor = {};
  var TIERS = { free: "Free", le10: "≤ $10/mo", le50: "≤ $50/mo", le100: "≤ $100/mo", gt100: "> $100/mo" };

  function authBadge(s) {
    if (s.keyless) return { t: "No auth", c: "var(--green)" };
    var a = (s.auth || "").toLowerCase();
    if (a.indexOf("oauth") >= 0) return { t: "OAuth", c: "var(--bright)" };
    if (a.indexOf("key") >= 0) return { t: "API key", c: "var(--gold)" };
    return { t: a ? "Auth" : "—", c: "var(--muted)" };
  }
  function costBadge(s) { return s.tier === "free" ? "Free" : (s.cost ? "$" + s.cost + "/mo" : TIERS[s.tier] || ""); }

  function build(all) {
    ALL = all;
    var cats = {}; ALL.forEach(function (s) { cats[s.category] = (cats[s.category] || 0) + 1; });
    var catKeys = Object.keys(cats).sort(function (a, b) { return cats[b] - cats[a]; });
    catKeys.forEach(function (k, i) { catColor[k] = pal[i % pal.length]; });
    var types = {}; ALL.forEach(function (s) { if (s.type) types[s.type] = (types[s.type] || 0) + 1; });
    var typeKeys = Object.keys(types).sort();
    var free = ALL.filter(function (s) { return s.tier === "free"; }).length;
    var le10 = ALL.filter(function (s) { return s.tier === "le10"; }).length;
    var keyless = ALL.filter(function (s) { return s.keyless; }).length;
    var easy = ALL.filter(function (s) { return s.easy; }).length;
    var inp = "background:var(--surface);border:1px solid var(--border);border-radius:10px;padding:11px 12px;color:var(--text);font-size:13px;font-family:inherit;outline:none";

    el.innerHTML =
      '<div style="max-width:1280px;margin:56px auto 0">' +
      '<div style="font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.1em;color:var(--gold);margin-bottom:8px">Data Source Catalog</div>' +
      '<div style="font-size:clamp(22px,3vw,30px);font-weight:700;color:var(--text);line-height:1.15;margin-bottom:6px">Every source we can connect</div>' +
      '<div style="font-size:13px;color:var(--muted);font-weight:300;margin-bottom:18px"><span id="src-count" style="color:var(--gold);font-family:\'JetBrains Mono\',monospace;font-weight:700">' + ALL.length + '</span> sources · <b style="color:var(--green)">' + keyless + '</b> keyless · <b style="color:var(--gold)">' + free + '</b> free · ' + le10 + ' at ≤$10 · ' + easy + ' easy-to-connect</div>' +
      '<div class="rp-glass rp-rise" style="padding:18px">' +
        '<div style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:14px">' +
          '<input id="src-q" placeholder="🔍 Search source, provider, what it provides…" style="flex:1;min-width:220px;' + inp + '">' +
          '<select id="src-cat" style="' + inp + '"><option value="">All categories</option>' + catKeys.map(function (k) { return '<option value="' + esc(k) + '">' + esc(lab(k)) + " (" + cats[k] + ")</option>"; }).join("") + '</select>' +
          '<select id="src-tier" style="' + inp + '"><option value="">All pricing</option><option value="free">Free (' + free + ')</option><option value="le10">≤ $10/mo (' + le10 + ')</option><option value="le50">≤ $50/mo</option><option value="le100">≤ $100/mo</option></select>' +
          '<select id="src-auth" style="' + inp + '"><option value="">All auth</option><option value="keyless">No auth (' + keyless + ')</option><option value="key">API key</option><option value="oauth">OAuth</option></select>' +
          '<select id="src-type" style="' + inp + '"><option value="">All types</option>' + typeKeys.map(function (k) { return '<option value="' + esc(k) + '">' + esc(k) + " (" + types[k] + ")</option>"; }).join("") + '</select>' +
        '</div>' +
        '<div id="src-grid" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(290px,1fr));gap:10px"></div>' +
        '<div style="text-align:center;margin-top:16px"><button id="src-more" style="background:var(--grad-gold);color:#000;border:none;border-radius:10px;padding:11px 26px;font-family:inherit;font-weight:600;font-size:13px;cursor:pointer">Show more</button><div id="src-status" style="font-size:11px;color:var(--muted);margin-top:8px"></div></div>' +
      '</div></div>';

    ["src-q", "src-cat", "src-tier", "src-auth", "src-type"].forEach(function (id) { var e = document.getElementById(id); e.addEventListener(id === "src-q" ? "input" : "change", apply); });
    document.getElementById("src-more").addEventListener("click", function () { shown += PAGE; paint(); });
    // restore from URL hash
    var hp = {}; location.hash.replace(/^#/, "").split("&").forEach(function (kv) { var p = kv.split("="); if (p[0]) hp[p[0]] = decodeURIComponent(p[1] || ""); });
    if (hp.q) document.getElementById("src-q").value = hp.q;
    if (hp.cat) document.getElementById("src-cat").value = hp.cat;
    if (hp.tier) document.getElementById("src-tier").value = hp.tier;
    if (hp.auth) document.getElementById("src-auth").value = hp.auth;
    apply();
  }

  function apply() {
    var qraw = document.getElementById("src-q").value || "", q = qraw.toLowerCase();
    var c = document.getElementById("src-cat").value, tr = document.getElementById("src-tier").value,
        au = document.getElementById("src-auth").value, t = document.getElementById("src-type").value;
    FILT = ALL.filter(function (s) {
      if (c && s.category !== c) return false;
      if (tr && s.tier !== tr) return false;
      if (t && s.type !== t) return false;
      if (au === "keyless" && !s.keyless) return false;
      if (au === "key" && (s.keyless || (s.auth || "").toLowerCase().indexOf("key") < 0)) return false;
      if (au === "oauth" && (s.auth || "").toLowerCase().indexOf("oauth") < 0) return false;
      if (q && (s.name + " " + s.provider + " " + s.category + " " + s.provides).toLowerCase().indexOf(q) < 0) return false;
      return true;
    });
    try {
      var o = {}; location.hash.replace(/^#/, "").split("&").forEach(function (kv) { var p = kv.split("="); if (p[0]) o[p[0]] = decodeURIComponent(p[1] || ""); });
      ["q", "cat", "tier", "auth"].forEach(function (k) { delete o[k]; });
      if (qraw) o.q = qraw; if (c) o.cat = c; if (tr) o.tier = tr; if (au) o.auth = au;
      history.replaceState(null, "", "#" + Object.keys(o).map(function (k) { return k + "=" + encodeURIComponent(o[k]); }).join("&"));
    } catch (e) { }
    shown = PAGE; paint();
  }

  function paint() {
    var grid = document.getElementById("src-grid");
    grid.innerHTML = FILT.slice(0, shown).map(function (s) {
      var col = catColor[s.category] || "#BC9C45", ab = authBadge(s);
      var nm = s.endpoint ? '<a href="' + esc(s.endpoint) + '" target="_blank" rel="noopener" style="color:var(--text)">' + esc(s.name) + " ↗</a>" : esc(s.name);
      return '<div class="rp-glass" style="padding:13px 14px;border-left:3px solid ' + col + '">' +
        '<div style="display:flex;justify-content:space-between;gap:8px"><div style="font-size:12.5px;font-weight:600;color:var(--text);line-height:1.3;flex:1;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden">' + nm + '</div>' +
          '<span style="flex-shrink:0;font-size:9px;font-weight:700;color:' + (s.tier === "free" ? "var(--green)" : "var(--gold)") + ';background:var(--surface);padding:2px 7px;border-radius:99px;height:fit-content">' + costBadge(s) + '</span></div>' +
        (s.provides ? '<div style="font-size:10.5px;color:var(--muted);margin-top:4px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden">' + esc(s.provides) + '</div>' : "") +
        '<div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:8px;align-items:center">' +
          '<span style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.04em;color:' + col + ';background:var(--surface);padding:2px 7px;border-radius:99px">' + esc(lab(s.category)) + "</span>" +
          '<span style="font-size:9px;font-weight:600;color:' + ab.c + '">● ' + ab.t + "</span>" +
          (s.signup ? '<a href="' + esc(s.signup) + '" target="_blank" rel="noopener" style="font-size:9px;color:var(--bright);margin-left:auto">signup ↗</a>' : "") +
        "</div></div>";
    }).join("");
    document.getElementById("src-count").textContent = FILT.length.toLocaleString();
    var more = document.getElementById("src-more"), st = document.getElementById("src-status");
    if (shown < FILT.length) { more.style.display = ""; st.textContent = "Showing " + Math.min(shown, FILT.length).toLocaleString() + " of " + FILT.length.toLocaleString(); }
    else { more.style.display = "none"; st.textContent = FILT.length.toLocaleString() + " sources"; }
  }

  fetch("/data/sources_catalog.json").then(function (r) { return r.json(); }).then(function (d) { build(d.sources || d); })
    .catch(function () { el.innerHTML = '<div style="max-width:1280px;margin:56px auto;color:var(--muted);font-size:13px">Source catalog unavailable.</div>'; });
})();
