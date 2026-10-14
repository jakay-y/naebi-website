/*
 * Naebi Dynamic Concepts: 3D logo mark.
 * Builds the four pieces of the "ND" mark as extruded, clear-coated solids with the
 * brand gradients baked into vertex colours. Needs the global THREE (r160 UMD build).
 *
 *   NaebiLogo3D.mount(canvas, { assemble: true, sway: true, interactive: true })
 *   NaebiLogo3D.still(canvas, { yaw: -0.4, pitch: 0.12 })   // one frame, used for the PNG renders
 */
(function (global) {
  "use strict";

  // Path commands in the logo's own pixel space (traced from the supplied artwork).
  // ["A", cx, cy, r, fromDeg, toDeg] samples an arc; 0deg = +x, 90deg = down.
  var PIECES = [
    { tone: "green", cmd: [["M", 261, 126], ["H", 573], ["A", 573, 276, 150, -90, 0], ["V", 404], ["H", 633], ["V", 275], ["A", 573, 275, 60, 0, -90], ["H", 261]] },
    { tone: "navy", cmd: [["M", 262, 249], ["H", 549], ["A", 549, 299, 50, -90, 0], ["V", 404], ["H", 509], ["V", 350], ["H", 356], ["V", 743], ["H", 262]] },
    { tone: "navy", cmd: [["M", 509, 434], ["H", 599], ["V", 560], ["A", 529, 560, 70, 0, 90], ["H", 509]] },
    { tone: "green", cmd: [["M", 385, 376], ["H", 474], ["V", 664], ["H", 529], ["A", 529, 560, 104, 90, 0], ["V", 434], ["H", 723], ["V", 560], ["A", 538, 560, 185, 0, 90], ["H", 385]] }
  ];
  var CX = 492, CY = 435.5, S = 100; // centre and scale (logo px per world unit)
  var BOUNDS = { minX: (261 - CX) / S, maxX: (723 - CX) / S, minY: -(745 - CY) / S, maxY: -(126 - CY) / S };

  function toShape(cmd) {
    var pts = [], x = 0, y = 0;
    cmd.forEach(function (c) {
      if (c[0] === "M") { x = c[1]; y = c[2]; pts.push([x, y]); }
      else if (c[0] === "H") { x = c[1]; pts.push([x, y]); }
      else if (c[0] === "V") { y = c[1]; pts.push([x, y]); }
      else if (c[0] === "A") {
        var n = 28, a0 = c[4] * Math.PI / 180, a1 = c[5] * Math.PI / 180;
        for (var i = 1; i <= n; i++) {
          var a = a0 + (a1 - a0) * (i / n);
          x = c[1] + Math.cos(a) * c[3]; y = c[2] + Math.sin(a) * c[3];
          pts.push([x, y]);
        }
      }
    });
    var shape = new THREE.Shape();
    pts.forEach(function (p, i) {
      var X = (p[0] - CX) / S, Y = -(p[1] - CY) / S;
      if (i === 0) shape.moveTo(X, Y); else shape.lineTo(X, Y);
    });
    shape.closePath();
    return shape;
  }

  var RAMPS = {
    green: [[0, "#9ED14B"], [0.5, "#5FA03B"], [1, "#0F4A2E"]],
    navy: [[0, "#2453A6"], [0.55, "#14306A"], [1, "#070D1C"]]
  };
  function ramp(stops, t) {
    t = Math.max(0, Math.min(1, t));
    for (var i = 1; i < stops.length; i++) {
      if (t <= stops[i][0]) {
        var a = stops[i - 1], b = stops[i], k = (t - a[0]) / (b[0] - a[0]);
        return new THREE.Color(a[1]).lerp(new THREE.Color(b[1]), k);
      }
    }
    return new THREE.Color(stops[stops.length - 1][1]);
  }

  function buildMark() {
    var group = new THREE.Group();
    var w = BOUNDS.maxX - BOUNDS.minX, h = BOUNDS.maxY - BOUNDS.minY;
    PIECES.forEach(function (p) {
      var geo = new THREE.ExtrudeGeometry(toShape(p.cmd), {
        depth: 0.46, bevelEnabled: true, bevelThickness: 0.07, bevelSize: 0.045, bevelSegments: 5, curveSegments: 1
      });
      geo.translate(0, 0, -0.23);
      var pos = geo.attributes.position, cols = new Float32Array(pos.count * 3);
      for (var i = 0; i < pos.count; i++) {
        var u = (pos.getX(i) - BOUNDS.minX) / w, v = (BOUNDS.maxY - pos.getY(i)) / h;
        var t = p.tone === "green" ? 0.42 * u + 0.58 * v : 0.22 * u + 0.78 * v;
        var c = ramp(RAMPS[p.tone], t);
        // slightly darker extrusion walls so the front face reads crisply
        if (Math.abs(pos.getZ(i)) < 0.2) c.multiplyScalar(0.78);
        cols[i * 3] = c.r; cols[i * 3 + 1] = c.g; cols[i * 3 + 2] = c.b;
      }
      geo.setAttribute("color", new THREE.BufferAttribute(cols, 3));
      geo.computeVertexNormals();
      var mat = new THREE.MeshPhysicalMaterial({
        vertexColors: true, roughness: 0.3, metalness: 0.12, clearcoat: 1, clearcoatRoughness: 0.1, transparent: true
      });
      group.add(new THREE.Mesh(geo, mat));
    });
    return group;
  }

  // Soft studio environment: two softboxes and a faint lime bounce, for clear-coat reflections.
  function studioEnv(renderer) {
    var c = document.createElement("canvas"); c.width = 1024; c.height = 512;
    var g = c.getContext("2d");
    var bg = g.createLinearGradient(0, 0, 0, 512);
    bg.addColorStop(0, "#202a3c"); bg.addColorStop(0.5, "#0c1220"); bg.addColorStop(1, "#05080f");
    g.fillStyle = bg; g.fillRect(0, 0, 1024, 512);
    function box(x, y, bw, bh, col, blur) { g.filter = "blur(" + blur + "px)"; g.fillStyle = col; g.fillRect(x, y, bw, bh); }
    box(180, 120, 200, 130, "#ffffff", 18);
    box(640, 90, 140, 260, "#e8f0ff", 22);
    box(420, 380, 260, 60, "#9ED14B", 30);
    g.filter = "none";
    var tex = new THREE.CanvasTexture(c);
    tex.mapping = THREE.EquirectangularReflectionMapping;
    tex.colorSpace = THREE.SRGBColorSpace;
    var pm = new THREE.PMREMGenerator(renderer);
    var env = pm.fromEquirectangular(tex).texture;
    tex.dispose(); pm.dispose();
    return env;
  }

  function setup(canvas) {
    var renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true, preserveDrawingBuffer: true });
    renderer.setPixelRatio(Math.min(global.devicePixelRatio || 1, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    var scene = new THREE.Scene();
    scene.environment = studioEnv(renderer);
    var cam = new THREE.PerspectiveCamera(28, 1, 0.1, 100);
    cam.position.set(0, 0, 15.5);
    var key = new THREE.DirectionalLight(0xffffff, 1.6); key.position.set(-4, 6, 8); scene.add(key);
    var rim = new THREE.DirectionalLight(0xbfe38a, 0.9); rim.position.set(6, -2, -4); scene.add(rim);
    scene.add(new THREE.AmbientLight(0xffffff, 0.25));
    var mark = buildMark(); scene.add(mark);
    function size() {
      var r = canvas.getBoundingClientRect(), w = Math.max(1, r.width), h = Math.max(1, r.height);
      renderer.setSize(w, h, false); cam.aspect = w / h; cam.updateProjectionMatrix();
    }
    size();
    return { renderer: renderer, scene: scene, cam: cam, mark: mark, size: size };
  }

  function easeOutExpo(t) { return t >= 1 ? 1 : 1 - Math.pow(2, -10 * t); }

  function mount(canvas, opts) {
    opts = opts || {};
    var s = setup(canvas), raf = 0, t0 = performance.now(), mx = 0, my = 0, alive = true;
    var reduce = global.matchMedia && global.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var starts = s.mark.children.map(function (m, i) {
      var dir = [[-1, 1], [-1, -0.3], [1, -0.6], [0.6, -1]][i];
      return { x: dir[0] * 2.4, y: dir[1] * 2.4, z: 5, ry: (i % 2 ? 1 : -1) * 1.4, rx: (i < 2 ? 1 : -1) * 0.9 };
    });
    function onMove(e) { mx = (e.clientX / global.innerWidth) * 2 - 1; my = (e.clientY / global.innerHeight) * 2 - 1; }
    if (opts.interactive) global.addEventListener("pointermove", onMove, { passive: true });
    global.addEventListener("resize", s.size);
    function frame(now) {
      if (!alive) return;
      var t = (now - t0) / 1000;
      s.mark.children.forEach(function (m, i) {
        var k = opts.assemble && !reduce ? easeOutExpo(Math.max(0, (t - 0.1 - i * 0.12) / 1.25)) : 1;
        var st = starts[i], inv = 1 - k;
        m.position.set(st.x * inv, st.y * inv, st.z * inv);
        m.rotation.set(st.rx * inv, st.ry * inv, 0);
        m.material.opacity = Math.min(1, k * 1.6);
      });
      var settle = Math.min(1, Math.max(0, (t - 1.2) / 0.8));
      var sway = opts.sway && !reduce ? Math.sin(t * 0.9) * 0.32 * settle : 0;
      s.mark.rotation.y += ((sway + mx * 0.35 - 0.18) - s.mark.rotation.y) * 0.08;
      s.mark.rotation.x += ((0.1 + my * 0.18) - s.mark.rotation.x) * 0.08;
      s.renderer.render(s.scene, s.cam);
      raf = global.requestAnimationFrame(frame);
    }
    raf = global.requestAnimationFrame(frame);
    return {
      dispose: function () {
        alive = false; global.cancelAnimationFrame(raf);
        global.removeEventListener("pointermove", onMove); global.removeEventListener("resize", s.size);
        s.renderer.dispose();
      }
    };
  }

  function still(canvas, opts) {
    opts = opts || {};
    var s = setup(canvas);
    s.mark.rotation.set(opts.pitch || 0.1, opts.yaw || -0.4, 0);
    s.renderer.render(s.scene, s.cam);
    return s;
  }

  global.NaebiLogo3D = { mount: mount, still: still };
})(window);
