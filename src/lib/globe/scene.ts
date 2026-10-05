// The brass desk globe (Design.md, "3D globe specification"). Ported from the prototype,
// which used three.js r128. Two settings keep modern three.js looking identical to it:
// colour management off with linear output (r128 passed colours straight through), and light
// intensities multiplied by π (r128's legacy lighting mode did that internally).
import {
  AdditiveBlending,
  AmbientLight,
  BackSide,
  BufferGeometry,
  Color,
  ColorManagement,
  CylinderGeometry,
  DirectionalLight,
  DoubleSide,
  Float32BufferAttribute,
  Group,
  Line,
  LineBasicMaterial,
  LineSegments,
  LinearSRGBColorSpace,
  Mesh,
  MeshBasicMaterial,
  MeshPhongMaterial,
  PerspectiveCamera,
  RingGeometry,
  Scene,
  ShaderMaterial,
  SphereGeometry,
  TorusGeometry,
  Vector3,
  WebGLRenderer,
  type Material,
} from 'three';
import { LAND } from './land';

export type GeoPin = { lat: number; lon: number; name: string; info: string[] };
export type PinObj = { head: Mesh; halo: Mesh<RingGeometry, MeshBasicMaterial>; v: Vector3; data: GeoPin; k: number };
export type SceneName = 'hero' | 'journey' | 'visit';
export type GlobeScene = Awaited<ReturnType<typeof build>>;

const D = Math.PI / 180;
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));

// Building the engraving is a few hundred milliseconds of work on a slow phone, so it yields
// between steps and compiles shaders off the main thread, instead of arriving as one long task.
const yieldToPage = () => new Promise<void>((r) => setTimeout(r, 0));

export async function createScene(canvas: HTMLCanvasElement, geo: GeoPin[], VN: GeoPin, BG: GeoPin): Promise<GlobeScene | null> {
  ColorManagement.enabled = false;
  let R: WebGLRenderer;
  try {
    R = new WebGLRenderer({ canvas, antialias: true, alpha: false });
  } catch {
    return null;
  }
  return build(R, canvas, geo, VN, BG);
}

async function build(R: WebGLRenderer, canvas: HTMLCanvasElement, geo: GeoPin[], VN: GeoPin, BG: GeoPin) {
  R.outputColorSpace = LinearSRGBColorSpace;
  R.setClearColor(0x0e2a23, 1);

  const scene = new Scene();
  const cam = new PerspectiveCamera(30, 1, 0.1, 50);
  cam.position.set(0, 0, 6.2);
  const rig = new Group();
  rig.rotation.z = -0.13;
  scene.add(rig);
  const axis = new Group();
  rig.add(axis);
  const earth = new Group();
  axis.add(earth);
  scene.add(new AmbientLight(0xffffff, 0.55 * Math.PI));
  const sun = new DirectionalLight(0xfff2d0, 1.0 * Math.PI);
  sun.position.set(-2.5, 3, 4);
  scene.add(sun);

  function ll(lat: number, lon: number, r: number) {
    const a = lat * D, o = lon * D;
    return new Vector3(r * Math.cos(a) * Math.sin(o), r * Math.sin(a), r * Math.cos(a) * Math.cos(o));
  }
  function slerp(a: Vector3, b: Vector3, u: number, ang: number) {
    if (ang < 1e-5) return a.clone();
    const s = Math.sin(ang), k1 = Math.sin((1 - u) * ang) / s, k2 = Math.sin(u * ang) / s;
    return new Vector3(a.x * k1 + b.x * k2, a.y * k1 + b.y * k2, a.z * k1 + b.z * k2);
  }

  const VS = 'varying vec3 vN; varying vec3 vP; void main(){ vN = normalize(normalMatrix * normal); vec4 mv = modelViewMatrix * vec4(position, 1.0); vP = mv.xyz; gl_Position = projectionMatrix * mv; }';
  const BRASS = new Color(0xc9a44c);

  // the ball: lamp-lit from the upper left, brass rim light
  earth.add(new Mesh(new SphereGeometry(1, 72, 48), new ShaderMaterial({
    uniforms: { deep: { value: new Color(0x05110d) }, mid: { value: new Color(0x163f33) }, rim: { value: BRASS } },
    vertexShader: VS,
    fragmentShader: 'uniform vec3 deep; uniform vec3 mid; uniform vec3 rim; varying vec3 vN; varying vec3 vP; void main(){ vec3 N = normalize(vN); vec3 V = normalize(-vP); float f = pow(1.0 - max(dot(N, V), 0.0), 3.0); float d = max(dot(N, normalize(vec3(-0.55, 0.55, 0.63))), 0.0); vec3 c = mix(deep, mid, d * d); c += rim * f * 0.32; gl_FragColor = vec4(c, 1.0); }',
    polygonOffset: true, polygonOffsetFactor: 1, polygonOffsetUnits: 1,
  })));
  // soft halo
  rig.add(new Mesh(new SphereGeometry(1.2, 48, 32), new ShaderMaterial({
    uniforms: { rim: { value: BRASS } }, vertexShader: VS,
    fragmentShader: 'uniform vec3 rim; varying vec3 vN; varying vec3 vP; void main(){ float g = -dot(normalize(vN), normalize(-vP)); float a = clamp(g * 1.8, 0.0, 1.0); gl_FragColor = vec4(rim * a * a * 0.2, 1.0); }',
    side: BackSide, transparent: true, blending: AdditiveBlending, depthWrite: false,
  })));

  function lineSet(arr: number[], opacity: number) {
    const g = new BufferGeometry();
    g.setAttribute('position', new Float32BufferAttribute(arr, 3));
    return new LineSegments(g, new LineBasicMaterial({ color: 0xc9a44c, transparent: true, opacity }));
  }
  function pushArc(a: Vector3, b: Vector3, r: number, out: number[]) {
    const ang = a.angleTo(b), n = Math.max(1, Math.ceil(ang / (2.5 * D)));
    let prev = a.clone().multiplyScalar(r);
    for (let i = 1; i <= n; i++) {
      const v = slerp(a, b, i / n, ang).normalize().multiplyScalar(r);
      out.push(prev.x, prev.y, prev.z, v.x, v.y, v.z);
      prev = v;
    }
  }

  await yieldToPage();
  // land, engraved: parallels clipped to the continents
  {
    const hp: number[] = [];
    LAND.h.forEach((row) => {
      const lat = row[0] / 10;
      for (let k = 1; k < row.length; k += 2) {
        const a = -180 + row[k] * 0.5, b = -180 + row[k + 1] * 0.5, n = Math.max(1, Math.ceil((b - a) / 2.5));
        for (let j = 0; j < n; j++) {
          const p0 = ll(lat, a + ((b - a) * j) / n, 1.002), p1 = ll(lat, a + ((b - a) * (j + 1)) / n, 1.002);
          hp.push(p0.x, p0.y, p0.z, p1.x, p1.y, p1.z);
        }
      }
    });
    earth.add(lineSet(hp, 0.42));
    await yieldToPage();
    const cp: number[] = [];
    LAND.c.forEach((line) => {
      for (let i = 0; i + 3 < line.length; i += 2) {
        const x0 = line[i] / 10, y0 = line[i + 1] / 10, x1 = line[i + 2] / 10, y1 = line[i + 3] / 10;
        if (Math.abs(x0) > 179.8 && Math.abs(x1) > 179.8) continue;
        if (y0 < -89 && y1 < -89) continue;
        pushArc(ll(y0, x0, 1), ll(y1, x1, 1), 1.003, cp);
      }
    });
    earth.add(lineSet(cp, 0.95));
    const gp: number[] = [];
    for (let lon = -180; lon < 180; lon += 30) for (let la = -84; la < 84; la += 4) { const q0 = ll(la, lon, 1.001), q1 = ll(la + 4, lon, 1.001); gp.push(q0.x, q0.y, q0.z, q1.x, q1.y, q1.z); }
    for (let lt = -60; lt <= 60; lt += 30) for (let lo = -180; lo < 180; lo += 4) { const r0 = ll(lt, lo, 1.001), r1 = ll(lt, lo + 4, 1.001); gp.push(r0.x, r0.y, r0.z, r1.x, r1.y, r1.z); }
    earth.add(lineSet(gp, 0.12));
  }

  await yieldToPage();
  // brass meridian ring and axis pins, like a desk globe
  const brassMat = new MeshPhongMaterial({ color: 0xb28e3d, specular: 0xfff0c4, shininess: 70 });
  const ring = new Mesh(new TorusGeometry(1.13, 0.013, 12, 200), brassMat);
  ring.rotation.y = 0.6;
  axis.add(ring);
  [1, -1].forEach((sgn) => {
    const c = new Mesh(new CylinderGeometry(0.014, 0.014, 0.17, 12), brassMat);
    c.position.y = sgn * 1.06;
    axis.add(c);
    const k = new Mesh(new SphereGeometry(0.03, 16, 12), brassMat);
    k.position.y = sgn * 1.15;
    axis.add(k);
  });

  // pins
  const Z = new Vector3(0, 0, 1);
  function addPin(p: GeoPin, color: number, size: number): PinObj {
    const g = new Group(), v = ll(p.lat, p.lon, 1);
    g.position.copy(v);
    g.quaternion.setFromUnitVectors(Z, v.clone().normalize());
    const head = new Mesh(new SphereGeometry(size, 14, 10), new MeshBasicMaterial({ color }));
    head.position.z = size * 0.6;
    const halo = new Mesh(new RingGeometry(0.036, 0.043, 48), new MeshBasicMaterial({ color, transparent: true, opacity: 0, side: DoubleSide, depthWrite: false }));
    halo.position.z = 0.006;
    g.add(head);
    g.add(halo);
    earth.add(g);
    return { head, halo, v, data: p, k: 1 };
  }
  const pins = geo.map((g, i) => addPin(g, i === 0 ? 0xece7d6 : 0xc9a44c, i === 0 ? 0.02 : 0.015));
  const vnPin = addPin(VN, 0xe36a55, 0.02), bgPin = addPin(BG, 0x8f7a3e, 0.012);
  const allPins = pins.concat([vnPin, bgPin]);

  // route legs between consecutive stops
  const LEG_N = 80;
  const legs: BufferGeometry[] = [];
  for (let li = 0; li < geo.length - 1; li++) {
    const va = ll(geo[li].lat, geo[li].lon, 1), vb = ll(geo[li + 1].lat, geo[li + 1].lon, 1), ang = va.angleTo(vb), h = 0.025 + 0.22 * (ang / Math.PI), arr: number[] = [];
    for (let s = 0; s <= LEG_N; s++) {
      const u = s / LEG_N, pv = slerp(va, vb, u, ang).normalize().multiplyScalar(1.006 + h * Math.sin(Math.PI * u));
      arr.push(pv.x, pv.y, pv.z);
    }
    const lg = new BufferGeometry();
    lg.setAttribute('position', new Float32BufferAttribute(arr, 3));
    lg.setDrawRange(0, 0);
    earth.add(new Line(lg, new LineBasicMaterial({ color: 0xece7d6, transparent: true, opacity: 0.85 })));
    legs.push(lg);
  }
  function setLegs(fn: (i: number) => number) {
    for (let i = 0; i < legs.length; i++) {
      const c = Math.round(clamp(fn(i)) * LEG_N);
      legs[i].setDrawRange(0, c ? c + 1 : 0);
    }
  }

  await yieldToPage();
  await R.compileAsync(scene, cam).catch(() => undefined);

  /* ---------------- layout ---------------- */
  function resize() {
    const w = canvas.clientWidth || innerWidth, h = canvas.clientHeight || innerHeight;
    R.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    R.setSize(w, h, false);
    cam.aspect = w / h;
    cam.updateProjectionMatrix();
  }
  function place(sc: SceneName) {
    const H = 2 * cam.position.z * Math.tan((cam.fov * D) / 2), W = H * cam.aspect;
    if (cam.aspect < 0.85) {
      const ps = W * 0.43;
      if (sc === 'hero') return { x: 0, y: H * 0.17, s: ps };
      if (sc === 'journey') return { x: 0, y: H * 0.175, s: ps * 0.92 };
      return { x: 0, y: H * 0.16, s: ps * 1.1 };
    }
    const fit = W * 0.215;
    if (sc === 'hero') return { x: W * 0.235, y: 0, s: Math.min(1.12, fit) };
    if (sc === 'journey') return { x: W * 0.24, y: 0, s: Math.min(1.02, fit) };
    return { x: W * 0.25, y: 0, s: Math.min(1.5, fit * 1.35) };
  }

  const wp = new Vector3(), wc = new Vector3();
  function screenOf(pin: PinObj) {
    wp.copy(pin.v).multiplyScalar(1.02);
    earth.localToWorld(wp);
    wc.copy(rig.position);
    const nx = wp.x - wc.x, ny = wp.y - wc.y, nz = wp.z - wc.z, vx = cam.position.x - wp.x, vy = cam.position.y - wp.y, vz = cam.position.z - wp.z;
    const facing = (nx * vx + ny * vy + nz * vz) / (Math.sqrt(nx * nx + ny * ny + nz * nz) * Math.sqrt(vx * vx + vy * vy + vz * vz));
    wp.project(cam);
    return { x: ((wp.x + 1) / 2) * canvas.clientWidth, y: ((1 - wp.y) / 2) * canvas.clientHeight, front: facing > 0.12 };
  }

  function render() {
    R.render(scene, cam);
  }

  function dispose() {
    scene.traverse((o) => {
      const m = o as Mesh;
      m.geometry?.dispose();
      const mat = m.material as Material | Material[] | undefined;
      if (Array.isArray(mat)) mat.forEach((x) => x.dispose());
      else mat?.dispose();
    });
    R.dispose();
    R.forceContextLoss();
  }

  return { scene, rig, axis, earth, pins, vnPin, allPins, setLegs, resize, place, screenOf, render, dispose };
}
