/* eslint-disable @eslint-react/dom-no-unknown-property -- React Three Fiber intrinsic elements are three.js objects, not DOM nodes. */
import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useChipTexture, PaletteContext, palette } from "./shared";
import type { SceneProps } from "./LazyScene";

/*
 * "Remote worldwide": a dotted, latitude/longitude globe anchored on Mumbai,
 * with live arcs to the time-zone regions listed in the availability copy
 * (UK, EU, US and APAC). It always sits on the blue contact panel, so it uses
 * a fixed light-on-blue palette in both themes.
 */

const RADIUS = 2.4;
const home = { name: "Mumbai", lat: 19.07, lon: 72.88 };
const regions = [
  { name: "London", lat: 51.5, lon: -0.13 },
  { name: "Berlin", lat: 52.52, lon: 13.4 },
  { name: "New York", lat: 40.71, lon: -74.0 },
  { name: "San Francisco", lat: 37.77, lon: -122.42 },
  { name: "Singapore", lat: 1.35, lon: 103.82 },
  { name: "Sydney", lat: -33.87, lon: 151.21 },
];

function toVector(lat: number, lon: number, radius = RADIUS) {
  const phi = THREE.MathUtils.degToRad(90 - lat);
  const theta = THREE.MathUtils.degToRad(lon + 180);
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  );
}

function Dots() {
  const geometry = useMemo(() => {
    const count = 2200;
    const positions = new Float32Array(count * 3);
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < count; i++) {
      const y = 1 - (i / (count - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      positions[i * 3] = Math.cos(golden * i) * r * RADIUS;
      positions[i * 3 + 1] = y * RADIUS;
      positions[i * 3 + 2] = Math.sin(golden * i) * r * RADIUS;
    }
    const result = new THREE.BufferGeometry();
    result.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return result;
  }, []);
  return (
    <points geometry={geometry}>
      <pointsMaterial
        color="#cfe0ff"
        size={0.028}
        sizeAttenuation
        transparent
        opacity={0.55}
        depthWrite={false}
      />
    </points>
  );
}

function Graticule() {
  const geometry = useMemo(() => {
    const points: THREE.Vector3[] = [];
    for (let lat = -60; lat <= 60; lat += 30)
      for (let lon = -180; lon < 180; lon += 4) {
        points.push(toVector(lat, lon, RADIUS * 1.001));
        points.push(toVector(lat, lon + 4, RADIUS * 1.001));
      }
    for (let lon = -180; lon < 180; lon += 30)
      for (let lat = -88; lat < 88; lat += 4) {
        points.push(toVector(lat, lon, RADIUS * 1.001));
        points.push(toVector(lat + 4, lon, RADIUS * 1.001));
      }
    return new THREE.BufferGeometry().setFromPoints(points);
  }, []);
  return (
    <lineSegments geometry={geometry}>
      <lineBasicMaterial color="#9fc1ff" transparent opacity={0.16} />
    </lineSegments>
  );
}

function Arc({ target, index }: { target: THREE.Vector3; index: number }) {
  const material = useRef<THREE.ShaderMaterial>(null);
  const geometry = useMemo(() => {
    const start = toVector(home.lat, home.lon);
    const mid = start.clone().add(target).multiplyScalar(0.5);
    const lift = 1 + start.distanceTo(target) / (RADIUS * 2.4);
    mid.normalize().multiplyScalar(RADIUS * lift);
    const curve = new THREE.QuadraticBezierCurve3(start, mid, target);
    return new THREE.TubeGeometry(curve, 64, 0.012, 5, false);
  }, [target]);
  const uniforms = useMemo(
    () => ({ uTime: { value: 0 }, uOffset: { value: index * 0.37 } }),
    [index],
  );
  useFrame((state) => {
    if (material.current)
      material.current.uniforms.uTime.value = state.clock.elapsedTime;
  });
  return (
    <mesh geometry={geometry}>
      <shaderMaterial
        ref={material}
        transparent
        depthWrite={false}
        uniforms={uniforms}
        vertexShader={`
          varying vec2 vUv;
          void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`}
        fragmentShader={`
          uniform float uTime; uniform float uOffset; varying vec2 vUv;
          void main(){
            float head = fract(uTime * 0.35 + uOffset);
            float d = head - vUv.x;
            float trail = d >= 0.0 ? smoothstep(0.35, 0.0, d) : 0.0;
            float base = 0.18;
            vec3 color = mix(vec3(0.62,0.78,1.0), vec3(1.0), trail);
            gl_FragColor = vec4(color, base + trail * 0.8);
          }`}
      />
    </mesh>
  );
}

function Marker({
  position,
  primary,
}: {
  position: THREE.Vector3;
  primary?: boolean;
}) {
  const ring = useRef<THREE.Mesh>(null);
  const quaternion = useMemo(
    () =>
      new THREE.Quaternion().setFromUnitVectors(
        new THREE.Vector3(0, 0, 1),
        position.clone().normalize(),
      ),
    [position],
  );
  useFrame((state) => {
    if (!ring.current) return;
    const t = (state.clock.elapsedTime * 0.8 + (primary ? 0 : position.x)) % 1;
    ring.current.scale.setScalar(1 + t * (primary ? 2.6 : 1.6));
    (ring.current.material as THREE.MeshBasicMaterial).opacity = (1 - t) * 0.6;
  });
  return (
    <group position={position} quaternion={quaternion}>
      <mesh>
        <circleGeometry args={[primary ? 0.07 : 0.045, 20]} />
        <meshBasicMaterial color={primary ? "#ffffff" : "#bcd3ff"} />
      </mesh>
      <mesh ref={ring}>
        <ringGeometry args={[0.07, 0.085, 32]} />
        <meshBasicMaterial color="#ffffff" transparent depthWrite={false} />
      </mesh>
    </group>
  );
}

function HomeLabel({ position }: { position: THREE.Vector3 }) {
  const node = useMemo(() => ({ label: "Mumbai · UTC+5:30", glyph: "HG" }), []);
  const texture = useChipTexture(node);
  const labelPosition = useMemo(
    () =>
      position
        .clone()
        .normalize()
        .multiplyScalar(RADIUS * 1.2)
        .add(new THREE.Vector3(0, 0.35, 0)),
    [position],
  );
  return (
    <sprite position={labelPosition} scale={[1.45, 0.45, 1]} renderOrder={10}>
      <spriteMaterial map={texture} transparent depthTest={false} />
    </sprite>
  );
}

function Globe() {
  const group = useRef<THREE.Group>(null);
  const homePoint = useMemo(() => toVector(home.lat, home.lon), []);
  const targets = useMemo(() => regions.map((r) => toVector(r.lat, r.lon)), []);
  const pointer = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const move = (event: PointerEvent) => {
      pointer.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (event.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, []);
  // Face Mumbai toward the camera, then drift gently around it.
  const baseY = useMemo(
    () => -THREE.MathUtils.degToRad(home.lon + 90) + 0.75,
    [],
  );
  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    const k = 1 - Math.pow(0.004, delta);
    const drift = Math.sin(state.clock.elapsedTime * 0.12) * 0.5;
    g.rotation.y +=
      (baseY + drift + pointer.current.x * 0.35 - g.rotation.y) * k;
    g.rotation.x += (0.28 + pointer.current.y * 0.12 - g.rotation.x) * k;
  });
  return (
    <group ref={group}>
      <mesh>
        <sphereGeometry args={[RADIUS * 0.985, 64, 64]} />
        <meshBasicMaterial color="#0c2a78" transparent opacity={0.55} />
      </mesh>
      <Dots />
      <Graticule />
      {targets.map((target, index) => (
        <Arc key={regions[index].name} target={target} index={index} />
      ))}
      {targets.map((target, index) => (
        <Marker key={regions[index].name} position={target} />
      ))}
      <Marker position={homePoint} primary />
      <HomeLabel position={homePoint} />
    </group>
  );
}

function Ready({ onReady }: { onReady: () => void }) {
  const done = useRef(false);
  useFrame(() => {
    if (done.current) return;
    done.current = true;
    requestAnimationFrame(onReady);
  });
  return null;
}

export function RemoteGlobe({ active, onReady }: SceneProps) {
  // Chip textures use the dark palette: light text on deep glass reads well
  // on the blue panel in both themes.
  const colors = useMemo(() => palette(true), []);
  return (
    <div className="globe-canvas">
      <Canvas
        frameloop={active ? "always" : "never"}
        dpr={[1, 1.75]}
        camera={{ position: [0, 0, 9], fov: 40 }}
        gl={{ antialias: true, alpha: true }}
        onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
      >
        <PaletteContext.Provider value={colors}>
          <Globe />
        </PaletteContext.Provider>
        <Ready onReady={onReady} />
      </Canvas>
    </div>
  );
}
