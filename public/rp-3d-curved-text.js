/* RePrime Group — 3D Curved Text Helper
 *
 * Renders the "RePrime Group · RePrime Terminal · " brand string as a
 * curved ring or overhead arc inside Three.js scenes. Used by every
 * 3D viz component (globes, terrain, kanban, skyline).
 *
 * Technique: paint text on a 2D canvas, wrap the canvas as a tiling
 * CanvasTexture around a thin open-ended cylinder. The cylinder is
 * added as a child of the scene's rotation group, so the text follows
 * the existing motion. No font-file dependency — uses whatever font
 * the page already loaded (Poppins / system).
 *
 * Two presets:
 *   addOrbitRing(parent, opts)    — vertical ring around a globe
 *   addOverheadArc(parent, opts)  — half-cylinder arching over a scene
 *
 * No state of its own — pure factory; the consumer keeps the handle.
 */
(function () {
  'use strict';
  window.RP3D = window.RP3D || {};

  function buildTextCanvas(text, color, fontPx) {
    var canvas = document.createElement('canvas');
    canvas.width = 4096;
    canvas.height = 256;
    var ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.shadowColor = 'rgba(0,0,0,0.55)';
    ctx.shadowBlur = 8;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 2;

    ctx.font = '700 ' + (fontPx || 130) + "px 'Poppins', 'JetBrains Mono', system-ui, sans-serif";
    ctx.fillStyle = color || '#BC9C45';
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'left';

    var measured = ctx.measureText(text).width || 1;
    var scaleX = canvas.width / measured;
    ctx.setTransform(scaleX, 0, 0, 1, 0, canvas.height / 2);
    ctx.fillText(text, 0, 0);
    return canvas;
  }

  function makeTexture(canvas, repeats) {
    var THREE = window.THREE;
    var t = new THREE.CanvasTexture(canvas);
    t.wrapS = THREE.RepeatWrapping;
    t.wrapT = THREE.ClampToEdgeWrapping;
    t.repeat.x = repeats || 4;
    t.anisotropy = 8;
    t.needsUpdate = true;
    return t;
  }

  /**
   * Add a vertical orbital ring around a globe.
   * opts: { radius, height, y, tilt, opacity, repeats, color, text, fontPx, segments }
   */
  window.RP3D.addOrbitRing = function (parent, opts) {
    var THREE = window.THREE;
    if (!THREE || !parent) return null;
    opts = opts || {};
    var text     = opts.text     || 'RePrime Group  ·  RePrime Terminal  ·  ';
    var radius   = opts.radius   || 110;
    var height   = opts.height   || 14;
    var y        = opts.y        || 0;
    var tilt     = opts.tilt     || 0;
    var opacity  = opts.opacity  != null ? opts.opacity : 0.7;
    var repeats  = opts.repeats  || 4;
    var color    = opts.color    || '#BC9C45';
    var fontPx   = opts.fontPx   || 130;
    var segments = opts.segments || 128;

    var canvas = buildTextCanvas(text, color, fontPx);
    var tex = makeTexture(canvas, repeats);

    var geom = new THREE.CylinderGeometry(radius, radius, height, segments, 1, true);
    var mat = new THREE.MeshBasicMaterial({
      map: tex,
      transparent: true,
      side: THREE.DoubleSide,
      opacity: opacity,
      depthWrite: false
    });
    var ring = new THREE.Mesh(geom, mat);
    ring.position.y = y;
    ring.rotation.x = tilt;
    ring.renderOrder = 5;
    parent.add(ring);

    return {
      mesh: ring,
      texture: tex,
      spin: function (delta) { ring.rotation.y += delta; }
    };
  };

  /**
   * Add a curved arc text band arching across the top of a 3D scene.
   * The cylinder is laid on its side (X-axis), with only the top half
   * visible via a 180-degree theta range, producing a rainbow-style
   * banner floating above the scene.
   *
   * opts: { radius, height, y, opacity, repeats, color, text, fontPx, segments, axisY }
   */
  window.RP3D.addOverheadArc = function (parent, opts) {
    var THREE = window.THREE;
    if (!THREE || !parent) return null;
    opts = opts || {};
    var text     = opts.text     || 'RePrime Group  ·  RePrime Terminal  ·  ';
    var radius   = opts.radius   || 110;
    var height   = opts.height   || 18;
    var y        = opts.y        || 60;
    var opacity  = opts.opacity  != null ? opts.opacity : 0.55;
    var repeats  = opts.repeats  || 2;
    var color    = opts.color    || '#BC9C45';
    var fontPx   = opts.fontPx   || 130;
    var segments = opts.segments || 96;
    var axisY    = opts.axisY    || 0;

    var canvas = buildTextCanvas(text, color, fontPx);
    var tex = makeTexture(canvas, repeats);

    var geom = new THREE.CylinderGeometry(
      radius, radius, height,
      segments, 1, true,
      0, Math.PI
    );
    var mat = new THREE.MeshBasicMaterial({
      map: tex,
      transparent: true,
      side: THREE.DoubleSide,
      opacity: opacity,
      depthWrite: false
    });
    var arc = new THREE.Mesh(geom, mat);
    arc.rotation.z = Math.PI / 2;
    arc.rotation.y = axisY;
    arc.position.y = y;
    arc.renderOrder = 5;
    parent.add(arc);

    return {
      mesh: arc,
      texture: tex,
      spin: function (delta) { arc.rotation.x += delta; }
    };
  };
})();
