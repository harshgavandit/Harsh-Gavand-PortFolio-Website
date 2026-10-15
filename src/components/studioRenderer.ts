import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

export type StudioRenderer = {
  update: (enabled: boolean, active: number) => void;
  setProgress: (progress: number) => void;
  turn: (direction: number) => void;
  reset: () => void;
  dispose: () => void;
};

/** Procedural kinetic sculpture. One canvas, shared geometry, no downloaded models. */
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
  renderer.setClearColor(0xffffff, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.95;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 60);
  camera.position.set(0, 1.3, 10.4);
  camera.lookAt(0, 0, 0);
  const environment = new RoomEnvironment();
  const generator = new THREE.PMREMGenerator(renderer);
  const environmentMap = generator.fromScene(environment, 0.04);
  scene.environment = environmentMap.texture;
  environment.dispose();
  generator.dispose();
  scene.add(new THREE.HemisphereLight(0xe9f2d9, 0x141b0d, 2));
  const light = new THREE.DirectionalLight(0xfff7e4, 3);
  light.position.set(-3, 6, 5);
  scene.add(light);
  const rim = new THREE.DirectionalLight(0xc5ed8b, 2.8);
  rim.position.set(4, 2, -3);
  scene.add(rim);
  const violetRim = new THREE.DirectionalLight(0xe3e9d9, 2);
  violetRim.position.set(-4, -2, 2);
  scene.add(violetRim);

  const blue = new THREE.MeshStandardMaterial({
    color: 0xcbd3bf,
    emissive: 0x1e2814,
    emissiveIntensity: 0.15,
    metalness: 0.82,
    roughness: 0.22,
  });
  const pearl = new THREE.MeshStandardMaterial({
    color: 0xe5e8dc,
    emissive: 0x252b1d,
    emissiveIntensity: 0.1,
    metalness: 0.6,
    roughness: 0.27,
  });
  const silver = new THREE.MeshStandardMaterial({
    color: 0xc5ed8b,
    emissive: 0x425b25,
    emissiveIntensity: 0.22,
    metalness: 0.65,
    roughness: 0.22,
  });
  const glass = new THREE.MeshStandardMaterial({
    color: 0xc5ed8b,
    metalness: 0.2,
    roughness: 0.1,
    transparent: true,
    opacity: 0.45,
    depthWrite: false,
    side: THREE.DoubleSide,
  });
  const ink = new THREE.MeshStandardMaterial({
    color: 0x1c2415,
    emissive: 0x526a36,
    emissiveIntensity: 0.25,
    metalness: 0.6,
    roughness: 0.3,
  });
  const assembly = new THREE.Group();
  assembly.rotation.set(0.13, -0.28, -0.13);
  scene.add(assembly);

  const orbit = new THREE.Group();
  orbit.position.y = 0.3;
  assembly.add(orbit);
  const mainRing = new THREE.Mesh(
    new THREE.TorusKnotGeometry(1.05, 0.25, 120, 16, 2, 3),
    blue,
  );
  mainRing.rotation.set(0.15, 0.5, -0.35);
  orbit.add(mainRing);
  const innerRing = new THREE.Mesh(
    new THREE.TorusGeometry(1.78, 0.035, 12, 96),
    silver,
  );
  innerRing.rotation.set(-0.62, -0.42, 0.5);
  orbit.add(innerRing);
  const core = new THREE.Mesh(new THREE.IcosahedronGeometry(0.46, 3), pearl);
  orbit.add(core);
  const coreLight = new THREE.PointLight(0xc5ed8b, 1.8, 10);
  core.add(coreLight);
  const coreGrid = new THREE.LineSegments(
    new THREE.WireframeGeometry(new THREE.IcosahedronGeometry(0.49, 1)),
    new THREE.LineBasicMaterial({
      color: 0xc5ed8b,
      transparent: true,
      opacity: 0.75,
    }),
  );
  core.add(coreGrid);

  const paths: THREE.Mesh[] = [];
  const pathsGroup = new THREE.Group();
  pathsGroup.position.y = 0.4;
  assembly.add(pathsGroup);
  for (let i = 0; i < 3; i++) {
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(2.03 + i * 0.22, 0.009, 5, 96),
      i === 0 ? blue : silver,
    );
    ring.rotation.set(0.55 + i * 0.56, 0.25 + i * 0.54, i * 0.6);
    pathsGroup.add(ring);
    paths.push(ring);
  }
  const satelliteGeometry = new THREE.SphereGeometry(0.045, 10, 8);
  const satellites: THREE.Mesh[] = [];
  for (let i = 0; i < 12; i++) {
    const node = new THREE.Mesh(satelliteGeometry, i % 3 === 0 ? pearl : blue);
    paths[i % 3].add(node);
    satellites.push(node);
  }

  const layers: THREE.Group[] = [];
  const slabGeometry = new RoundedBoxGeometry(2.7, 0.12, 1.8, 3, 0.055);
  const traceGeometry = new THREE.BoxGeometry(0.075, 0.017, 0.55);
  for (let i = 0; i < 3; i++) {
    const layer = new THREE.Group();
    layer.add(new THREE.Mesh(slabGeometry, i === 1 ? glass : ink));
    layer.position.y = -1.6 - i * 0.22;
    layer.rotation.y = 0.3;
    for (let j = 0; j < 6; j++) {
      const trace = new THREE.Mesh(traceGeometry, j === 0 ? blue : silver);
      trace.position.set(-0.95 + j * 0.37, 0.072, -0.25 + (j % 2) * 0.3);
      layer.add(trace);
    }
    assembly.add(layer);
    layers.push(layer);
  }
  const base = new THREE.Mesh(
    new THREE.CylinderGeometry(1.78, 1.87, 0.12, 80),
    ink,
  );
  base.position.set(0, -2.31, 0);
  assembly.add(base);
  const baseRing = new THREE.Mesh(
    new THREE.TorusGeometry(1.79, 0.018, 8, 96),
    blue,
  );
  baseRing.rotation.x = Math.PI / 2;
  baseRing.position.y = -2.22;
  assembly.add(baseRing);

  const chips: THREE.Group[] = [];
  const chipGeo = new RoundedBoxGeometry(0.82, 0.65, 0.09, 3, 0.07);
  const lineGeo = new THREE.BoxGeometry(0.44, 0.04, 0.025);
  for (let i = 0; i < 3; i++) {
    const chip = new THREE.Group();
    chip.add(new THREE.Mesh(chipGeo, i === 1 ? silver : ink));
    for (let j = 0; j < 3; j++) {
      const stripe = new THREE.Mesh(
        lineGeo,
        i === 1 ? pearl : j === 0 ? blue : ink,
      );
      stripe.position.set(j === 2 ? -0.08 : 0, 0.13 - j * 0.12, 0.058);
      if (j === 2) stripe.scale.x = 0.65;
      chip.add(stripe);
    }
    chip.position.set(
      i === 0 ? -2 : i === 1 ? 2.08 : 1.75,
      i === 0 ? 1.2 : i === 1 ? 0.85 : -1.12,
      i === 0 ? 0.4 : -0.1,
    );
    chip.rotation.set(-0.12, i === 0 ? 0.4 : -0.4, i === 0 ? -0.13 : 0.12);
    assembly.add(chip);
    chips.push(chip);
  }

  const points = new Float32Array(160 * 3);
  for (let i = 0; i < 160; i++) {
    const angle = i * 2.399963;
    const radius = 2.4 + (i % 13) * 0.18;
    points.set(
      [
        Math.cos(angle) * radius,
        Math.sin(angle) * radius * 0.72,
        -0.8 - (i % 7) * 0.3,
      ],
      i * 3,
    );
  }
  const pointGeo = new THREE.BufferGeometry();
  pointGeo.setAttribute("position", new THREE.BufferAttribute(points, 3));
  const field = new THREE.Points(
    pointGeo,
    new THREE.PointsMaterial({
      color: 0xa8bc8b,
      size: 0.038,
      transparent: true,
      opacity: 0.82,
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
    time = 0,
    previous = 0,
    lastDraw = 0,
    progress = 0,
    turn = 0;
  const pointer = { x: 0, y: 0 };
  let drag: { id: number; x: number; turn: number } | undefined;
  const targetScale = new THREE.Vector3();
  const render = (stamp: number) => {
    frame = 0;
    if (disposed || lost || !visible || document.hidden) return;
    // This decorative scene needs at most 30 draws per second. Input and
    // visibility still use native animation-frame scheduling.
    if (enabled && stamp - lastDraw < 1000 / 30) {
      frame = requestAnimationFrame(render);
      return;
    }
    lastDraw = stamp;
    const delta = previous ? Math.min((stamp - previous) / 1000, 0.05) : 0;
    previous = stamp;
    if (enabled) time += delta;
    const ease = enabled ? 1 - Math.exp(-5 * delta) : 1;
    const scroll = enabled ? progress : 0;
    assembly.rotation.y +=
      (-0.28 +
        turn +
        active * 0.23 +
        (enabled ? pointer.x * 0.3 : 0) +
        scroll * 0.35 -
        assembly.rotation.y) *
      ease;
    assembly.rotation.x +=
      (0.13 + (enabled ? pointer.y * 0.14 : 0) - assembly.rotation.x) * ease;
    assembly.position.y = -scroll * 0.2;
    orbit.rotation.z = enabled ? Math.sin(time * 0.18) * 0.09 : 0;
    innerRing.rotation.y = -0.42 + time * 0.1;
    core.rotation.y = time * 0.13;
    coreLight.intensity = enabled ? 1.6 + Math.sin(time * 1.8) * 0.25 : 1.6;
    core.scale.lerp(targetScale.setScalar(active === 2 ? 1.15 : 1), ease);
    mainRing.rotation.y +=
      ((active === 1 ? 1.3 : active === 2 ? -0.55 : 0.5) -
        mainRing.rotation.y) *
      ease;
    mainRing.rotation.z = -0.35 + (enabled ? Math.sin(time * 0.22) * 0.18 : 0);
    orbit.position.y += ((active === 1 ? 0.8 : 0.3) - orbit.position.y) * ease;
    layers.forEach((layer, i) => {
      layer.position.y +=
        (-1.6 - i * (active === 1 ? 0.36 : 0.22) - layer.position.y) * ease;
    });
    satellites.forEach((node, i) => {
      const angle = i * 0.83 + time * (active === 2 ? 0.28 : 0.13);
      const radius = 2.03 + (i % 3) * 0.22;
      node.position.set(Math.cos(angle) * radius, Math.sin(angle) * radius, 0);
    });
    chips.forEach((chip, i) => {
      chip.position.y =
        [1.2, 0.85, -1.12][i] +
        (enabled ? Math.sin(time * 0.65 + i * 2) * 0.1 : 0);
    });
    field.rotation.z = time * 0.012;
    renderer.render(scene, camera);
    if (enabled) frame = requestAnimationFrame(render);
  };
  const request = () => {
    if (!frame && !disposed && !lost) frame = requestAnimationFrame(render);
  };
  const resize = () => {
    const { width, height } = host.getBoundingClientRect();
    if (!width || !height) return;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.position.z = camera.aspect < 1 ? 10.4 / camera.aspect : 10.4;
    camera.updateProjectionMatrix();
    request();
  };
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(host);
  const intersection = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    previous = 0;
    if (visible) request();
    else {
      cancelAnimationFrame(frame);
      frame = 0;
    }
  });
  intersection.observe(host);
  const move = (event: PointerEvent) => {
    if (event.pointerType !== "mouse" || !enabled) return;
    const box = host.getBoundingClientRect();
    pointer.x = (event.clientX - box.left) / box.width - 0.5;
    pointer.y = (event.clientY - box.top) / box.height - 0.5;
    if (drag) turn = drag.turn + (event.clientX - drag.x) * 0.007;
  };
  const down = (event: PointerEvent) => {
    if (event.pointerType !== "mouse" || event.button !== 0 || !enabled) return;
    drag = { id: event.pointerId, x: event.clientX, turn };
    host.setPointerCapture(event.pointerId);
    host.dataset.dragging = "true";
  };
  const up = () => {
    if (drag && host.hasPointerCapture(drag.id))
      host.releasePointerCapture(drag.id);
    drag = undefined;
    delete host.dataset.dragging;
  };
  const leave = () => {
    if (!drag) {
      pointer.x = 0;
      pointer.y = 0;
    }
  };
  const reset = () => {
    turn = 0;
    pointer.x = 0;
    pointer.y = 0;
    request();
  };
  const visibility = () => {
    previous = 0;
    if (!document.hidden) request();
    else {
      cancelAnimationFrame(frame);
      frame = 0;
    }
  };
  const contextLost = (event: Event) => {
    event.preventDefault();
    lost = true;
    cancelAnimationFrame(frame);
    frame = 0;
    onLost();
  };
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
      turn += (direction * Math.PI) / 6;
      request();
    },
    reset,
    dispose() {
      disposed = true;
      cancelAnimationFrame(frame);
      up();
      resizeObserver.disconnect();
      intersection.disconnect();
      host.removeEventListener("pointermove", move);
      host.removeEventListener("pointerdown", down);
      host.removeEventListener("pointerup", up);
      host.removeEventListener("pointercancel", up);
      host.removeEventListener("pointerleave", leave);
      document.removeEventListener("visibilitychange", visibility);
      renderer.domElement.removeEventListener("webglcontextlost", contextLost);
      const geometries = new Set<THREE.BufferGeometry>();
      const materials = new Set<THREE.Material>();
      scene.traverse((object) => {
        if (
          object instanceof THREE.Mesh ||
          object instanceof THREE.LineSegments ||
          object instanceof THREE.Points
        ) {
          geometries.add(object.geometry);
          (Array.isArray(object.material)
            ? object.material
            : [object.material]
          ).forEach((material) => materials.add(material));
        }
      });
      geometries.forEach((geometry) => geometry.dispose());
      materials.forEach((material) => material.dispose());
      environmentMap.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      renderer.domElement.remove();
    },
  };
}
