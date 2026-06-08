/* RePrime — NL source discovery UI (Phase 4, ADR-002)
 *
 * Mounts a natural-language search box into any element with id="rp-discover".
 * Calls /api/discover?q=... and renders ranked source cards.
 *
 * XSS-safe: all dynamic content via textContent / DOM construction (Phase 2.9).
 */
(function () {
  'use strict';
  var el = document.getElementById('rp-discover');
  if (!el) return;

  var DEBOUNCE_MS = 350;
  var MIN_LEN = 5;
  var debounceTimer = null;
  var inflight = null;

  function shell() {
    el.textContent = '';
    var wrap = document.createElement('div');
    wrap.style.cssText = 'max-width:1280px;margin:36px auto 0';

    var eyebrow = document.createElement('div');
    eyebrow.textContent = 'AI Source Discovery';
    eyebrow.style.cssText = 'font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.1em;color:var(--gold,#BC9C45);margin-bottom:8px';

    var heading = document.createElement('div');
    heading.textContent = 'Describe what you need.';
    heading.style.cssText = 'font-size:clamp(22px,3vw,30px);font-weight:700;color:var(--text);line-height:1.15;margin-bottom:6px';

    var sub = document.createElement('div');
    sub.textContent = 'Natural-language search over the full source catalog. Powered by pgvector embeddings.';
    sub.style.cssText = 'font-size:13px;color:var(--muted);font-weight:300;margin-bottom:18px';

    var card = document.createElement('div');
    card.className = 'rp-glass rp-rise';
    card.style.cssText = 'padding:18px';

    var inputRow = document.createElement('div');
    inputRow.style.cssText = 'display:flex;gap:10px;flex-wrap:wrap;align-items:center;margin-bottom:14px';

    var input = document.createElement('input');
    input.id = 'rp-discover-q';
    input.type = 'search';
    input.placeholder = 'e.g. free APIs for treasury yields, or REIT financials without an API key';
    input.style.cssText = 'flex:1;min-width:280px;background:var(--surface);border:1px solid var(--border);border-radius:10px;padding:13px 14px;color:var(--text);font-size:14px;font-family:inherit;outline:none';

    var status = document.createElement('div');
    status.id = 'rp-discover-status';
    status.style.cssText = 'font-size:11px;color:var(--muted);min-width:140px';
    status.textContent = 'Type a question to begin.';

    inputRow.appendChild(input);
    inputRow.appendChild(status);

    var grid = document.createElement('div');
    grid.id = 'rp-discover-grid';
    grid.style.cssText = 'display:grid;grid-template-columns:repeat(auto-fill,minmax(290px,1fr));gap:10px';

    card.appendChild(inputRow);
    card.appendChild(grid);
    wrap.appendChild(eyebrow);
    wrap.appendChild(heading);
    wrap.appendChild(sub);
    wrap.appendChild(card);
    el.appendChild(wrap);

    input.addEventListener('input', onInput);
  }

  function setStatus(t) {
    var s = document.getElementById('rp-discover-status');
    if (s) s.textContent = t;
  }

  function onInput(e) {
    var q = (e.target.value || '').trim();
    if (debounceTimer) clearTimeout(debounceTimer);
    if (q.length < MIN_LEN) {
      setStatus('Type at least ' + MIN_LEN + ' characters.');
      renderGrid([]);
      return;
    }
    debounceTimer = setTimeout(function () { search(q); }, DEBOUNCE_MS);
  }

  function search(q) {
    setStatus('Searching…');
    var ctl = (typeof AbortController !== 'undefined') ? new AbortController() : null;
    if (inflight && inflight.abort) try { inflight.abort(); } catch (e) {}
    inflight = ctl;

    var url = '/api/discover?q=' + encodeURIComponent(q) + '&k=12';
    fetch(url, { signal: ctl ? ctl.signal : undefined, headers: { Accept: 'application/json' } })
      .then(function (r) {
        if (r.ok) return r.json();
        return r.json().then(function (j) { throw new Error(j.message || ('HTTP ' + r.status)); });
      })
      .then(function (data) {
        var results = (data && data.results) || [];
        setStatus(results.length + ' matches');
        renderGrid(results);
      })
      .catch(function (err) {
        if (err.name === 'AbortError') return;
        setStatus('Search failed: ' + String(err.message || err).slice(0, 60));
        renderGrid([]);
      });
  }

  function renderGrid(results) {
    var grid = document.getElementById('rp-discover-grid');
    if (!grid) return;
    grid.textContent = '';
    if (!results.length) {
      var empty = document.createElement('div');
      empty.style.cssText = 'grid-column:1/-1;text-align:center;color:var(--muted);font-size:13px;padding:24px';
      empty.textContent = 'No matches yet.';
      grid.appendChild(empty);
      return;
    }
    results.forEach(function (r) { grid.appendChild(cardFor(r)); });
  }

  function cardFor(r) {
    // DOM construction throughout — XSS-safe (Phase 2.9).
    var card = document.createElement('div');
    card.className = 'rp-glass';
    card.style.cssText = 'padding:13px 14px;border-left:3px solid var(--gold,#BC9C45)';

    var head = document.createElement('div');
    head.style.cssText = 'display:flex;justify-content:space-between;gap:8px;align-items:start';

    var nameEl = document.createElement('div');
    nameEl.style.cssText = 'font-size:12.5px;font-weight:600;color:var(--text);line-height:1.3;flex:1';
    if (r.url) {
      var a = document.createElement('a');
      a.href = String(r.url); a.target = '_blank'; a.rel = 'noopener noreferrer';
      a.style.cssText = 'color:var(--text);text-decoration:none';
      a.textContent = String(r.name || '(unnamed)') + ' ↗';
      nameEl.appendChild(a);
    } else {
      nameEl.textContent = String(r.name || '(unnamed)');
    }

    var sim = document.createElement('span');
    sim.style.cssText = 'flex-shrink:0;font-size:9px;font-weight:700;color:var(--gold,#BC9C45);background:var(--surface);padding:2px 7px;border-radius:99px;font-family:"JetBrains Mono",monospace';
    sim.textContent = (typeof r.similarity === 'number' ? (r.similarity * 100).toFixed(0) + '%' : '—');

    head.appendChild(nameEl);
    head.appendChild(sim);

    var meta = document.createElement('div');
    meta.style.cssText = 'display:flex;gap:6px;flex-wrap:wrap;margin-top:8px;align-items:center;font-size:9px';

    [r.category, r.provider, r.tier, r.auth].forEach(function (v) {
      if (!v) return;
      var pill = document.createElement('span');
      pill.style.cssText = 'font-weight:700;text-transform:uppercase;letter-spacing:.04em;color:var(--muted);background:var(--surface);padding:2px 7px;border-radius:99px';
      pill.textContent = String(v).replace(/_/g, ' ');
      meta.appendChild(pill);
    });

    card.appendChild(head);
    card.appendChild(meta);
    return card;
  }

  shell();
})();
