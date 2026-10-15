import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

export type StudioRenderer = {
  update: (enabled: boolean, active: number) => void;
  setProgress: (progress: number) => void;
  turn: (direction: number) => void;
  reset: () => void;
  dispose: () => void;
};

/** Original kinetic frame study; abstract material, not a product architecture. */
export function createStudio(
  host: HTMLElement,
  onLost: () => void,
): StudioRenderer {
  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
    powerPreference: "low-power",
  });
  renderer.setPixelRatio(
    Math.min(window.devicePixelRatio, window.innerWidth < 700 ? 1.25 : 1.5),
  );
  renderer.setClearColor(0x10120f, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 50);
  camera.position.set(0, 0.5, 10.7);
  camera.lookAt(0, 0, 0);
  const room = new RoomEnvironment();
  const generator = new THREE.PMREMGenerator(renderer);
  const environment = generator.fromScene(room, 0.04);
  scene.environment = environment.texture;
  room.dispose();
  generator.dispose();
  scene.add(new THREE.HemisphereLight(0xf0f4e8, 0x1b2414, 2.2));
  const key = new THREE.DirectionalLight(0xffffff, 4);
  key.position.set(-3, 5, 5);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0xc5ed8b, 4);
  rim.position.set(4, 0, -3);
  scene.add(rim);
  const fill = new THREE.DirectionalLight(0xe9eddc, 2);
  fill.position.set(-4, -3, 2);
  scene.add(fill);
  const chrome = new THREE.MeshStandardMaterial({
    color: 0xd5dbce,
    metalness: 0.95,
    roughness: 0.16,
  });
  const graphite = new THREE.MeshStandardMaterial({
    color: 0x293024,
    metalness: 0.82,
    roughness: 0.25,
  });
  const signal = new THREE.MeshStandardMaterial({
    color: 0xc5ed8b,
    emissive: 0x61892b,
    emissiveIntensity: 0.36,
    metalness: 0.65,
    roughness: 0.22,
  });

  function roundedPath(size: number, radius: number) {
    const p = new THREE.Shape();
    const h = size / 2;
    p.moveTo(-h + radius, -h);
    p.lineTo(h - radius, -h);
    p.quadraticCurveTo(h, -h, h, -h + radius);
    p.lineTo(h, h - radius);
    p.quadraticCurveTo(h, h, h - radius, h);
    p.lineTo(-h + radius, h);
    p.quadraticCurveTo(-h, h, -h, h - radius);
    p.lineTo(-h, -h + radius);
    p.quadraticCurveTo(-h, -h, -h + radius, -h);
    return p;
  }
  const shape = roundedPath(3.05, 0.62);
  shape.holes.push(roundedPath(2.38, 0.43));
  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: 0.085,
    bevelEnabled: true,
    bevelSegments: 3,
    steps: 1,
    bevelSize: 0.045,
    bevelThickness: 0.045,
    curveSegments: 12,
  });
  geometry.center();
  const object = new THREE.Group();
  object.rotation.set(-0.22, -0.5, -0.3);
  scene.add(object);
  const frames: THREE.Mesh[] = [];
  for (let i = 0; i < 11; i++) {
    const frame = new THREE.Mesh(
      geometry,
      i === 5 ? signal : i % 4 === 0 ? graphite : chrome,
    );
    object.add(frame);
    frames.push(frame);
  }
  const particles = new Float32Array(64 * 3);
  for (let i = 0; i < 64; i++) {
    const a = i * 2.399963,
      r = 2.5 + (i % 9) * 0.17;
    particles.set(
      [Math.cos(a) * r, Math.sin(a) * r * 0.8, -2 - (i % 7) * 0.15],
      i * 3,
    );
  }
  const pointGeometry = new THREE.BufferGeometry();
  pointGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(particles, 3),
  );
  const field = new THREE.Points(
    pointGeometry,
    new THREE.PointsMaterial({
      color: 0xc5ed8b,
      size: 0.018,
      transparent: true,
      opacity: 0.45,
    }),
  );
  scene.add(field);
  host.appendChild(renderer.domElement);
  let enabled = true,
    active = 0,
    visible = true,
    disposed = false,
    lost = false;
  let frame = 0,
    previous = 0,
    lastDraw = 0,
    time = 0,
    progress = 0,
    angle = 0;
  const pointer = { x: 0, y: 0 };
  const target = new THREE.Vector3();
  let drag: { id: number; x: number; angle: number } | undefined;
  let initialized = false;
  function render(stamp: number) {
    frame = 0;
    if (disposed || lost || !visible || document.hidden) return;
    if (enabled && stamp - lastDraw < 1000 / 30) {
      frame = requestAnimationFrame(render);
      return;
    }
    lastDraw = stamp;
    const delta = previous ? Math.min((stamp - previous) / 1000, 0.05) : 1 / 30;
    previous = stamp;
    if (enabled) time += delta;
    const ease = !enabled || !initialized ? 1 : 1 - Math.exp(-5 * delta);
    frames.forEach((mesh, i) => {
      const n = i - 5;
      let x = n * 0.14,
        y = n * 0.025,
        z = n * 0.19,
        rx = 0,
        ry = n * 0.012,
        rz = n * 0.095;
      if (active === 1) {
        x = Math.sin(n * 0.38) * 0.45;
        y = n * 0.14;
        z = Math.cos(n * 0.38) * 0.38;
        rx = n * 0.065;
        ry = n * 0.12;
        rz = n * 0.035;
      }
      if (active === 2) {
        x = Math.sin(n * 0.5) * 0.5;
        y = n * 0.18;
        z = Math.cos(n * 0.5) * 0.45;
        rx = 0.15;
        ry = n * 0.1;
        rz = n * 0.16;
      }
      mesh.position.lerp(target.set(x, y, z), ease);
      mesh.rotation.x += (rx - mesh.rotation.x) * ease;
      mesh.rotation.y += (ry - mesh.rotation.y) * ease;
      mesh.rotation.z += (rz - mesh.rotation.z) * ease;
    });
    object.rotation.y +=
      (-0.5 +
        angle +
        (enabled
          ? pointer.x * 0.32 + Math.sin(time * 0.18) * 0.12 + progress * 0.4
          : 0) -
        object.rotation.y) *
      ease;
    object.rotation.x +=
      (-0.22 + (enabled ? pointer.y * 0.2 : 0) - object.rotation.x) * ease;
    object.rotation.z = -0.3 + (enabled ? Math.sin(time * 0.22) * 0.035 : 0);
    object.position.y = enabled
      ? Math.sin(time * 0.55) * 0.08 - progress * 0.2
      : 0;
    signal.emissiveIntensity = enabled
      ? 0.35 + Math.sin(time * 0.9) * 0.08
      : 0.35;
    field.rotation.z = time * 0.006;
    renderer.render(scene, camera);
    initialized = true;
    if (enabled) frame = requestAnimationFrame(render);
  }
  function request() {
    if (!frame && !disposed && !lost) frame = requestAnimationFrame(render);
  }
  function resize() {
    const { width, height } = host.getBoundingClientRect();
    if (!width || !height) return;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.position.z = camera.aspect < 1 ? 10.7 / camera.aspect : 10.7;
    camera.updateProjectionMatrix();
    request();
  }
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(host);
  const observer = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    previous = 0;
    if (visible) request();
    else {
      cancelAnimationFrame(frame);
      frame = 0;
    }
  });
  observer.observe(host);
  function move(event: PointerEvent) {
    if (event.pointerType !== "mouse" || !enabled) return;
    const box = host.getBoundingClientRect();
    pointer.x = (event.clientX - box.left) / box.width - 0.5;
    pointer.y = (event.clientY - box.top) / box.height - 0.5;
    if (drag) angle = drag.angle + (event.clientX - drag.x) * 0.008;
    request();
  }
  function down(event: PointerEvent) {
    if (event.pointerType !== "mouse" || !enabled) return;
    drag = { id: event.pointerId, x: event.clientX, angle };
    host.setPointerCapture(event.pointerId);
    host.dataset.dragging = "true";
  }
  function up() {
    if (drag && host.hasPointerCapture(drag.id))
      host.releasePointerCapture(drag.id);
    drag = undefined;
    delete host.dataset.dragging;
  }
  function leave() {
    pointer.x = 0;
    pointer.y = 0;
    request();
  }
  function visibility() {
    previous = 0;
    if (!document.hidden) request();
    else {
      cancelAnimationFrame(frame);
      frame = 0;
    }
  }
  function contextLost(event: Event) {
    event.preventDefault();
    lost = true;
    cancelAnimationFrame(frame);
    frame = 0;
    onLost();
  }
  host.addEventListener("pointermove", move);
  host.addEventListener("pointerdown", down);
  host.addEventListener("pointerup", up);
  host.addEventListener("pointercancel", up);
  host.addEventListener("pointerleave", leave);
  document.addEventListener("visibilitychange", visibility);
  renderer.domElement.addEventListener("webglcontextlost", contextLost);
  resize();
  return {
    update(motion, selection) {
      enabled = motion;
      active = selection;
      previous = 0;
      if (!motion) up();
      request();
    },
    setProgress(value) {
      progress = value;
      if (enabled && visible) request();
    },
    turn(direction) {
      angle += (direction * Math.PI) / 6;
      request();
    },
    reset() {
      angle = 0;
      pointer.x = 0;
      pointer.y = 0;
      request();
    },
    dispose() {
      disposed = true;
      cancelAnimationFrame(frame);
      up();
      resizeObserver.disconnect();
      observer.disconnect();
      host.removeEventListener("pointermove", move);
      host.removeEventListener("pointerdown", down);
      host.removeEventListener("pointerup", up);
      host.removeEventListener("pointercancel", up);
      host.removeEventListener("pointerleave", leave);
      document.removeEventListener("visibilitychange", visibility);
      renderer.domElement.removeEventListener("webglcontextlost", contextLost);
      geometry.dispose();
      pointGeometry.dispose();
      chrome.dispose();
      graphite.dispose();
      signal.dispose();
      (field.material as THREE.Material).dispose();
      environment.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      renderer.domElement.remove();
    },
  };
}
