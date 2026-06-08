/* RePrime Group — Featured Projects Carousel
 *
 * Auto-scrolling project gallery with hover-pause. Each card is a
 * photo-led project tile with type badge, name, market w/ country code,
 * cap rate, IRR, and value. Uses existing /images/om_p*.jpeg assets.
 *
 * Mounts into #rp-featured-projects.
 * Pure DOM construction (XSS-safe). Reduced-motion safe.
 */
(function () {
  'use strict';
  var el = document.getElementById('rp-featured-projects');
  if (!el) return;

  var REDUCED_MOTION = false;
  try { REDUCED_MOTION = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}

  var PROJECTS = [
    { name: 'The Palms at Doral',     market: 'Doral · US',          type: 'Multifamily', cap: '6.2%', irr: '18.4%', value: '$61.2M',  image: '/images/om_p1_img1.jpeg',  tag: 'Reviewed' },
    { name: 'Coral Springs Office',   market: 'Coral Springs · US',  type: 'Office',      cap: '7.1%', irr: '15.8%', value: '$38.5M',  image: '/images/om_p5_img1.jpeg',  tag: 'Reviewed' },
    { name: 'Tampa Bay Industrial',   market: 'Tampa · US',          type: 'Industrial',  cap: '5.8%', irr: '17.6%', value: '$52.8M',  image: '/images/om_p7_img1.jpeg',  tag: 'Reviewed' },
    { name: 'Orlando Mixed-Use',      market: 'Orlando · US',        type: 'Mixed-Use',   cap: '5.5%', irr: '19.2%', value: '$89.3M',  image: '/images/om_p9_img1.jpeg',  tag: 'Reviewed' },
    { name: 'Ft. Lauderdale Retail',  market: 'Ft. Lauderdale · US', type: 'Retail',      cap: '6.8%', irr: '14.5%', value: '$42.7M',  image: '/images/om_p12_img1.jpeg', tag: 'Reviewed' },
    { name: 'Brickell Tower',         market: 'Miami · US',          type: 'Office',      cap: '5.4%', irr: '16.1%', value: '$215.0M', image: '/images/om_p1_img1.jpeg',  tag: 'Sourced'  },
    { name: 'Hialeah Logistics',      market: 'Hialeah · US',        type: 'Industrial',  cap: '5.5%', irr: '17.9%', value: '$78.5M',  image: '/images/om_p7_img1.jpeg',  tag: 'Advised'  }
  ];

  var TYPE_COLOR = {
    'Multifamily': '#22c55e', 'Office': '#00A1FF', 'Industrial': '#BC9C45',
    'Retail': '#FFBC7D', 'Mixed-Use': '#009080', 'Land': '#94a3b8', 'Hotel': '#ef4444'
  };

  function buildCard(p) {
    var card = document.createElement('div');
    card.style.cssText = 'flex-shrink:0;width:340px;height:480px;border-radius:14px;overflow:hidden;position:relative;border:1px solid var(--border,rgba(255,255,255,.1));' +
      "background-image:linear-gradient(180deg, rgba(2,6,23,.0) 0%, rgba(2,6,23,.4) 50%, rgba(2,6,23,.95) 100%), url('" + p.image + "');" +
      'background-size:cover;background-position:center;transition:transform .35s var(--ease-glass,cubic-bezier(0.4,0,0.2,1)),box-shadow .35s;cursor:pointer';
    card.addEventListener('mouseenter', function () { this.style.transform = 'translateY(-4px) scale(1.01)'; this.style.boxShadow = '0 24px 60px -20px rgba(0,0,0,.6)'; });
    card.addEventListener('mouseleave', function () { this.style.transform = ''; this.style.boxShadow = ''; });

    var topRow = document.createElement('div');
    topRow.style.cssText = 'position:absolute;top:14px;left:14px;right:14px;display:flex;justify-content:space-between;align-items:start;gap:8px';
    var typeBadge = document.createElement('span');
    typeBadge.style.cssText = 'background:' + (TYPE_COLOR[p.type] || '#BC9C45') + ';color:#000;padding:4px 10px;border-radius:99px;font-size:10px;font-weight:700;letter-spacing:.06em;text-transform:uppercase';
    typeBadge.textContent = p.type;
    var tagBadge = document.createElement('span');
    tagBadge.style.cssText = 'background:rgba(15,23,42,.85);color:var(--gold,#BC9C45);padding:4px 10px;border-radius:99px;font-size:9px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;border:1px solid var(--gold,#BC9C45);backdrop-filter:blur(8px)';
    tagBadge.textContent = p.tag;
    topRow.appendChild(typeBadge); topRow.appendChild(tagBadge);
    card.appendChild(topRow);

    var bottom = document.createElement('div');
    bottom.style.cssText = 'position:absolute;left:0;right:0;bottom:0;padding:18px;color:var(--text);display:flex;flex-direction:column;gap:6px';

    var market = document.createElement('div');
    market.style.cssText = 'font-size:10px;letter-spacing:.1em;text-transform:uppercase;color:var(--gold,#BC9C45);font-weight:700';
    market.textContent = p.market;

    var name = document.createElement('div');
    name.style.cssText = "font-family:'Fraunces','Poppins',serif;font-size:22px;font-weight:500;line-height:1.15;letter-spacing:-0.01em";
    name.textContent = p.name;

    var divider = document.createElement('div');
    divider.style.cssText = 'height:1px;background:rgba(255,255,255,.18);margin:8px 0 4px';

    var metrics = document.createElement('div');
    metrics.style.cssText = 'display:grid;grid-template-columns:repeat(3,1fr);gap:8px';
    [['Cap', p.cap], ['IRR', p.irr], ['Value', p.value]].forEach(function (kv) {
      var col = document.createElement('div');
      var lab = document.createElement('div');
      lab.style.cssText = 'font-size:9px;color:var(--muted,#94a3b8);letter-spacing:.06em;text-transform:uppercase;margin-bottom:2px';
      lab.textContent = kv[0];
      var v = document.createElement('div');
      v.style.cssText = "font-family:'JetBrains Mono',monospace;font-size:14px;font-weight:700;color:var(--text);font-variant-numeric:tabular-nums slashed-zero";
      v.textContent = kv[1];
      col.appendChild(lab); col.appendChild(v);
      metrics.appendChild(col);
    });

    bottom.appendChild(market);
    bottom.appendChild(name);
    bottom.appendChild(divider);
    bottom.appendChild(metrics);
    card.appendChild(bottom);

    return card;
  }

  function shell() {
    el.innerHTML = '';
    var wrap = document.createElement('div');
    wrap.className = 'rp-glass-2';
    wrap.style.cssText = 'max-width:1280px;margin:24px auto;padding:18px 0;overflow:hidden';

    var head = document.createElement('div');
    head.style.cssText = 'display:flex;justify-content:space-between;align-items:center;padding:0 18px 14px;flex-wrap:wrap;gap:8px';
    var label = document.createElement('div');
    label.style.cssText = 'display:flex;align-items:center;gap:10px';
    var dot = document.createElement('span'); dot.className = 'rp-live-dot';
    var name = document.createElement('span');
    name.style.cssText = 'font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--gold,#BC9C45)';
    name.textContent = 'RePrime Group — Featured Projects';
    label.appendChild(dot); label.appendChild(name);
    var foot = document.createElement('a');
    foot.href = '/terminal';
    foot.style.cssText = 'font-size:10px;color:var(--muted,#94a3b8);text-decoration:none';
    foot.textContent = '→ Open RePrime Terminal';
    head.appendChild(label); head.appendChild(foot);
    wrap.appendChild(head);

    var track = document.createElement('div');
    track.id = 'rp-projects-track';
    var anim = REDUCED_MOTION ? '' : 'rp-projects-scroll 60s linear infinite';
    track.style.cssText = 'display:flex;gap:14px;padding:6px 18px;animation:' + anim + ';will-change:transform';
    track.addEventListener('mouseenter', function () { this.style.animationPlayState = 'paused'; });
    track.addEventListener('mouseleave', function () { this.style.animationPlayState = 'running'; });

    for (var dup = 0; dup < 2; dup++) {
      PROJECTS.forEach(function (p) { track.appendChild(buildCard(p)); });
    }
    wrap.appendChild(track);

    var ssub = document.createElement('div');
    ssub.style.cssText = 'padding:8px 18px 0;font-size:9px;color:var(--muted,#94a3b8);text-align:right;letter-spacing:.04em';
    ssub.textContent = 'Reviewed · Sourced · Advised — no claim of ownership · auto-scroll · hover any card to pause';
    wrap.appendChild(ssub);

    el.appendChild(wrap);

    var style = document.createElement('style');
    style.textContent = '@keyframes rp-projects-scroll{from{transform:translateX(0)}to{transform:translateX(-50%)}}@media(prefers-reduced-motion:reduce){#rp-projects-track{animation:none!important}}';
    el.appendChild(style);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', shell);
  else shell();
})();
