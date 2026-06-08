/* RePrime — U.S. Property Heatmap (Phase 6.3)
 *
 * 2D canvas map of market signals (vol / cap / vacancy) layered over a
 * coarse U.S. mainland outline. No topojson dep (~9 MB) — uses a
 * 60-vertex polygon approximation. Adequate fidelity for a dashboard
 * widget; upgrade to topojson in Phase 7 if needed.
 *
 * Mounts into #viz-heatmap-us.
 * Pure canvas + DOM, no external libs.
 */
(function () {
  'use strict';
  var el = document.getElementById('viz-heatmap-us');
  if (!el) return;

  // Top 25 U.S. CRE markets w/ indicative signal values (0-1 each).
  // Phase 7 will source from Supabase rolling aggregates.
  var SIGNALS = [
    { name: 'New York',         lat: 40.7128, lon: -74.0060, vol: 0.95, cap: 0.4,  vac: 0.6 },
    { name: 'Los Angeles',      lat: 34.0522, lon: -118.2437,vol: 0.85, cap: 0.5,  vac: 0.55 },
    { name: 'Chicago',          lat: 41.8781, lon: -87.6298, vol: 0.72, cap: 0.6,  vac: 0.7 },
    { name: 'Dallas',           lat: 32.7767, lon: -96.7970, vol: 0.78, cap: 0.55, vac: 0.45 },
    { name: 'Houston',          lat: 29.7604, lon: -95.3698, vol: 0.68, cap: 0.65, vac: 0.5 },
    { name: 'Atlanta',          lat: 33.7490, lon: -84.3880, vol: 0.72, cap: 0.55, vac: 0.4 },
    { name: 'Boston',           lat: 42.3601, lon: -71.0589, vol: 0.65, cap: 0.45, vac: 0.5 },
    { name: 'San Francisco',    lat: 37.7749, lon: -122.4194,vol: 0.72, cap: 0.4,  vac: 0.65 },
    { name: 'Miami',            lat: 25.7617, lon: -80.1918, vol: 0.62, cap: 0.55, vac: 0.4 },
    { name: 'Seattle',          lat: 47.6062, lon: -122.3321,vol: 0.58, cap: 0.5,  vac: 0.55 },
    { name: 'Washington DC',    lat: 38.9072, lon: -77.0369, vol: 0.6,  cap: 0.45, vac: 0.5 },
    { name: 'Denver',           lat: 39.7392, lon: -104.9903,vol: 0.5,  cap: 0.55, vac: 0.45 },
    { name: 'Philadelphia',     lat: 39.9526, lon: -75.1652, vol: 0.55, cap: 0.6,  vac: 0.55 },
    { name: 'Phoenix',          lat: 33.4484, lon: -112.0740,vol: 0.6,  cap: 0.5,  vac: 0.4 },
    { name: 'San Diego',        lat: 32.7157, lon: -117.1611,vol: 0.55, cap: 0.45, vac: 0.5 },
    { name: 'Charlotte',        lat: 35.2271, lon: -80.8431, vol: 0.5,  cap: 0.55, vac: 0.4 },
    { name: 'Austin',           lat: 30.2672, lon: -97.7431, vol: 0.65, cap: 0.45, vac: 0.5 },
    { name: 'Nashville',        lat: 36.1627, lon: -86.7816, vol: 0.55, cap: 0.55, vac: 0.4 },
    { name: 'Tampa',            lat: 27.9506, lon: -82.4572, vol: 0.5,  cap: 0.55, vac: 0.45 },
    { name: 'Orlando',          lat: 28.5383, lon: -81.3792, vol: 0.48, cap: 0.55, vac: 0.4 },
    { name: 'Portland',         lat: 45.5051, lon: -122.6750,vol: 0.45, cap: 0.5,  vac: 0.55 },
    { name: 'Minneapolis',      lat: 44.9778, lon: -93.2650, vol: 0.45, cap: 0.55, vac: 0.55 },
    { name: 'Salt Lake City',   lat: 40.7608, lon: -111.8910,vol: 0.4,  cap: 0.55, vac: 0.45 },
    { name: 'Indianapolis',     lat: 39.7684, lon: -86.1581, vol: 0.4,  cap: 0.6,  vac: 0.55 },
    { name: 'Las Vegas',        lat: 36.1699, lon: -115.1398,vol: 0.42, cap: 0.55, vac: 0.5 }
  ];

  var SIGNAL_LABELS = {
    vol: { label: 'Transaction Volume', desc: 'higher = more deals' },
    cap: { label: 'Cap Rate Pressure',  desc: 'higher = compressed yields' },
    vac: { label: 'Vacancy',            desc: 'higher = more empty space' }
  };

  function project(lon, lat, W, H) {
    var x = ((lon + 125) / (125 - 66)) * W;
    var y = ((50 - lat) / (50 - 24)) * H;
    return [x, y];
  }

  var US_OUTLINE = [
    [-124.7, 48.4], [-123.0, 46.2], [-124.0, 43.0], [-124.4, 40.3], [-123.0, 37.5],
    [-121.5, 35.0], [-120.0, 33.7], [-118.5, 33.5], [-117.0, 32.5], [-114.5, 32.6],
    [-111.0, 31.3], [-108.2, 31.3], [-106.5, 31.7], [-103.5, 28.9], [-101.0, 29.7],
    [-99.0,  27.4], [-97.5,  26.0], [-97.0,  25.9], [-94.0,  29.5], [-91.5,  29.2],
    [-89.0,  29.0], [-88.0,  30.2], [-85.7,  29.7], [-84.0,  30.1], [-82.5,  27.0],
    [-80.2,  25.2], [-80.0,  26.5], [-80.7,  28.6], [-81.5,  30.7], [-81.0,  31.5],
    [-79.8,  32.8], [-78.6,  33.9], [-77.0,  34.5], [-75.8,  35.7], [-75.5,  37.5],
    [-75.9,  38.5], [-74.5,  39.5], [-73.9,  40.8], [-71.8,  41.3], [-70.2,  41.8],
    [-69.8,  43.7], [-69.0,  44.5], [-67.0,  44.8], [-67.5,  45.2], [-69.0,  47.0],
    [-71.5,  45.0], [-75.0,  45.0], [-78.5,  43.4], [-82.5,  42.0], [-83.0,  41.7],
    [-83.5,  45.0], [-86.5,  45.2], [-88.0,  46.8], [-90.0,  46.8], [-92.0,  46.5],
    [-95.0,  49.0], [-99.0,  49.0], [-115.0, 49.0], [-122.8, 49.0]
  ];

  var ACTIVE_SIGNAL = 'vol';

  function tabBtn(signal, label, active) {
    var bg = active ? 'var(--gold,#BC9C45)' : 'transparent';
    var color = active ? '#000' : 'var(--muted,#94a3b8)';
    return '<button data-signal="' + signal + '" data-active="' + active + '" style="background:' + bg + ';color:' + color + ';border:1px solid var(--border,rgba(255,255,255,.18));padding:4px 10px;border-radius:99px;font-size:10px;font-weight:700;letter-spacing:.04em;text-transform:uppercase;cursor:pointer;transition:all .2s">' + label + '</button>';
  }

  function updateDesc() {
    var d = document.getElementById('rp-heatmap-desc');
    if (d) d.textContent = SIGNAL_LABELS[ACTIVE_SIGNAL].label + ' — ' + SIGNAL_LABELS[ACTIVE_SIGNAL].desc;
  }

  function shell() {
    el.innerHTML =
      '<div style="position:relative;max-width:1280px;margin:24px auto;border:1px solid var(--border,rgba(255,255,255,.12));border-radius:16px;background:linear-gradient(135deg,rgba(15,23,42,.55),rgba(2,6,23,.8));padding:16px 0 0;overflow:hidden">' +
        '<div style="display:flex;justify-content:space-between;align-items:center;padding:0 18px 12px;flex-wrap:wrap;gap:8px">' +
          '<div style="font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--gold,#BC9C45)">U.S. Market Heatmap</div>' +
          '<div id="rp-heatmap-controls" style="display:flex;gap:6px">' +
            tabBtn('vol', 'Volume', true) +
            tabBtn('cap', 'Cap Rate', false) +
            tabBtn('vac', 'Vacancy', false) +
          '</div>' +
        '</div>' +
        '<div style="position:relative;width:100%;aspect-ratio:16/9;max-height:520px">' +
          '<canvas id="rp-heatmap-c" style="position:absolute;inset:0;width:100%;height:100%"></canvas>' +
          '<div id="rp-heatmap-tooltip" style="position:absolute;pointer-events:none;background:rgba(15,23,42,.95);border:1px solid var(--gold,#BC9C45);border-radius:8px;padding:8px 12px;font-size:12px;color:var(--text);display:none;z-index:2;backdrop-filter:blur(8px)"></div>' +
        '</div>' +
        '<div style="display:flex;gap:10px;padding:12px 18px;flex-wrap:wrap;justify-content:center;font-size:10px;color:var(--muted,#94a3b8)">' +
          '<span id="rp-heatmap-desc"></span>' +
          '<span style="opacity:.6">·</span>' +
          '<span>' + SIGNALS.length + ' markets · indicative values</span>' +
        '</div>' +
      '</div>';

    var ctrls = document.getElementById('rp-heatmap-controls');
    if (ctrls) {
      ctrls.querySelectorAll('button').forEach(function (b) {
        b.addEventListener('click', function () {
          ACTIVE_SIGNAL = b.dataset.signal;
          ctrls.querySelectorAll('button').forEach(function (bb) {
            bb.dataset.active = String(bb.dataset.signal === ACTIVE_SIGNAL);
            bb.style.background = bb.dataset.active === 'true' ? 'var(--gold,#BC9C45)' : 'transparent';
            bb.style.color = bb.dataset.active === 'true' ? '#000' : 'var(--muted,#94a3b8)';
          });
          render();
        });
      });
    }
    updateDesc();
  }

  function render() {
    updateDesc();
    var canvas = document.getElementById('rp-heatmap-c');
    if (!canvas) return;
    var rect = canvas.getBoundingClientRect();
    var W = rect.width, H = rect.height;
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = W * dpr; canvas.height = H * dpr;
    var ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, W, H);

    ctx.beginPath();
    US_OUTLINE.forEach(function (pt, i) {
      var p = project(pt[0], pt[1], W, H);
      if (i === 0) ctx.moveTo(p[0], p[1]); else ctx.lineTo(p[0], p[1]);
    });
    ctx.closePath();
    ctx.fillStyle = 'rgba(30,41,59,.45)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(148,163,184,.35)';
    ctx.lineWidth = 1;
    ctx.stroke();

    SIGNALS.forEach(function (s) {
      var p = project(s.lon, s.lat, W, H);
      var v = s[ACTIVE_SIGNAL];
      var r = 30 + v * 90;
      var grad = ctx.createRadialGradient(p[0], p[1], 0, p[0], p[1], r);
      var hue = (1 - v) * 220 + (v * 35);
      grad.addColorStop(0,   'hsla(' + hue + ', 90%, 55%, ' + (0.55 * v + 0.25) + ')');
      grad.addColorStop(0.5, 'hsla(' + hue + ', 90%, 50%, ' + (0.25 * v) + ')');
      grad.addColorStop(1,   'hsla(' + hue + ', 90%, 50%, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(p[0], p[1], r, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.font = '500 10px Poppins, system-ui, sans-serif';
    ctx.textBaseline = 'middle';
    SIGNALS.forEach(function (s) {
      var p = project(s.lon, s.lat, W, H);
      var v = s[ACTIVE_SIGNAL];
      ctx.beginPath();
      ctx.arc(p[0], p[1], 2.5 + v * 2, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,255,255,.95)';
      ctx.fill();
      if (v > 0.55) {
        ctx.fillStyle = 'rgba(255,255,255,.85)';
        ctx.fillText(s.name, p[0] + 6, p[1]);
      }
    });

    canvas._signals = SIGNALS.map(function (s) {
      var p = project(s.lon, s.lat, W, H);
      return { x: p[0], y: p[1], data: s };
    });
  }

  function setupHover() {
    var canvas = document.getElementById('rp-heatmap-c');
    var tip = document.getElementById('rp-heatmap-tooltip');
    if (!canvas || !tip) return;
    canvas.addEventListener('mousemove', function (e) {
      var rect = canvas.getBoundingClientRect();
      var x = e.clientX - rect.left, y = e.clientY - rect.top;
      var best = null, bestDist = 30;
      (canvas._signals || []).forEach(function (m) {
        var d = Math.sqrt((m.x - x) * (m.x - x) + (m.y - y) * (m.y - y));
        if (d < bestDist) { best = m; bestDist = d; }
      });
      if (best) {
        var s = best.data;
        // textContent for the name (untrusted-source-data safe pattern from Phase 2.9)
        tip.textContent = '';
        var name = document.createElement('div');
        name.style.cssText = 'font-weight:700;color:var(--gold,#BC9C45);margin-bottom:4px';
        name.textContent = s.name;
        var vals = document.createElement('div');
        vals.style.cssText = "font-family:'JetBrains Mono',monospace;font-size:11px";
        vals.textContent = 'Vol: ' + (s.vol * 100).toFixed(0) + ' · Cap: ' + (s.cap * 100).toFixed(0) + ' · Vac: ' + (s.vac * 100).toFixed(0);
        tip.appendChild(name); tip.appendChild(vals);
        tip.style.left = Math.min(x + 12, rect.width - 200) + 'px';
        tip.style.top = (y - 30) + 'px';
        tip.style.display = 'block';
      } else {
        tip.style.display = 'none';
      }
    });
    canvas.addEventListener('mouseleave', function () { tip.style.display = 'none'; });
  }

  function start() {
    shell();
    render();
    setupHover();
    window.addEventListener('resize', render);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
