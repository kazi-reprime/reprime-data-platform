/* RePrime — 3D Risk Surface (Phase 6 extension)
 *
 * A 3D heightmap (terrain) where peaks represent concentrated risk
 * (vacancy + cap rate compression) across the top U.S. CRE markets.
 * Visually distinct from the two globes — flat-plane terrain w/ gold
 * crest highlighting, slow orbital camera.
 *
 * Mounts into #viz-risk-surface.
 * Shares the same Three.js r128 + SRI as globe.js / deal-flow-globe.js.
 * Honors prefers-reduced-motion (static notice fallback).
 */
(function () {
  'use strict';
  var el = document.getElementById('viz-risk-surface');
  if (!el) return;

  try {
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.innerHTML =
        '<div style="display:flex;align-items:center;justify-content:center;height:240px;color:var(--muted,#94a3b8);font-size:13px;text-align:center;padding:24px">' +
        'Risk surface disabled (reduced motion).<br/>' +
        '<a href="/wall" style="color:var(--accent,#3b82f6);text-decoration:none">View risk by market →</a>' +
        '</div>';
      return;
    }
  } catch (e) {}

  var THREE_SRC = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
  var THREE_SRI = 'sha384-CI3ELBVUz9XQO+97x6nwMDPosPR5XvsxW2ua7N1Xeygeh1IxtgqtCkGfQY9WWdHu';

  function load(src) {
    return new Promise(function (res) {
      if (window.THREE) return res();
      var s = document.createElement('script');
      s.src = src;
      s.integrity = THREE_SRI;
      s.crossOrigin = 'anonymous';
      s.referrerPolicy = 'no-referrer';
      s.onload = res; s.onerror = res;
      document.head.appendChild(s);
    });
  }

  function webglOK() {
    try {
      var c = document.createElement('canvas');
      return !!(window.WebGLRenderingContext && (c.getContext('webgl') || c.getContext('experimental-webgl')));
    } catch (e) { return false; }
  }

  function css(v, f) {
    return (getComputedStyle(document.documentElement).getPropertyValue(v) || f).trim() || f;
  }

  // Same 25 markets as the heatmap (lat, lon, vac, cap → height).
  // Phase 7 will source from Supabase rolling aggregates.
  var RISK_POINTS = [
    { lat: 40.7128, lon: -74.0060, vac: 0.60, cap: 0.40 },
    { lat: 34.0522, lon: -118.2437,vac: 0.55, cap: 0.50 },
    { lat: 41.8781, lon: -87.6298, vac: 0.70, cap: 0.60 },
    { lat: 32.7767, lon: -96.7970, vac: 0.45, cap: 0.55 },
    { lat: 29.7604, lon: -95.3698, vac: 0.50, cap: 0.65 },
    { lat: 33.7490, lon: -84.3880, vac: 0.40, cap: 0.55 },
    { lat: 42.3601, lon: -71.0589, vac: 0.50, cap: 0.45 },
    { lat: 37.7749, lon: -122.4194,vac: 0.65, cap: 0.40 },
    { lat: 25.7617, lon: -80.1918, vac: 0.40, cap: 0.55 },
    { lat: 47.6062, lon: -122.3321,vac: 0.55, cap: 0.50 },
    { lat: 38.9072, lon: -77.0369, vac: 0.50, cap: 0.45 },
    { lat: 39.7392, lon: -104.9903,vac: 0.45, cap: 0.55 },
    { lat: 39.9526, lon: -75.1652, vac: 0.55, cap: 0.60 },
    { lat: 33.4484, lon: -112.0740,vac: 0.40, cap: 0.50 },
    { lat: 32.7157, lon: -117.1611,vac: 0.50, cap: 0.45 },
    { lat: 35.2271, lon: -80.8431, vac: 0.40, cap: 0.55 },
    { lat: 30.2672, lon: -97.7431, vac: 0.50, cap: 0.45 },
    { lat: 36.1627, lon: -86.7816, vac: 0.40, cap: 0.55 },
    { lat: 27.9506, lon: -82.4572, vac: 0.45, cap: 0.55 },
    { lat: 28.5383, lon: -81.3792, vac: 0.40, cap: 0.55 },
    { lat: 45.5051, lon: -122.6750,vac: 0.55, cap: 0.50 },
    { lat: 44.9778, lon: -93.2650, vac: 0.55, cap: 0.55 },
    { lat: 40.7608, lon: -111.8910,vac: 0.45, cap: 0.55 },
    { lat: 39.7684, lon: -86.1581, vac: 0.55, cap: 0.60 },
    { lat: 36.1699, lon: -115.1398,vac: 0.50, cap: 0.55 }
  ];

  // Map lat/lon to a normalized 2D plane (terrain x/z)
  function project(lon, lat) {
    var x = (lon + 100) / 30;     // -125..-66 → about -0.83 to 1.13
    var z = (40 - lat) / 10;      // 50..24 → -1 to 1.6
    return [x * 60, z * 40];
  }

  function shell() {
    el.innerHTML =
      '<div class="rp-glass-2" style="position:relative;max-width:1280px;margin:24px auto;padding:16px 0 0;overflow:hidden">' +
        '<div style="display:flex;justify-content:space-between;align-items:center;padding:0 18px 12px;flex-wrap:wrap;gap:8px">' +
          '<div style="font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--gold,#BC9C45)">3D Risk Surface</div>' +
          '<div style="font-size:10px;color:var(--muted,#94a3b8)">Vacancy × Cap-Rate Pressure · 25 Markets · Peaks = Higher Risk</div>' +
        '</div>' +
        '<canvas id="rp-risk-surface-c" style="display:block;width:100%;height:420px"></canvas>' +
      '</div>';
  }

  function initScene() {
    var canvas = document.getElementById('rp-risk-surface-c');
    if (!canvas) return;
    var W = canvas.clientWidth || 1280;
    var H = 420;

    var THREE = window.THREE;
    var renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(W, H, false);

    var scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x020617, 200, 600);

    var camera = new THREE.PerspectiveCamera(40, W / H, 0.1, 1000);
    camera.position.set(0, 90, 180);
    camera.lookAt(0, 0, 0);

    var goldHex = parseInt(css('--gold', '#BC9C45').replace('#', ''), 16);
    var greenHex = parseInt(css('--green', '#22c55e').replace('#', ''), 16);

    // Build a height grid from the risk points using inverse-distance interpolation
    var GRID_W = 80, GRID_H = 50;
    var SCALE_X = 140 / GRID_W;
    var SCALE_Z = 90 / GRID_H;

    var heights = new Float32Array(GRID_W * GRID_H);
    for (var gz = 0; gz < GRID_H; gz++) {
      for (var gx = 0; gx < GRID_W; gx++) {
        var wx = (gx - GRID_W / 2) * SCALE_X;
        var wz = (gz - GRID_H / 2) * SCALE_Z;
        var sum = 0, total = 0;
        for (var i = 0; i < RISK_POINTS.length; i++) {
          var p = project(RISK_POINTS[i].lon, RISK_POINTS[i].lat);
          var dx = p[0] - wx, dz = p[1] - wz;
          var d2 = dx * dx + dz * dz;
          var w = 1 / (d2 + 50);
          var risk = (RISK_POINTS[i].vac + RISK_POINTS[i].cap) * 0.5; // 0..1
          sum += risk * w;
          total += w;
        }
        heights[gz * GRID_W + gx] = (sum / total);
      }
    }

    // Build the plane geometry and apply heights
    var geom = new THREE.PlaneGeometry(140, 90, GRID_W - 1, GRID_H - 1);
    geom.rotateX(-Math.PI / 2);
    var pos = geom.attributes.position;
    for (var v = 0; v < pos.count; v++) {
      var hv = heights[v] || 0;
      pos.setY(v, hv * 60); // amplify
    }
    geom.computeVertexNormals();

    // Vertex-colored terrain — cold blue → gold crest
    var colors = new Float32Array(pos.count * 3);
    for (var k = 0; k < pos.count; k++) {
      var h = heights[k] || 0;
      // hue: blue (220) → gold (40), lightness: 35 → 60
      var hue = 220 - h * 180;
      var c = hslToRgb(hue / 360, 0.7, 0.35 + h * 0.30);
      colors[k * 3] = c[0]; colors[k * 3 + 1] = c[1]; colors[k * 3 + 2] = c[2];
    }
    geom.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    var mat = new THREE.MeshPhongMaterial({
      vertexColors: true,
      shininess: 30,
      transparent: true,
      opacity: 0.95,
      flatShading: false
    });
    var terrain = new THREE.Mesh(geom, mat);
    scene.add(terrain);

    // Wireframe overlay for grid feel
    var wireMat = new THREE.MeshBasicMaterial({ color: 0x334155, wireframe: true, transparent: true, opacity: 0.2 });
    var wire = new THREE.Mesh(geom, wireMat);
    wire.position.y = 0.3;
    scene.add(wire);

    // Lights
    scene.add(new THREE.AmbientLight(0xffffff, 0.4));
    var key = new THREE.DirectionalLight(0xffffff, 0.8);
    key.position.set(50, 80, 30);
    scene.add(key);
    var rim = new THREE.DirectionalLight(goldHex, 0.45);
    rim.position.set(-30, 60, -40);
    scene.add(rim);

    // Market markers — vertical thin pillars at each high-risk peak
    RISK_POINTS.forEach(function (p) {
      var risk = (p.vac + p.cap) * 0.5;
      if (risk < 0.5) return;
      var coord = project(p.lon, p.lat);
      var pillar = new THREE.Mesh(
        new THREE.CylinderGeometry(0.5, 0.5, 6, 8),
        new THREE.MeshBasicMaterial({ color: goldHex, transparent: true, opacity: 0.85 })
      );
      pillar.position.set(coord[0], risk * 60 + 5, coord[1]);
      scene.add(pillar);
      var pip = new THREE.Mesh(
        new THREE.SphereGeometry(1.5, 12, 8),
        new THREE.MeshBasicMaterial({ color: greenHex })
      );
      pip.position.copy(pillar.position);
      pip.position.y += 3;
      scene.add(pip);
    });

    var visible = true;
    document.addEventListener('visibilitychange', function () { visible = document.visibilityState === 'visible'; });

    var t0 = Date.now();
    function animate() {
      requestAnimationFrame(animate);
      if (!visible) return;
      var t = (Date.now() - t0) * 0.0001;
      camera.position.x = Math.sin(t) * 180;
      camera.position.z = Math.cos(t) * 180;
      camera.position.y = 90 + Math.sin(t * 0.7) * 12;
      camera.lookAt(0, 5, 0);
      renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', function () {
      var w = canvas.clientWidth || W;
      renderer.setSize(w, H, false);
      camera.aspect = w / H; camera.updateProjectionMatrix();
    });
  }

  function hslToRgb(h, s, l) {
    var r, g, b;
    if (s === 0) { r = g = b = l; }
    else {
      var hue2rgb = function (p, q, t) {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
      };
      var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      var p = 2 * l - q;
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }
    return [r, g, b];
  }

  function start() {
    shell();
    if (!webglOK()) {
      var c = document.getElementById('rp-risk-surface-c');
      if (c) c.outerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:420px;color:var(--muted,#94a3b8);font-size:13px">WebGL unavailable — risk surface requires WebGL.</div>';
      return;
    }
    load(THREE_SRC).then(function () {
      if (window.THREE) try { initScene(); } catch (e) { /* graceful fail */ }
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
