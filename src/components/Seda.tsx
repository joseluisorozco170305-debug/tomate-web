import { useEffect, useRef } from "react";
import { reduceMovimiento } from "../lib/scroll";

/**
 * Fondo de "seda líquida" en WebGL con la paleta café/crema.
 * Se dibuja a resolución reducida, se pausa fuera de pantalla y con la pestaña oculta,
 * y con movimiento reducido pinta un solo cuadro fijo. Sin WebGL queda el degradado CSS del contenedor.
 */
const VERT = `attribute vec2 p; void main(){ gl_Position = vec4(p, 0.0, 1.0); }`;

const FRAG = `
precision mediump float;
uniform vec2 uR;
uniform float uT;
uniform vec2 uM;
const vec3 C0 = vec3(0.161, 0.110, 0.055); // #291C0E
const vec3 C1 = vec3(0.431, 0.278, 0.231); // #6E473B
const vec3 C2 = vec3(0.655, 0.553, 0.471); // #A78D78
const vec3 C3 = vec3(0.745, 0.710, 0.663); // #BEB5A9
const vec3 C4 = vec3(0.882, 0.831, 0.761); // #E1D4C2

vec3 rampa(float x){
  x = clamp(x, 0.0, 1.0);
  if (x < 0.25) return mix(C0, C1, x / 0.25);
  if (x < 0.5)  return mix(C1, C2, (x - 0.25) / 0.25);
  if (x < 0.75) return mix(C2, C3, (x - 0.5) / 0.25);
  return mix(C3, C4, (x - 0.75) / 0.25);
}

void main(){
  vec2 p = (gl_FragCoord.xy - 0.5 * uR) / uR.y;
  float t = uT * 0.07;
  p += (uM - 0.5) * 0.10;
  vec2 q = p * 0.95;
  for (float i = 1.0; i < 6.0; i++) {
    q.x += 0.42 / i * sin(i * q.y * 1.1 + t * 1.7 + i * 1.3);
    q.y += 0.36 / i * cos(i * q.x * 0.9 - t * 1.3 + i * 0.7);
  }
  float v = 0.5 + 0.5 * sin(q.x * 1.2 + q.y * 0.8 + t);
  float w = 0.5 + 0.5 * sin(q.y * 1.7 - q.x * 0.6 - t * 0.8);
  float base = mix(v, w, 0.45);

  // listones de vidrio: brillos finos que recorren la seda
  float b1 = abs(sin(q.x * 1.6 - q.y * 1.1 + t * 0.5));
  float l1 = pow(1.0 - b1, 11.0) * 1.0 + pow(1.0 - b1, 2.6) * 0.22;
  float b2 = abs(sin(q.y * 2.1 + q.x * 0.4 - t * 0.4));
  float l2 = pow(1.0 - b2, 24.0) * 0.6;

  // más contraste: zonas profundas de cacao y café, luces de crema
  vec3 col = rampa(pow(base, 1.35) * 0.9 + 0.03);
  float filo = pow(1.0 - b1, 70.0) * 0.9 + pow(1.0 - b2, 90.0) * 0.5; // reflejo fino tipo vidrio
  float luz = clamp(l1 * 0.85 + l2 * 0.6 + filo, 0.0, 1.0);
  col = mix(col, C4 * 1.08, luz);
  // sombra pegada a cada listón: da el volumen de vidrio doblado
  col *= 0.55 + 0.45 * smoothstep(0.0, 0.55, b1);
  col *= mix(0.62, 1.08, smoothstep(1.35, 0.05, length(p - vec2(0.45, 0.05))));

  float g = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233)) + uT) * 43758.5453);
  col += (g - 0.5) * 0.035;
  gl_FragColor = vec4(col, 1.0);
}`;

export function Seda({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", { antialias: false, premultipliedAlpha: false, powerPreference: "low-power" });
    if (!gl) {
      canvas.style.display = "none";
      return;
    }

    const shader = (tipo: number, src: string) => {
      const s = gl.createShader(tipo)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null;
    };
    const vs = shader(gl.VERTEX_SHADER, VERT);
    const fs = shader(gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) {
      canvas.style.display = "none";
      return;
    }
    const prog = gl.createProgram()!;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uR = gl.getUniformLocation(prog, "uR");
    const uT = gl.getUniformLocation(prog, "uT");
    const uM = gl.getUniformLocation(prog, "uM");

    const movil = window.innerWidth < 700;
    // la seda es suave de por sí: se dibuja a baja resolución y el navegador la escala
    const escala = Math.min(window.devicePixelRatio || 1, 1.5) * (movil ? 0.4 : 0.5);
    const intervalo = movil ? 1000 / 30 : 1000 / 60; // en celular 30 cuadros bastan y ahorran batería
    let ultimo = 0;
    const ajustar = () => {
      const w = Math.max(1, Math.round(canvas.clientWidth * escala));
      const h = Math.max(1, Math.round(canvas.clientHeight * escala));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
      gl.uniform2f(uR, w, h);
    };

    const raton = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 };
    const mover = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      raton.tx = (e.clientX - r.left) / r.width;
      raton.ty = 1 - (e.clientY - r.top) / r.height;
    };

    const estatico = reduceMovimiento();
    let visible = true;
    let raf = 0;
    const inicio = performance.now() - 9000; // arranca en un punto bonito de la animación

    const dibujar = (ahora: number) => {
      ajustar();
      raton.x += (raton.tx - raton.x) * 0.04;
      raton.y += (raton.ty - raton.y) * 0.04;
      gl.uniform1f(uT, estatico ? 14 : (ahora - inicio) / 1000);
      gl.uniform2f(uM, raton.x, raton.y);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
    const bucle = (ahora: number) => {
      if (ahora - ultimo >= intervalo - 1) {
        ultimo = ahora;
        dibujar(ahora);
      }
      if (visible && !document.hidden) raf = requestAnimationFrame(bucle);
    };
    const reanudar = () => {
      cancelAnimationFrame(raf);
      if (!estatico && visible && !document.hidden) raf = requestAnimationFrame(bucle);
    };

    const obs = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      reanudar();
    });
    obs.observe(canvas);
    const alCambiar = () => (estatico ? dibujar(performance.now()) : reanudar());
    window.addEventListener("resize", alCambiar);
    document.addEventListener("visibilitychange", reanudar);
    if (!estatico) window.addEventListener("pointermove", mover, { passive: true });

    dibujar(performance.now());
    reanudar();

    return () => {
      cancelAnimationFrame(raf);
      obs.disconnect();
      window.removeEventListener("resize", alCambiar);
      document.removeEventListener("visibilitychange", reanudar);
      window.removeEventListener("pointermove", mover);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, []);

  return <canvas ref={ref} className={className} aria-hidden="true" />;
}
