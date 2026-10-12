import * as THREE from "three";

export type StudioRenderer = {
  update: (enabled: boolean, active: number) => void;
  reset: () => void;
  dispose: () => void;
};

/** A small, self-contained scene: no textures, network models, postprocessing or continuous offscreen work. */
export function createStudio(
  host: HTMLElement,
  onLost: () => void,
): StudioRenderer {
  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
    powerPreference: "low-power",
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.setClearColor(0xffffff, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.25;
  host.appendChild(renderer.domElement);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
  camera.position.set(0, 1.1, 9.8);
  camera.lookAt(0, 0, 0);
  scene.add(new THREE.HemisphereLight(0xffffff, 0x6785b0, 3));
  const key = new THREE.DirectionalLight(0xffffff, 4.5);
  key.position.set(-3, 5, 5);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0x8dbdff, 3);
  rim.position.set(4, 1, -2);
  scene.add(rim);
  const assembly = new THREE.Group();
  scene.add(assembly);
  assembly.rotation.set(0.12, -0.35, -0.12);
  const blue = new THREE.MeshPhysicalMaterial({
    color: 0x3466e5,
    metalness: 0.36,
    roughness: 0.2,
    clearcoat: 1,
  });
  const white = new THREE.MeshPhysicalMaterial({
    color: 0xe4ecff,
    metalness: 0.15,
    roughness: 0.25,
    clearcoat: 0.7,
  });
  const pale = new THREE.MeshStandardMaterial({
    color: 0xa2c8ff,
    metalness: 0.2,
    roughness: 0.3,
  });
  const core = new THREE.Mesh(
    new THREE.TorusKnotGeometry(0.78, 0.245, 128, 20, 2, 3),
    blue,
  );
  core.position.y = 0.35;
  assembly.add(core);
  const rings: THREE.Mesh[] = [];
  for (let i = 0; i < 2; i++) {
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(1.65 + i * 0.32, 0.012, 6, 96),
      pale,
    );
    ring.rotation.set(1.15 + i * 0.35, i * 0.65, 0.3);
    ring.position.y = 0.15;
    assembly.add(ring);
    rings.push(ring);
  }
  const layers: THREE.Group[] = [];
  for (let i = 0; i < 3; i++) {
    const layer = new THREE.Group();
    const slab = new THREE.Mesh(
      new THREE.BoxGeometry(2.7, 0.1, 1.85),
      i === 1 ? pale : white,
    );
    layer.add(slab);
    const edges = new THREE.LineSegments(
      new THREE.EdgesGeometry(slab.geometry),
      new THREE.LineBasicMaterial({
        color: 0x91b0e4,
        transparent: true,
        opacity: 0.55,
      }),
    );
    layer.add(edges);
    for (let j = 0; j < 4; j++) {
      const bar = new THREE.Mesh(
        new THREE.BoxGeometry(0.12, 0.025, 0.55 + j * 0.12),
        i === 1 ? white : pale,
      );
      bar.position.set(-0.8 + j * 0.5, 0.065, 0);
      layer.add(bar);
    }
    layer.position.y = -1.05 - i * 0.25;
    layer.rotation.y = 0.3 + i * 0.08;
    assembly.add(layer);
    layers.push(layer);
  }
  const satellites: THREE.Mesh[] = [];
  for (let i = 0; i < 6; i++) {
    const dot = new THREE.Mesh(
      new THREE.IcosahedronGeometry(i % 2 ? 0.09 : 0.14, 1),
      i % 2 ? pale : blue,
    );
    const angle = (i / 6) * Math.PI * 2;
    dot.position.set(
      Math.cos(angle) * 2.1,
      Math.sin(angle) * 1.5 + 0.3,
      Math.sin(angle) * 0.7,
    );
    assembly.add(dot);
    satellites.push(dot);
  }
  let enabled = true,
    active = 0,
    visible = true,
    disposed = false,
    lost = false;
  let frame = 0,
    time = 0,
    previous = 0;
  const pointer = { x: 0, y: 0 };
  const targetScale = new THREE.Vector3();
  const render = (stamp: number) => {
    frame = 0;
    if (disposed || lost || !visible || document.hidden) return;
    const delta = previous ? Math.min((stamp - previous) / 1000, 0.05) : 0;
    previous = stamp;
    if (enabled) time += delta;
    const ease = enabled ? 0.055 : 1;
    assembly.rotation.y +=
      (-0.35 +
        (enabled ? pointer.x * 0.4 : 0) +
        active * 0.32 -
        assembly.rotation.y) *
      ease;
    assembly.rotation.x +=
      (0.12 + (enabled ? pointer.y * 0.16 : 0) - assembly.rotation.x) * ease;
    core.rotation.y = enabled ? time * 0.16 : 0;
    core.rotation.z = enabled ? Math.sin(time * 0.2) * 0.15 : 0;
    core.position.y = 0.4 + (enabled ? Math.sin(time * 0.8) * 0.09 : 0);
    core.scale.lerp(targetScale.setScalar(active === 2 ? 1.17 : 1), ease);
    layers.forEach((layer, i) => {
      layer.position.y +=
        (-1.05 - i * (active === 1 ? 0.47 : 0.25) - layer.position.y) * ease;
    });
    rings[0].rotation.z = 0.3 + time * 0.045;
    satellites.forEach((dot, i) => {
      dot.rotation.y = time * 0.25 + i;
    });
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
    camera.position.z = width < 350 ? 11.8 : 9.8;
    camera.updateProjectionMatrix();
    request();
  };
  const observer = new ResizeObserver(resize);
  observer.observe(host);
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
  };
  const reset = () => {
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
  host.addEventListener("pointerleave", reset);
  document.addEventListener("visibilitychange", visibility);
  renderer.domElement.addEventListener("webglcontextlost", contextLost);
  resize();
  return {
    update(motion, selection) {
      enabled = motion;
      active = selection;
      previous = 0;
      request();
    },
    reset,
    dispose() {
      disposed = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
      intersection.disconnect();
      host.removeEventListener("pointermove", move);
      host.removeEventListener("pointerleave", reset);
      document.removeEventListener("visibilitychange", visibility);
      renderer.domElement.removeEventListener("webglcontextlost", contextLost);
      const geometries = new Set<THREE.BufferGeometry>();
      const materials = new Set<THREE.Material>();
      scene.traverse((object) => {
        if (
          object instanceof THREE.Mesh ||
          object instanceof THREE.LineSegments
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
      renderer.dispose();
      renderer.forceContextLoss();
      renderer.domElement.remove();
    },
  };
}
