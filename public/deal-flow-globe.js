/* RePrime — Deal-Flow Globe (Phase 6.2)
 *
 * Second 3D scene complementing globe.js. Shows CAPITAL FLOW: animated arcs
 * between major U.S. CRE markets, arc weight proportional to indicative
 * transaction volume. Visually differentiates from the existing data globe
 * (which counts catalog sources).
 *
 * Mounts into #viz-deal-flow-globe.
 * Loads Three.js on-demand (cdnjs r128 with SRI — matches globe.js).
 * Respects prefers-reduced-motion (renders static notice instead).
 *
 * Markets list is hardcoded to top 12 U.S. CRE markets per industry
 * convention (JLL/CBRE/C&W quarterly markets). Flow weights are computed
 * deterministically from market-weight + distance — clearly labeled
 * "Indicative" so visitors understand it's not live transaction data yet.
 */
(function () {
  'use strict';
  var el = document.getElementById('viz-deal-flow-globe');
  if (!el) return;

  // Phase 3 — honor prefers-reduced-motion
  try {
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.innerHTML =
        '<div style="display:flex;align-items:center;justify-content:center;height:240px;color:var(--muted,#94a3b8);font-size:13px;text-align:center;padding:24px">' +
        'Deal-flow visualization disabled (reduced motion).<br/>' +
        '<a href="/wall" style="color:var(--accent,#3b82f6);text-decoration:none">View transactions →</a>' +
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

  var MARKETS = [
    { name: 'New York',      lat: 40.7128, lon: -74.0060,  weight: 1.00 },
    { name: 'Los Angeles',   lat: 34.0522, lon: -118.2437, weight: 0.85 },
    { name: 'Chicago',       lat: 41.8781, lon: -87.6298,  weight: 0.70 },
    { name: 'Dallas',        lat: 32.7767, lon: -96.7970,  weight: 0.78 },
    { name: 'Houston',       lat: 29.7604, lon: -95.3698,  weight: 0.68 },
    { name: 'Atlanta',       lat: 33.7490, lon: -84.3880,  weight: 0.72 },
    { name: 'Boston',        lat: 42.3601, lon: -71.0589,  weight: 0.65 },
    { name: 'San Francisco', lat: 37.7749, lon: -122.4194, weight: 0.75 },
    { name: 'Miami',         lat: 25.7617, lon: -80.1918,  weight: 0.62 },
    { name: 'Seattle',       lat: 47.6062, lon: -122.3321, weight: 0.58 },
    { name: 'Washington DC', lat: 38.9072, lon: -77.0369,  weight: 0.60 },
    { name: 'Denver',        lat: 39.7392, lon: -104.9903, weight: 0.50 }
  ];

  function computeFlows() {
    var flows = [];
    for (var i = 0; i < MARKETS.length; i++) {
      for (var j = 0; j < MARKETS.length; j++) {
        if (i === j) continue;
        var combinedWeight = (MARKETS[i].weight + MARKETS[j].weight) / 2;
        var dlat = MARKETS[i].lat - MARKETS[j].lat;
        var dlon = MARKETS[i].lon - MARKETS[j].lon;
        var dist = Math.sqrt(dlat * dlat + dlon * dlon);
        var distFactor = Math.max(0, 1 - dist / 60);
        var w = combinedWeight * distFactor;
        if (w > 0.25) flows.push({ from: i, to: j, weight: w });
      }
    }
    flows.sort(function (a, b) { return b.weight - a.weight; });
    return flows.slice(0, 20);
  }

  function latLonToVec3(lat, lon, radius) {
    var phi = (90 - lat) * Math.PI / 180;
    var theta = (lon + 180) * Math.PI / 180;
    return new window.THREE.Vector3(
      -radius * Math.sin(phi) * Math.cos(theta),
       radius * Math.cos(phi),
       radius * Math.sin(phi) * Math.sin(theta)
    );
  }

  function shell() {
    el.innerHTML =
      '<div style="position:relative;max-width:1280px;margin:24px auto;border:1px solid var(--border,rgba(255,255,255,.12));border-radius:16px;background:linear-gradient(135deg,rgba(15,23,42,.6),rgba(2,6,23,.8));padding:16px 0 0;overflow:hidden">' +
        '<div style="display:flex;justify-content:space-between;align-items:center;padding:0 18px 12px;flex-wrap:wrap;gap:8px">' +
          '<div style="font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--gold,#BC9C45)">Deal Flow</div>' +
          '<div style="font-size:10px;color:var(--muted,#94a3b8)">Capital Flow · Top 12 U.S. CRE Markets · Indicative</div>' +
        '</div>' +
        '<canvas id="rp-deal-flow-c" style="display:block;width:100%;height:420px"></canvas>' +
        '<div id="rp-deal-flow-legend" style="display:flex;gap:14px;padding:10px 18px 14px;flex-wrap:wrap;justify-content:center;font-size:10px;color:var(--muted,#94a3b8)"></div>' +
      '</div>';
  }

  function initScene() {
    var canvas = document.getElementById('rp-deal-flow-c');
    if (!canvas) return;
    var W = canvas.clientWidth || 1280;
    var H = 420;
    canvas.width = W; canvas.height = H;

    var THREE = window.THREE;
    var renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(W, H, false);

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(45, W / H, 0.1, 1000);
    camera.position.z = 350;

    var GLOBE_R = 90;
    var goldHex = parseInt(css('--gold', '#BC9C45').replace('#', ''), 16);
    var greenHex = parseInt(css('--green', '#22c55e').replace('#', ''), 16);

    var globeGeom = new THREE.SphereGeometry(GLOBE_R, 64, 48);
    var wireMat = new THREE.MeshBasicMaterial({ color: 0x1e293b, wireframe: true, transparent: true, opacity: 0.35 });
    var globeMesh = new THREE.Mesh(globeGeom, wireMat);
    scene.add(globeMesh);

    var dotsGeom = new THREE.SphereGeometry(GLOBE_R - 0.5, 32, 24);
    var dotsMat = new THREE.PointsMaterial({ color: goldHex, size: 0.7, transparent: true, opacity: 0.5 });
    var dotsMesh = new THREE.Points(dotsGeom, dotsMat);
    scene.add(dotsMesh);

    // Starfield
    var starGeom = new THREE.BufferGeometry();
    var starCount = 600;
    var starPositions = new Float32Array(starCount * 3);
    for (var i = 0; i < starCount; i++) {
      var r = 380 + Math.random() * 80;
      var ph = Math.acos(2 * Math.random() - 1);
      var th = 2 * Math.PI * Math.random();
      starPositions[i * 3]     = r * Math.sin(ph) * Math.cos(th);
      starPositions[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th);
      starPositions[i * 3 + 2] = r * Math.cos(ph);
    }
    starGeom.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    scene.add(new THREE.Points(starGeom, new THREE.PointsMaterial({ color: 0xffffff, size: 0.8, transparent: true, opacity: 0.5 })));

    // Wrap all globe-attached objects in a group so they rotate together
    var earthGroup = new THREE.Group();
    earthGroup.add(globeMesh);
    earthGroup.add(dotsMesh);
    scene.add(earthGroup);

    // Market markers (attached to earthGroup so they co-rotate)
    MARKETS.forEach(function (m) {
      var pos = latLonToVec3(m.lat, m.lon, GLOBE_R);
      var size = 1.5 + m.weight * 2.5;
      var dot = new THREE.Mesh(
        new THREE.SphereGeometry(size, 16, 12),
        new THREE.MeshBasicMaterial({ color: goldHex, transparent: true, opacity: 0.9 })
      );
      dot.position.copy(pos);
      earthGroup.add(dot);
      var halo = new THREE.Mesh(
        new THREE.SphereGeometry(size * 1.8, 16, 12),
        new THREE.MeshBasicMaterial({ color: goldHex, transparent: true, opacity: 0.15 })
      );
      halo.position.copy(pos);
      earthGroup.add(halo);
    });

    // Flow arcs (also attached to earthGroup)
    var flows = computeFlows();
    var pulses = [];
    flows.forEach(function (f) {
      var p1 = latLonToVec3(MARKETS[f.from].lat, MARKETS[f.from].lon, GLOBE_R);
      var p2 = latLonToVec3(MARKETS[f.to].lat, MARKETS[f.to].lon, GLOBE_R);
      var mid = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);
      var dist = p1.distanceTo(p2);
      mid.setLength(GLOBE_R + dist * 0.35);
      var curve = new THREE.QuadraticBezierCurve3(p1, mid, p2);
      var points = curve.getPoints(48);
      var arcLine = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(points),
        new THREE.LineBasicMaterial({ color: goldHex, transparent: true, opacity: 0.15 + f.weight * 0.4 })
      );
      earthGroup.add(arcLine);

      var pulse = new THREE.Mesh(
        new THREE.SphereGeometry(1 + f.weight, 8, 6),
        new THREE.MeshBasicMaterial({ color: greenHex, transparent: true, opacity: 0.9 })
      );
      earthGroup.add(pulse);
      pulses.push({ mesh: pulse, curve: curve, t: Math.random(), speed: 0.005 + f.weight * 0.008 });
    });

    var legend = document.getElementById('rp-deal-flow-legend');
    if (legend) {
      legend.innerHTML =
        '<span><span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:var(--gold,#BC9C45);vertical-align:middle;margin-right:4px"></span>Market</span>' +
        '<span><span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:var(--green,#22c55e);vertical-align:middle;margin-right:4px"></span>Capital pulse</span>' +
        '<span style="opacity:.6">Top ' + flows.length + ' active corridors · ' + MARKETS.length + ' markets</span>';
    }

    // Curved-text brand ring orbiting the globe (attached to earthGroup so
    // it follows the existing rotation). Two rings — one equatorial, one
    // tilted for a satellite-orbit feel.
    if (window.RP3D && window.RP3D.addOrbitRing) {
      window.RP3D.addOrbitRing(earthGroup, { radius: GLOBE_R + 18, height: 14, y: 0,             opacity: 0.7,  repeats: 5, color: '#BC9C45' });
      window.RP3D.addOrbitRing(earthGroup, { radius: GLOBE_R + 34, height: 10, y: 0, tilt: 0.45, opacity: 0.45, repeats: 4, color: '#d4af37' });
    }

    var visible = true;
    document.addEventListener('visibilitychange', function () { visible = document.visibilityState === 'visible'; });

    function animate() {
      requestAnimationFrame(animate);
      if (!visible) return;
      earthGroup.rotation.y += 0.0015;
      pulses.forEach(function (p) {
        p.t += p.speed; if (p.t > 1) p.t -= 1;
        var pos = p.curve.getPoint(p.t);
        p.mesh.position.copy(pos);
      });
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
      var c = document.getElementById('rp-deal-flow-c');
      if (c) c.outerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:420px;color:var(--muted,#94a3b8);font-size:13px">WebGL unavailable — deal-flow visualization requires WebGL.</div>';
      return;
    }
    load(THREE_SRC).then(function () {
      if (window.THREE) try { initScene(); } catch (e) { /* graceful fail */ }
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
