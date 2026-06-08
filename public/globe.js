/* RePrime 3D Live Data Globe — Kaspersky-cybermap-style WebGL centerpiece.
   Three.js (r128, cdnjs): dark starfield, rotating dotted sphere + wireframe +
   atmosphere glow, animated arcs with traveling pulses, monospace live-data
   overlay driven by our REAL counts. Renders into #viz-globe. Glassmorphic,
   WebGL feature-detected, graceful fallback. No new API keys needed. */
(function () {
  "use strict";
  var el = document.getElementById("viz-globe");
  if (!el) return;
  var THREE_SRC = "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js";
  function css(v, f) { return (getComputedStyle(document.documentElement).getPropertyValue(v) || f).trim() || f; }
  function load(src) { return new Promise(function (res) { if (window.THREE) return res(); var s = document.createElement("script"); s.src = src; s.onload = res; s.onerror = res; document.head.appendChild(s); }); }
  function getJSON(u, o) { return fetch(u, o).then(function (r) { return r.json(); }).catch(function () { return null; }); }
  function webglOK() { try { var c = document.createElement("canvas"); return !!(window.WebGLRenderingContext && (c.getContext("webgl") || c.getContext("experimental-webgl"))); } catch (e) { return false; } }
  var fmt = function (n) { return Number(n || 0).toLocaleString(); };

  var SB = "https://gugcmsqrscqqqltdtgkz.supabase.co";
  var H = { apikey: "sb_publishable_J5zIiHNf1VqpQ7r14SevFw__MbvlEpm", Authorization: "Bearer sb_publishable_J5zIiHNf1VqpQ7r14SevFw__MbvlEpm" };

  function shell(data) {
    el.innerHTML =
      '<div style="max-width:1280px;margin:56px auto 0">' +
      '<div style="font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.1em;color:var(--gold);margin-bottom:8px">Live Network</div>' +
      '<div style="font-size:clamp(22px,3vw,30px);font-weight:700;color:var(--text);line-height:1.15;margin-bottom:18px">The RePrime data universe, live</div>' +
      '<div class="rp-glass rp-rise" style="position:relative;overflow:hidden;height:540px;background:radial-gradient(ellipse at center,rgba(14,52,112,.18),rgba(3,6,12,.6))">' +
      '<canvas id="rp-globe-c" style="display:block;width:100%;height:100%"></canvas>' +
      '<div style="position:absolute;top:18px;left:20px;pointer-events:none;font-family:\'JetBrains Mono\',monospace">' +
        '<div style="font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:var(--gold);display:flex;align-items:center;gap:7px"><span class="rp-live-dot"></span>Live Data Network</div>' +
        ovl("g-sources", data.sources, "data sources", "var(--gold)") +
        ovl("g-records", data.records, "records ingested", "var(--bright)") +
        ovl("g-cats", data.categories, "categories", "var(--teal)") +
      '</div>' +
      '<div style="position:absolute;bottom:14px;right:18px;pointer-events:none;font-family:\'JetBrains Mono\',monospace;font-size:10px;color:var(--dim)">WebGL · real-time render</div>' +
      '</div></div>';
  }
  function ovl(id, val, lbl, col) {
    return '<div style="margin-top:14px"><div id="' + id + '" style="font-size:30px;font-weight:800;color:' + col + ';line-height:1">' + fmt(val) + '</div><div style="font-size:10px;text-transform:uppercase;letter-spacing:.08em;color:var(--muted)">' + lbl + '</div></div>';
  }

  function spherePoint(R) {
    var u = Math.random(), v = Math.random();
    var theta = 2 * Math.PI * u, phi = Math.acos(2 * v - 1);
    return new window.THREE.Vector3(R * Math.sin(phi) * Math.cos(theta), R * Math.cos(phi), R * Math.sin(phi) * Math.sin(theta));
  }
  function hex(c) { return parseInt(c.replace("#", "0x")); }

  function initGlobe(data) {
    var THREE = window.THREE;
    var canvas = document.getElementById("rp-globe-c");
    var W = canvas.clientWidth || 900, Hh = 540;
    var gold = css("--gold", "#BC9C45"), blue = css("--blue", "#1D5FB8"), bright = css("--bright", "#00A1FF"), teal = css("--teal", "#009080"), amber = css("--amber", "#FFBC7D");
    var arcPal = [gold, bright, teal, amber, blue].map(hex);

    var renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(W, Hh, false);
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(42, W / Hh, 0.1, 2000);
    camera.position.z = 330;

    var group = new THREE.Group(); group.rotation.x = 0.45; scene.add(group);
    var R = 110;

    // dotted globe surface (fibonacci sphere)
    var N = 1600, pos = [];
    for (var i = 0; i < N; i++) {
      var y = 1 - (i / (N - 1)) * 2, r = Math.sqrt(1 - y * y), th = i * 2.399963;
      pos.push(Math.cos(th) * r * R, y * R, Math.sin(th) * r * R);
    }
    var dotGeo = new THREE.BufferGeometry();
    dotGeo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    group.add(new THREE.Points(dotGeo, new THREE.PointsMaterial({ color: hex(gold), size: 1.5, transparent: true, opacity: .55 })));

    // faint wireframe + atmosphere
    group.add(new THREE.Mesh(new THREE.SphereGeometry(R, 24, 18), new THREE.MeshBasicMaterial({ color: hex(blue), wireframe: true, transparent: true, opacity: .10 })));
    group.add(new THREE.Mesh(new THREE.SphereGeometry(R * 1.14, 32, 32), new THREE.MeshBasicMaterial({ color: hex(teal), transparent: true, opacity: .05, side: THREE.BackSide })));

    // arcs with traveling pulses — count tied to real categories/datasets
    var nArcs = Math.max(10, Math.min(30, (data.categories || 14) + Math.round((data.datasets || 16) / 8)));
    var arcs = [];
    for (var k = 0; k < nArcs; k++) {
      var a = spherePoint(R), b = spherePoint(R);
      var mid = a.clone().add(b).multiplyScalar(0.5).normalize().multiplyScalar(R * (1.35 + Math.random() * 0.3));
      var curve = new THREE.QuadraticBezierCurve3(a, mid, b);
      var col = arcPal[k % arcPal.length];
      var lg = new THREE.BufferGeometry().setFromPoints(curve.getPoints(44));
      group.add(new THREE.Line(lg, new THREE.LineBasicMaterial({ color: col, transparent: true, opacity: .45 })));
      var dot = new THREE.Mesh(new THREE.SphereGeometry(1.7, 8, 8), new THREE.MeshBasicMaterial({ color: col }));
      group.add(dot);
      // endpoint glow markers
      [a, b].forEach(function (p) { var m = new THREE.Mesh(new THREE.SphereGeometry(1.3, 6, 6), new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: .8 })); m.position.copy(p); group.add(m); });
      arcs.push({ curve: curve, dot: dot, t: Math.random(), sp: 0.0025 + Math.random() * 0.006 });
    }

    // starfield
    var sN = 900, sp = [];
    for (var s = 0; s < sN; s++) { sp.push((Math.random() - .5) * 1600, (Math.random() - .5) * 1200, (Math.random() - .5) * 1600 - 300); }
    var starGeo = new THREE.BufferGeometry(); starGeo.setAttribute("position", new THREE.Float32BufferAttribute(sp, 3));
    scene.add(new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0xffffff, size: 1.1, transparent: true, opacity: .5 })));

    var raf;
    function animate() {
      group.rotation.y += 0.0017;
      for (var j = 0; j < arcs.length; j++) { var ar = arcs[j]; ar.t += ar.sp; if (ar.t > 1) ar.t = 0; ar.dot.position.copy(ar.curve.getPoint(ar.t)); }
      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    }
    animate();

    window.addEventListener("resize", function () {
      var w = canvas.clientWidth || W; renderer.setSize(w, Hh, false); camera.aspect = w / Hh; camera.updateProjectionMatrix();
    });
  }

  function start() {
    Promise.all([
      getJSON("/data/sources_all.json"),
      getJSON("/api/stats"),
      fetch(SB + "/rest/v1/data_records?select=count", { headers: Object.assign({ Prefer: "count=exact" }, H) }).then(function (r) { return r.json(); }).then(function (j) { return (j && j[0] && j[0].count) || 0; }).catch(function () { return 0; }),
      fetch(SB + "/rest/v1/v_latest_source_data?select=name&status=eq.ok&limit=200", { headers: H }).then(function (r) { return r.json(); }).then(function (j) { return (j || []).length; }).catch(function () { return 0; })
    ]).then(function (r) {
      var cat = r[0] || {}, stats = r[1] || {}, recs = r[2] || 0, ds = r[3] || 0;
      // Honest fallback (audit Phase 1 task 1.6): when fetches fail, show 0 — not fabricated values.
      // Previously fell back to 1932/16063/14/32 which made failure indistinguishable from success.
      var sourcesCount = ((cat.sources || cat) || []).length || stats.cataloged_sources || 0;
      var data = {
        sources: sourcesCount,
        records: recs,
        categories: stats.category_count || 0,
        datasets: ds,
        unavailable: (sourcesCount === 0 && recs === 0 && ds === 0)
      };
      shell(data);
      if (!webglOK()) { var c = document.getElementById("rp-globe-c"); if (c) c.outerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100%;color:var(--muted);font-size:13px">3D globe needs WebGL — your browser has it disabled.</div>'; return; }
      load(THREE_SRC).then(function () { if (window.THREE) { try { initGlobe(data); } catch (e) { /* leave overlay/starfield card */ } } });
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
