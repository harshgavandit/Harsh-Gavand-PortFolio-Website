import { useEffect, useRef } from "react";
import { useMotionEnabled } from "./MotionPreferences";

// A single low-resolution draw call lights the engineering grid. Content never depends on WebGL.
export default function BlueprintLight() {
  const ref = useRef<HTMLCanvasElement>(null);
  const enabled = useMotionEnabled();
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas || !enabled || matchMedia("(max-width: 767px)").matches) return;
    const gl = canvas.getContext("webgl", {
      alpha: true,
      antialias: false,
      depth: false,
      powerPreference: "low-power",
    });
    if (!gl) return;
    const vertex = gl.createShader(gl.VERTEX_SHADER)!;
    const fragment = gl.createShader(gl.FRAGMENT_SHADER)!;
    gl.shaderSource(
      vertex,
      "attribute vec2 position; varying vec2 uv; void main(){uv=position*.5+.5;gl_Position=vec4(position,0.,1.);}",
    );
    gl.shaderSource(
      fragment,
      `precision mediump float; varying vec2 uv; uniform float time; uniform vec2 pointer;
      void main(){
        vec2 p=uv; p.x+=(p.y-.5)*.13;
        vec2 cell=abs(fract(p*vec2(18.,12.))-.5);
        float grid=1.-smoothstep(.012,.035,min(cell.x,cell.y));
        float beam=exp(-pow((p.x+p.y*.35-mod(time*.07,1.8)+.4)*7.,2.));
        float lamp=exp(-length(uv-pointer)*3.5);
        float vignette=(1.-smoothstep(.1,.8,distance(uv,vec2(.55,.5))));
        float a=(grid*(.08+beam*.22)+lamp*.045)*vignette;
        gl_FragColor=vec4(vec3(.65,.59,.82)*a,a);
      }`,
    );
    gl.compileShader(vertex);
    gl.compileShader(fragment);
    const program = gl.createProgram()!;
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      gl.deleteShader(vertex);
      gl.deleteShader(fragment);
      gl.deleteProgram(program);
      return;
    }
    gl.useProgram(program);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW,
    );
    const attribute = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(attribute);
    gl.vertexAttribPointer(attribute, 2, gl.FLOAT, false, 0, 0);
    const time = gl.getUniformLocation(program, "time"),
      pointer = gl.getUniformLocation(program, "pointer");
    let frame = 0,
      last = 0,
      elapsed = 0,
      visible = true,
      lost = false;
    let cursor = [0.55, 0.5];
    const resize = new ResizeObserver(() => {
      canvas.width = Math.min(1000, Math.round(canvas.clientWidth));
      canvas.height = Math.min(700, Math.round(canvas.clientHeight));
      gl.viewport(0, 0, canvas.width, canvas.height);
    });
    resize.observe(canvas);
    function draw(now: number) {
      frame = 0;
      if (!visible || document.hidden || lost) {
        last = 0;
        return;
      }
      if (now - last >= 32) {
        elapsed += last ? Math.min(now - last, 60) / 1000 : 0;
        gl!.uniform1f(time, elapsed);
        gl!.uniform2f(pointer, cursor[0], cursor[1]);
        gl!.drawArrays(gl!.TRIANGLES, 0, 6);
        last = now;
      }
      frame = requestAnimationFrame(draw);
    }
    function schedule() {
      if (!frame && visible && !document.hidden && !lost)
        frame = requestAnimationFrame(draw);
    }
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      schedule();
    });
    observer.observe(canvas);
    const host = canvas.parentElement!;
    function move(event: PointerEvent) {
      const rect = host.getBoundingClientRect();
      cursor = [
        (event.clientX - rect.left) / rect.width,
        1 - (event.clientY - rect.top) / rect.height,
      ];
    }
    function contextLost(event: Event) {
      event.preventDefault();
      lost = true;
      canvas!.style.opacity = "0";
    }
    host.addEventListener("pointermove", move, { passive: true });
    canvas.addEventListener("webglcontextlost", contextLost);
    document.addEventListener("visibilitychange", schedule);
    schedule();
    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      observer.disconnect();
      host.removeEventListener("pointermove", move);
      canvas.removeEventListener("webglcontextlost", contextLost);
      document.removeEventListener("visibilitychange", schedule);
      gl.deleteBuffer(buffer);
      gl.deleteShader(vertex);
      gl.deleteShader(fragment);
      gl.deleteProgram(program);
      gl.clear(gl.COLOR_BUFFER_BIT);
    };
  }, [enabled]);
  return <canvas ref={ref} className="blueprint-light" aria-hidden="true" />;
}
