/* eslint-disable @eslint-react/dom-no-unknown-property -- React Three Fiber intrinsic elements are three.js objects, not DOM nodes. */
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, type ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";
import { resumeStackGroups } from "../data/heroStack";
import {
  PaletteContext,
  palette,
  useChipTexture,
  useDarkTheme,
  type ChipNode,
} from "./shared";
import { stackFocus } from "./stackFocus";
import type { SceneProps } from "./LazyScene";

/*
 * Every technology from the categorised stack, placed on a Fibonacci sphere.
 * Categories occupy neighbouring bands so each group reads as a region. Drag
 * to spin; click a technology to highlight its category (synced with the
 * filter buttons beside it).
 */

type Star = ChipNode & { group: string; position: THREE.Vector3 };

const glyphFor = (name: string) =>
  name
    .split(/[\s/]+/)
    .map((word) => word[0])
    .join("")
    .slice(0, 3)
    .toUpperCase();

function buildStars(): Star[] {
  const items = resumeStackGroups.flatMap((group) =>
    group.items.map((item) => ({
      label: item.name,
      brand: item.brand,
      glyph: item.brand ? undefined : glyphFor(item.name),
      group: group.id,
    })),
  );
  const count = items.length;
  const golden = Math.PI * (3 - Math.sqrt(5));
  return items.map((item, index) => {
    const y = 1 - (index / (count - 1)) * 2;
    const radius = Math.sqrt(1 - y * y);
    const theta = golden * index;
    return {
      ...item,
      position: new THREE.Vector3(
        Math.cos(theta) * radius,
        y,
        Math.sin(theta) * radius,
      ).multiplyScalar(3.1),
    };
  });
}

const drag = { active: false, x: 0, y: 0, vx: 0, vy: 0 };

function StarSprite({ star }: { star: Star }) {
  const sprite = useRef<THREE.Sprite>(null);
  const texture = useChipTexture(star);
  const [hovered, setHovered] = useState(false);
  const world = useMemo(() => new THREE.Vector3(), []);
  useFrame(() => {
    const object = sprite.current;
    if (!object) return;
    object.getWorldPosition(world);
    const focus = stackFocus.get();
    const inFocus = !focus || focus === star.group;
    const depth = THREE.MathUtils.mapLinear(world.z, -3.1, 3.1, 0.35, 1);
    const material = object.material as THREE.SpriteMaterial;
    const targetOpacity = (inFocus ? 1 : 0.14) * depth;
    material.opacity += (targetOpacity - material.opacity) * 0.15;
    const scale =
      (hovered ? 1.25 : inFocus && focus ? 1.08 : 1) * (0.7 + depth * 0.35);
    const current = object.scale.x / 1.12;
    const next = current + (scale - current) * 0.18;
    object.scale.set(1.12 * next, 0.35 * next, 1);
    object.renderOrder = Math.round(world.z * 10) + 100;
  });
  return (
    <sprite
      ref={sprite}
      position={star.position}
      onPointerOver={(event: ThreeEvent<PointerEvent>) => {
        event.stopPropagation();
        setHovered(true);
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = "";
      }}
      onClick={(event: ThreeEvent<MouseEvent>) => {
        event.stopPropagation();
        stackFocus.set(stackFocus.get() === star.group ? null : star.group);
      }}
    >
      <spriteMaterial
        map={texture}
        transparent
        depthWrite={false}
        opacity={0}
      />
    </sprite>
  );
}

function Lattice() {
  const geometry = useMemo(
    () => new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(2.2, 2)),
    [],
  );
  const colors = useContext(PaletteContext);
  return (
    <group>
      <lineSegments geometry={geometry}>
        <lineBasicMaterial color={colors.line} transparent opacity={0.16} />
      </lineSegments>
      <mesh>
        <sphereGeometry args={[1.05, 48, 48]} />
        <meshPhysicalMaterial
          color={colors.core}
          emissive={colors.coreEmissive}
          emissiveIntensity={colors.coreGlow}
          roughness={0.15}
          clearcoat={1}
          transparent
          opacity={0.85}
        />
      </mesh>
    </group>
  );
}

function Sphere() {
  const group = useRef<THREE.Group>(null);
  const stars = useMemo(buildStars, []);
  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    if (!drag.active) {
      drag.vx += (0.12 - drag.vx) * Math.min(1, delta * 1.5);
      drag.vy *= 0.94;
    }
    g.rotation.y += drag.vx * delta;
    g.rotation.x = THREE.MathUtils.clamp(
      g.rotation.x + drag.vy * delta,
      -0.6,
      0.6,
    );
    const intro = THREE.MathUtils.smoothstep(state.clock.elapsedTime, 0, 1.4);
    g.scale.setScalar(0.75 + intro * 0.25);
  });
  return (
    <group ref={group}>
      <Lattice />
      {stars.map((star) => (
        <StarSprite key={star.label} star={star} />
      ))}
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

export function TechConstellation({ active, onReady }: SceneProps) {
  const dark = useDarkTheme();
  const colors = useMemo(() => palette(dark), [dark]);
  const [, rerender] = useState(0);
  useEffect(() => stackFocus.subscribe(() => rerender((n) => n + 1)), []);
  return (
    <div
      className="constellation-canvas"
      onPointerDown={(event) => {
        drag.active = true;
        drag.x = event.clientX;
        drag.y = event.clientY;
        (event.target as Element).setPointerCapture?.(event.pointerId);
      }}
      onPointerMove={(event) => {
        if (!drag.active) return;
        drag.vx = (event.clientX - drag.x) * 0.25;
        drag.vy = (event.clientY - drag.y) * 0.15;
        drag.x = event.clientX;
        drag.y = event.clientY;
      }}
      onPointerUp={() => {
        drag.active = false;
      }}
      onPointerLeave={() => {
        drag.active = false;
      }}
    >
      <Canvas
        frameloop={active ? "always" : "never"}
        dpr={[1, 1.6]}
        camera={{ position: [0, 0, 10.4], fov: 38 }}
        gl={{ antialias: true, alpha: true }}
        onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
      >
        <ambientLight intensity={0.8} />
        <directionalLight position={[4, 5, 6]} intensity={1.3} />
        <pointLight position={[-4, -2, 4]} intensity={14} color="#7aa7ff" />
        <PaletteContext.Provider value={colors}>
          <Sphere />
        </PaletteContext.Provider>
        <Ready onReady={onReady} />
      </Canvas>
    </div>
  );
}
