/* eslint-disable @eslint-react/dom-no-unknown-property -- React Three Fiber intrinsic elements are three.js objects, not DOM nodes. */
import { useContext, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { informaCapture } from "../data/informaPresentation";
import {
  Environment,
  PaletteContext,
  palette,
  useChipTexture,
  useDarkTheme,
} from "./shared";
import type { SceneProps } from "./LazyScene";

/*
 * Informa AI spotlight: a laptop built from primitives, showing the real
 * Reading Room capture. The lid opens as the spotlight scrolls into view, the
 * device turns with scroll and the cursor, and three glass cards trace the
 * product's pipeline (feeds → summaries → brief) around it.
 */

const scroll = { progress: 0 };

function Laptop() {
  const lid = useRef<THREE.Group>(null);
  const body = useRef<THREE.Group>(null);
  const colors = useContext(PaletteContext);
  const screen = useLoader(THREE.TextureLoader, informaCapture.src);
  useEffect(() => {
    screen.colorSpace = THREE.SRGBColorSpace;
    screen.anisotropy = 8;
    screen.needsUpdate = true;
  }, [screen]);
  const base = useMemo(
    () => new RoundedBoxGeometry(6.4, 0.22, 4.1, 4, 0.12),
    [],
  );
  const shell = useMemo(
    () => new RoundedBoxGeometry(6.4, 4.05, 0.16, 4, 0.12),
    [],
  );
  const aspect = informaCapture.width / informaCapture.height;
  const screenW = 6.0;
  const screenH = Math.min(3.65, screenW / aspect);
  const pointer = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const move = (event: PointerEvent) => {
      pointer.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (event.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, []);
  useFrame((_, delta) => {
    const k = 1 - Math.pow(0.002, delta);
    const p = scroll.progress;
    const open = THREE.MathUtils.smoothstep(p, 0.05, 0.42);
    if (lid.current)
      lid.current.rotation.x +=
        (-0.22 + (1 - open) * (Math.PI / 2 + 0.16) - lid.current.rotation.x) *
        k;
    if (body.current) {
      const turn = THREE.MathUtils.mapLinear(p, 0, 1, -0.55, 0.35);
      body.current.rotation.y +=
        (turn + pointer.current.x * 0.12 - body.current.rotation.y) * k;
      body.current.rotation.x +=
        (0.32 + pointer.current.y * 0.06 - body.current.rotation.x) * k;
      body.current.position.y +=
        (-0.9 + Math.sin(p * Math.PI) * 0.3 - body.current.position.y) * k;
    }
  });
  const metal = colors.label === "#0b1a30" ? "#8d9bb1" : "#3a475b";
  return (
    <group ref={body} position={[0, -0.9, 0]}>
      <mesh geometry={base} position={[0, 0, 0]}>
        <meshPhysicalMaterial
          color={metal}
          metalness={0.6}
          roughness={0.28}
          clearcoat={0.6}
        />
      </mesh>
      <mesh position={[0, 0.115, 0.9]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2.2, 1.2]} />
        <meshStandardMaterial color={metal} metalness={0.5} roughness={0.4} />
      </mesh>
      <group
        ref={lid}
        position={[0, 0.11, -2.0]}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <mesh geometry={shell} position={[0, 2.02, 0]}>
          <meshPhysicalMaterial
            color={metal}
            metalness={0.6}
            roughness={0.28}
            clearcoat={0.6}
          />
        </mesh>
        <mesh position={[0, 2.02, 0.085]}>
          <planeGeometry args={[6.2, 3.86]} />
          <meshBasicMaterial color="#0a0f18" />
        </mesh>
        <mesh position={[0, 2.06, 0.09]}>
          <planeGeometry args={[screenW, screenH]} />
          <meshBasicMaterial map={screen} toneMapped={false} />
        </mesh>
      </group>
    </group>
  );
}

const stages = [
  { label: "Live tech feeds", glyph: "RSS", position: [-3.7, 2.5, 0.8] },
  { label: "AI summaries", glyph: "AI", position: [3.8, 1.9, 0.8] },
  { label: "Brief in your inbox", glyph: "@", position: [3.2, -2.1, 1.6] },
] as const;

function StageCard({ index }: { index: number }) {
  const stage = stages[index];
  const node = useMemo(
    () => ({ label: stage.label, glyph: stage.glyph }),
    [stage],
  );
  const texture = useChipTexture(node);
  const sprite = useRef<THREE.Sprite>(null);
  useFrame((state) => {
    if (!sprite.current) return;
    const t = state.clock.elapsedTime;
    const appear = THREE.MathUtils.smoothstep(
      scroll.progress,
      0.18 + index * 0.08,
      0.36 + index * 0.08,
    );
    const material = sprite.current.material as THREE.SpriteMaterial;
    material.opacity = appear;
    sprite.current.position.set(
      stage.position[0],
      stage.position[1] + Math.sin(t * 0.8 + index * 1.7) * 0.12,
      stage.position[2],
    );
    const s = 0.82 + appear * 0.18;
    sprite.current.scale.set(2.2 * s, 0.69 * s, 1);
  });
  return (
    <sprite ref={sprite} renderOrder={200}>
      <spriteMaterial
        map={texture}
        transparent
        depthWrite={false}
        depthTest={false}
        opacity={0}
      />
    </sprite>
  );
}

function Flow() {
  const material = useRef<THREE.ShaderMaterial>(null);
  const geometry = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(...stages[0].position),
      new THREE.Vector3(-1.2, 2.6, -0.4),
      new THREE.Vector3(1.5, 2.4, -0.2),
      new THREE.Vector3(...stages[1].position),
      new THREE.Vector3(4.4, -0.2, 1.2),
      new THREE.Vector3(...stages[2].position),
    ]);
    return new THREE.TubeGeometry(curve, 160, 0.018, 6, false);
  }, []);
  const colors = useContext(PaletteContext);
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColor: { value: new THREE.Color() },
      uReveal: { value: 0 },
    }),
    [],
  );
  useFrame((state) => {
    if (!material.current) return;
    material.current.uniforms.uTime.value = state.clock.elapsedTime;
    material.current.uniforms.uColor.value.copy(colors.accent);
    material.current.uniforms.uReveal.value = THREE.MathUtils.smoothstep(
      scroll.progress,
      0.2,
      0.55,
    );
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
          uniform float uTime; uniform vec3 uColor; uniform float uReveal; varying vec2 vUv;
          void main(){
            float dash = step(0.45, fract(vUv.x * 28.0 - uTime * 0.9));
            float visible = step(vUv.x, uReveal);
            gl_FragColor = vec4(uColor, (0.25 + dash * 0.6) * visible);
          }`}
      />
    </mesh>
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

export function DeviceShowcase({ active, onReady }: SceneProps) {
  const dark = useDarkTheme();
  const colors = useMemo(() => palette(dark), [dark]);
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const box = root.current?.getBoundingClientRect();
      if (!box) return;
      const total = window.innerHeight + box.height;
      scroll.progress = THREE.MathUtils.clamp(
        (window.innerHeight - box.top) / total,
        0,
        1,
      );
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);
  return (
    <div ref={root} className="device-canvas">
      <Canvas
        frameloop={active ? "always" : "never"}
        dpr={[1, 1.75]}
        camera={{ position: [0, 1.6, 15], fov: 34 }}
        gl={{ antialias: true, alpha: true }}
        onCreated={({ gl, camera }) => {
          gl.setClearColor(0x000000, 0);
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          camera.lookAt(0, 0.4, 0);
        }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 8, 6]} intensity={1.6} />
        <Environment />
        <PaletteContext.Provider value={colors}>
          <Laptop />
          <Flow />
          {stages.map((stage, index) => (
            <StageCard key={stage.label} index={index} />
          ))}
        </PaletteContext.Provider>
        <Ready onReady={onReady} />
      </Canvas>
    </div>
  );
}
