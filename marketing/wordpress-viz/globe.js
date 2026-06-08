/* ============================================================================
   globe.js — RePrime 3D Deal Map  (Kaspersky Cyberthreat-map technique)
   ----------------------------------------------------------------------------
   Technique replicated:
     • WebGL globe rendered with Three.js on a dark starfield (full-bleed void)
     • requestAnimationFrame loop — globe auto-rotates, arc pulses travel
     • Bezier (QuadraticBezierCurve3) "deal arcs" from RePrime HQ to each
       acquisition market, exactly like Kaspersky's attack arcs
     • Raycaster hover → DOM tooltip overlay on top of the canvas (DOM-on-WebGL)
   Performance:
     • Lazy: nothing initializes until the section scrolls into view (IO)
     • Batched: all motion happens inside ONE rAF loop
     • Enqueued with `defer`; never blocks page load
   Data: REAL completed-transaction markets (Postville HQ + deal cities). No placeholders.
   Depends on: window.THREE (enqueued by functions.php with dependency)
   ============================================================================ */
(function () {
  "use strict";
  var host = document.getElementById("reprime-globe");
  if (!host) return;

  // --- Real RePrime markets (lat, lon, label, asset, $ value) -------------
  var HQ = { lat: 43.08, lon: -91.57, label: "RePrime HQ — Postville, IA" };
  var DEALS = [
    { lat: 42.03, lon: -91.60, label: "Anchor Plaza Center",   meta: "Grocery-Anchored Retail · Marion, IA · $18.4M" },
    { lat: 25.81, lon: -80.36, label: "The Palms at Doral",    meta: "240-Unit Multifamily · Doral, FL · $61.2M" },
    { lat: 27.95, lon: -82.46, label: "Tampa Bay Industrial",  meta: "220K SF Industrial · Tampa, FL · $52.8M" },
    { lat: 28.54, lon: -81.38, label: "Orlando Mixed-Use",     meta: "180 Units + Retail · Orlando, FL · $89.3M" },
    { lat: 26.12, lon: -80.14, label: "Ft. Lauderdale Retail", meta: "65K SF Retail · Ft. Lauderdale, FL · $42.7M" },
    { lat: 30.42, lon: -87.22, label: "Pensacola Plaza",       meta: "Retail · Pensacola, FL" },
    { lat: 39.49, lon: -75.03, label: "CVS Vineland",          meta: "Net Lease · Vineland, NJ · TD Bank" },
    { lat: 41.50, lon: -81.60, label: "Glenville Towne Center",meta: "Retail Center · Glenville, OH" },
    { lat: 42.70, lon: -84.50, label: "Pirate's Plaza",        meta: "Retail · MI · Archway Capital" },
    { lat: 35.60, lon: -82.55, label: "Redbud Commons",        meta: "Retail · NC · Archway Capital" },
    { lat: 39.80, lon: -86.20, label: "Trails Edge Apartments",meta: "Multifamily · IN · FM Capital" }
  ];

  // --- Skeleton shown immediately (Cloudflare technique); zero JS cost ----
  host.innerHTML = '<div class="rpv-skel rpv-globe-host"></div>';

  function latLon(lat, lon, R) {
    var phi = (90 - lat) * Math.PI / 180, theta = (lon + 180) * Math.PI / 180;
    return new THREE.Vector3(-R * Math.sin(phi) * Math.cos(theta), R * Math.cos(phi), R * Math.sin(phi) * Math.sin(theta));
  }
  var cssVar = function (n, f) { return (getComputedStyle(document.documentElement).getPropertyValue(n) || f).trim() || f; };
  var hexNum = function (c) { return parseInt(c.replace("#", "0x")); };

  function init() {
    if (!window.THREE) { host.innerHTML = '<div class="rpv-glass rpv-glass-pad rpv-globe-host" style="display:flex;align-items:center;justify-content:center;color:var(--rpv-muted)">3D map requires WebGL.</div>'; return; }
    var GOLD = hexNum(cssVar("--rpv-gold", "#BC9C45")), BLUE = hexNum(cssVar("--rpv-blue", "#1D5FB8")),
        BRIGHT = hexNum(cssVar("--rpv-bright", "#00A1FF")), TEAL = hexNum(cssVar("--rpv-teal", "#009080"));

    host.innerHTML = '<div class="rpv-glass rpv-canvas-host rpv-globe-host rpv-rise rpv-in" style="background:radial-gradient(ellipse at center,rgba(14,52,112,.18),rgba(3,6,12,.65))">' +
      '<canvas style="display:block;width:100%;height:100%"></canvas>' +
      '<div style="position:absolute;top:18px;left:20px;pointer-events:none;font-family:var(--rpv-mono)">' +
        '<div style="font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:var(--rpv-gold)"><span class="rpv-dot"></span> Live Deal Map</div>' +
        '<div class="rpv-stat-v" style="margin-top:10px">' + DEALS.length + '</div><div class="rpv-stat-l">active markets</div>' +
        '<div class="rpv-stat-v" style="margin-top:10px;color:var(--rpv-bright)">800+</div><div class="rpv-stat-l">transactions · 21M+ SF</div>' +
      '</div></div>';
    var canvas = host.querySelector("canvas");
    var W = canvas.clientWidth || 1000, H = 560;

    var renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(W, H, false);
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(40, W / H, 0.1, 2000);
    // tilt toward North America so US markets face the viewer
    camera.position.set(120, 70, 320);
    camera.lookAt(0, 0, 0);

    var group = new THREE.Group(); scene.add(group);
    var R = 110;

    // dotted sphere surface (fibonacci distribution)
    var pts = [], N = 1700;
    for (var i = 0; i < N; i++) { var y = 1 - (i / (N - 1)) * 2, r = Math.sqrt(1 - y * y), th = i * 2.399963; pts.push(Math.cos(th) * r * R, y * R, Math.sin(th) * r * R); }
    var dg = new THREE.BufferGeometry(); dg.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
    group.add(new THREE.Points(dg, new THREE.PointsMaterial({ color: GOLD, size: 1.4, transparent: true, opacity: .5 })));
    group.add(new THREE.Mesh(new THREE.SphereGeometry(R, 26, 20), new THREE.MeshBasicMaterial({ color: BLUE, wireframe: true, transparent: true, opacity: .09 })));
    group.add(new THREE.Mesh(new THREE.SphereGeometry(R * 1.14, 32, 32), new THREE.MeshBasicMaterial({ color: TEAL, transparent: true, opacity: .05, side: THREE.BackSide })));

    // HQ marker
    var hqPos = latLon(HQ.lat, HQ.lon, R);
    var hq = new THREE.Mesh(new THREE.SphereGeometry(2.6, 12, 12), new THREE.MeshBasicMaterial({ color: GOLD }));
    hq.position.copy(hqPos); hq.userData = HQ; group.add(hq);

    // deal nodes + arcs from HQ
    var nodes = [hq], arcs = [];
    DEALS.forEach(function (d, k) {
      var p = latLon(d.lat, d.lon, R);
      var node = new THREE.Mesh(new THREE.SphereGeometry(1.9, 10, 10), new THREE.MeshBasicMaterial({ color: BRIGHT }));
      node.position.copy(p); node.userData = d; group.add(node); nodes.push(node);
      var mid = hqPos.clone().add(p).multiplyScalar(0.5).normalize().multiplyScalar(R * (1.32 + Math.random() * 0.18));
      var curve = new THREE.QuadraticBezierCurve3(hqPos, mid, p);
      group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(curve.getPoints(48)), new THREE.LineBasicMaterial({ color: k % 2 ? GOLD : BRIGHT, transparent: true, opacity: .4 })));
      var pulse = new THREE.Mesh(new THREE.SphereGeometry(1.5, 8, 8), new THREE.MeshBasicMaterial({ color: GOLD }));
      group.add(pulse); arcs.push({ curve: curve, pulse: pulse, t: Math.random(), sp: 0.0035 + Math.random() * 0.004 });
    });

    // starfield
    var sp = [], sN = 800; for (var s = 0; s < sN; s++) sp.push((Math.random() - .5) * 1700, (Math.random() - .5) * 1300, (Math.random() - .5) * 1700 - 400);
    var sg = new THREE.BufferGeometry(); sg.setAttribute("position", new THREE.Float32BufferAttribute(sp, 3));
    scene.add(new THREE.Points(sg, new THREE.PointsMaterial({ color: 0xffffff, size: 1.1, transparent: true, opacity: .45 })));

    // --- hover tooltip (DOM overlay on WebGL) ------------------------------
    var tip = document.createElement("div"); tip.className = "rpv-tip"; document.body.appendChild(tip);
    var ray = new THREE.Raycaster(); ray.params.Points = { threshold: 4 }; var mouse = new THREE.Vector2(); var hovering = null;
    canvas.addEventListener("mousemove", function (e) {
      var r = canvas.getBoundingClientRect();
      mouse.x = ((e.clientX - r.left) / r.width) * 2 - 1; mouse.y = -((e.clientY - r.top) / r.height) * 2 + 1;
      ray.setFromCamera(mouse, camera);
      var hit = ray.intersectObjects(nodes)[0];
      if (hit) { hovering = hit.object; var d = hovering.userData; tip.style.display = "block"; tip.style.left = (e.clientX + 14) + "px"; tip.style.top = (e.clientY + 14) + "px"; tip.innerHTML = "<b>" + d.label + "</b>" + (d.meta ? "<br>" + d.meta : ""); canvas.style.cursor = "pointer"; }
      else { hovering = null; tip.style.display = "none"; canvas.style.cursor = "default"; }
    });
    canvas.addEventListener("mouseleave", function () { tip.style.display = "none"; });

    // --- single batched rAF loop ------------------------------------------
    var running = true;
    function frame() {
      if (!running) return;
      group.rotation.y += 0.0016;
      for (var j = 0; j < arcs.length; j++) { var a = arcs[j]; a.t += a.sp; if (a.t > 1) a.t = 0; a.pulse.position.copy(a.curve.getPoint(a.t)); }
      renderer.render(scene, camera);
      requestAnimationFrame(frame);
    }
    frame();
    // pause when offscreen to save CPU
    new IntersectionObserver(function (es) { running = es[0].isIntersecting; if (running) frame(); }, { threshold: 0 }).observe(canvas);
    window.addEventListener("resize", function () { var w = canvas.clientWidth || W; renderer.setSize(w, H, false); camera.aspect = w / H; camera.updateProjectionMatrix(); });
  }

  // --- Lazy init: only build WebGL when the section enters the viewport ----
  var io = new IntersectionObserver(function (entries) {
    if (entries[0].isIntersecting) { io.disconnect(); init(); }
  }, { rootMargin: "200px" });
  io.observe(host);
})();
