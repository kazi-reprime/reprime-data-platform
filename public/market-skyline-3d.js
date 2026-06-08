/* RePrime Terminal — Market Skyline (3D)
 *
 * Per-market 3D "skyline" — each top CRE market rendered as a cluster
 * of 4 buildings in a 2×2 layout. Building height = transaction
 * $-volume by property type (Multifamily / Office / Industrial / Retail).
 *
 * Mounts into #rp-market-skyline. Loads Three.js r128 from cdnjs (SRI
 * matched to other 3D scenes). Reduced-motion safe. Visibility-gated.
 *
 * 3D bar chart with small-multiples arrangement — both well-established
 * generic data viz techniques. Original implementation w/ RePrime
 * branding + CRE data.
 */
(function () {
  'use strict';
  var el = document.getElementById('rp-market-skyline');
  if (!el) return;

  try {
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.innerHTML =
        '<div style="display:flex;align-items:center;justify-content:center;height:240px;color:var(--muted,#94a3b8);font-size:13px;text-align:center;padding:24px">' +
        'Skyline visualization disabled (reduced motion).' +
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
      s.src = src; s.integrity = THREE_SRI; s.crossOrigin = 'anonymous'; s.referrerPolicy = 'no-referrer';
      s.onload = res; s.onerror = res; document.head.appendChild(s);
    });
  }
  function webglOK() {
    try { var c = document.createElement('canvas'); return !!(window.WebGLRenderingContext && (c.getContext('webgl') || c.getContext('experimental-webgl'))); }
    catch (e) { return false; }
  }
  function css(v, f) { return (getComputedStyle(document.documentElement).getPropertyValue(v) || f).trim() || f; }

  var MARKETS = [
    { name: 'New York · US',      mf: 0.78, off: 0.92, ind: 0.42, ret: 0.58 },
    { name: 'Los Angeles · US',   mf: 0.65, off: 0.55, ind: 0.78, ret: 0.45 },
    { name: 'Chicago · US',       mf: 0.42, off: 0.48, ind: 0.62, ret: 0.38 },
    { name: 'Dallas · US',        mf: 0.72, off: 0.45, ind: 0.68, ret: 0.42 },
    { name: 'Atlanta · US',       mf: 0.68, off: 0.32, ind: 0.55, ret: 0.40 },
    { name: 'Miami · US',         mf: 0.55, off: 0.28, ind: 0.35, ret: 0.48 },
    { name: 'San Francisco · US', mf: 0.62, off: 0.48, ind: 0.20, ret: 0.30 },
    { name: 'Boston · US',        mf: 0.52, off: 0.65, ind: 0.25, ret: 0.32 }
  ];

  var TYPES = [
    { key: 'mf',  label: 'Multifamily', color: '#22c55e' },
    { key: 'off', label: 'Office',      color: '#00A1FF' },
    { key: 'ind', label: 'Industrial',  color: '#BC9C45' },
    { key: 'ret', label: 'Retail',      color: '#FFBC7D' }
  ];

  function shell() {
    el.innerHTML =
      '<div class="rp-glass-2" style="max-width:1280px;margin:24px auto;padding:16px 0 0;overflow:hidden">' +
        '<div style="display:flex;justify-content:space-between;align-items:center;padding:0 18px 12px;flex-wrap:wrap;gap:8px">' +
          '<div style="display:flex;align-items:center;gap:10px">' +
            '<span class="rp-live-dot"></span>' +
            '<span style="font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--gold,#BC9C45)">RePrime Terminal — Market Skyline</span>' +
          '</div>' +
          '<a href="/sources" style="font-size:10px;color:var(--muted,#94a3b8);text-decoration:none">→ Browse market sources</a>' +
        '</div>' +
        '<canvas id="rp-skyline-c" style="display:block;width:100%;height:420px"></canvas>' +
        '<div id="rp-skyline-legend" style="display:flex;gap:18px;padding:12px 18px;flex-wrap:wrap;justify-content:center;font-size:10px;color:var(--muted,#94a3b8)"></div>' +
      '</div>';
  }

  function initScene() {
    var canvas = document.getElementById('rp-skyline-c');
    if (!canvas) return;
    var W = canvas.clientWidth || 1280, H = 420;
    canvas.width = W; canvas.height = H;

    var THREE = window.THREE;
    var renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(W, H, false);

    var scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x020617, 280, 900);

    var camera = new THREE.PerspectiveCamera(38, W / H, 0.1, 1500);
    camera.position.set(0, 90, 280);
    camera.lookAt(0, 25, 0);

    var floor = new THREE.Mesh(
      new THREE.PlaneGeometry(800, 240),
      new THREE.MeshLambertMaterial({ color: 0x0a1426, transparent: true, opacity: 0.7 })
    );
    floor.rotation.x = -Math.PI / 2;
    scene.add(floor);

    var grid = new THREE.GridHelper(800, 80, 0x334155, 0x1a2236);
    grid.material.opacity = 0.45; grid.material.transparent = true;
    grid.position.y = 0.02;
    scene.add(grid);

    scene.add(new THREE.AmbientLight(0xffffff, 0.5));
    var keyL = new THREE.DirectionalLight(0xffffff, 0.7);
    keyL.position.set(50, 120, 70); scene.add(keyL);
    var goldL = new THREE.DirectionalLight(parseInt(css('--gold', '#BC9C45').replace('#', ''), 16), 0.5);
    goldL.position.set(-60, 80, -50); scene.add(goldL);

    var clusterSpacing = 60;
    var buildingW = 7;
    var totalW = MARKETS.length * clusterSpacing;
    var startX = -totalW / 2 + clusterSpacing / 2;

    var clusters = [];
    MARKETS.forEach(function (mkt, idx) {
      var cx = startX + idx * clusterSpacing;
      var cluster = new THREE.Group();

      TYPES.forEach(function (type, ti) {
        var v = mkt[type.key];
        var height = v * 90 + 4;
        var offX = (ti % 2 === 0 ? -1 : 1) * (buildingW / 2 + 1);
        var offZ = (ti < 2 ? -1 : 1) * (buildingW / 2 + 1);
        var mesh = new THREE.Mesh(
          new THREE.BoxGeometry(buildingW, height, buildingW),
          new THREE.MeshPhongMaterial({
            color: parseInt(type.color.replace('#', ''), 16),
            emissive: parseInt(type.color.replace('#', ''), 16),
            emissiveIntensity: 0.08,
            shininess: 60,
            transparent: true,
            opacity: 0.92
          })
        );
        mesh.position.set(offX, height / 2, offZ);
        cluster.add(mesh);

        var cap = new THREE.Mesh(
          new THREE.BoxGeometry(buildingW * 0.6, 0.6, buildingW * 0.6),
          new THREE.MeshBasicMaterial({ color: parseInt(type.color.replace('#', ''), 16) })
        );
        cap.position.set(offX, height + 0.3, offZ);
        cluster.add(cap);
      });

      var plinth = new THREE.Mesh(
        new THREE.BoxGeometry(buildingW * 2 + 6, 0.6, buildingW * 2 + 6),
        new THREE.MeshLambertMaterial({ color: 0x0e1b30 })
      );
      plinth.position.y = 0.3;
      cluster.add(plinth);

      cluster.position.set(cx, 0, 0);
      scene.add(cluster);
      clusters.push({ group: cluster, name: mkt.name, x: cx });
    });

    var legend = document.getElementById('rp-skyline-legend');
    if (legend) {
      legend.innerHTML = '';
      TYPES.forEach(function (t) {
        var chip = document.createElement('span');
        chip.style.cssText = 'display:inline-flex;align-items:center;gap:6px';
        var dot = document.createElement('span');
        dot.style.cssText = 'display:inline-block;width:10px;height:10px;border-radius:2px;background:' + t.color;
        var name = document.createElement('span');
        name.style.cssText = 'color:var(--text);font-weight:600';
        name.textContent = t.label;
        chip.appendChild(dot); chip.appendChild(name);
        legend.appendChild(chip);
      });
      var hint = document.createElement('span');
      hint.style.cssText = 'opacity:.6';
      hint.textContent = 'Height = $-volume by type · ' + MARKETS.length + ' markets';
      legend.appendChild(hint);
    }

    var visible = true;
    document.addEventListener('visibilitychange', function () { visible = document.visibilityState === 'visible'; });

    var t0 = Date.now();
    function animate() {
      requestAnimationFrame(animate);
      if (!visible) return;
      var t = (Date.now() - t0) * 0.0002;
      camera.position.x = Math.sin(t) * 140;
      camera.position.z = 250 - Math.cos(t * 0.7) * 30;
      camera.position.y = 90 + Math.sin(t * 0.3) * 10;
      camera.lookAt(0, 25, 0);
      clusters.forEach(function (c, i) { c.group.rotation.y += 0.002 + i * 0.0003; });
      renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', function () {
      var w = canvas.clientWidth || W;
      renderer.setSize(w, H, false);
      camera.aspect = w / H; camera.updateProjectionMatrix();
    });
  }

  function start() {
    shell();
    if (!webglOK()) {
      var c = document.getElementById('rp-skyline-c');
      if (c) c.outerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:420px;color:var(--muted,#94a3b8);font-size:13px">WebGL unavailable — skyline visualization requires WebGL.</div>';
      return;
    }
    load(THREE_SRC).then(function () { if (window.THREE) try { initScene(); } catch (e) {} });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
