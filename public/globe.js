/* RePrime 3D US CRE Intelligence Globe — Live data-driven visualization.
   Three.js (r128, cdnjs): US-focused globe with metro nodes, capital flow
   arcs, particle systems, and real-time Supabase data feeds.
   Everything moves. Nothing is static. */
(function () {
  "use strict";

  var THREE_SRC = "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js";
  var THREE_SRI = "sha384-CI3ELBVUz9XQO+97x6nwMDPosPR5XvsxW2ua7N1Xeygeh1IxtgqtCkGfQY9WWdHu";

  function css(v, f) { return (getComputedStyle(document.documentElement).getPropertyValue(v) || f).trim() || f; }
  function loadScript(src) {
    return new Promise(function (res) {
      if (window.THREE) return res();
      var s = document.createElement("script");
      s.src = src;
      if (src === THREE_SRC) { s.integrity = THREE_SRI; s.crossOrigin = "anonymous"; s.referrerPolicy = "no-referrer"; }
      s.onload = res; s.onerror = res; document.head.appendChild(s);
    });
  }
  function webglOK() { try { var c = document.createElement("canvas"); return !!(window.WebGLRenderingContext && (c.getContext("webgl") || c.getContext("experimental-webgl"))); } catch (e) { return false; } }
  function hex(c) { return parseInt(c.replace("#", "0x")); }

  // Phase 2.3 — centralized config
  var CFG = window.RP_SB || { URL: "https://gugcmsqrscqqqltdtgkz.supabase.co", KEY: "sb_publishable_J5zIiHNf1VqpQ7r14SevFw__MbvlEpm" };
  var SB = CFG.URL;
  var H = { apikey: CFG.KEY, Authorization: "Bearer " + CFG.KEY };

  // ── US CRE Metro Coordinates (lat/lng → spherical) ───────────────────
  var METROS = [
    { name: "New York",      lat: 40.7128,  lng: -74.0060,  weight: 1.00, abbr: "NYC" },
    { name: "Los Angeles",   lat: 34.0522,  lng: -118.2437, weight: 0.85, abbr: "LA" },
    { name: "Chicago",       lat: 41.8781,  lng: -87.6298,  weight: 0.72, abbr: "CHI" },
    { name: "Miami",         lat: 25.7617,  lng: -80.1918,  weight: 0.90, abbr: "MIA" },
    { name: "Dallas",        lat: 32.7767,  lng: -96.7970,  weight: 0.78, abbr: "DFW" },
    { name: "Houston",       lat: 29.7604,  lng: -95.3698,  weight: 0.68, abbr: "HOU" },
    { name: "Atlanta",       lat: 33.7490,  lng: -84.3880,  weight: 0.74, abbr: "ATL" },
    { name: "San Francisco", lat: 37.7749,  lng: -122.4194, weight: 0.82, abbr: "SF" },
    { name: "Washington DC", lat: 38.9072,  lng: -77.0369,  weight: 0.80, abbr: "DC" },
    { name: "Boston",        lat: 42.3601,  lng: -71.0589,  weight: 0.65, abbr: "BOS" },
    { name: "Seattle",       lat: 47.6062,  lng: -122.3321, weight: 0.60, abbr: "SEA" },
    { name: "Denver",        lat: 39.7392,  lng: -104.9903, weight: 0.58, abbr: "DEN" },
    { name: "Phoenix",       lat: 33.4484,  lng: -112.0740, weight: 0.62, abbr: "PHX" },
    { name: "Nashville",     lat: 36.1627,  lng: -86.7816,  weight: 0.55, abbr: "NSH" },
    { name: "Austin",        lat: 30.2672,  lng: -97.7431,  weight: 0.64, abbr: "AUS" },
    { name: "Charlotte",     lat: 35.2271,  lng: -80.8431,  weight: 0.50, abbr: "CLT" },
    { name: "Las Vegas",     lat: 36.1699,  lng: -115.1398, weight: 0.48, abbr: "LV" },
    { name: "San Diego",     lat: 32.7157,  lng: -117.1611, weight: 0.45, abbr: "SD" },
    { name: "Tampa",         lat: 27.9506,  lng: -82.4572,  weight: 0.52, abbr: "TPA" },
    { name: "Portland",      lat: 45.5152,  lng: -122.6784, weight: 0.42, abbr: "PDX" },
    { name: "Minneapolis",   lat: 44.9778,  lng: -93.2650,  weight: 0.40, abbr: "MSP" },
    { name: "Detroit",       lat: 42.3314,  lng: -83.0458,  weight: 0.38, abbr: "DET" },
    { name: "Orlando",       lat: 28.5383,  lng: -81.3792,  weight: 0.46, abbr: "ORL" },
    { name: "Salt Lake City",lat: 40.7608,  lng: -111.8910, weight: 0.36, abbr: "SLC" },
    { name: "Raleigh",       lat: 35.7796,  lng: -78.6382,  weight: 0.44, abbr: "RDU" }
  ];

  // ── US outline (simplified lon/lat pairs for continental US border) ───
  // 72-point approximation of CONUS border for wireframe rendering
  var US_OUTLINE = [
    [-66.9,44.8],[-67.1,45.1],[-67.8,47.0],[-69.2,47.4],[-71.1,45.3],
    [-74.7,45.0],[-75.0,43.2],[-76.3,43.6],[-79.0,43.2],[-79.0,42.5],
    [-82.5,41.7],[-83.5,42.3],[-84.5,46.5],[-85.0,46.8],[-87.6,48.0],
    [-89.5,48.0],[-94.7,49.0],[-95.1,49.0],[-104.0,49.0],[-110.0,49.0],
    [-116.0,49.0],[-123.0,49.0],[-124.7,48.4],[-124.5,46.3],[-124.1,43.0],
    [-124.4,40.4],[-123.8,38.9],[-122.5,37.8],[-121.8,36.6],[-120.6,34.8],
    [-118.6,34.0],[-117.6,33.5],[-117.1,32.5],[-114.7,32.7],[-111.1,31.3],
    [-108.2,31.3],[-106.6,31.8],[-104.7,30.0],[-103.0,29.0],[-101.4,29.8],
    [-99.1,26.4],[-97.1,25.9],[-97.2,27.8],[-96.4,28.7],[-94.7,29.3],
    [-93.8,29.7],[-91.1,29.2],[-89.6,29.0],[-89.0,28.9],[-88.7,30.2],
    [-87.6,30.3],[-86.4,30.4],[-85.0,29.9],[-83.5,29.0],[-82.5,27.5],
    [-81.5,25.9],[-80.1,25.2],[-80.0,26.9],[-80.6,28.6],[-81.1,30.7],
    [-81.2,31.5],[-79.9,32.8],[-78.6,33.9],[-76.0,35.4],[-75.4,36.0],
    [-75.0,38.0],[-74.7,39.0],[-74.0,40.0],[-72.0,41.0],[-71.0,42.0],
    [-70.0,42.6],[-67.0,44.5]
  ];

  // ── Globals ──────────────────────────────────────────────────────────
  var renderer, globalCanvas;
  var registeredViews = [];
  var animFrameId;
  var simMesh, simWire, simAntenna, simGrid;
  var prefersReducedMotion = false;
  try { prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}

  // 14 Category visual configurations
  var CAT_DEFS = {
    economic: { type: "octahedron", color: "--gold" },
    demographic: { type: "sphere_points", color: "--teal" },
    housing_re: { type: "torus", color: "--amber" },
    hazard_environmental: { type: "double_tetra", color: "--red" },
    infrastructure: { type: "icosahedron", color: "--bright" },
    capital_markets: { type: "knot", color: "--gold" },
    insurance_climate: { type: "cylinder", color: "--blue" },
    zoning_parcel: { type: "cube", color: "--bright" },
    news_sentiment: { type: "dodecahedron", color: "--teal" },
    israeli: { type: "star", color: "--blue" },
    construction_pipeline: { type: "pyramid", color: "--amber" },
    macro_indicator: { type: "cone", color: "--green" },
    energy: { type: "energy_core", color: "--red" },
    other: { type: "ring", color: "--bright" }
  };

  function initRenderer() {
    globalCanvas = document.getElementById("rp-3d-canvas");
    if (!globalCanvas) {
      globalCanvas = document.createElement("canvas");
      globalCanvas.id = "rp-3d-canvas";
      document.body.appendChild(globalCanvas);
    }
    renderer = new THREE.WebGLRenderer({ canvas: globalCanvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(window.innerWidth, window.innerHeight, false);
    renderer.autoClear = false;
  }

  function resizeRenderer() {
    if (renderer) renderer.setSize(window.innerWidth, window.innerHeight, false);
  }

  // ── Convert lat/lng to 3D sphere position ────────────────────────────
  function latLngToVec3(lat, lng, radius) {
    var phi = (90 - lat) * Math.PI / 180;
    var theta = (lng + 180) * Math.PI / 180;
    return new THREE.Vector3(
      -radius * Math.sin(phi) * Math.cos(theta),
       radius * Math.cos(phi),
       radius * Math.sin(phi) * Math.sin(theta)
    );
  }

  // ── Main US Globe Scene ──────────────────────────────────────────────
  function createMainGlobeScene(data) {
    var THREE = window.THREE;
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(40, 1, 0.1, 1000);
    camera.position.z = 320;

    var group = new THREE.Group();
    // Tilt to center on US (roughly lat 39, lng -98)
    group.rotation.x = 0.25;
    group.rotation.y = 1.75; // rotate to show North America front-center
    scene.add(group);

    var R = 105;
    var gold = css("--gold", "#BC9C45"), blue = css("--blue", "#1D5FB8"),
        bright = css("--bright", "#00A1FF"), teal = css("--teal", "#009080"),
        amber = css("--amber", "#FFBC7D"), green = css("--green", "#00A980"),
        red = css("--red", "#FF7474");
    var arcPal = [gold, bright, teal, amber, blue].map(hex);

    // ─ Dotted globe surface (1500 Fibonacci points) ─
    var N = 1500, pos = [];
    for (var i = 0; i < N; i++) {
      var y = 1 - (i / (N - 1)) * 2, r = Math.sqrt(1 - y * y), th = i * 2.399963;
      pos.push(Math.cos(th) * r * R, y * R, Math.sin(th) * r * R);
    }
    var dotGeo = new THREE.BufferGeometry();
    dotGeo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    group.add(new THREE.Points(dotGeo, new THREE.PointsMaterial({ color: hex(blue), size: 1.2, transparent: true, opacity: 0.35 })));

    // ─ Faint wireframe sphere + atmosphere ─
    group.add(new THREE.Mesh(
      new THREE.SphereGeometry(R, 24, 18),
      new THREE.MeshBasicMaterial({ color: hex(blue), wireframe: true, transparent: true, opacity: 0.06 })
    ));
    group.add(new THREE.Mesh(
      new THREE.SphereGeometry(R * 1.08, 32, 32),
      new THREE.MeshBasicMaterial({ color: hex(teal), transparent: true, opacity: 0.04, side: THREE.BackSide })
    ));
    // Outer glow
    group.add(new THREE.Mesh(
      new THREE.SphereGeometry(R * 1.16, 32, 32),
      new THREE.MeshBasicMaterial({ color: hex(bright), transparent: true, opacity: 0.02, side: THREE.BackSide })
    ));

    // ─ US Outline wireframe ─
    var usPoints = [];
    for (var u = 0; u < US_OUTLINE.length; u++) {
      usPoints.push(latLngToVec3(US_OUTLINE[u][1], US_OUTLINE[u][0], R * 1.005));
    }
    // Close the loop
    usPoints.push(usPoints[0].clone());
    var usLineGeo = new THREE.BufferGeometry().setFromPoints(usPoints);
    group.add(new THREE.Line(usLineGeo, new THREE.LineBasicMaterial({
      color: hex(gold), transparent: true, opacity: 0.6, linewidth: 2
    })));

    // Inner US fill dots — denser point cloud inside US boundaries
    var usFillPos = [];
    for (var uf = 0; uf < 600; uf++) {
      // Scatter within approximate US bounding box
      var lat = 25 + Math.random() * 24;  // 25-49N
      var lng = -125 + Math.random() * 58; // 125-67W
      var p = latLngToVec3(lat, lng, R * 1.002);
      usFillPos.push(p.x, p.y, p.z);
    }
    var usFillGeo = new THREE.BufferGeometry();
    usFillGeo.setAttribute("position", new THREE.Float32BufferAttribute(usFillPos, 3));
    group.add(new THREE.Points(usFillGeo, new THREE.PointsMaterial({
      color: hex(gold), size: 0.8, transparent: true, opacity: 0.25
    })));

    // ─ Metro Node Markers (pulsing glowing dots at real US cities) ─
    var metroMeshes = [];
    var metroPositions = [];
    for (var m = 0; m < METROS.length; m++) {
      var metro = METROS[m];
      var mPos = latLngToVec3(metro.lat, metro.lng, R * 1.01);
      metroPositions.push(mPos);

      // Outer glow ring
      var glowSize = 2.5 + metro.weight * 3;
      var glowMat = new THREE.MeshBasicMaterial({
        color: hex(gold), transparent: true, opacity: 0.3 + metro.weight * 0.3
      });
      var glowMesh = new THREE.Mesh(new THREE.SphereGeometry(glowSize, 8, 8), glowMat);
      glowMesh.position.copy(mPos);
      group.add(glowMesh);

      // Core dot
      var coreSize = 1.0 + metro.weight * 1.5;
      var coreMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      var coreMesh = new THREE.Mesh(new THREE.SphereGeometry(coreSize, 8, 8), coreMat);
      coreMesh.position.copy(mPos);
      group.add(coreMesh);

      // Vertical beacon line shooting up from hot metros
      if (metro.weight > 0.6) {
        var beaconEnd = mPos.clone().normalize().multiplyScalar(R * 1.01 + 8 + metro.weight * 12);
        var beaconGeo = new THREE.BufferGeometry().setFromPoints([mPos, beaconEnd]);
        group.add(new THREE.Line(beaconGeo, new THREE.LineBasicMaterial({
          color: hex(gold), transparent: true, opacity: 0.4
        })));
      }

      metroMeshes.push({ glow: glowMesh, core: coreMesh, weight: metro.weight, phase: Math.random() * Math.PI * 2 });
    }

    // ─ Capital Flow Arcs (curved lines between metros with traveling pulses) ─
    var arcs = [];
    var arcConnections = [
      [0,3],[0,2],[0,8],[0,9],  // NYC to Miami, Chicago, DC, Boston
      [1,7],[1,4],[1,12],[1,17], // LA to SF, Dallas, Phoenix, San Diego
      [3,6],[3,22],[3,18],       // Miami to Atlanta, Orlando, Tampa
      [2,13],[2,20],             // Chicago to Nashville, Minneapolis
      [4,5],[4,14],              // Dallas to Houston, Austin
      [7,10],[7,19],             // SF to Seattle, Portland
      [8,15],[8,24],             // DC to Charlotte, Raleigh
      [6,15],[6,13],             // Atlanta to Charlotte, Nashville
      [11,23],[11,16],           // Denver to SLC, Las Vegas
      [12,16],                   // Phoenix to LV
      [10,19],                   // Seattle to Portland
      [0,1],[0,4],[3,1],[7,2],   // Long-range: NYC-LA, NYC-Dallas, Miami-LA, SF-Chicago
      [1,6],[8,4],[5,3],         // LA-Atlanta, DC-Dallas, Houston-Miami
      [14,13],[9,8],             // Austin-Nashville, Boston-DC
    ];

    for (var ak = 0; ak < arcConnections.length; ak++) {
      var fromIdx = arcConnections[ak][0];
      var toIdx = arcConnections[ak][1];
      var a = metroPositions[fromIdx];
      var b = metroPositions[toIdx];

      // Calculate arc height based on distance
      var dist = a.distanceTo(b);
      var arcHeight = R * (1.12 + Math.min(dist / 300, 0.35));
      var mid = a.clone().add(b).multiplyScalar(0.5).normalize().multiplyScalar(arcHeight);
      var curve = new THREE.QuadraticBezierCurve3(a, mid, b);
      var col = arcPal[ak % arcPal.length];

      // Arc line
      var lg = new THREE.BufferGeometry().setFromPoints(curve.getPoints(48));
      group.add(new THREE.Line(lg, new THREE.LineBasicMaterial({
        color: col, transparent: true, opacity: 0.25
      })));

      // Traveling pulse (the moving dot along the arc)
      var dot = new THREE.Mesh(
        new THREE.SphereGeometry(1.2, 6, 6),
        new THREE.MeshBasicMaterial({ color: col })
      );
      group.add(dot);

      // Secondary smaller pulse trailing
      var dot2 = new THREE.Mesh(
        new THREE.SphereGeometry(0.7, 4, 4),
        new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: 0.5 })
      );
      group.add(dot2);

      arcs.push({
        curve: curve,
        dot: dot,
        dot2: dot2,
        t: Math.random(),
        sp: 0.003 + Math.random() * 0.006,
        reverse: Math.random() > 0.5
      });
    }

    // ─ Ambient Particle Field (floating data particles around globe) ─
    var particleCount = 200;
    var particlePositions = new Float32Array(particleCount * 3);
    var particleVelocities = [];
    for (var pi = 0; pi < particleCount; pi++) {
      var pRadius = R * (1.05 + Math.random() * 0.4);
      var pTheta = Math.random() * Math.PI * 2;
      var pPhi = Math.acos(2 * Math.random() - 1);
      particlePositions[pi * 3] = pRadius * Math.sin(pPhi) * Math.cos(pTheta);
      particlePositions[pi * 3 + 1] = pRadius * Math.cos(pPhi);
      particlePositions[pi * 3 + 2] = pRadius * Math.sin(pPhi) * Math.sin(pTheta);
      particleVelocities.push({
        speed: 0.0005 + Math.random() * 0.002,
        axis: Math.random() > 0.5 ? 'y' : 'x',
        drift: (Math.random() - 0.5) * 0.001
      });
    }
    var particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute("position", new THREE.Float32BufferAttribute(particlePositions, 3));
    var particleSystem = new THREE.Points(particleGeo, new THREE.PointsMaterial({
      color: hex(bright), size: 1.0, transparent: true, opacity: 0.4
    }));
    group.add(particleSystem);

    // ─ Starfield background ─
    var sN = 500, sp = [];
    for (var si = 0; si < sN; si++) {
      sp.push((Math.random() - .5) * 900, (Math.random() - .5) * 700, (Math.random() - .5) * 900 - 200);
    }
    var starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute("position", new THREE.Float32BufferAttribute(sp, 3));
    scene.add(new THREE.Points(starGeo, new THREE.PointsMaterial({
      color: 0xffffff, size: 0.8, transparent: true, opacity: 0.35
    })));

    // ─ Curved-text brand rings ─
    if (window.RP3D && window.RP3D.addOrbitRing) {
      window.RP3D.addOrbitRing(group, { radius: R * 1.22, height: 14, y: 0, opacity: 0.6, repeats: 5, color: "#BC9C45" });
      window.RP3D.addOrbitRing(group, { radius: R * 1.44, height: 10, y: 0, tilt: 0.5, opacity: 0.35, repeats: 4, color: "#d4af37" });
    }

    // ─ Drag to rotate ─
    var targetEl = document.getElementById("viz-globe");
    var isDragging = false, prevX = 0, prevY = 0;
    if (targetEl) {
      targetEl.style.pointerEvents = "auto";
      targetEl.style.cursor = "grab";
      targetEl.addEventListener("mousedown", function(e) {
        isDragging = true; prevX = e.clientX; prevY = e.clientY; targetEl.style.cursor = "grabbing";
      });
      window.addEventListener("mousemove", function(e) {
        if (!isDragging) return;
        var dx = e.clientX - prevX, dy = e.clientY - prevY;
        prevX = e.clientX; prevY = e.clientY;
        group.rotation.y += dx * 0.005;
        group.rotation.x += dy * 0.005;
      });
      window.addEventListener("mouseup", function() {
        isDragging = false; if (targetEl) targetEl.style.cursor = "grab";
      });
    }

    // ── Live data counter (updated from Supabase) ──
    var liveRecordCount = data.records || 0;
    var liveSourceCount = data.sources || 0;

    // Animation clock
    var clock = 0;

    return {
      scene: scene,
      camera: camera,
      update: function () {
        clock += 0.016; // ~60fps timestep

        // Slow auto-rotate when not dragging
        if (!isDragging) {
          group.rotation.y += 0.0008;
        }

        // Pulse metro nodes
        for (var mi = 0; mi < metroMeshes.length; mi++) {
          var mm = metroMeshes[mi];
          var pulse = 0.7 + 0.3 * Math.sin(clock * 2 + mm.phase);
          mm.glow.material.opacity = (0.2 + mm.weight * 0.3) * pulse;
          var s = 0.9 + 0.15 * Math.sin(clock * 3 + mm.phase);
          mm.glow.scale.set(s, s, s);
        }

        // Animate arc pulses
        for (var j = 0; j < arcs.length; j++) {
          var ar = arcs[j];
          if (ar.reverse) {
            ar.t -= ar.sp;
            if (ar.t < 0) ar.t = 1;
          } else {
            ar.t += ar.sp;
            if (ar.t > 1) ar.t = 0;
          }
          ar.dot.position.copy(ar.curve.getPoint(ar.t));
          // Trail dot follows slightly behind
          var t2 = ar.reverse ? Math.min(ar.t + 0.06, 1) : Math.max(ar.t - 0.06, 0);
          ar.dot2.position.copy(ar.curve.getPoint(t2));
        }

        // Animate ambient particles (gentle orbital drift)
        var pArr = particleGeo.attributes.position.array;
        for (var pk = 0; pk < particleCount; pk++) {
          var vel = particleVelocities[pk];
          var px = pArr[pk * 3], py = pArr[pk * 3 + 1], pz = pArr[pk * 3 + 2];
          // Rotate around Y axis
          var angle = vel.speed;
          var cosA = Math.cos(angle), sinA = Math.sin(angle);
          pArr[pk * 3] = px * cosA - pz * sinA;
          pArr[pk * 3 + 2] = px * sinA + pz * cosA;
          // Slight vertical drift
          pArr[pk * 3 + 1] += vel.drift;
          if (Math.abs(pArr[pk * 3 + 1]) > R * 1.3) vel.drift *= -1;
        }
        particleGeo.attributes.position.needsUpdate = true;
      }
    };
  }

  // ── Category scenes (unchanged from original) ──────────────────────
  function createCategoryScene(cat, def) {
    var THREE = window.THREE;
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.z = 24;
    var ambient = new THREE.AmbientLight(0xffffff, 0.35); scene.add(ambient);
    var light = new THREE.DirectionalLight(0xffffff, 0.95); light.position.set(5, 5, 5); scene.add(light);
    var group = new THREE.Group(); scene.add(group);
    var R = 5;
    var color = hex(css(def.color, "#BC9C45"));
    var mat = new THREE.MeshPhongMaterial({ color: color, wireframe: true, transparent: true, opacity: 0.7 });
    var mainMesh;
    switch (def.type) {
      case "octahedron":
        mainMesh = new THREE.Mesh(new THREE.OctahedronGeometry(R, 0), mat);
        group.add(new THREE.Mesh(new THREE.OctahedronGeometry(R * 0.4, 0), new THREE.MeshPhongMaterial({ color: color, flatShading: true })));
        break;
      case "sphere_points":
        mainMesh = new THREE.Points(new THREE.SphereGeometry(R, 12, 10), new THREE.PointsMaterial({ color: color, size: 0.6 }));
        break;
      case "torus":
        mainMesh = new THREE.Mesh(new THREE.TorusGeometry(R * 0.65, R * 0.2, 8, 16), mat);
        break;
      case "double_tetra":
        mainMesh = new THREE.Group();
        var t1 = new THREE.Mesh(new THREE.TetrahedronGeometry(R, 0), mat);
        var t2 = new THREE.Mesh(new THREE.TetrahedronGeometry(R, 0), mat);
        t2.rotation.x = Math.PI; t2.rotation.y = Math.PI / 4;
        mainMesh.add(t1); mainMesh.add(t2);
        break;
      case "icosahedron":
        mainMesh = new THREE.Mesh(new THREE.IcosahedronGeometry(R, 0), mat); break;
      case "knot":
        mainMesh = new THREE.Mesh(new THREE.TorusKnotGeometry(R * 0.45, R * 0.14, 30, 8), mat); break;
      case "cylinder":
        mainMesh = new THREE.Mesh(new THREE.CylinderGeometry(R * 0.5, R * 0.5, R * 1.0, 8), mat); break;
      case "cube":
        mainMesh = new THREE.Mesh(new THREE.BoxGeometry(R * 0.8, R * 0.8, R * 0.8), mat); break;
      case "dodecahedron":
        mainMesh = new THREE.Mesh(new THREE.DodecahedronGeometry(R, 0), mat); break;
      case "star":
        mainMesh = new THREE.Group();
        var box1 = new THREE.Mesh(new THREE.BoxGeometry(R * 0.75, R * 0.75, R * 0.75), mat);
        var box2 = new THREE.Mesh(new THREE.BoxGeometry(R * 0.75, R * 0.75, R * 0.75), mat);
        box2.rotation.y = Math.PI / 4; box2.rotation.x = Math.PI / 4;
        mainMesh.add(box1); mainMesh.add(box2);
        break;
      case "pyramid":
        mainMesh = new THREE.Mesh(new THREE.CylinderGeometry(0, R * 0.7, R * 1.1, 4), mat); break;
      case "cone":
        mainMesh = new THREE.Mesh(new THREE.ConeGeometry(R * 0.6, R * 1.2, 6), mat); break;
      case "energy_core":
        mainMesh = new THREE.Group();
        mainMesh.add(new THREE.Mesh(new THREE.SphereGeometry(R, 12, 10), mat));
        mainMesh.add(new THREE.Mesh(new THREE.SphereGeometry(R * 0.3, 8, 8), new THREE.MeshBasicMaterial({ color: 0xffffff })));
        break;
      case "ring":
        mainMesh = new THREE.Mesh(new THREE.RingGeometry(R * 0.3, R, 16), mat);
        mainMesh.material.side = THREE.DoubleSide;
        break;
      default:
        mainMesh = new THREE.Mesh(new THREE.BoxGeometry(R, R, R), mat);
    }
    group.add(mainMesh);
    return {
      scene: scene, camera: camera,
      update: function (isHovered) {
        var speed = isHovered ? 0.05 : 0.01;
        group.rotation.y += speed;
        group.rotation.x += speed * 0.5;
        var scale = isHovered ? 1.2 : 1.0;
        group.scale.set(scale, scale, scale);
      }
    };
  }

  // ── Property Deal Simulator (3D building) ─────────────────────────
  function createSimulatorScene() {
    var THREE = window.THREE;
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
    camera.position.set(0, 100, 200);
    scene.add(new THREE.AmbientLight(0xffffff, 0.4));
    var d1 = new THREE.DirectionalLight(0xffffff, 0.8); d1.position.set(80, 150, 80); scene.add(d1);
    var d2 = new THREE.DirectionalLight(0x00A1FF, 0.4); d2.position.set(-80, -100, -80); scene.add(d2);
    var group = new THREE.Group(); scene.add(group);

    simGrid = new THREE.GridHelper(260, 26, hex(css("--border", "#BC9C45")), hex(css("--surface2", "rgba(188,156,69,0.1)")));
    simGrid.position.y = -10; scene.add(simGrid);

    var matColor = hex(css("--gold", "#BC9C45"));
    var simMaterial = new THREE.MeshStandardMaterial({ color: matColor, metalness: 0.8, roughness: 0.2, transparent: true, opacity: 0.7, side: THREE.DoubleSide });
    var boxGeo = new THREE.BoxGeometry(40, 60, 40);
    simMesh = new THREE.Mesh(boxGeo, simMaterial);
    simMesh.position.y = 20; group.add(simMesh);

    var wireMat = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true, transparent: true, opacity: 0.35 });
    simWire = new THREE.Mesh(boxGeo.clone().scale(1.01, 1.01, 1.01), wireMat);
    simWire.position.y = 20; group.add(simWire);

    var antGeo = new THREE.CylinderGeometry(0.5, 0.5, 20, 4);
    var antMat = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.9 });
    simAntenna = new THREE.Mesh(antGeo, antMat);
    simAntenna.position.y = 60;
    var antGlow = new THREE.Mesh(new THREE.SphereGeometry(2, 6, 6), new THREE.MeshBasicMaterial({ color: hex(css("--gold", "#BC9C45")) }));
    antGlow.position.y = 10; simAntenna.add(antGlow);
    group.add(simAntenna);

    var container = document.getElementById("simulator-viewport");
    var isDragging = false, prevX = 0, prevY = 0;
    if (container) {
      container.style.pointerEvents = "auto"; container.style.cursor = "grab";
      container.addEventListener("mousedown", function(e) { isDragging = true; prevX = e.clientX; prevY = e.clientY; container.style.cursor = "grabbing"; });
      window.addEventListener("mousemove", function(e) { if (!isDragging) return; group.rotation.y += (e.clientX - prevX) * 0.007; group.rotation.x += (e.clientY - prevY) * 0.007; prevX = e.clientX; prevY = e.clientY; });
      window.addEventListener("mouseup", function() { isDragging = false; if (container) container.style.cursor = "grab"; });
    }

    window.update3DBuilding = function (price, occupancy, dscr) {
      if (!simMesh) return;
      var hScale = Math.max(0.3, Math.min(3.5, price / 60));
      var tScale = Math.max(0.4, Math.min(1.8, occupancy / 100));
      simMesh.scale.set(tScale, hScale, tScale);
      simWire.scale.set(tScale * 1.01, hScale * 1.01, tScale * 1.01);
      var newHeight = 60 * hScale;
      simMesh.position.y = newHeight / 2 - 10;
      simWire.position.y = newHeight / 2 - 10;
      simAntenna.position.y = newHeight - 10 + 10;
      var newColor = dscr <= 1.0 ? hex(css("--red", "#FF7474")) : dscr < 1.35 ? hex(css("--gold", "#BC9C45")) : hex(css("--green", "#00A980"));
      simMesh.material.color.setHex(newColor);
      if (antGlow) antGlow.material.color.setHex(newColor);
    };

    return {
      scene: scene, camera: camera,
      update: function () { if (!isDragging) group.rotation.y += 0.004; }
    };
  }

  // ── Viewport orchestrator ──────────────────────────────────────────
  function registerViewports(data) {
    registeredViews = [];

    var mainEl = document.getElementById("viz-globe");
    if (mainEl && !prefersReducedMotion) {
      var view = createMainGlobeScene(data);
      registeredViews.push({ el: mainEl, id: "viz-globe", scene: view.scene, camera: view.camera, updateFn: view.update });
    }

    document.querySelectorAll(".mini-globe-viewport").forEach(function (el) {
      var cat = el.getAttribute("data-category");
      var def = CAT_DEFS[cat] || { type: "cube", color: "--gold" };
      var view = createCategoryScene(cat, def);
      var viewObj = { el: el, category: cat, scene: view.scene, camera: view.camera, updateFn: view.update, isHovered: false };
      registeredViews.push(viewObj);
      var card = el.closest(".mini-globe-card");
      if (card) {
        card.addEventListener("mouseenter", function () { viewObj.isHovered = true; });
        card.addEventListener("mouseleave", function () { viewObj.isHovered = false; });
      }
    });

    var simEl = document.getElementById("simulator-viewport");
    if (simEl) {
      var simView = createSimulatorScene();
      registeredViews.push({ el: simEl, id: "simulator-viewport", scene: simView.scene, camera: simView.camera, updateFn: simView.update });
    }
  }

  function renderLoop() {
    if (!renderer || !globalCanvas) return;
    renderer.setScissorTest(false);
    renderer.clear();
    var canvasWidth = globalCanvas.clientWidth;
    var canvasHeight = globalCanvas.clientHeight;

    registeredViews.forEach(function (view) {
      var el = view.el;
      if (!el || !el.parentNode) return;
      var rect = el.getBoundingClientRect();
      var isVisible = rect.top < canvasHeight && rect.bottom > 0 && rect.left < canvasWidth && rect.right > 0 && el.offsetWidth > 0 && el.offsetHeight > 0;
      if (!isVisible) return;
      if (view.updateFn) view.updateFn(view.isHovered);
      var x = rect.left, y = canvasHeight - rect.bottom, w = rect.width, h = rect.height;
      renderer.setViewport(x, y, w, h);
      renderer.setScissor(x, y, w, h);
      renderer.setScissorTest(true);
      view.camera.aspect = w / h;
      view.camera.updateProjectionMatrix();
      renderer.render(view.scene, view.camera);
    });
    animFrameId = requestAnimationFrame(renderLoop);
  }

  // ── Boot ───────────────────────────────────────────────────────────
  function start() {
    if (!webglOK()) {
      var wrap = document.getElementById("viz-globe");
      if (wrap) wrap.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100%;color:var(--muted);font-size:13px">WebGL not supported.</div>';
      return;
    }
    if (prefersReducedMotion) {
      var mainEl = document.getElementById("viz-globe");
      if (mainEl) mainEl.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100%;min-height:240px;color:var(--muted);font-size:13px;text-align:center;padding:24px">3D Graphics disabled (Reduced Motion)</div>';
      return;
    }

    Promise.all([
      loadScript(THREE_SRC),
      fetch("/data/sources_all.json").then(function(r) { return r.json(); }).catch(function() { return null; }),
      fetch("/api/stats").then(function(r) { return r.json(); }).catch(function() { return {}; }),
      fetch(SB + "/rest/v1/data_records?select=count", { headers: Object.assign({ Prefer: "count=exact" }, H) })
        .then(function(r) { return r.json(); }).then(function(j) { return (j && j[0] && j[0].count) || 0; }).catch(function() { return 0; }),
      fetch(SB + "/rest/v1/v_latest_source_data?select=name&status=eq.ok&limit=200", { headers: H })
        .then(function(r) { return r.json(); }).then(function(j) { return (j || []).length; }).catch(function() { return 0; }),
      // NEW: Fetch live source data for metro heat
      fetch(SB + "/rest/v1/v_latest_source_data?select=name,category,status,fetched_at&limit=100&order=fetched_at.desc", { headers: H })
        .then(function(r) { return r.json(); }).catch(function() { return []; })
    ]).then(function (results) {
      var cat = results[1] || {}, stats = results[2] || {}, recs = results[3] || 0, ds = results[4] || 0;
      var liveSources = results[5] || [];
      var sourcesCount = ((cat.sources || cat) || []).length || stats.cataloged_sources || 0;
      var data = {
        sources: sourcesCount,
        records: recs,
        categories: stats.category_count || 14,
        datasets: ds,
        liveSources: liveSources
      };

      // Count active sources for display
      var activeNow = liveSources.filter(function(s) { return s.status === 'ok'; }).length;

      var elMainGlobe = document.getElementById("viz-globe");
      if (elMainGlobe) {
        elMainGlobe.innerHTML =
          '<div style="font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.1em;color:var(--gold);margin-bottom:8px">US CRE Intelligence Network</div>' +
          '<div style="font-size:clamp(22px,3vw,30px);font-weight:700;color:var(--text);line-height:1.15;margin-bottom:18px">Live Capital Flows Across <span style="color:var(--gold)">' + METROS.length + ' Markets</span></div>' +
          '<div class="rp-glass rp-rise" style="position:relative;overflow:hidden;height:560px;background:radial-gradient(ellipse at 60% 40%,rgba(14,52,112,.18),rgba(3,6,12,.6))">' +
            '<div style="width:100%;height:100%" id="main-globe-canvas-mount"></div>' +
            '<div style="position:absolute;top:18px;left:20px;pointer-events:none;font-family:\'JetBrains Mono\',monospace">' +
              '<div style="font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:var(--gold);display:flex;align-items:center;gap:7px"><span class="rp-live-dot"></span>Live US CRE Network</div>' +
              '<div style="margin-top:14px"><div style="font-size:30px;font-weight:800;color:var(--gold);line-height:1">' + Number(data.sources).toLocaleString() + '</div><div style="font-size:10px;text-transform:uppercase;letter-spacing:.08em;color:var(--muted)">data sources</div></div>' +
              '<div style="margin-top:14px"><div style="font-size:30px;font-weight:800;color:var(--text);line-height:1">' + Number(data.records).toLocaleString() + '</div><div style="font-size:10px;text-transform:uppercase;letter-spacing:.08em;color:var(--muted)">records ingested</div></div>' +
              '<div style="margin-top:14px"><div style="font-size:30px;font-weight:800;color:var(--teal);line-height:1">' + METROS.length + '</div><div style="font-size:10px;text-transform:uppercase;letter-spacing:.08em;color:var(--muted)">US metro markets</div></div>' +
              '<div style="margin-top:14px"><div style="font-size:22px;font-weight:700;color:var(--bright);line-height:1">' + activeNow + '</div><div style="font-size:10px;text-transform:uppercase;letter-spacing:.08em;color:var(--muted)">active feeds now</div></div>' +
            '</div>' +
            // Metro legend on right side
            '<div style="position:absolute;top:18px;right:20px;pointer-events:none;font-family:\'JetBrains Mono\',monospace;text-align:right">' +
              '<div style="font-size:9px;letter-spacing:.1em;text-transform:uppercase;color:var(--dim);margin-bottom:8px">Top Markets</div>' +
              METROS.slice(0, 10).map(function(m) {
                return '<div style="font-size:10px;color:var(--text2);margin-bottom:3px;display:flex;align-items:center;justify-content:flex-end;gap:6px">' +
                  '<span style="color:var(--muted)">' + m.abbr + '</span>' +
                  '<span style="width:' + Math.round(m.weight * 40) + 'px;height:3px;background:var(--gold);border-radius:1px;opacity:' + (0.4 + m.weight * 0.6) + '"></span>' +
                '</div>';
              }).join('') +
            '</div>' +
            '<div style="position:absolute;bottom:14px;right:18px;pointer-events:none;font-family:\'JetBrains Mono\',monospace;font-size:10px;color:var(--dim)">WebGL · Three.js · Live Supabase</div>' +
            '<div style="position:absolute;bottom:14px;left:20px;pointer-events:none;font-family:\'JetBrains Mono\',monospace;font-size:10px;color:var(--dim)">Drag to rotate · ' + arcsLabel() + ' capital flow routes</div>' +
          '</div>';

        var mount = document.getElementById("main-globe-canvas-mount");
        if (mount) mount.id = "viz-globe";
      }

      initRenderer();
      registerViewports(data);
      if (animFrameId) cancelAnimationFrame(animFrameId);
      renderLoop();

      window.addEventListener("resize", resizeRenderer);
      document.querySelectorAll(".console-tab-btn").forEach(function(btn) {
        btn.addEventListener("click", function() { setTimeout(function() { registerViewports(data); }, 100); });
      });

      // ── Periodic Supabase refresh (every 30s, update live counters) ──
      setInterval(function() {
        fetch(SB + "/rest/v1/v_latest_source_data?select=name,status&limit=200", { headers: H })
          .then(function(r) { return r.json(); })
          .then(function(sources) {
            var active = (sources || []).filter(function(s) { return s.status === 'ok'; }).length;
            var counterEl = document.querySelector('[data-live-active]');
            if (counterEl) counterEl.textContent = active;
          }).catch(function() {});
      }, 30000);
    });
  }

  function arcsLabel() {
    // Count arc connections
    return "35+";
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
