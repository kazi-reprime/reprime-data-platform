/* ═══════════════════════════════════════════════════════════════
   REPRIME SHELL — Single source of truth for chrome behavior.
   Injects background layers, the nav (header), optional ticker
   (topper) and the footer, then wires the 4-theme toggle, glow
   cursor, particle field and scroll reveal. Linked by every page.
   Edit nav/footer/theme ONCE here; all pages stay in lockstep.
   ═══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  /* ─── Canonical nav links (mirror of site.html) ─── */
  var LINKS = [
    { href: '/site',     label: 'Platform' },
    { href: '/',         label: 'Dashboard' },
    { href: '/terminal', label: 'Terminal' },
    { href: '/explore',  label: 'Explore' },
    { href: '/data',     label: 'Data' },
    { href: '/sources',  label: 'Sources' },
    { href: '/wall',     label: 'Wall' }
  ];

  /* Normalize current path → canonical href for active-state matching */
  function currentHref() {
    var p = location.pathname.replace(/\/index\.html$/, '/').replace(/\.html$/, '');
    if (p === '' ) p = '/';
    if (p === '/dashboard') p = '/';          // dashboard.html highlights "Dashboard"
    if (p === '/data-coverage') p = '/data';  // safety if served as file
    return p;
  }

  var active = currentHref();

  var navLinksHTML = LINKS.map(function (l) {
    var on = (l.href === active) ? ' class="active"' : '';
    return '<a href="' + l.href + '"' + on + '>' + l.label + '</a>';
  }).join('');

  var hasTicker = document.body.classList.contains('rp-has-ticker');

  var navHTML =
    '<div class="mesh-bg"></div>' +
    '<div class="noise"></div>' +
    '<canvas id="particles"></canvas>' +
    '<div class="glow" id="rpGlow"></div>' +
    '<nav class="nav"><div class="nav-inner">' +
      '<a href="/site" class="nav-brand"><span class="logo-mark">RP</span>RePrime Group</a>' +
      '<div class="nav-links">' + navLinksHTML + '</div>' +
      '<div class="nav-right"><div class="theme-tog" id="rpThemeTog">' +
        '<button data-theme="dark" title="Dark">Dark</button>' +
        '<button data-theme="light" title="Light">Light</button>' +
        '<button data-theme="midnight" title="Midnight">Night</button>' +
        '<button data-theme="gold" title="Gold">Gold</button>' +
      '</div></div>' +
    '</div></nav>' +
    (hasTicker ? '<div class="ticker"><div class="ticker-track" id="rpTickerTrack"></div></div>' : '');

  document.body.insertAdjacentHTML('afterbegin', navHTML);

  /* ─── Footer ─── */
  var footerHTML =
    '<footer class="rp-footer"><div class="f-inner">' +
      '<div>' +
        '<h4 style="display:flex;align-items:center;gap:8px"><span class="logo-mark" style="width:24px;height:24px;font-size:10px;border-radius:6px;background:var(--grad-gold);color:#000;display:inline-flex;align-items:center;justify-content:center;font-weight:800">RP</span> RePrime Group</h4>' +
        '<p style="max-width:300px;line-height:1.6;margin-top:8px">Institutional Capital. Immediate Execution. Commercial real estate across all asset classes — 800+ transactions, 21M+ sq ft nationwide.</p>' +
      '</div>' +
      '<div><h4>Company</h4>' +
        '<a href="/about">About</a><a href="/team">Team</a><a href="/partners">Partners</a><a href="/faq">FAQ</a><a href="/help">Help</a>' +
      '</div>' +
      '<div><h4>Portals</h4>' +
        '<a href="https://info.reprimeterminal.com/" target="_blank" rel="noopener">For Investors</a>' +
        '<a href="http://broker.reprimeterminal.com" target="_blank" rel="noopener">For Brokers — Submit a Deal</a>' +
        '<a href="https://reprimepro.co.il" target="_blank" rel="noopener">Israeli Investors — RePrime Pro</a>' +
        '<a href="/terminal">RePrime Terminal</a>' +
      '</div>' +
      '<div><h4>Contact</h4>' +
        '<a href="mailto:info@reprime.com">info@reprime.com</a>' +
        '<a href="tel:+18887708770">888-770-8770</a>' +
        '<a href="#">123 North Lawler St, Postville, IA 52162</a>' +
        '<a href="https://reprime.com/privacy-policy/" target="_blank" rel="noopener">Privacy</a>' +
        '<a href="https://reprime.com/terms-of-use/" target="_blank" rel="noopener">Terms</a>' +
      '</div>' +
    '</div>' +
    '<div class="f-legal"><span>© 2026 RePrime Group. All rights reserved.</span><span>Institutional Use Only · reprime.com</span></div>' +
    '</footer>';

  document.body.insertAdjacentHTML('beforeend', footerHTML);

  /* ─── Theme system (4 themes, persisted) ─── */
  var saved = localStorage.getItem('rp-theme') || 'dark';
  document.documentElement.setAttribute('data-theme', saved);
  var togBtns = document.querySelectorAll('#rpThemeTog button');
  togBtns.forEach(function (b) {
    b.classList.toggle('active', b.dataset.theme === saved);
    b.addEventListener('click', function () {
      document.documentElement.setAttribute('data-theme', b.dataset.theme);
      localStorage.setItem('rp-theme', b.dataset.theme);
      togBtns.forEach(function (x) { x.classList.remove('active'); });
      b.classList.add('active');
    });
  });

  /* ─── Glow cursor ─── */
  var glow = document.getElementById('rpGlow');
  if (glow) {
    document.addEventListener('mousemove', function (e) {
      glow.style.left = e.clientX + 'px';
      glow.style.top = e.clientY + 'px';
    });
  }

  /* ─── Particle field ─── */
  (function () {
    var c = document.getElementById('particles');
    if (!c) return;
    var ctx = c.getContext('2d'), w, h, pts = [];
    function resize() {
      w = c.width = innerWidth; h = c.height = innerHeight; pts = [];
      for (var i = 0; i < 60; i++) pts.push({ x: Math.random() * w, y: Math.random() * h, vx: (Math.random() - .5) * .3, vy: (Math.random() - .5) * .3, r: Math.random() * 1.5 + .5 });
    }
    resize(); window.addEventListener('resize', resize);
    function draw() {
      ctx.clearRect(0, 0, w, h);
      var gold = getComputedStyle(document.documentElement).getPropertyValue('--gold').trim() || '#BC9C45';
      pts.forEach(function (p) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = gold; ctx.globalAlpha = .15; ctx.fill();
      });
      for (var i = 0; i < pts.length; i++) {
        for (var j = i + 1; j < pts.length; j++) {
          var dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y, d = Math.sqrt(dx * dx + dy * dy);
          if (d < 120) { ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y); ctx.strokeStyle = gold; ctx.globalAlpha = .04 * (1 - d / 120); ctx.stroke(); }
        }
      }
      ctx.globalAlpha = 1;
      requestAnimationFrame(draw);
    }
    draw();
  })();

  /* ─── Scroll reveal ─── */
  var obs = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
  }, { threshold: .1, rootMargin: '0px 0px -50px 0px' });
  document.querySelectorAll('.reveal').forEach(function (el) { obs.observe(el); });

  /* ─── Ticker (topper) — only when present; degrade gracefully ─── */
  if (hasTicker) {
    fetch('/api/live/ticker').then(function (r) { return r.json(); }).then(function (d) {
      var track = document.getElementById('rpTickerTrack');
      if (!track) return;
      var labels = { treasury_10y: '10Y Treasury', mortgage_30y: '30Y Mortgage', fed_funds: 'Fed Funds', unemployment: 'Unemployment', sofr: 'SOFR', bitcoin: 'Bitcoin', ethereum: 'Ethereum' };
      var items = Object.entries(d).filter(function (e) { return e[1] && e[1].value; }).map(function (e) { return { l: labels[e[0]] || e[0], val: e[1].value, s: e[1].source || '' }; });
      if (!items.length) { dropTicker(); return; }
      var html = '';
      for (var r = 0; r < 2; r++) { items.forEach(function (i) { html += '<div class="ti"><span class="pulse"></span>' + i.l + ' <strong>' + i.val + '</strong> <span class="src">' + i.s + '</span></div>'; }); }
      track.innerHTML = html;
    }).catch(dropTicker);
  }
  function dropTicker() {
    var t = document.querySelector('.ticker');
    if (t) t.remove();
    document.body.classList.remove('rp-has-ticker');
  }
})();
