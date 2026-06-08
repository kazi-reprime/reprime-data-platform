/* RePrime Group — Capital Flow Particle Field
 *
 * 2D canvas particle system rendering capital migration across U.S.
 * CRE markets. Particles spawn at "source" markets (capital surplus)
 * and drift toward "sink" markets (capital demand) along curved paths.
 *
 * Mounts into #rp-capital-flow. Pure 2D canvas — no WebGL context cost.
 * Visibility-gated. Reduced-motion safe.
 *
 * Particle physics is standard Euler integration along quadratic Bezier
 * paths — a generic, well-documented animation pattern. Original code.
 */
(function () {
  'use strict';
  var el = document.getElementById('rp-capital-flow');
  if (!el) return;

  var REDUCED_MOTION = false;
  try { REDUCED_MOTION = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}

  var MARKETS = [
    { name: 'New York · US',      lat: 40.7128, lon: -74.0060, role: 'sink',   intensity: 1.0 },
    { name: 'Los Angeles · US',   lat: 34.0522, lon: -118.2437,role: 'sink',   intensity: 0.85 },
    { name: 'San Francisco · US', lat: 37.7749, lon: -122.4194,role: 'source', intensity: 0.75 },
    { name: 'Chicago · US',       lat: 41.8781, lon: -87.6298, role: 'source', intensity: 0.7 },
    { name: 'Dallas · US',        lat: 32.7767, lon: -96.7970, role: 'sink',   intensity: 0.78 },
    { name: 'Houston · US',       lat: 29.7604, lon: -95.3698, role: 'source', intensity: 0.68 },
    { name: 'Atlanta · US',       lat: 33.7490, lon: -84.3880, role: 'sink',   intensity: 0.72 },
    { name: 'Boston · US',        lat: 42.3601, lon: -71.0589, role: 'source', intensity: 0.65 },
    { name: 'Miami · US',         lat: 25.7617, lon: -80.1918, role: 'sink',   intensity: 0.7 },
    { name: 'Seattle · US',       lat: 47.6062, lon: -122.3321,role: 'source', intensity: 0.58 },
    { name: 'Washington · US',    lat: 38.9072, lon: -77.0369, role: 'source', intensity: 0.6 },
    { name: 'Denver · US',        lat: 39.7392, lon: -104.9903,role: 'sink',   intensity: 0.55 },
    { name: 'Phoenix · US',       lat: 33.4484, lon: -112.0740,role: 'sink',   intensity: 0.6 },
    { name: 'Charlotte · US',     lat: 35.2271, lon: -80.8431, role: 'sink',   intensity: 0.5 },
    { name: 'Austin · US',        lat: 30.2672, lon: -97.7431, role: 'sink',   intensity: 0.65 },
    { name: 'Nashville · US',     lat: 36.1627, lon: -86.7816, role: 'sink',   intensity: 0.55 },
    { name: 'Toronto · CA',       lat: 43.6532, lon: -79.3832, role: 'source', intensity: 0.6 },
    { name: 'Portland · US',      lat: 45.5051, lon: -122.6750,role: 'source', intensity: 0.45 }
  ];

  function project(lon, lat, W, H) {
    var x = ((lon + 125) / 60) * W;
    var y = ((50 - lat) / 26) * H;
    return [x, y];
  }

  function shell() {
    el.innerHTML =
      '<div class="rp-glass-2" style="max-width:1280px;margin:24px auto;padding:16px 0 0;overflow:hidden">' +
        '<div style="display:flex;justify-content:space-between;align-items:center;padding:0 18px 12px;flex-wrap:wrap;gap:8px">' +
          '<div style="display:flex;align-items:center;gap:10px">' +
            '<span class="rp-live-dot"></span>' +
            '<span style="font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--gold,#BC9C45)">RePrime Terminal — Capital Migration</span>' +
          '</div>' +
          '<div style="font-size:10px;color:var(--muted,#94a3b8)">' +
            'Source markets (▲) push capital → Sink markets (●) draw it' +
          '</div>' +
        '</div>' +
        '<div style="position:relative;width:100%;aspect-ratio:16/9;max-height:440px">' +
          '<canvas id="rp-capflow-c" style="display:block;width:100%;height:100%"></canvas>' +
        '</div>' +
      '</div>';
  }

  function start() {
    shell();
    var canvas = document.getElementById('rp-capflow-c');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var W, H, dpr = Math.min(window.devicePixelRatio || 1, 2);
    var sources = [], sinks = [];

    function resize() {
      var rect = canvas.getBoundingClientRect();
      W = rect.width; H = rect.height;
      canvas.width = W * dpr; canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      sources = MARKETS.filter(function (m) { return m.role === 'source'; }).map(function (m) {
        var p = project(m.lon, m.lat, W, H); return { x: p[0], y: p[1], data: m };
      });
      sinks = MARKETS.filter(function (m) { return m.role === 'sink'; }).map(function (m) {
        var p = project(m.lon, m.lat, W, H); return { x: p[0], y: p[1], data: m };
      });
    }
    resize();
    window.addEventListener('resize', resize);

    var POOL = REDUCED_MOTION ? 0 : 240;
    var P = [];
    for (var i = 0; i < POOL; i++) P.push({ x:0, y:0, tx:0, ty:0, life:0, maxLife:0, color:'#22c55e' });

    function respawn(p) {
      var src = sources[(Math.random() * sources.length) | 0];
      if (!src) return;
      var snk = sinks[(Math.random() * sinks.length) | 0];
      if (!snk) return;
      p.x  = src.x + (Math.random() - 0.5) * 14;
      p.y  = src.y + (Math.random() - 0.5) * 14;
      p.tx = snk.x; p.ty = snk.y;
      p.maxLife = 90 + Math.random() * 80;
      p.life = 0;
      p.color = ['#22c55e', '#BC9C45', '#00A1FF'][(Math.random() * 3) | 0];
    }
    for (var k = 0; k < P.length; k++) { respawn(P[k]); P[k].life = Math.random() * P[k].maxLife; }

    var visible = true;
    document.addEventListener('visibilitychange', function () { visible = document.visibilityState === 'visible'; });

    function draw() {
      requestAnimationFrame(draw);
      if (!visible) return;

      ctx.fillStyle = 'rgba(2,6,23,0.16)';
      ctx.fillRect(0, 0, W, H);

      sources.forEach(function (s) {
        ctx.fillStyle = 'rgba(34,197,94,0.65)';
        ctx.beginPath(); ctx.moveTo(s.x, s.y - 6); ctx.lineTo(s.x - 5, s.y + 4); ctx.lineTo(s.x + 5, s.y + 4); ctx.closePath(); ctx.fill();
        ctx.fillStyle = 'rgba(226,232,240,0.7)';
        ctx.font = "500 9px Poppins, system-ui, sans-serif";
        ctx.textAlign = 'left';
        ctx.fillText(s.data.name, s.x + 8, s.y + 3);
      });
      sinks.forEach(function (s) {
        var r = 4 + s.data.intensity * 3;
        var grad = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, r * 4);
        grad.addColorStop(0, 'rgba(188,156,69,0.55)');
        grad.addColorStop(1, 'rgba(188,156,69,0)');
        ctx.fillStyle = grad;
        ctx.beginPath(); ctx.arc(s.x, s.y, r * 4, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = 'rgba(188,156,69,0.95)';
        ctx.beginPath(); ctx.arc(s.x, s.y, r, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = 'rgba(226,232,240,0.9)';
        ctx.font = "600 10px Poppins, system-ui, sans-serif";
        ctx.fillText(s.data.name, s.x + r + 5, s.y + 3);
      });

      for (var i = 0; i < P.length; i++) {
        var p = P[i];
        p.life++;
        if (p.life > p.maxLife) { respawn(p); continue; }
        var t = p.life / p.maxLife;
        var ease = t * t * (3 - 2 * t);
        var mx = (p.x + p.tx) / 2, my = (p.y + p.ty) / 2;
        var dx = p.tx - p.x, dy = p.ty - p.y;
        var nx = -dy * 0.18, ny = dx * 0.18;
        var cx = mx + nx, cy = my + ny;
        var sx = p.x * (1 - ease) * (1 - ease) + cx * 2 * (1 - ease) * ease + p.tx * ease * ease;
        var sy = p.y * (1 - ease) * (1 - ease) + cy * 2 * (1 - ease) * ease + p.ty * ease * ease;
        var alpha = (1 - Math.abs(0.5 - t) * 2) * 0.85;
        ctx.globalAlpha = alpha;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(sx, sy, 1.8, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    }
    draw();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
