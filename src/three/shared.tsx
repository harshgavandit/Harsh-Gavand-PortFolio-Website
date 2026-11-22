/* eslint-disable react-refresh/only-export-components -- shared WebGL helpers module, not a page component. */
// Shared building blocks for every WebGL scene on the site: theme palette,
// logo-chip textures drawn from the existing SVG sprite, and lighting.
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

export const BLUE = new THREE.Color("#1d5bd8");
export const SKY = new THREE.Color("#38bdf8");
export const INDIGO = new THREE.Color("#6366f1");

export type ChipNode = { label: string; brand?: string; glyph?: string };

// Follows the site's light/dark toggle (html[data-theme]).
export function useDarkTheme() {
  const read = () => document.documentElement.dataset.theme === "dark";
  const [dark, setDark] = useState(read);
  useEffect(() => {
    const observer = new MutationObserver(() => setDark(read()));
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    return () => observer.disconnect();
  }, []);
  return dark;
}

export const palette = (dark: boolean) =>
  dark
    ? {
        chipTop: "rgba(26,39,60,0.96)",
        chipBottom: "rgba(16,25,40,0.94)",
        chipStroke: "rgba(125,165,255,0.4)",
        chipShadow: "rgba(0,0,0,0.45)",
        wellTop: "#22375a",
        wellBottom: "#1a2b47",
        glyph: "#9dbdff",
        label: "#ecf2fb",
        logo: "#9dbdff",
        core: "#7fa4f0",
        coreEmissive: "#2b5fd0",
        coreGlow: 0.42,
        line: "#6f9cff",
        packet: "#9dbdff",
        accent: new THREE.Color("#7aa7ff"),
        particleAlpha: 0.75,
      }
    : {
        chipTop: "rgba(255,255,255,0.97)",
        chipBottom: "rgba(236,243,255,0.94)",
        chipStroke: "rgba(29,91,216,0.28)",
        chipShadow: "rgba(29,70,150,0.22)",
        wellTop: "#e8f0ff",
        wellBottom: "#d6e4ff",
        glyph: "#1d5bd8",
        label: "#0b1a30",
        logo: "#1d5bd8",
        core: "#8aaef5",
        coreEmissive: "#1d5bd8",
        coreGlow: 0.3,
        line: "#5b8fe0",
        packet: "#2f6df0",
        accent: BLUE,
        particleAlpha: 0.5,
      };
export type Palette = ReturnType<typeof palette>;
export const PaletteContext = createContext<Palette>(palette(false));
// ---------------------------------------------------------------- textures --

let spritePromise: Promise<Document | null> | undefined;
export function loadLogoSprite() {
  spritePromise ??= fetch("/stack/technology-logos.svg")
    .then((response) => (response.ok ? response.text() : ""))
    .then((text) =>
      text ? new DOMParser().parseFromString(text, "image/svg+xml") : null,
    )
    .catch(() => null);
  return spritePromise;
}

export async function logoImage(brand: string, color: string) {
  const sprite = await loadLogoSprite();
  const symbol = sprite?.getElementById(brand);
  if (!symbol) return null;
  const viewBox = symbol.getAttribute("viewBox") || "0 0 24 24";
  const markup = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" width="96" height="96" fill="${color}">${symbol.innerHTML.replaceAll("currentColor", color)}</svg>`;
  const image = new Image();
  image.decoding = "async";
  image.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(markup);
  await image.decode().catch(() => undefined);
  return image.complete && image.naturalWidth ? image : null;
}

function roundedRect(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) {
  context.beginPath();
  context.roundRect(x, y, width, height, radius);
}

export function drawChip(
  canvas: HTMLCanvasElement,
  node: ChipNode,
  logo: HTMLImageElement | null,
  colors: Palette,
) {
  const context = canvas.getContext("2d")!;
  const { width, height } = canvas;
  context.clearRect(0, 0, width, height);
  const pad = 14;
  // Soft shadow + glass body.
  context.save();
  context.shadowColor = colors.chipShadow;
  context.shadowBlur = 26;
  context.shadowOffsetY = 8;
  roundedRect(context, pad, pad, width - pad * 2, height - pad * 2, 40);
  const fill = context.createLinearGradient(0, 0, 0, height);
  fill.addColorStop(0, colors.chipTop);
  fill.addColorStop(1, colors.chipBottom);
  context.fillStyle = fill;
  context.fill();
  context.restore();
  roundedRect(context, pad, pad, width - pad * 2, height - pad * 2, 40);
  context.lineWidth = 3;
  context.strokeStyle = colors.chipStroke;
  context.stroke();
  // Icon well.
  const well = height - pad * 2 - 28;
  const wellX = pad + 16;
  const wellY = pad + 14;
  roundedRect(context, wellX, wellY, well, well, 26);
  const wellFill = context.createLinearGradient(
    wellX,
    wellY,
    wellX + well,
    wellY + well,
  );
  wellFill.addColorStop(0, colors.wellTop);
  wellFill.addColorStop(1, colors.wellBottom);
  context.fillStyle = wellFill;
  context.fill();
  if (logo) {
    const size = well * 0.62;
    context.drawImage(
      logo,
      wellX + (well - size) / 2,
      wellY + (well - size) / 2,
      size,
      size,
    );
  } else {
    context.fillStyle = colors.glyph;
    context.font = `700 ${node.glyph && node.glyph.length > 2 ? 30 : 40}px "Space Grotesk Variable", "Inter Variable", sans-serif`;
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText(
      node.glyph || node.label[0],
      wellX + well / 2,
      wellY + well / 2 + 2,
    );
  }
  context.fillStyle = colors.label;
  // Shrink long labels so they always fit inside the chip.
  const textX = wellX + well + 24;
  const room = width - pad - 26 - textX;
  let size = 46;
  context.font = `600 ${size}px "Inter Variable", sans-serif`;
  while (size > 26 && context.measureText(node.label).width > room) {
    size -= 2;
    context.font = `600 ${size}px "Inter Variable", sans-serif`;
  }
  context.textAlign = "left";
  context.textBaseline = "middle";
  context.fillText(node.label, textX, height / 2 + 2);
}

export function useChipTexture(node: ChipNode) {
  const colors = useContext(PaletteContext);
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 480;
    canvas.height = 150;
    const result = new THREE.CanvasTexture(canvas);
    result.colorSpace = THREE.SRGBColorSpace;
    result.anisotropy = 4;
    return result;
  }, []);
  useEffect(() => () => texture.dispose(), [texture]);
  useEffect(() => {
    let cancelled = false;
    const redraw = (logo: HTMLImageElement | null) => {
      if (cancelled) return;
      drawChip(texture.image as HTMLCanvasElement, node, logo, colors);
      texture.needsUpdate = true;
    };
    redraw(null);
    // Fonts and logos may finish loading after the first draw.
    void document.fonts?.ready.then(() =>
      node.brand
        ? logoImage(node.brand, colors.logo).then(redraw)
        : redraw(null),
    );
    return () => {
      cancelled = true;
    };
  }, [node, texture, colors]);
  return texture;
}

export function Environment() {
  const { gl, scene } = useThree();
  useEffect(() => {
    const generator = new THREE.PMREMGenerator(gl);
    const room = new RoomEnvironment();
    const target = generator.fromScene(room, 0.04);
    scene.environment = target.texture;
    return () => {
      scene.environment = null;
      target.dispose();
      generator.dispose();
      room.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          (object.material as THREE.Material).dispose();
        }
      });
    };
  }, [gl, scene]);
  return null;
}
