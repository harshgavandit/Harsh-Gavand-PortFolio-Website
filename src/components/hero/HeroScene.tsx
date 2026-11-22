/* eslint-disable @eslint-react/dom-no-unknown-property -- React Three Fiber intrinsic elements are three.js objects, not DOM nodes. */
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { heroNodes, type HeroNode } from "./heroNodes";

/*
 * Hero scene: an AI "core" with technology modules on three orbits. Data
 * packets travel between each module and the core, a particle field gives
 * depth, and a blueprint floor grounds the composition. The whole rig follows
 * the cursor and drifts with scroll. Everything is procedural: no models or
 * image textures are downloaded besides the existing logo sprite.
 */

import {
  BLUE,
  INDIGO,
  SKY,
  Environment,
  PaletteContext,
  palette,
  useChipTexture,
  useDarkTheme,
} from "../../three/shared";

const RINGS = [
  { radius: 2.35, tilt: new THREE.Euler(1.2, 0.05, 0.18), speed: 0.15 },
  { radius: 3.15, tilt: new THREE.Euler(1.32, -0.12, -0.22), speed: 0.105 },
  { radius: 3.95, tilt: new THREE.Euler(1.12, 0.1, 0.36), speed: 0.075 },
];

const pointer = { x: 0, y: 0 };

function ringPoint(ring: number, angle: number, target: THREE.Vector3) {
  const { radius, tilt } = RINGS[ring];
  target.set(Math.cos(angle) * radius, Math.sin(angle) * radius, 0);
  return target.applyEuler(tilt);
}

// ----------------------------------------------------------------- pieces --

const pulse = { value: 0 };

function Core() {
  const colors = useContext(PaletteContext);
  const shell = useRef<THREE.Mesh>(null);
  const cage = useRef<THREE.LineSegments>(null);
  const heart = useRef<THREE.Mesh>(null);
  const halo = useRef<THREE.Mesh>(null);
  const cageGeometry = useMemo(
    () => new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(1.42, 1)),
    [],
  );
  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    pulse.value = Math.max(0, pulse.value - delta * 1.8);
    const intro = Math.min(1, t / 1.6);
    const eased = 1 - Math.pow(1 - intro, 3);
    if (shell.current) {
      shell.current.rotation.y = t * 0.18;
      shell.current.rotation.x = Math.sin(t * 0.3) * 0.15;
      const s = (0.55 + eased * 0.45) * (1 + pulse.value * 0.04);
      shell.current.scale.setScalar(s);
    }
    if (cage.current) {
      cage.current.rotation.y = -t * 0.12;
      cage.current.rotation.z = t * 0.05;
      cage.current.scale.setScalar(0.6 + eased * 0.4);
    }
    if (heart.current) {
      const material = heart.current.material as THREE.MeshBasicMaterial;
      material.opacity = 0.55 + Math.sin(t * 2.2) * 0.12 + pulse.value * 0.25;
      heart.current.rotation.y = -t * 0.6;
    }
    if (halo.current) {
      const s = 1 + Math.sin(t * 1.4) * 0.04 + pulse.value * 0.08;
      halo.current.scale.setScalar(s);
    }
  });
  return (
    <group>
      <mesh ref={halo}>
        <sphereGeometry args={[1.95, 48, 48]} />
        <shaderMaterial
          transparent
          depthWrite={false}
          side={THREE.BackSide}
          uniforms={{ uColor: { value: SKY } }}
          vertexShader={`
            varying vec3 vNormal; varying vec3 vView;
            void main(){
              vec4 mv = modelViewMatrix * vec4(position,1.0);
              vNormal = normalize(normalMatrix * normal);
              vView = normalize(-mv.xyz);
              gl_Position = projectionMatrix * mv;
            }`}
          fragmentShader={`
            uniform vec3 uColor; varying vec3 vNormal; varying vec3 vView;
            void main(){
              float rim = 1.0 - abs(dot(vNormal, vView));
              float a = pow(1.0 - rim, 3.0) * 0.32;
              gl_FragColor = vec4(uColor, a);
            }`}
        />
      </mesh>
      <mesh ref={shell}>
        <icosahedronGeometry args={[1.18, 0]} />
        <meshPhysicalMaterial
          color={colors.core}
          emissive={colors.coreEmissive}
          emissiveIntensity={colors.coreGlow}
          metalness={0.15}
          roughness={0.06}
          clearcoat={1}
          clearcoatRoughness={0.05}
          iridescence={1}
          iridescenceIOR={1.35}
          envMapIntensity={1.35}
          transparent
          opacity={0.9}
          flatShading
        />
      </mesh>
      <mesh ref={heart}>
        <icosahedronGeometry args={[0.52, 1]} />
        <meshBasicMaterial color={BLUE} wireframe transparent opacity={0.6} />
      </mesh>
      <lineSegments ref={cage} geometry={cageGeometry}>
        <lineBasicMaterial color={BLUE} transparent opacity={0.22} />
      </lineSegments>
    </group>
  );
}

function Rings() {
  return (
    <group>
      {RINGS.map((ring, index) => (
        <mesh key={index} rotation={ring.tilt}>
          <torusGeometry args={[ring.radius, 0.008, 6, 220]} />
          <meshBasicMaterial
            color={index === 1 ? INDIGO : BLUE}
            transparent
            opacity={0.32 - index * 0.06}
          />
        </mesh>
      ))}
    </group>
  );
}

function Chip({
  node,
  index,
  positions,
}: {
  node: HeroNode;
  index: number;
  positions: THREE.Vector3[];
}) {
  const sprite = useRef<THREE.Sprite>(null);
  const texture = useChipTexture(node);
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const angle = node.phase + t * RINGS[node.ring].speed;
    const position = ringPoint(node.ring, angle, positions[index]);
    position.y += Math.sin(t * 0.9 + index) * 0.08;
    if (!sprite.current) return;
    sprite.current.position.copy(position);
    // Staggered entrance and depth cue: modules behind the core recede.
    const appear = THREE.MathUtils.smoothstep(
      t,
      0.5 + index * 0.12,
      1.3 + index * 0.12,
    );
    const depth = THREE.MathUtils.mapLinear(position.z, -4, 4, 0.55, 1);
    const material = sprite.current.material as THREE.SpriteMaterial;
    material.opacity = appear * THREE.MathUtils.clamp(depth, 0.45, 1);
    const scale = 0.58 * (0.85 + depth * 0.25) * (0.7 + appear * 0.3);
    sprite.current.scale.set(1.6 * scale, 0.5 * scale, 1);
    sprite.current.renderOrder = Math.round(position.z * 10) + 100;
  });
  return (
    <sprite ref={sprite}>
      <spriteMaterial map={texture} transparent depthWrite={false} />
    </sprite>
  );
}

function Links({ positions }: { positions: THREE.Vector3[] }) {
  const colors = useContext(PaletteContext);
  const count = positions.length;
  const lines = useRef<THREE.LineSegments>(null);
  const packets = useRef<THREE.InstancedMesh>(null);
  const geometry = useMemo(() => {
    const result = new THREE.BufferGeometry();
    result.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array(count * 6), 3),
    );
    return result;
  }, [count]);
  const matrix = useMemo(() => new THREE.Matrix4(), []);
  const point = useMemo(() => new THREE.Vector3(), []);
  const lastArrival = useRef<number[]>(Array(count).fill(0));
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const attribute = geometry.getAttribute(
      "position",
    ) as THREE.BufferAttribute;
    for (let i = 0; i < count; i++) {
      const p = positions[i];
      attribute.setXYZ(i * 2, p.x, p.y, p.z);
      attribute.setXYZ(i * 2 + 1, 0, 0, 0);
    }
    attribute.needsUpdate = true;
    if (lines.current) {
      const material = lines.current.material as THREE.LineBasicMaterial;
      material.opacity = 0.28 * THREE.MathUtils.smoothstep(t, 1.2, 2.4);
    }
    if (!packets.current) return;
    for (let i = 0; i < count; i++) {
      const period = 2.6 + (i % 3) * 0.55;
      const local = ((t + i * 0.73) % period) / period;
      // Odd modules send requests inward, even ones receive results.
      const progress = i % 2 ? local : 1 - local;
      point.copy(positions[i]).multiplyScalar(1 - progress);
      const visible = THREE.MathUtils.smoothstep(t, 1.8, 2.6);
      const size = visible * (0.55 + Math.sin(local * Math.PI) * 0.6);
      matrix.makeScale(size, size, size).setPosition(point);
      packets.current.setMatrixAt(i, matrix);
      if (i % 2 && local > 0.96 && t - lastArrival.current[i] > 1) {
        lastArrival.current[i] = t;
        pulse.value = Math.min(1, pulse.value + 0.6);
      }
    }
    packets.current.instanceMatrix.needsUpdate = true;
  });
  return (
    <group>
      <lineSegments ref={lines} geometry={geometry}>
        <lineBasicMaterial color={colors.line} transparent opacity={0} />
      </lineSegments>
      <instancedMesh ref={packets} args={[undefined, undefined, count]}>
        <sphereGeometry args={[0.055, 12, 12]} />
        <meshBasicMaterial color={colors.packet} />
      </instancedMesh>
    </group>
  );
}

function Particles({ count }: { count: number }) {
  const colors = useContext(PaletteContext);
  const material = useRef<THREE.ShaderMaterial>(null);
  const { gl } = useThree();
  const geometry = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const scales = new Float32Array(count);
    const tint = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const radius = 3.2 + Math.pow(Math.random(), 0.7) * 9;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta) * 1.4;
      positions[i * 3 + 1] = radius * Math.cos(phi) * 0.7;
      positions[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
      scales[i] = 0.35 + Math.random() * 0.9;
      tint[i] = Math.random();
    }
    const result = new THREE.BufferGeometry();
    result.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    result.setAttribute("aScale", new THREE.BufferAttribute(scales, 1));
    result.setAttribute("aTint", new THREE.BufferAttribute(tint, 1));
    return result;
  }, [count]);
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPixelRatio: { value: Math.min(gl.getPixelRatio(), 1.75) },
      uBlue: { value: BLUE.clone() },
      uAlpha: { value: 0.5 },
      uSky: { value: SKY },
    }),
    [gl],
  );
  useFrame((state) => {
    if (!material.current) return;
    const uniforms = material.current.uniforms;
    uniforms.uTime.value = state.clock.elapsedTime;
    uniforms.uBlue.value.copy(colors.accent);
    uniforms.uAlpha.value = colors.particleAlpha;
  });
  return (
    <points geometry={geometry}>
      <shaderMaterial
        ref={material}
        transparent
        depthWrite={false}
        uniforms={uniforms}
        vertexShader={`
          uniform float uTime; uniform float uPixelRatio;
          attribute float aScale; attribute float aTint;
          varying float vTint; varying float vFade;
          void main(){
            vec3 p = position;
            p.y += sin(uTime * 0.35 + position.x * 0.6) * 0.18;
            p.x += cos(uTime * 0.25 + position.z * 0.5) * 0.14;
            vec4 mv = modelViewMatrix * vec4(p, 1.0);
            gl_Position = projectionMatrix * mv;
            gl_PointSize = aScale * 34.0 * uPixelRatio / -mv.z;
            vTint = aTint;
            vFade = smoothstep(26.0, 8.0, -mv.z);
          }`}
        fragmentShader={`
          uniform vec3 uBlue; uniform vec3 uSky; uniform float uAlpha;
          varying float vTint; varying float vFade;
          void main(){
            float d = length(gl_PointCoord - 0.5);
            float a = smoothstep(0.5, 0.05, d);
            vec3 c = mix(uBlue, uSky, vTint);
            gl_FragColor = vec4(c, a * uAlpha * vFade);
          }`}
      />
    </points>
  );
}

function BlueprintFloor() {
  const colors = useContext(PaletteContext);
  const material = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(
    () => ({ uTime: { value: 0 }, uColor: { value: BLUE.clone() } }),
    [],
  );
  useFrame((state) => {
    if (material.current)
      material.current.uniforms.uTime.value = state.clock.elapsedTime;
    material.current?.uniforms.uColor.value.copy(colors.accent);
  });
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3.6, 0]}>
      <planeGeometry args={[60, 60, 1, 1]} />
      <shaderMaterial
        ref={material}
        transparent
        depthWrite={false}
        uniforms={uniforms}
        vertexShader={`
          varying vec2 vPos;
          void main(){
            vPos = position.xy;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }`}
        fragmentShader={`
          uniform float uTime; uniform vec3 uColor; varying vec2 vPos;
          float grid(vec2 p, float size, float width){
            vec2 g = abs(fract(p / size - 0.5) - 0.5) / fwidth(p / size);
            return 1.0 - min(min(g.x, g.y) / width, 1.0);
          }
          void main(){
            float minor = grid(vPos, 0.6, 1.0) * 0.35;
            float major = grid(vPos, 3.0, 1.2);
            float dist = length(vPos);
            float fade = smoothstep(18.0, 2.0, dist);
            float wave = smoothstep(0.9, 0.0, abs(dist - mod(uTime * 2.2, 22.0))) * 0.6;
            float a = (max(minor, major) * 0.22 + wave * 0.12) * fade;
            gl_FragColor = vec4(uColor, a);
          }`}
      />
    </mesh>
  );
}

function Rig({ compact }: { compact: boolean }) {
  const group = useRef<THREE.Group>(null);
  const { viewport, camera } = useThree();
  const positions = useMemo(() => heroNodes.map(() => new THREE.Vector3()), []);
  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    const wide = viewport.aspect > 1.15;
    const baseX = wide ? viewport.width * 0.25 : 0;
    const baseY = wide ? 0.15 : -0.9;
    const scroll = Math.min(
      1,
      window.scrollY / Math.max(1, window.innerHeight),
    );
    const k = 1 - Math.pow(0.0015, delta);
    g.position.x += (baseX - g.position.x) * k;
    g.position.y += (baseY + scroll * 2.4 - g.position.y) * k;
    g.rotation.y += (pointer.x * 0.38 + scroll * 0.6 - g.rotation.y) * k;
    g.rotation.x += (-pointer.y * 0.18 + 0.12 - g.rotation.x) * k;
    const scale = (wide ? 1 : 0.78) * (1 - scroll * 0.12);
    g.scale.setScalar(scale);
    camera.position.x += (pointer.x * 0.55 - camera.position.x) * k;
    camera.position.y += (pointer.y * 0.35 + 0.4 - camera.position.y) * k;
    camera.lookAt(baseX * 0.35, 0, 0);
    void state;
  });
  return (
    <group ref={group}>
      <Core />
      <Rings />
      <Links positions={positions} />
      {heroNodes.map((node, index) => (
        <Chip
          key={node.label}
          node={node}
          index={index}
          positions={positions}
        />
      ))}
      <Particles count={compact ? 380 : 760} />
    </group>
  );
}

function ReadySignal({ onReady }: { onReady: () => void }) {
  const frames = useRef(0);
  const done = useRef(false);
  useFrame(() => {
    if (done.current) return;
    frames.current += 1;
    if (frames.current > 3) {
      done.current = true;
      onReady();
    }
  });
  return null;
}

export function HeroScene({ onReady }: { onReady: () => void }) {
  const container = useRef<HTMLDivElement>(null);
  const dark = useDarkTheme();
  const colors = useMemo(() => palette(dark), [dark]);
  const [visible, setVisible] = useState(true);
  const compact = useMemo(
    () => window.matchMedia("(max-width: 1100px)").matches,
    [],
  );
  useEffect(() => {
    const move = (event: PointerEvent) => {
      pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.y = -((event.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", move, { passive: true });
    const observer = new IntersectionObserver(([entry]) =>
      setVisible(entry.isIntersecting),
    );
    if (container.current) observer.observe(container.current);
    return () => {
      window.removeEventListener("pointermove", move);
      observer.disconnect();
    };
  }, []);
  return (
    <div ref={container} className="hero-canvas-inner">
      <Canvas
        frameloop={visible ? "always" : "never"}
        dpr={[1, compact ? 1.25 : 1.75]}
        camera={{ position: [0, 0.4, 13], fov: 35, near: 0.1, far: 80 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.05;
        }}
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 6, 4]} intensity={1.4} />
        <pointLight position={[-3, 1, 3]} intensity={18} color="#7aa7ff" />
        <Environment />
        <PaletteContext.Provider value={colors}>
          <Rig compact={compact} />
          <BlueprintFloor />
        </PaletteContext.Provider>
        <ReadySignal onReady={onReady} />
      </Canvas>
    </div>
  );
}
