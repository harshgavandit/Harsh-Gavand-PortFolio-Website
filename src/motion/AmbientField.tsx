import { useEffect, useRef } from "react";
import { useMotionEnabled } from "../components/MotionPreferences";

/*
 * Page-wide ambient light field: one full-screen WebGL quad running a
 * domain-warped noise shader. It drifts slowly, shifts as the visitor scrolls
 * through the chapters and brightens around the cursor. Raw WebGL (no
 * three.js) keeps it under 3 KB; it renders at reduced resolution, is capped
 * at 30 fps, pauses in background tabs, and never loads for reduced motion,
 * reduced data, small screens or browsers without WebGL.
 */

const vertex = `#version 300 es
in vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }`;

const fragment = `#version 300 es
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform vec2 uMouse;
uniform float uScroll;
uniform float uDark;
out vec4 outColor;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x),
             mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
}
float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 5; i++) { v += a * noise(p); p = p * 2.03 + 17.0; a *= 0.5; }
  return v;
}

void main() {
  vec2 uv = gl_FragCoord.xy / uRes;
  float aspect = uRes.x / uRes.y;
  vec2 p = (uv - 0.5) * vec2(aspect, 1.0);
  float t = uTime * 0.035;
  vec2 drift = vec2(0.0, uScroll * 2.2);
  vec2 q = vec2(fbm(p * 1.3 + drift + t), fbm(p * 1.3 + drift + vec2(5.2, 1.3) - t));
  vec2 r = vec2(fbm(p * 1.6 + 2.2 * q + vec2(1.7, 9.2) + t * 1.4),
                fbm(p * 1.6 + 2.2 * q + vec2(8.3, 2.8) - t));
  float f = fbm(p * 1.4 + 2.6 * r + drift);

  vec2 m = (uMouse - 0.5) * vec2(aspect, 1.0);
  float glow = exp(-length(p - m) * 3.2);

  // Light: near-white paper with blue, sky and indigo currents.
  vec3 baseL = vec3(0.965, 0.976, 0.992);
  vec3 blueL = vec3(0.70, 0.80, 0.98);
  vec3 skyL = vec3(0.72, 0.90, 0.99);
  vec3 indL = vec3(0.80, 0.78, 0.99);
  // Dark: deep navy with luminous currents.
  vec3 baseD = vec3(0.043, 0.067, 0.106);
  vec3 blueD = vec3(0.10, 0.22, 0.52);
  vec3 skyD = vec3(0.05, 0.28, 0.45);
  vec3 indD = vec3(0.22, 0.16, 0.50);

  vec3 base = mix(baseL, baseD, uDark);
  vec3 c = mix(mix(blueL, blueD, uDark), mix(skyL, skyD, uDark), clamp(q.x * 1.6 - 0.3, 0.0, 1.0));
  c = mix(c, mix(indL, indD, uDark), clamp(r.y * 1.4 - 0.45 + uScroll * 0.4, 0.0, 1.0));
  float strength = smoothstep(0.35, 0.95, f) * mix(0.55, 0.75, uDark);
  vec3 color = mix(base, c, strength);
  color += mix(vec3(0.10, 0.16, 0.30), vec3(0.08, 0.16, 0.38), uDark) * glow * 0.35;

  // Fine dither avoids banding in the soft gradients.
  color += (hash(gl_FragCoord.xy + uTime) - 0.5) / 255.0;
  outColor = vec4(color, 1.0);
}`;

function compile(gl: WebGL2RenderingContext, type: number, source: string) {
  const shader = gl.createShader(type)!;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  return gl.getShaderParameter(shader, gl.COMPILE_STATUS) ? shader : null;
}

export function AmbientField() {
  const motion = useMotionEnabled();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !motion) return;
    const connection = (
      navigator as Navigator & { connection?: { saveData?: boolean } }
    ).connection;
    if (
      connection?.saveData ||
      !window.matchMedia("(min-width: 768px)").matches
    )
      return;
    const gl = canvas.getContext("webgl2", {
      antialias: false,
      alpha: false,
      powerPreference: "low-power",
    });
    if (!gl) return;
    const vs = compile(gl, gl.VERTEX_SHADER, vertex);
    const fs = compile(gl, gl.FRAGMENT_SHADER, fragment);
    if (!vs || !fs) return;
    const program = gl.createProgram()!;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
    gl.useProgram(program);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW,
    );
    const position = gl.getAttribLocation(program, "aPos");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
    const u = (name: string) => gl.getUniformLocation(program, name);
    const uRes = u("uRes"),
      uTime = u("uTime"),
      uMouse = u("uMouse"),
      uScroll = u("uScroll"),
      uDark = u("uDark");

    const scale = Math.min(1, window.devicePixelRatio) * 0.5;
    const resize = () => {
      canvas.width = Math.max(1, Math.round(window.innerWidth * scale));
      canvas.height = Math.max(1, Math.round(window.innerHeight * scale));
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();

    const mouse = { x: 0.7, y: 0.6, tx: 0.7, ty: 0.6 };
    const move = (event: PointerEvent) => {
      mouse.tx = event.clientX / window.innerWidth;
      mouse.ty = 1 - event.clientY / window.innerHeight;
    };
    let dark = document.documentElement.dataset.theme === "dark" ? 1 : 0;
    let darkTarget = dark;
    const themeObserver = new MutationObserver(() => {
      darkTarget = document.documentElement.dataset.theme === "dark" ? 1 : 0;
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    let frame = 0;
    let last = 0;
    let scroll = 0;
    const start = performance.now();
    const render = (now: number) => {
      frame = requestAnimationFrame(render);
      if (now - last < 33) return; // ~30 fps is plenty for a slow field
      last = now;
      mouse.x += (mouse.tx - mouse.x) * 0.06;
      mouse.y += (mouse.ty - mouse.y) * 0.06;
      dark += (darkTarget - dark) * 0.12;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const target = max > 0 ? window.scrollY / max : 0;
      scroll += (target - scroll) * 0.08;
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, (now - start) / 1000);
      gl.uniform2f(uMouse, mouse.x, mouse.y);
      gl.uniform1f(uScroll, scroll);
      gl.uniform1f(uDark, dark);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      if (!canvas.classList.contains("is-live"))
        canvas.classList.add("is-live");
    };
    const visibility = () => {
      cancelAnimationFrame(frame);
      if (!document.hidden) frame = requestAnimationFrame(render);
    };
    frame = requestAnimationFrame(render);
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("visibilitychange", visibility);
    return () => {
      cancelAnimationFrame(frame);
      themeObserver.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", move);
      document.removeEventListener("visibilitychange", visibility);
      canvas.classList.remove("is-live");
    };
  }, [motion]);
  return (
    <canvas ref={canvasRef} className="ambient-field" aria-hidden="true" />
  );
}
