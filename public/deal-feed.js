/* RePrime — Live Deal Feed (Phase 6.4)
 *
 * Bloomberg-Terminal-style floating live transaction ticker. Cards stream
 * up from the bottom of the container, fade in/out at top/bottom.
 *
 * Data source: Supabase `v_latest_source_data` + SEED_DEALS as fallback.
 * Polls every 30s, visibility-gated (Phase 3 pattern).
 *
 * Mounts into #rp-deal-feed.
 * XSS-safe — all card content via textContent / DOM construction.
 * Respects prefers-reduced-motion (static list, no animation).
 *
 * Brand language: every card carries Reviewed / Sourced / Advised —
 * no ownership claim, matches CLAUDE.md "Confidentiality language".
 */
(function () {
  'use strict';
  var el = document.getElementById('rp-deal-feed');
  if (!el) return;

  var REDUCED_MOTION = false;
  try {
    REDUCED_MOTION = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch (e) {}

  var CFG = window.RP_SB || { URL: 'https://gugcmsqrscqqqltdtgkz.supabase.co', KEY: 'sb_publishable_J5zIiHNf1VqpQ7r14SevFw__MbvlEpm' };
  var H = { apikey: CFG.KEY, Authorization: 'Bearer ' + CFG.KEY };

  var SEED_DEALS = [
    { name: 'The Palms at Doral',     market: 'Doral, FL',          type: 'Multifamily', value: '$61.2M',  metric: '240 units · 6.2% cap', side: 'review' },
    { name: 'Coral Springs Office',   market: 'Coral Springs, FL',  type: 'Office',      value: '$38.5M',  metric: '145K SF · 7.1% cap',   side: 'review' },
    { name: 'Tampa Bay Industrial',   market: 'Tampa, FL',          type: 'Industrial',  value: '$52.8M',  metric: '220K SF · 5.8% cap',   side: 'review' },
    { name: 'Orlando Mixed-Use',      market: 'Orlando, FL',        type: 'Mixed-Use',   value: '$89.3M',  metric: '180U + 25K SF',        side: 'review' },
    { name: 'Ft. Lauderdale Retail',  market: 'Ft. Lauderdale, FL', type: 'Retail',      value: '$42.7M',  metric: '65K SF · 6.8% cap',    side: 'review' },
    { name: 'Brickell Tower',         market: 'Miami, FL',          type: 'Office',      value: '$215.0M', metric: '420K SF · 5.4% cap',   side: 'sourced' },
    { name: 'Hialeah Logistics',      market: 'Hialeah, FL',        type: 'Industrial',  value: '$78.5M',  metric: '310K SF · 5.5% cap',   side: 'advised' },
    { name: 'Coconut Grove MF',       market: 'Miami, FL',          type: 'Multifamily', value: '$54.0M',  metric: '156 units · 5.9% cap', side: 'review' }
  ];

  var TYPE_COLOR = {
    'Multifamily': 'var(--green,#22c55e)',
    'Office':      'var(--bright,#00A1FF)',
    'Industrial':  'var(--gold,#BC9C45)',
    'Retail':      'var(--amber,#FFBC7D)',
    'Mixed-Use':   'var(--teal,#009080)',
    'Land':        'var(--muted,#94a3b8)',
    'Hotel':       'var(--red,#ef4444)'
  };
  var SIDE_LABEL = { sourced: 'Sourced', review: 'Reviewed', advised: 'Advised' };

  var DECK = [];

  function shell() {
    el.innerHTML =
      '<div style="position:relative;max-width:1280px;margin:24px auto;border:1px solid var(--border,rgba(255,255,255,.12));border-radius:16px;background:linear-gradient(180deg,rgba(15,23,42,.85),rgba(2,6,23,.95));overflow:hidden">' +
        '<div style="display:flex;justify-content:space-between;align-items:center;padding:14px 18px 10px;border-bottom:1px solid var(--border,rgba(255,255,255,.08));flex-wrap:wrap;gap:8px">' +
          '<div style="display:flex;align-items:center;gap:10px">' +
            '<span class="rp-pulse" style="display:inline-block;width:8px;height:8px;border-radius:50%;background:var(--green,#22c55e);box-shadow:0 0 12px var(--green,#22c55e)"></span>' +
            '<span style="font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--gold,#BC9C45)">Live Deal Feed</span>' +
          '</div>' +
          '<div style="display:flex;gap:10px;align-items:center;font-size:10px;color:var(--muted,#94a3b8)">' +
            '<span id="rp-feed-count">—</span>' +
            '<span style="opacity:.5">·</span>' +
            '<span>Reviewed · Sourced · Advised — no claim of ownership</span>' +
          '</div>' +
        '</div>' +
        '<div id="rp-feed-stage" style="position:relative;height:380px;overflow:hidden;padding:8px 0">' +
          '<div id="rp-feed-rail" style="position:absolute;inset:0;display:flex;flex-direction:column;gap:8px;padding:8px 18px;will-change:transform"></div>' +
        '</div>' +
        '<style>' +
          '@keyframes rp-pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.6;transform:scale(1.4)}}' +
          '.rp-pulse{animation:rp-pulse 2.2s ease-in-out infinite}' +
          '@keyframes rp-feed-rise{0%{transform:translateY(40px);opacity:0}10%{opacity:1}90%{opacity:1}100%{transform:translateY(-380px);opacity:0}}' +
          '.rp-feed-card{animation:rp-feed-rise 18s linear forwards}' +
          '@media(prefers-reduced-motion:reduce){.rp-feed-card{animation:none!important}.rp-pulse{animation:none!important}}' +
        '</style>' +
      '</div>';
  }

  function buildCard(deal) {
    var card = document.createElement('div');
    card.className = REDUCED_MOTION ? '' : 'rp-feed-card';
    card.style.cssText = 'flex-shrink:0;background:rgba(15,23,42,.6);border:1px solid var(--border,rgba(255,255,255,.1));border-left:3px solid ' + (TYPE_COLOR[deal.type] || 'var(--gold,#BC9C45)') + ';border-radius:10px;padding:10px 14px;display:grid;grid-template-columns:auto 1fr auto;gap:14px;align-items:center;backdrop-filter:blur(8px);transition:transform .25s var(--ease-glass,cubic-bezier(0.4,0,0.2,1))';

    var side = document.createElement('span');
    side.style.cssText = 'font-size:9px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:' + (TYPE_COLOR[deal.type] || 'var(--gold,#BC9C45)') + ';font-family:"JetBrains Mono",monospace';
    side.textContent = SIDE_LABEL[deal.side] || 'Reviewed';

    var center = document.createElement('div');
    center.style.cssText = 'min-width:0;display:flex;flex-direction:column;gap:2px';
    var top = document.createElement('div');
    top.style.cssText = 'font-size:13px;font-weight:600;color:var(--text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis';
    top.textContent = (deal.name || '—') + ' · ' + (deal.type || '—');
    var bottom = document.createElement('div');
    bottom.style.cssText = 'font-size:11px;color:var(--muted,#94a3b8);font-weight:300;white-space:nowrap;overflow:hidden;text-overflow:ellipsis';
    bottom.textContent = (deal.market || '') + (deal.metric ? '  ·  ' + deal.metric : '');
    center.appendChild(top); center.appendChild(bottom);

    var value = document.createElement('div');
    value.style.cssText = "font-family:'JetBrains Mono',monospace;font-size:15px;font-weight:700;color:" + (TYPE_COLOR[deal.type] || 'var(--gold,#BC9C45)') + ';font-variant-numeric:tabular-nums slashed-zero';
    value.textContent = deal.value || '—';

    card.appendChild(side); card.appendChild(center); card.appendChild(value);
    return card;
  }

  function paint() {
    var rail = document.getElementById('rp-feed-rail');
    if (!rail) return;
    rail.textContent = '';
    var visible = DECK.slice(0, REDUCED_MOTION ? 6 : 12);
    visible.forEach(function (deal, i) {
      var card = buildCard(deal);
      if (!REDUCED_MOTION) card.style.animationDelay = (-i * 2.5) + 's';
      rail.appendChild(card);
    });
    var counter = document.getElementById('rp-feed-count');
    if (counter) counter.textContent = DECK.length + ' transactions in stream';
  }

  function tryFetchLive() {
    fetch(CFG.URL + '/rest/v1/v_latest_source_data?select=name,category,record_count,fetched_at&status=eq.ok&order=fetched_at.desc&limit=24', { headers: H })
      .then(function (r) { return r.ok ? r.json() : []; })
      .then(function (rows) {
        if (!Array.isArray(rows) || !rows.length) return;
        var mapped = rows.slice(0, 20).map(function (r) {
          return {
            name: String(r.name || '').slice(0, 60),
            market: String(r.category || 'cataloged').replace(/_/g, ' '),
            type: 'Multifamily',
            value: r.record_count ? Number(r.record_count).toLocaleString() + ' rows' : '—',
            metric: r.fetched_at ? new Date(r.fetched_at).toLocaleString() : '',
            side: 'review'
          };
        });
        var seen = {};
        DECK = mapped.concat(SEED_DEALS).filter(function (d) {
          var k = d.name; if (seen[k]) return false; seen[k] = true; return true;
        }).slice(0, 24);
        paint();
      })
      .catch(function () {});
  }

  function startPolling() {
    var visible = true;
    document.addEventListener('visibilitychange', function () {
      visible = document.visibilityState === 'visible';
      if (visible) tryFetchLive();
    });
    setInterval(function () { if (visible) tryFetchLive(); }, 30000);
  }

  function start() {
    shell();
    DECK = SEED_DEALS.slice();
    paint();
    tryFetchLive();
    startPolling();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
