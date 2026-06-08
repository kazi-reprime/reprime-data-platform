/* RePrime — Terminal Page Tabs (Phase 6.5)
 *
 * Wraps the existing dense panel layout on /terminal into five tabs:
 *   Overview / Pipeline / Capital / Market / Risk
 *
 * Strategy: instead of restructuring HTML (which would touch every panel),
 * this module classifies each .panel by its .panel-title text, tags with
 * data-tab, and toggles visibility on tab change. JS-off degrades to the
 * single long scroll the page already has.
 *
 * State persisted in URL hash (#t=overview) for shareable links.
 * Mounts the tab bar into #rp-terminal-tabs.
 */
(function () {
  'use strict';
  var el = document.getElementById('rp-terminal-tabs');
  if (!el) return;

  var TAB_MAP = [
    { tab: 'pipeline', match: ['key metrics', 'deal pipeline', 'portfolio summary', 'tenant roster'] },
    { tab: 'capital',  match: ['capital stack', 'financing landscape', 'lender'] },
    { tab: 'market',   match: ['market pulse', 'rate environment', 'macro', 'reit', 'yield curve', 'live market'] },
    { tab: 'risk',     match: ['environmental risk', 'flood', 'fema', 'epa', 'news feed', 'coverage'] }
  ];

  var TABS = [
    { id: 'overview', label: 'Overview',  hint: 'Everything in one scroll' },
    { id: 'pipeline', label: 'Pipeline',  hint: 'Deals · metrics · portfolio · tenants' },
    { id: 'capital',  label: 'Capital',   hint: 'Stack · financing · lenders' },
    { id: 'market',   label: 'Market',    hint: 'Macro · rates · REITs' },
    { id: 'risk',     label: 'Risk',      hint: 'Env · news · coverage' }
  ];

  function classifyPanel(titleText) {
    var t = (titleText || '').toLowerCase().trim();
    if (!t) return 'overview';
    for (var i = 0; i < TAB_MAP.length; i++) {
      for (var j = 0; j < TAB_MAP[i].match.length; j++) {
        if (t.indexOf(TAB_MAP[i].match[j]) !== -1) return TAB_MAP[i].tab;
      }
    }
    return 'overview';
  }

  function tagPanels() {
    document.querySelectorAll('.panel').forEach(function (p) {
      if (p.dataset.tab) return;
      var title = p.querySelector('.panel-title');
      p.dataset.tab = classifyPanel(title ? title.textContent : '');
    });
  }

  function renderTabBar(activeTab) {
    el.textContent = '';
    var bar = document.createElement('div');
    bar.style.cssText = 'display:flex;gap:6px;flex-wrap:wrap;padding:14px 0;max-width:1280px;margin:0 auto;border-bottom:1px solid var(--border,rgba(255,255,255,.1))';

    TABS.forEach(function (t) {
      var btn = document.createElement('button');
      btn.dataset.tab = t.id;
      var active = t.id === activeTab;
      btn.style.cssText =
        'background:' + (active ? 'var(--gold,#BC9C45)' : 'transparent') + ';' +
        'color:' + (active ? '#000' : 'var(--text,#e2e8f0)') + ';' +
        'border:1px solid ' + (active ? 'var(--gold,#BC9C45)' : 'var(--border,rgba(255,255,255,.18))') + ';' +
        'padding:8px 16px;border-radius:99px;font-size:12px;font-weight:600;letter-spacing:.04em;cursor:pointer;' +
        'transition:all .2s var(--ease-glass,cubic-bezier(0.4,0,0.2,1))';
      btn.textContent = t.label;
      btn.title = t.hint;
      btn.addEventListener('click', function () { activate(t.id); });
      bar.appendChild(btn);
    });

    var hint = document.createElement('div');
    hint.style.cssText = 'font-size:11px;color:var(--muted,#94a3b8);padding:6px 0 0';
    var t = TABS.find(function (x) { return x.id === activeTab; });
    hint.textContent = t ? t.hint : '';

    el.appendChild(bar);
    el.appendChild(hint);
  }

  function activate(tabId) {
    var t = TABS.find(function (x) { return x.id === tabId; }) || TABS[0];
    var active = t.id;
    try {
      var hp = {};
      location.hash.replace(/^#/, '').split('&').forEach(function (kv) {
        var p = kv.split('='); if (p[0]) hp[p[0]] = decodeURIComponent(p[1] || '');
      });
      hp.t = active;
      history.replaceState(null, '', '#' + Object.keys(hp).map(function (k) { return k + '=' + encodeURIComponent(hp[k]); }).join('&'));
    } catch (e) {}
    renderTabBar(active);

    document.querySelectorAll('.panel').forEach(function (p) {
      var pTab = p.dataset.tab || 'overview';
      var show = (active === 'overview') || (pTab === active) || (pTab === 'overview');
      p.style.display = show ? '' : 'none';
    });
  }

  function init() {
    tagPanels();
    var hp = {};
    location.hash.replace(/^#/, '').split('&').forEach(function (kv) {
      var p = kv.split('='); if (p[0]) hp[p[0]] = decodeURIComponent(p[1] || '');
    });
    var initial = TABS.find(function (x) { return x.id === hp.t; }) ? hp.t : 'overview';
    activate(initial);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
