/* RePrime Terminal — Composition Donuts
 *
 * Three SVG donut charts side-by-side showing composition breakdowns of
 * the CRE portfolio universe:
 *   1. Sales Price Mix       (price bands)
 *   2. Off-plan vs Secondary (deal source)
 *   3. Bedroom-Type Mix      (unit composition)
 *
 * Mounts into #rp-comp-donuts.
 * Pure SVG + DOM construction — no external libs. Original arc-path math
 * implemented inline. XSS-safe (textContent throughout). Reduced-motion safe.
 */
(function () {
  'use strict';
  var el = document.getElementById('rp-comp-donuts');
  if (!el) return;

  var DATASETS = [
    {
      title: 'Sales Price Mix',
      caption: 'Villas & Townhouses',
      slices: [
        { label: '<$750K',   pct: 11.4, color: '#1e3a8a' },
        { label: '$750K-1M', pct: 15.1, color: '#1e40af' },
        { label: '$1M-1.5M', pct: 26.6, color: '#3b82f6' },
        { label: '$1.5M-2M', pct: 13.7, color: '#60a5fa' },
        { label: '$2M-3M',   pct: 16.4, color: '#93c5fd' },
        { label: '$3M-5M',   pct: 11.4, color: '#BC9C45' },
        { label: '$5M-10M',  pct:  3.4, color: '#d4af37' },
        { label: '$10M+',    pct:  2.0, color: '#fde68a' }
      ]
    },
    {
      title: 'Off-plan vs Secondary',
      caption: 'By Value',
      slices: [
        { label: 'Off-plan',  pct: 61, color: '#0f766e' },
        { label: 'Secondary', pct: 39, color: '#BC9C45' }
      ]
    },
    {
      title: 'Bedroom-Type Mix',
      caption: 'Apartments',
      slices: [
        { label: 'Studio',  pct: 25.9, color: '#1e3a8a' },
        { label: '1 Bed',   pct: 41.2, color: '#3b82f6' },
        { label: '2 Bed',   pct: 25.5, color: '#60a5fa' },
        { label: '3 Bed',   pct:  6.7, color: '#BC9C45' },
        { label: '4 Bed',   pct:  0.6, color: '#d4af37' },
        { label: '5+ Bed',  pct:  0.1, color: '#fde68a' }
      ]
    }
  ];

  function arcPath(cx, cy, rOuter, rInner, startAngle, endAngle) {
    var sx = cx + rOuter * Math.sin(startAngle);
    var sy = cy - rOuter * Math.cos(startAngle);
    var ex = cx + rOuter * Math.sin(endAngle);
    var ey = cy - rOuter * Math.cos(endAngle);
    var sxi = cx + rInner * Math.sin(endAngle);
    var syi = cy - rInner * Math.cos(endAngle);
    var exi = cx + rInner * Math.sin(startAngle);
    var eyi = cy - rInner * Math.cos(startAngle);
    var largeArc = (endAngle - startAngle) > Math.PI ? 1 : 0;
    return 'M ' + sx + ' ' + sy +
           ' A ' + rOuter + ' ' + rOuter + ' 0 ' + largeArc + ' 1 ' + ex + ' ' + ey +
           ' L ' + sxi + ' ' + syi +
           ' A ' + rInner + ' ' + rInner + ' 0 ' + largeArc + ' 0 ' + exi + ' ' + eyi +
           ' Z';
  }

  function buildDonut(data) {
    var wrap = document.createElement('div');
    wrap.style.cssText = 'display:flex;flex-direction:column;align-items:center;min-width:0;padding:18px 12px';

    var title = document.createElement('div');
    title.style.cssText = 'font-size:13px;font-weight:700;color:var(--text);margin-bottom:2px';
    title.textContent = data.title;
    var caption = document.createElement('div');
    caption.style.cssText = 'font-size:10px;color:var(--muted,#94a3b8);letter-spacing:.04em;margin-bottom:12px';
    caption.textContent = data.caption;
    wrap.appendChild(title); wrap.appendChild(caption);

    var SIZE = 260, cx = SIZE/2, cy = SIZE/2, rOuter = 110, rInner = 70;
    var svgNS = 'http://www.w3.org/2000/svg';
    var svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('viewBox', '0 0 ' + SIZE + ' ' + SIZE);
    svg.setAttribute('width', '100%');
    svg.style.maxWidth = SIZE + 'px';

    var totalPct = data.slices.reduce(function (a, s) { return a + s.pct; }, 0);
    var angle = 0;

    var center = document.createElementNS(svgNS, 'g');
    center.setAttribute('transform', 'translate(' + cx + ',' + cy + ')');
    var centerLabel = document.createElementNS(svgNS, 'text');
    centerLabel.setAttribute('text-anchor', 'middle');
    centerLabel.setAttribute('y', -6);
    centerLabel.setAttribute('font-family', "'JetBrains Mono', monospace");
    centerLabel.setAttribute('font-size', '20');
    centerLabel.setAttribute('font-weight', '700');
    centerLabel.setAttribute('fill', 'var(--text)');
    centerLabel.textContent = '100%';
    var centerSub = document.createElementNS(svgNS, 'text');
    centerSub.setAttribute('text-anchor', 'middle');
    centerSub.setAttribute('y', 14);
    centerSub.setAttribute('font-family', 'Poppins, system-ui, sans-serif');
    centerSub.setAttribute('font-size', '9');
    centerSub.setAttribute('fill', 'var(--muted,#94a3b8)');
    centerSub.textContent = data.caption;
    center.appendChild(centerLabel); center.appendChild(centerSub);

    data.slices.forEach(function (slice, idx) {
      var startA = (angle / totalPct) * Math.PI * 2;
      var endA = ((angle + slice.pct) / totalPct) * Math.PI * 2;
      angle += slice.pct;
      var path = document.createElementNS(svgNS, 'path');
      path.setAttribute('d', arcPath(cx, cy, rOuter, rInner, startA, endA));
      path.setAttribute('fill', slice.color);
      path.setAttribute('opacity', '0.92');
      path.style.cursor = 'pointer';
      path.style.transition = 'transform .2s var(--ease-glass,cubic-bezier(0.4,0,0.2,1)), opacity .2s';
      path.dataset.sliceIdx = idx;
      path.addEventListener('mouseenter', function () {
        this.setAttribute('opacity', '1');
        var midAngle = (startA + endA) / 2;
        var pushX = Math.sin(midAngle) * 6, pushY = -Math.cos(midAngle) * 6;
        this.style.transform = 'translate(' + pushX + 'px, ' + pushY + 'px)';
        centerLabel.textContent = slice.pct.toFixed(1) + '%';
        centerSub.textContent = slice.label;
      });
      path.addEventListener('mouseleave', function () {
        this.setAttribute('opacity', '0.92');
        this.style.transform = '';
        centerLabel.textContent = '100%';
        centerSub.textContent = data.caption;
      });
      svg.appendChild(path);
    });
    svg.appendChild(center);
    wrap.appendChild(svg);

    var legend = document.createElement('div');
    legend.style.cssText = 'display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:4px 12px;margin-top:14px;width:100%;max-width:260px';
    data.slices.forEach(function (slice) {
      var row = document.createElement('div');
      row.style.cssText = 'display:flex;align-items:center;gap:8px;font-size:11px';
      var dot = document.createElement('span');
      dot.style.cssText = 'display:inline-block;width:9px;height:9px;border-radius:2px;background:' + slice.color + ';flex-shrink:0';
      var lab = document.createElement('span');
      lab.style.cssText = 'color:var(--text);flex:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis';
      lab.textContent = slice.label;
      var pct = document.createElement('span');
      pct.style.cssText = "color:var(--gold,#BC9C45);font-family:'JetBrains Mono',monospace;font-weight:700;font-variant-numeric:tabular-nums slashed-zero";
      pct.textContent = slice.pct.toFixed(1) + '%';
      row.appendChild(dot); row.appendChild(lab); row.appendChild(pct);
      legend.appendChild(row);
    });
    wrap.appendChild(legend);

    return wrap;
  }

  function shell() {
    el.innerHTML = '';
    var card = document.createElement('div');
    card.className = 'rp-glass-2';
    card.style.cssText = 'max-width:1280px;margin:24px auto;padding:18px 0 8px;overflow:hidden';

    var head = document.createElement('div');
    head.style.cssText = 'display:flex;justify-content:space-between;align-items:center;padding:0 18px 14px;flex-wrap:wrap;gap:8px';
    var label = document.createElement('div');
    label.style.cssText = 'display:flex;align-items:center;gap:10px';
    var dot = document.createElement('span'); dot.className = 'rp-live-dot';
    var name = document.createElement('span');
    name.style.cssText = 'font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--gold,#BC9C45)';
    name.textContent = 'RePrime Terminal — Composition';
    label.appendChild(dot); label.appendChild(name);
    var hint = document.createElement('div');
    hint.style.cssText = 'font-size:10px;color:var(--muted,#94a3b8)';
    hint.textContent = 'Hover any slice for detail · 3 breakdowns';
    head.appendChild(label); head.appendChild(hint);
    card.appendChild(head);

    var row = document.createElement('div');
    row.style.cssText = 'display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;align-items:start';
    DATASETS.forEach(function (ds) { row.appendChild(buildDonut(ds)); });
    card.appendChild(row);

    var foot = document.createElement('div');
    foot.style.cssText = 'padding:10px 18px 14px;font-size:9px;color:var(--muted,#94a3b8);text-align:right';
    var a = document.createElement('a');
    a.href = '/wall'; a.style.cssText = 'color:var(--gold,#BC9C45);text-decoration:none;font-weight:600;letter-spacing:.04em';
    a.textContent = 'View underlying deals →';
    foot.appendChild(a);
    card.appendChild(foot);

    el.appendChild(card);

    var style = document.createElement('style');
    style.textContent = '@media(max-width:820px){#rp-comp-donuts > div > div:nth-of-type(2){grid-template-columns:1fr!important}}';
    el.appendChild(style);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', shell);
  else shell();
})();
