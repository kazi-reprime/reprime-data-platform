/* RePrime Terminal — Deal Pipeline (3D Kanban)
 *
 * Five deal stages (Sourcing → Underwriting → Due Diligence → Closing →
 * Closed) rendered as animated 3D columns. Column height scales with
 * total $-volume in that stage. Each column is composed of stacked
 * segments — one per deal in the stage.
 *
 * Mounts into #rp-pipeline-3d. Loads Three.js r128 from cdnjs with SRI.
 * Reduced-motion safe. Visibility-gated render loop.
 *
 * Original implementation of a generic 3D bar-chart layout w/ RePrime
 * branding and CRE deal data.
 */
(function () {
  'use strict';
  var el = document.getElementById('rp-pipeline-3d');
  if (!el) return;

  try {
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.innerHTML =
        '<div style="display:flex;align-items:center;justify-content:center;height:240px;color:var(--muted,#94a3b8);font-size:13px;text-align:center;padding:24px">' +
        'Pipeline visualization disabled (reduced motion).' +
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

  var STAGES = [
    { name: 'Sourcing',      short: 'SRC', deals: 28, value: 2.4, color: '#94a3b8' },
    { name: 'Underwriting',  short: 'UW',  deals: 19, value: 1.7, color: '#00A1FF' },
    { name: 'Due Diligence', short: 'DD',  deals: 12, value: 1.1, color: '#BC9C45' },
    { name: 'Closing',       short: 'CL',  deals:  6, value: 0.55,color: '#22c55e' },
    { name: 'Closed (TTM)',  short: 'TTM', deals: 47, value: 4.2, color: '#d4af37' }
  ];

  function shell() {
    el.innerHTML =
      '<div class="rp-glass-2" style="max-width:1280px;margin:24px auto;padding:16px 0 0;overflow:hidden">' +
        '<div style="display:flex;justify-content:space-between;align-items:center;padding:0 18px 12px;flex-wrap:wrap;gap:8px">' +
          '<div style="display:flex;align-items:center;gap:10px">' +
            '<span class="rp-live-dot"></span>' +
            '<span style="font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--gold,#BC9C45)">RePrime Terminal — Deal Pipeline</span>' +
          '</div>' +
          '<a href="/terminal" style="font-size:10px;color:var(--muted,#94a3b8);text-decoration:none">→ Open Terminal stages</a>' +
        '</div>' +
        '<canvas id="rp-pipeline-c" style="display:block;width:100%;height:380px"></canvas>' +
        '<div id="rp-pipeline-legend" style="display:flex;gap:18px;padding:12px 18px;flex-wrap:wrap;justify-content:center;font-size:10px;color:var(--muted,#94a3b8)"></div>' +
      '</div>';
  }

  function initScene() {
    var canvas = document.getElementById('rp-pipeline-c');
    if (!canvas) return;
    var W = canvas.clientWidth || 1280, H = 380;
    canvas.width = W; canvas.height = H;

    var THREE = window.THREE;
    var renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(W, H, false);

    var scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x020617, 250, 800);

    var camera = new THREE.PerspectiveCamera(35, W / H, 0.1, 1000);
    camera.position.set(0, 80, 240);
    camera.lookAt(0, 30, 0);

    var grid = new THREE.GridHelper(400, 40, 0x334155, 0x1e293b);
    grid.material.opacity = 0.4; grid.material.transparent = true;
    scene.add(grid);

    scene.add(new THREE.AmbientLight(0xffffff, 0.55));
    var keyL = new THREE.DirectionalLight(0xffffff, 0.7);
    keyL.position.set(40, 100, 50); scene.add(keyL);
    var rimL = new THREE.DirectionalLight(parseInt(css('--gold', '#BC9C45').replace('#', ''), 16), 0.4);
    rimL.position.set(-40, 60, -40); scene.add(rimL);

    var maxVal = Math.max.apply(null, STAGES.map(function (s) { return s.value; }));
    var pillarW = 16, gap = 12;
    var totalW = STAGES.length * pillarW + (STAGES.length - 1) * gap;
    var startX = -totalW / 2 + pillarW / 2;

    var columns = [];
    STAGES.forEach(function (stage, idx) {
      var x = startX + idx * (pillarW + gap);
      var height = (stage.value / maxVal) * 100 + 6;
      var col = new THREE.Group();

      var plinth = new THREE.Mesh(
        new THREE.BoxGeometry(pillarW + 4, 1, pillarW + 4),
        new THREE.MeshLambertMaterial({ color: 0x1e293b })
      );
      plinth.position.set(x, 0, 0);
      scene.add(plinth);

      var segCount = Math.max(3, Math.min(16, stage.deals));
      var segH = (height - 2) / segCount;
      for (var i = 0; i < segCount; i++) {
        var seg = new THREE.Mesh(
          new THREE.BoxGeometry(pillarW, segH * 0.85, pillarW),
          new THREE.MeshPhongMaterial({
            color: parseInt(stage.color.replace('#', ''), 16),
            emissive: parseInt(stage.color.replace('#', ''), 16),
            emissiveIntensity: 0.12,
            transparent: true,
            opacity: 0.9
          })
        );
        seg.position.set(x, 2 + segH * 0.5 + i * segH, 0);
        col.add(seg);
      }

      var cap = new THREE.Mesh(
        new THREE.BoxGeometry(pillarW + 2, 1.5, pillarW + 2),
        new THREE.MeshBasicMaterial({ color: parseInt(stage.color.replace('#', ''), 16) })
      );
      cap.position.set(x, 2 + height, 0);
      scene.add(cap);

      scene.add(col);
      columns.push({ group: col, x: x });
    });

    var legend = document.getElementById('rp-pipeline-legend');
    if (legend) {
      legend.innerHTML = '';
      STAGES.forEach(function (s) {
        var chip = document.createElement('span');
        chip.style.cssText = 'display:inline-flex;align-items:center;gap:6px';
        var dot = document.createElement('span');
        dot.style.cssText = 'display:inline-block;width:10px;height:10px;border-radius:2px;background:' + s.color;
        var name = document.createElement('span');
        name.style.cssText = 'color:var(--text);font-weight:600';
        name.textContent = s.name;
        var val = document.createElement('span');
        val.style.cssText = "font-family:'JetBrains Mono',monospace;color:var(--gold,#BC9C45)";
        val.textContent = '$' + s.value.toFixed(2) + 'B · ' + s.deals + ' deals';
        chip.appendChild(dot); chip.appendChild(name); chip.appendChild(val);
        legend.appendChild(chip);
      });
    }

    var visible = true;
    document.addEventListener('visibilitychange', function () { visible = document.visibilityState === 'visible'; });

    function animate() {
      requestAnimationFrame(animate);
      if (!visible) return;
      columns.forEach(function (c, i) { c.group.rotation.y += 0.003 + i * 0.0008; });
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
      var c = document.getElementById('rp-pipeline-c');
      if (c) c.outerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:380px;color:var(--muted,#94a3b8);font-size:13px">WebGL unavailable — pipeline visualization requires WebGL.</div>';
      return;
    }
    load(THREE_SRC).then(function () { if (window.THREE) try { initScene(); } catch (e) {} });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
