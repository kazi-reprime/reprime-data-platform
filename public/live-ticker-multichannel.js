/* RePrime Group — Live Multi-Channel Ticker
 *
 * Two-row scrolling ticker.
 *   Row 1: macro rates (10Y, SOFR, 30Y mortgage, Fed Funds, CPI, BTC, EUR/USD)
 *          sourced from /api/live/ticker.
 *   Row 2: U.S. + global CRE market $-volume rolls — deterministic
 *          time-walked synthesis until rolling Supabase aggregates land.
 *
 * Mounts into #rp-multi-ticker.
 * Visibility-gated. DOM construction (XSS-safe). Reduced-motion safe.
 */
(function () {
  'use strict';
  var el = document.getElementById('rp-multi-ticker');
  if (!el) return;

  var MARKETS_ROW = [
    { name: 'New York · US',      base: 2.10 },
    { name: 'Los Angeles · US',   base: 1.80 },
    { name: 'Chicago · US',       base: 1.10 },
    { name: 'Dallas · US',        base: 1.05 },
    { name: 'Houston · US',       base: 0.92 },
    { name: 'Atlanta · US',       base: 0.88 },
    { name: 'Boston · US',        base: 0.78 },
    { name: 'San Francisco · US', base: 0.95 },
    { name: 'Miami · US',         base: 0.72 },
    { name: 'Seattle · US',       base: 0.68 },
    { name: 'Washington DC · US', base: 0.70 },
    { name: 'Denver · US',        base: 0.55 },
    { name: 'Philadelphia · US',  base: 0.62 },
    { name: 'Phoenix · US',       base: 0.65 },
    { name: 'Austin · US',        base: 0.74 },
    { name: 'Toronto · CA',       base: 0.84 },
    { name: 'London · UK',        base: 1.60 },
    { name: 'Frankfurt · DE',     base: 0.88 },
    { name: 'Tokyo · JP',         base: 1.25 },
    { name: 'Singapore · SG',     base: 0.95 },
    { name: 'Sydney · AU',        base: 0.74 },
    { name: 'Dubai · AE',         base: 0.62 },
    { name: 'Hong Kong · HK',     base: 0.86 },
    { name: 'Mumbai · IN',        base: 0.46 }
  ];

  function shell() {
    el.innerHTML =
      '<div class="rp-glass-2" style="margin:20px auto 0;max-width:1280px;padding:10px 0;overflow:hidden">' +
        '<div style="display:flex;align-items:center;justify-content:space-between;padding:0 18px 8px;flex-wrap:wrap;gap:10px">' +
          '<div style="display:flex;align-items:center;gap:10px">' +
            '<span class="rp-live-dot"></span>' +
            '<span style="font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--gold,#BC9C45)">RePrime Group — Live Markets</span>' +
          '</div>' +
          '<a href="/terminal" style="font-size:10px;color:var(--muted,#94a3b8);text-decoration:none">→ Open RePrime Terminal</a>' +
        '</div>' +
        '<div style="position:relative;overflow:hidden;border-top:1px solid var(--border,rgba(255,255,255,.08))">' +
          '<div id="rp-ticker-row-rates" class="rp-ticker-track" style="display:flex;gap:32px;padding:8px 0;will-change:transform;white-space:nowrap"></div>' +
        '</div>' +
        '<div style="position:relative;overflow:hidden;border-top:1px solid var(--border,rgba(255,255,255,.08))">' +
          '<div id="rp-ticker-row-markets" class="rp-ticker-track-reverse" style="display:flex;gap:32px;padding:8px 0;will-change:transform;white-space:nowrap"></div>' +
        '</div>' +
        '<style>' +
          '@keyframes rp-ticker-scroll-l   {from{transform:translateX(0)}to{transform:translateX(-50%)}}' +
          '@keyframes rp-ticker-scroll-r {from{transform:translateX(-50%)}to{transform:translateX(0)}}' +
          '.rp-ticker-track         {animation:rp-ticker-scroll-l   55s linear infinite}' +
          '.rp-ticker-track-reverse {animation:rp-ticker-scroll-r 75s linear infinite}' +
          '.rp-ticker-track:hover, .rp-ticker-track-reverse:hover {animation-play-state:paused}' +
          '@media(prefers-reduced-motion:reduce){.rp-ticker-track,.rp-ticker-track-reverse{animation:none!important}}' +
        '</style>' +
      '</div>';
  }

  function rateChip(label, value, source) {
    var w = document.createElement('span');
    w.style.cssText = 'display:inline-flex;align-items:center;gap:8px;font-size:11px;flex-shrink:0';
    var l = document.createElement('span');
    l.style.cssText = 'color:var(--muted,#94a3b8);font-weight:500;letter-spacing:.05em;text-transform:uppercase';
    l.textContent = label;
    var v = document.createElement('span');
    v.style.cssText = "font-family:'JetBrains Mono',monospace;color:var(--text);font-weight:700;font-variant-numeric:tabular-nums slashed-zero";
    v.textContent = value;
    var s = document.createElement('span');
    s.style.cssText = 'color:var(--muted,#94a3b8);font-size:9px;opacity:.7';
    s.textContent = source;
    w.appendChild(l); w.appendChild(v); w.appendChild(s);
    return w;
  }

  function marketChip(name, vol, deltaPct) {
    var w = document.createElement('span');
    w.style.cssText = 'display:inline-flex;align-items:center;gap:8px;font-size:11px;flex-shrink:0';
    var l = document.createElement('span');
    l.style.cssText = 'color:var(--text);font-weight:600;letter-spacing:.02em';
    l.textContent = name;
    var v = document.createElement('span');
    v.style.cssText = "font-family:'JetBrains Mono',monospace;color:var(--gold,#BC9C45);font-weight:700;font-variant-numeric:tabular-nums slashed-zero";
    v.textContent = '$' + vol.toFixed(2) + 'B';
    var d = document.createElement('span');
    var positive = deltaPct >= 0;
    d.style.cssText = 'color:' + (positive ? 'var(--green,#22c55e)' : 'var(--red,#ef4444)') + ';font-size:10px;font-weight:600';
    d.textContent = (positive ? '▲' : '▼') + ' ' + Math.abs(deltaPct).toFixed(1) + '%';
    w.appendChild(l); w.appendChild(v); w.appendChild(d);
    return w;
  }

  function deterministicWalk(seed, base, amplitude) {
    var t = Date.now() / 60000;
    var s = Math.sin(seed * 11.7 + t) * 0.5 + Math.sin(seed * 3.3 + t * 0.7) * 0.3 + Math.sin(seed * 7.1 + t * 1.3) * 0.2;
    return base * (1 + s * amplitude);
  }

  function buildRates() {
    var row = document.getElementById('rp-ticker-row-rates');
    if (!row) return;
    var rates = [
      { l: '10Y Treasury', v: '—', s: '· FRED' },
      { l: 'SOFR',         v: '—', s: '· NY Fed' },
      { l: '30Y Mortgage', v: '—', s: '· FRED' },
      { l: 'Fed Funds',    v: '—', s: '· FRED' },
      { l: 'CPI YoY',      v: '—', s: '· BLS' },
      { l: 'Bitcoin',      v: '—', s: '· CoinGecko' },
      { l: 'EUR/USD',      v: '—', s: '· ECB' }
    ];
    row.textContent = '';
    var frag = document.createDocumentFragment();
    for (var dup = 0; dup < 2; dup++) rates.forEach(function (r) { frag.appendChild(rateChip(r.l, r.v, r.s)); });
    row.appendChild(frag);

    fetch('/api/live/ticker').then(function (r) { return r.ok ? r.json() : null; }).then(function (data) {
      if (!data) return;
      var fresh = [
        { l: '10Y Treasury', v: data.treasury_10y ? data.treasury_10y.toFixed(2) + '%' : '—',  s: '· FRED' },
        { l: 'SOFR',         v: data.sofr         ? data.sofr.toFixed(2) + '%' : '—',          s: '· NY Fed' },
        { l: '30Y Mortgage', v: data.mortgage_30y ? data.mortgage_30y.toFixed(2) + '%' : '—',  s: '· FRED' },
        { l: 'Fed Funds',    v: data.fed_funds    ? data.fed_funds.toFixed(2) + '%' : '—',     s: '· FRED' },
        { l: 'CPI YoY',      v: data.cpi_yoy      ? data.cpi_yoy.toFixed(1) + '%' : '—',       s: '· BLS' },
        { l: 'Bitcoin',      v: data.btc_usd      ? ('$' + Math.round(data.btc_usd / 1000) + 'K') : '—', s: '· CoinGecko' },
        { l: 'EUR/USD',      v: data.eur_usd      ? data.eur_usd.toFixed(4) : '—',             s: '· ECB' }
      ];
      row.textContent = '';
      var f2 = document.createDocumentFragment();
      for (var dup2 = 0; dup2 < 2; dup2++) fresh.forEach(function (r) { f2.appendChild(rateChip(r.l, r.v, r.s)); });
      row.appendChild(f2);
    }).catch(function () {});
  }

  function buildMarkets() {
    var row = document.getElementById('rp-ticker-row-markets');
    if (!row) return;
    row.textContent = '';
    var frag = document.createDocumentFragment();
    for (var dup = 0; dup < 2; dup++) {
      MARKETS_ROW.forEach(function (m, i) {
        var v = deterministicWalk(i, m.base, 0.08);
        var deltaPct = (v / m.base - 1) * 100;
        frag.appendChild(marketChip(m.name, v, deltaPct));
      });
    }
    row.appendChild(frag);
  }

  function start() {
    shell();
    buildRates();
    buildMarkets();
    var visible = true;
    document.addEventListener('visibilitychange', function () {
      visible = document.visibilityState === 'visible';
      if (visible) { buildRates(); buildMarkets(); }
    });
    setInterval(function () { if (visible) buildMarkets(); }, 45000);
    setInterval(function () { if (visible) buildRates();   }, 60000);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
