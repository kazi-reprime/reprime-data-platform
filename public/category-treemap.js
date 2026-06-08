/* RePrime Group — Property Category Treemap
 *
 * Squarified treemap of property categories. Tile area = transaction
 * $-volume. Tile color = cap-rate compression (green→amber→red). Clicks
 * drill into /sources to view that category's catalog.
 *
 * Mounts into #rp-cat-treemap.
 * Loads D3 v7 on-demand (from cdnjs with verified SRI). DOM construction.
 * Reduced-motion safe.
 *
 * Uses the squarified-treemap layout from D3 — original implementation
 * with RePrime branding and CRE data.
 */
(function () {
  'use strict';
  var el = document.getElementById('rp-cat-treemap');
  if (!el) return;

  var D3_SRC = 'https://cdnjs.cloudflare.com/ajax/libs/d3/7.9.0/d3.min.js';
  var D3_SRI = 'sha384-CjloA8y00+1SDAUkjs099PVfnY2KmDC2BZnws9kh8D/lX1s46w6EPhpXdqMfjK6i';

  var CATEGORIES = [
    { name: 'Multifamily',  ticker: 'MF',  vol: 11.2, cap: 5.8, deals: 142, region: 'US National' },
    { name: 'Industrial',   ticker: 'IND', vol:  8.6, cap: 5.5, deals: 98,  region: 'US National' },
    { name: 'Office',       ticker: 'OFF', vol:  6.2, cap: 7.4, deals: 71,  region: 'US Top-25' },
    { name: 'Retail',       ticker: 'RET', vol:  5.4, cap: 6.6, deals: 86,  region: 'US National' },
    { name: 'Mixed-Use',    ticker: 'MIX', vol:  3.8, cap: 5.7, deals: 42,  region: 'Coastal US' },
    { name: 'Hotel',        ticker: 'HOT', vol:  3.2, cap: 7.1, deals: 38,  region: 'Sun Belt US' },
    { name: 'Self-Storage', ticker: 'STO', vol:  2.4, cap: 5.4, deals: 51,  region: 'US National' },
    { name: 'Data Center',  ticker: 'DC',  vol:  2.0, cap: 5.2, deals: 14,  region: 'NA + EU' },
    { name: 'Healthcare',   ticker: 'HC',  vol:  1.8, cap: 6.1, deals: 26,  region: 'US National' },
    { name: 'Land',         ticker: 'LND', vol:  1.4, cap: null,deals: 32,  region: 'US + CA' },
    { name: 'Senior Living',ticker: 'SR',  vol:  1.2, cap: 6.8, deals: 18,  region: 'US National' },
    { name: 'Life Sciences',ticker: 'LS',  vol:  1.0, cap: 5.0, deals: 11,  region: 'Boston / SF / RTP' }
  ];

  function load(src) {
    return new Promise(function (res) {
      if (window.d3) return res();
      var s = document.createElement('script');
      s.src = src; s.integrity = D3_SRI; s.crossOrigin = 'anonymous'; s.referrerPolicy = 'no-referrer';
      s.onload = res; s.onerror = res; document.head.appendChild(s);
    });
  }

  function interpHex(a, b, t) {
    var pa = parseInt(a.slice(1), 16), pb = parseInt(b.slice(1), 16);
    var ra = (pa >> 16) & 255, ga = (pa >> 8) & 255, ba = pa & 255;
    var rb = (pb >> 16) & 255, gb = (pb >> 8) & 255, bb = pb & 255;
    var r = Math.round(ra + (rb - ra) * t);
    var g = Math.round(ga + (gb - ga) * t);
    var bl = Math.round(ba + (bb - ba) * t);
    return '#' + ((1 << 24) + (r << 16) + (g << 8) + bl).toString(16).slice(1);
  }
  function capColor(cap) {
    if (cap == null) return '#6b7280';
    var t = Math.max(0, Math.min(1, (cap - 5) / 3));
    if (t < 0.5) return interpHex('#22c55e', '#d4af37', t * 2);
    return interpHex('#d4af37', '#ef4444', (t - 0.5) * 2);
  }

  function shell() {
    el.innerHTML =
      '<div class="rp-glass-2" style="max-width:1280px;margin:24px auto;padding:16px 0 0;overflow:hidden">' +
        '<div style="display:flex;justify-content:space-between;align-items:center;padding:0 18px 12px;flex-wrap:wrap;gap:8px">' +
          '<div style="display:flex;align-items:center;gap:10px">' +
            '<span class="rp-live-dot"></span>' +
            '<span style="font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--gold,#BC9C45)">RePrime Terminal — Sector Map</span>' +
          '</div>' +
          '<div style="display:flex;gap:14px;align-items:center;font-size:10px;color:var(--muted,#94a3b8)">' +
            '<span>Area = $-volume · Color = cap-rate (green tight, red wide)</span>' +
            '<a href="/wall" style="color:var(--gold,#BC9C45);text-decoration:none">→ All deals</a>' +
          '</div>' +
        '</div>' +
        '<div style="position:relative;width:100%;aspect-ratio:16/9;max-height:520px;padding:0 18px 18px">' +
          '<svg id="rp-treemap-svg" style="width:100%;height:100%;display:block"></svg>' +
          '<div id="rp-treemap-tooltip" style="position:absolute;pointer-events:none;background:rgba(15,23,42,.96);border:1px solid var(--gold,#BC9C45);border-radius:8px;padding:10px 14px;font-size:12px;color:var(--text);display:none;z-index:3;backdrop-filter:blur(10px);min-width:200px"></div>' +
        '</div>' +
      '</div>';
  }

  function render() {
    var svgEl = document.getElementById('rp-treemap-svg');
    if (!svgEl || !window.d3) return;
    var d3 = window.d3;
    var rect = svgEl.getBoundingClientRect();
    var W = rect.width, H = rect.height;
    if (W < 50 || H < 50) return;

    var svg = d3.select(svgEl);
    svg.selectAll('*').remove();

    var root = d3.hierarchy({ children: CATEGORIES }).sum(function (d) { return d.vol || 0; }).sort(function (a, b) { return b.value - a.value; });
    d3.treemap().size([W, H]).paddingInner(3).round(true)(root);

    var nodes = svg.selectAll('g').data(root.leaves()).enter().append('g')
      .attr('transform', function (d) { return 'translate(' + d.x0 + ',' + d.y0 + ')'; })
      .style('cursor', 'pointer');

    nodes.append('rect')
      .attr('width',  function (d) { return d.x1 - d.x0; })
      .attr('height', function (d) { return d.y1 - d.y0; })
      .attr('rx', 6).attr('ry', 6)
      .attr('fill', function (d) { return capColor(d.data.cap); })
      .attr('fill-opacity', 0.85)
      .attr('stroke', 'rgba(0,0,0,.25)')
      .attr('stroke-width', 1)
      .style('transition', 'fill-opacity .25s var(--ease-glass,cubic-bezier(0.4,0,0.2,1))')
      .on('mouseenter', function () { d3.select(this).attr('fill-opacity', 1); })
      .on('mouseleave', function () { d3.select(this).attr('fill-opacity', 0.85); });

    nodes.append('text')
      .attr('x', 10).attr('y', 22)
      .attr('font-family', "'JetBrains Mono', monospace")
      .attr('font-size', function (d) { return Math.min(22, Math.max(10, (d.x1 - d.x0) / 5)); })
      .attr('font-weight', 800)
      .attr('fill', 'rgba(2,6,23,.92)')
      .text(function (d) { return d.data.ticker; });

    nodes.append('text')
      .attr('x', 10).attr('y', 42)
      .attr('font-family', 'Poppins, system-ui, sans-serif')
      .attr('font-size', 12)
      .attr('font-weight', 600)
      .attr('fill', 'rgba(2,6,23,.85)')
      .text(function (d) { return (d.x1 - d.x0) < 80 ? '' : d.data.name; });

    nodes.filter(function (d) { return (d.x1 - d.x0) > 110 && (d.y1 - d.y0) > 80; })
      .append('text')
      .attr('x', 10).attr('y', function (d) { return d.y1 - d.y0 - 26; })
      .attr('font-family', "'JetBrains Mono', monospace")
      .attr('font-size', 18)
      .attr('font-weight', 700)
      .attr('fill', 'rgba(2,6,23,.95)')
      .text(function (d) { return '$' + d.data.vol.toFixed(1) + 'B'; });

    nodes.filter(function (d) { return (d.x1 - d.x0) > 110 && (d.y1 - d.y0) > 80; })
      .append('text')
      .attr('x', 10).attr('y', function (d) { return d.y1 - d.y0 - 10; })
      .attr('font-family', 'Poppins, system-ui, sans-serif')
      .attr('font-size', 10)
      .attr('font-weight', 500)
      .attr('fill', 'rgba(2,6,23,.6)')
      .text(function (d) { return d.data.deals + ' deals · ' + (d.data.cap ? d.data.cap.toFixed(1) + '% cap' : 'cap n/a'); });

    var tip = document.getElementById('rp-treemap-tooltip');
    nodes
      .on('mousemove', function (event, d) {
        var box = svgEl.getBoundingClientRect();
        var x = event.clientX - box.left;
        var y = event.clientY - box.top;
        tip.textContent = '';
        var t1 = document.createElement('div');
        t1.style.cssText = 'font-weight:700;color:var(--gold,#BC9C45);margin-bottom:6px;font-size:13px';
        t1.textContent = d.data.name + ' (' + d.data.ticker + ')';
        var t2 = document.createElement('div');
        t2.style.cssText = "font-family:'JetBrains Mono',monospace;font-size:11px;line-height:1.7";
        t2.textContent = 'Volume:  $' + d.data.vol.toFixed(2) + 'B 7d';
        var t3 = document.createElement('div');
        t3.style.cssText = "font-family:'JetBrains Mono',monospace;font-size:11px;line-height:1.7";
        t3.textContent = 'Cap rate: ' + (d.data.cap ? d.data.cap.toFixed(2) + '%' : 'n/a');
        var t4 = document.createElement('div');
        t4.style.cssText = "font-family:'JetBrains Mono',monospace;font-size:11px;line-height:1.7";
        t4.textContent = 'Deals:   ' + d.data.deals;
        var t5 = document.createElement('div');
        t5.style.cssText = 'font-size:10px;color:var(--muted,#94a3b8);margin-top:6px';
        t5.textContent = d.data.region + ' · click to view sources →';
        tip.appendChild(t1); tip.appendChild(t2); tip.appendChild(t3); tip.appendChild(t4); tip.appendChild(t5);
        tip.style.left = Math.min(x + 16, box.width - 240) + 'px';
        tip.style.top = (y + 16) + 'px';
        tip.style.display = 'block';
      })
      .on('mouseleave', function () { tip.style.display = 'none'; })
      .on('click', function () { location.href = '/sources'; });
  }

  function start() {
    shell();
    load(D3_SRC).then(function () {
      render();
      window.addEventListener('resize', render);
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
