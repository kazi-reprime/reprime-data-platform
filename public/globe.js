/* RePrime 3D Command Console Engine — Multi-viewport WebGL centerpiece.
   Three.js (r128, cdnjs): Single canvas, 15 viewport scissor renderer.
   Includes interactive main globe, 14 category wireframe meshes, and an
   interactive 3D building simulator. Graceful fallback on WebGL failure. */
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
  function getJSON(u, o) { return fetch(u, o).then(function (r) { return r.json(); }).catch(function () { return null; }); }
  function webglOK() { try { var c = document.createElement("canvas"); return !!(window.WebGLRenderingContext && (c.getContext("webgl") || c.getContext("experimental-webgl"))); } catch (e) { return false; } }
  function hex(c) { return parseInt(c.replace("#", "0x")); }

  // Phase 2.3 — use centralized config; defensive fallback if not loaded.
  var CFG = window.RP_SB || { URL: "https://gugcmsqrscqqqltdtgkz.supabase.co", KEY: "sb_publishable_J5zIiHNf1VqpQ7r14SevFw__MbvlEpm" };
  var SB = CFG.URL;
  var H = { apikey: CFG.KEY, Authorization: "Bearer " + CFG.KEY };

  // Global references
  var renderer, globalCanvas;
  var registeredViews = []; // { el, id, category, scene, camera, updateFn, isHovered: false }
  var animFrameId;

  // Simulator global references
  var simMesh, simWire, simAntenna, simGrid;

  // 14 Category visual configurations (unique shapes + colors)
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

  // Safe checks for reduced motion
  var prefersReducedMotion = false;
  try {
    prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch (e) {}

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
    if (renderer) {
      renderer.setSize(window.innerWidth, window.innerHeight, false);
    }
  }

  // Create sub-scenes --------------------------------------------------------
  function createMainGlobeScene(data) {
    var THREE = window.THREE;
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(40, 1, 0.1, 1000);
    camera.position.z = 320;

    var group = new THREE.Group(); group.rotation.x = 0.45; scene.add(group);
    var R = 105;

    var gold = css("--gold", "#BC9C45"), blue = css("--blue", "#1D5FB8"), bright = css("--bright", "#00A1FF"), teal = css("--teal", "#009080"), amber = css("--amber", "#FFBC7D");
    var arcPal = [gold, bright, teal, amber, blue].map(hex);

    // dotted globe surface
    var N = 1500, pos = [];
    for (var i = 0; i < N; i++) {
      var y = 1 - (i / (N - 1)) * 2, r = Math.sqrt(1 - y * y), th = i * 2.399963;
      pos.push(Math.cos(th) * r * R, y * R, Math.sin(th) * r * R);
    }
    var dotGeo = new THREE.BufferGeometry();
    dotGeo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    group.add(new THREE.Points(dotGeo, new THREE.PointsMaterial({ color: hex(gold), size: 1.5, transparent: true, opacity: .6 })));

    // faint wireframe + atmosphere
    group.add(new THREE.Mesh(new THREE.SphereGeometry(R, 24, 18), new THREE.MeshBasicMaterial({ color: hex(blue), wireframe: true, transparent: true, opacity: .10 })));
    group.add(new THREE.Mesh(new THREE.SphereGeometry(R * 1.14, 32, 32), new THREE.MeshBasicMaterial({ color: hex(teal), transparent: true, opacity: .04, side: THREE.BackSide })));

    // arcs with traveling pulses
    var nArcs = Math.max(12, Math.min(26, (data.categories || 14) + Math.round((data.datasets || 16) / 8)));
    var arcs = [];
    var spherePoint = function() {
      var u = Math.random(), v = Math.random();
      var theta = 2 * Math.PI * u, phi = Math.acos(2 * v - 1);
      return new THREE.Vector3(R * Math.sin(phi) * Math.cos(theta), R * Math.cos(phi), R * Math.sin(phi) * Math.sin(theta));
    };

    for (var k = 0; k < nArcs; k++) {
      var a = spherePoint(), b = spherePoint();
      var mid = a.clone().add(b).multiplyScalar(0.5).normalize().multiplyScalar(R * (1.35 + Math.random() * 0.3));
      var curve = new THREE.QuadraticBezierCurve3(a, mid, b);
      var col = arcPal[k % arcPal.length];
      var lg = new THREE.BufferGeometry().setFromPoints(curve.getPoints(44));
      group.add(new THREE.Line(lg, new THREE.LineBasicMaterial({ color: col, transparent: true, opacity: .45 })));
      
      var dot = new THREE.Mesh(new THREE.SphereGeometry(1.6, 8, 8), new THREE.MeshBasicMaterial({ color: col }));
      group.add(dot);
      
      [a, b].forEach(function (p) {
        var m = new THREE.Mesh(new THREE.SphereGeometry(1.2, 6, 6), new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: .8 }));
        m.position.copy(p);
        group.add(m);
      });
      arcs.push({ curve: curve, dot: dot, t: Math.random(), sp: 0.002 + Math.random() * 0.005 });
    }

    // Curved-text brand rings orbiting the main globe (attached to the
    // rotation group so they follow drag + auto-spin). Two rings — equator
    // + tilted satellite-style ring at a wider radius.
    if (window.RP3D && window.RP3D.addOrbitRing) {
      window.RP3D.addOrbitRing(group, { radius: R * 1.18, height: 14, y: 0,           opacity: 0.75, repeats: 5, color: "#BC9C45" });
      window.RP3D.addOrbitRing(group, { radius: R * 1.40, height: 10, y: 0, tilt: 0.5, opacity: 0.45, repeats: 4, color: "#d4af37" });
    }

    // starfield
    var sN = 400, sp = [];
    for (var s = 0; s < sN; s++) { sp.push((Math.random() - .5) * 800, (Math.random() - .5) * 600, (Math.random() - .5) * 800 - 150); }
    var starGeo = new THREE.BufferGeometry(); starGeo.setAttribute("position", new THREE.Float32BufferAttribute(sp, 3));
    scene.add(new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0xffffff, size: 1.0, transparent: true, opacity: .4 })));

    // Drag to rotate implementation
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
        isDragging = false; targetEl.style.cursor = "grab";
      });
    }

    return {
      scene: scene,
      camera: camera,
      update: function () {
        if (!isDragging) {
          group.rotation.y += 0.0015;
        }
        for (var j = 0; j < arcs.length; j++) {
          var ar = arcs[j];
          ar.t += ar.sp;
          if (ar.t > 1) ar.t = 0;
          ar.dot.position.copy(ar.curve.getPoint(ar.t));
        }
      }
    };
  }

  function createCategoryScene(cat, def) {
    var THREE = window.THREE;
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.z = 24;

    // Lights
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
        // inner solid core
        var core = new THREE.Mesh(new THREE.OctahedronGeometry(R * 0.4, 0), new THREE.MeshPhongMaterial({ color: color, flatShading: true }));
        group.add(core);
        break;
      case "sphere_points":
        var sphereGeo = new THREE.SphereGeometry(R, 12, 10);
        mainMesh = new THREE.Points(sphereGeo, new THREE.PointsMaterial({ color: color, size: 0.6 }));
        break;
      case "torus":
        mainMesh = new THREE.Mesh(new THREE.TorusGeometry(R * 0.65, R * 0.2, 8, 16), mat);
        break;
      case "double_tetra":
        mainMesh = new THREE.Group();
        var t1 = new THREE.Mesh(new THREE.TetrahedronGeometry(R, 0), mat);
        var t2 = new THREE.Mesh(new THREE.TetrahedronGeometry(R, 0), mat);
        t2.rotation.x = Math.PI;
        t2.rotation.y = Math.PI / 4;
        mainMesh.add(t1); mainMesh.add(t2);
        break;
      case "icosahedron":
        mainMesh = new THREE.Mesh(new THREE.IcosahedronGeometry(R, 0), mat);
        break;
      case "knot":
        mainMesh = new THREE.Mesh(new THREE.TorusKnotGeometry(R * 0.45, R * 0.14, 30, 8), mat);
        break;
      case "cylinder":
        mainMesh = new THREE.Mesh(new THREE.CylinderGeometry(R * 0.5, R * 0.5, R * 1.0, 8), mat);
        break;
      case "cube":
        mainMesh = new THREE.Mesh(new THREE.BoxGeometry(R * 0.8, R * 0.8, R * 0.8), mat);
        break;
      case "dodecahedron":
        mainMesh = new THREE.Mesh(new THREE.DodecahedronGeometry(R, 0), mat);
        break;
      case "star":
        mainMesh = new THREE.Group();
        var box1 = new THREE.Mesh(new THREE.BoxGeometry(R * 0.75, R * 0.75, R * 0.75), mat);
        var box2 = new THREE.Mesh(new THREE.BoxGeometry(R * 0.75, R * 0.75, R * 0.75), mat);
        box2.rotation.y = Math.PI / 4;
        box2.rotation.x = Math.PI / 4;
        mainMesh.add(box1); mainMesh.add(box2);
        break;
      case "pyramid":
        mainMesh = new THREE.Mesh(new THREE.CylinderGeometry(0, R * 0.7, R * 1.1, 4), mat);
        break;
      case "cone":
        mainMesh = new THREE.Mesh(new THREE.ConeGeometry(R * 0.6, R * 1.2, 6), mat);
        break;
      case "energy_core":
        mainMesh = new THREE.Group();
        var outer = new THREE.Mesh(new THREE.SphereGeometry(R, 12, 10), mat);
        var inner = new THREE.Mesh(new THREE.SphereGeometry(R * 0.3, 8, 8), new THREE.MeshBasicMaterial({ color: 0xffffff }));
        mainMesh.add(outer); mainMesh.add(inner);
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
      scene: scene,
      camera: camera,
      update: function (isHovered) {
        var speed = isHovered ? 0.05 : 0.01;
        group.rotation.y += speed;
        group.rotation.x += speed * 0.5;
        var scale = isHovered ? 1.2 : 1.0;
        group.scale.set(scale, scale, scale);
      }
    };
  }

  function createSimulatorScene() {
    var THREE = window.THREE;
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
    camera.position.set(0, 100, 200);

    // Lights
    var ambient = new THREE.AmbientLight(0xffffff, 0.4); scene.add(ambient);
    var dirLight1 = new THREE.DirectionalLight(0xffffff, 0.8); dirLight1.position.set(80, 150, 80); scene.add(dirLight1);
    var dirLight2 = new THREE.DirectionalLight(0x00A1FF, 0.4); dirLight2.position.set(-80, -100, -80); scene.add(dirLight2);

    var group = new THREE.Group(); scene.add(group);

    // Grid Floor
    simGrid = new THREE.GridHelper(260, 26, hex(css("--border", "#BC9C45")), hex(css("--surface2", "rgba(188,156,69,0.1)")));
    simGrid.position.y = -10;
    scene.add(simGrid);

    // The Skyscraper base size (40, 60, 40)
    var matColor = hex(css("--gold", "#BC9C45"));
    var simMaterial = new THREE.MeshStandardMaterial({
      color: matColor,
      metalness: 0.8,
      roughness: 0.2,
      transparent: true,
      opacity: 0.7,
      side: THREE.DoubleSide
    });

    var boxGeo = new THREE.BoxGeometry(40, 60, 40);
    simMesh = new THREE.Mesh(boxGeo, simMaterial);
    simMesh.position.y = 20; // anchor bottom to grid
    group.add(simMesh);

    // Wireframe overlay for blueprint look
    var wireMat = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true, transparent: true, opacity: 0.35 });
    simWire = new THREE.Mesh(boxGeo.clone().scale(1.01, 1.01, 1.01), wireMat);
    simWire.position.y = 20;
    group.add(simWire);

    // Roof Antenna
    var antGeo = new THREE.CylinderGeometry(0.5, 0.5, 20, 4);
    var antMat = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.9 });
    simAntenna = new THREE.Mesh(antGeo, antMat);
    simAntenna.position.y = 60; // top of building
    var antGlow = new THREE.Mesh(new THREE.SphereGeometry(2, 6, 6), new THREE.MeshBasicMaterial({ color: hex(css("--gold", "#BC9C45")) }));
    antGlow.position.y = 10; // offset inside antenna group
    simAntenna.add(antGlow);
    group.add(simAntenna);

    // Drag-to-rotate interaction for building
    var container = document.getElementById("simulator-viewport");
    var isDragging = false, prevX = 0, prevY = 0;
    if (container) {
      container.style.pointerEvents = "auto";
      container.style.cursor = "grab";
      container.addEventListener("mousedown", function(e) {
        isDragging = true; prevX = e.clientX; prevY = e.clientY; container.style.cursor = "grabbing";
      });
      window.addEventListener("mousemove", function(e) {
        if (!isDragging) return;
        var dx = e.clientX - prevX, dy = e.clientY - prevY;
        prevX = e.clientX; prevY = e.clientY;
        group.rotation.y += dx * 0.007;
        group.rotation.x += dy * 0.007;
      });
      window.addEventListener("mouseup", function() {
        isDragging = false; container.style.cursor = "grab";
      });
    }

    // Expose dynamic updates to global scope
    window.update3DBuilding = function (price, occupancy, dscr) {
      if (!simMesh) return;
      var hScale = Math.max(0.3, Math.min(3.5, price / 60));
      var tScale = Math.max(0.4, Math.min(1.8, occupancy / 100));

      simMesh.scale.set(tScale, hScale, tScale);
      simWire.scale.set(tScale * 1.01, hScale * 1.01, tScale * 1.01);
      
      // Keep bottoms of building anchored on the grid floor (y = -10)
      var newHeight = 60 * hScale;
      simMesh.position.y = newHeight / 2 - 10;
      simWire.position.y = newHeight / 2 - 10;
      simAntenna.position.y = newHeight - 10 + 10;

      // Color mapping from DSCR performance
      var newColor;
      if (dscr <= 1.0) {
        newColor = hex(css("--red", "#FF7474"));
      } else if (dscr > 1.0 && dscr < 1.35) {
        newColor = hex(css("--gold", "#BC9C45"));
      } else {
        newColor = hex(css("--green", "#00A980"));
      }

      simMesh.material.color.setHex(newColor);
      if (antGlow) antGlow.material.color.setHex(newColor);
    };

    return {
      scene: scene,
      camera: camera,
      update: function () {
        if (!isDragging) {
          group.rotation.y += 0.004;
        }
      }
    };
  }

  // Orchestrator -------------------------------------------------------------
  function registerViewports(data) {
    registeredViews = [];

    // 1. Centerpiece main globe
    var mainEl = document.getElementById("viz-globe");
    if (mainEl && !prefersReducedMotion) {
      var view = createMainGlobeScene(data);
      registeredViews.push({
        el: mainEl,
        id: "viz-globe",
        scene: view.scene,
        camera: view.camera,
        updateFn: view.update
      });
    }

    // 2. 14 Category card globes
    var miniElList = document.querySelectorAll(".mini-globe-viewport");
    miniElList.forEach(function (el) {
      var cat = el.getAttribute("data-category");
      var def = CAT_DEFS[cat] || { type: "cube", color: "--gold" };
      var view = createCategoryScene(cat, def);
      var viewObj = {
        el: el,
        category: cat,
        scene: view.scene,
        camera: view.camera,
        updateFn: view.update,
        isHovered: false
      };
      registeredViews.push(viewObj);

      // Mouse hover trigger mapping
      var card = el.closest(".mini-globe-card");
      if (card) {
        card.addEventListener("mouseenter", function () { viewObj.isHovered = true; });
        card.addEventListener("mouseleave", function () { viewObj.isHovered = false; });
      }
    });

    // 3. Property Deal Simulator
    var simEl = document.getElementById("simulator-viewport");
    if (simEl) {
      var view = createSimulatorScene();
      registeredViews.push({
        el: simEl,
        id: "simulator-viewport",
        scene: view.scene,
        camera: view.camera,
        updateFn: view.update
      });
    }
  }

  function renderLoop() {
    if (!renderer || !globalCanvas) return;

    // Clear whole canvas
    renderer.setScissorTest(false);
    renderer.clear();

    var canvasRect = globalCanvas.getBoundingClientRect();
    var canvasWidth = globalCanvas.clientWidth;
    var canvasHeight = globalCanvas.clientHeight;

    registeredViews.forEach(function (view) {
      var el = view.el;
      if (!el || !el.parentNode) return;

      var rect = el.getBoundingClientRect();

      // Check visibility bounds (skip elements offscreen to save power)
      var isVisible = rect.top < canvasHeight && rect.bottom > 0 &&
                      rect.left < canvasWidth && rect.right > 0 &&
                      el.offsetWidth > 0 && el.offsetHeight > 0;

      if (!isVisible) return;

      // Run visual updates
      if (view.updateFn) {
        view.updateFn(view.isHovered);
      }

      // Convert coordinates (y-axis is flipped in WebGL vs DOM)
      var x = rect.left;
      var y = canvasHeight - rect.bottom;
      var w = rect.width;
      var h = rect.height;

      renderer.setViewport(x, y, w, h);
      renderer.setScissor(x, y, w, h);
      renderer.setScissorTest(true);

      view.camera.aspect = w / h;
      view.camera.updateProjectionMatrix();

      renderer.render(view.scene, view.camera);
    });

    animFrameId = requestAnimationFrame(renderLoop);
  }

  function start() {
    if (!webglOK()) {
      var canvasWrap = document.getElementById("viz-globe");
      if (canvasWrap) canvasWrap.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100%;color:var(--muted);font-size:13px">WebGL not supported or disabled in browser settings.</div>';
      return;
    }

    if (prefersReducedMotion) {
      var mainEl = document.getElementById("viz-globe");
      if (mainEl) {
        mainEl.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100%;min-height:240px;color:var(--muted);font-size:13px;text-align:center;padding:24px">3D Graphics disabled (Reduced Motion enabled)</div>';
      }
      return;
    }

    Promise.all([
      loadScript(THREE_SRC),
      getJSON("/data/sources_all.json"),
      getJSON("/api/stats"),
      fetch(SB + "/rest/v1/data_records?select=count", { headers: Object.assign({ Prefer: "count=exact" }, H) }).then(function (r) { return r.json(); }).then(function (j) { return (j && j[0] && j[0].count) || 0; }).catch(function () { return 0; }),
      fetch(SB + "/rest/v1/v_latest_source_data?select=name&status=eq.ok&limit=200", { headers: H }).then(function (r) { return r.json(); }).then(function (j) { return (j || []).length; }).catch(function () { return 0; })
    ]).then(function (results) {
      var cat = results[1] || {}, stats = results[2] || {}, recs = results[3] || 0, ds = results[4] || 0;
      var sourcesCount = ((cat.sources || cat) || []).length || stats.cataloged_sources || 0;
      var data = {
        sources: sourcesCount,
        records: recs,
        categories: stats.category_count || 14,
        datasets: ds
      };

      // Injects layout markup details
      var elMainGlobe = document.getElementById("viz-globe");
      if (elMainGlobe) {
        elMainGlobe.innerHTML =
          '<div style="font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.1em;color:var(--gold);margin-bottom:8px">Live Network</div>' +
          '<div style="font-size:clamp(22px,3vw,30px);font-weight:700;color:var(--text);line-height:1.15;margin-bottom:18px">The RePrime data universe, live</div>' +
          '<div class="rp-glass rp-rise" style="position:relative;overflow:hidden;height:520px;background:radial-gradient(ellipse at center,rgba(14,52,112,.15),rgba(3,6,12,.5))">' +
            '<div style="width:100%;height:100%" id="main-globe-canvas-mount"></div>' +
            '<div style="position:absolute;top:18px;left:20px;pointer-events:none;font-family:\'JetBrains Mono\',monospace">' +
              '<div style="font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:var(--gold);display:flex;align-items:center;gap:7px"><span class="rp-live-dot"></span>Live Data Network</div>' +
              '<div style="margin-top:14px"><div style="font-size:30px;font-weight:800;color:var(--gold);line-height:1">' + Number(data.sources).toLocaleString() + '</div><div style="font-size:10px;text-transform:uppercase;letter-spacing:.08em;color:var(--muted)">data sources</div></div>' +
              '<div style="margin-top:14px"><div style="font-size:30px;font-weight:800;color:var(--text);line-height:1">' + Number(data.records).toLocaleString() + '</div><div style="font-size:10px;text-transform:uppercase;letter-spacing:.08em;color:var(--muted)">records ingested</div></div>' +
              '<div style="margin-top:14px"><div style="font-size:30px;font-weight:800;color:var(--teal);line-height:1">' + Number(data.categories).toLocaleString() + '</div><div style="font-size:10px;text-transform:uppercase;letter-spacing:.08em;color:var(--muted)">categories</div></div>' +
            '</div>' +
            '<div style="position:absolute;bottom:14px;right:18px;pointer-events:none;font-family:\'JetBrains Mono\',monospace;font-size:10px;color:var(--dim)">WebGL · real-time render</div>' +
          '</div>';

        // Re-anchor main elements to mount
        var mount = document.getElementById("main-globe-canvas-mount");
        if (mount) {
          // Viewport mapping anchors directly to mount
          mount.id = "viz-globe";
        }
      }

      initRenderer();
      registerViewports(data);

      if (animFrameId) cancelAnimationFrame(animFrameId);
      renderLoop();

      window.addEventListener("resize", function () {
        resizeRenderer();
      });

      // Hook tab change listener to re-register viewports (which captures viewport shifts)
      document.querySelectorAll(".console-tab-btn").forEach(function(btn) {
        btn.addEventListener("click", function() {
          setTimeout(function() {
            registerViewports(data);
          }, 100);
        });
      });
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
