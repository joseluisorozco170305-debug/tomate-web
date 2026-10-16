import { useEffect, useId, useRef, useState } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { Isotipo } from "./Marca";
import { reduceMovimiento } from "../lib/scroll";

/*
 * Fondo temático: piezas del mundo del desarrollo web flotando detrás del vidrio.
 * Cada pieza se mueve a su propia velocidad al hacer scroll (parallax), así cada tarjeta
 * de vidrio tiene algo que difuminar y se nota la profundidad.
 */

function useGrad() {
  const id = useId().replace(/:/g, "");
  return id;
}

function Degradados({ id }: { id: string }) {
  return (
    <defs>
      <linearGradient id={`claro${id}`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#E1D4C2" />
        <stop offset="0.55" stopColor="#BEB5A9" />
        <stop offset="1" stopColor="#A78D78" />
      </linearGradient>
      <linearGradient id={`oscuro${id}`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#A78D78" />
        <stop offset="0.6" stopColor="#6E473B" />
        <stop offset="1" stopColor="#4f3128" />
      </linearGradient>
    </defs>
  );
}

function Codigo() {
  const id = useGrad();
  return (
    <svg viewBox="0 0 200 120">
      <Degradados id={id} />
      <g fill="none" stroke={`url(#claro${id})`} strokeWidth="18" strokeLinecap="round" strokeLinejoin="round">
        <path d="M58 22 L18 60 L58 98" />
        <path d="M142 22 L182 60 L142 98" />
        <path d="M114 14 L86 106" />
      </g>
    </svg>
  );
}

function Llaves() {
  const id = useGrad();
  return (
    <svg viewBox="0 0 200 160">
      <Degradados id={id} />
      <g fill="none" stroke={`url(#oscuro${id})`} strokeWidth="16" strokeLinecap="round">
        <path d="M66 14 C 40 14, 44 46, 44 62 C 44 74, 34 80, 20 80 C 34 80, 44 86, 44 98 C 44 114, 40 146, 66 146" />
        <path d="M134 14 C 160 14, 156 46, 156 62 C 156 74, 166 80, 180 80 C 166 80, 156 86, 156 98 C 156 114, 160 146, 134 146" />
      </g>
    </svg>
  );
}

function Cursor() {
  const id = useGrad();
  return (
    <svg viewBox="0 0 120 150">
      <Degradados id={id} />
      <path d="M14 8 L14 118 L42 92 L62 138 L84 128 L64 84 L104 84 Z" fill={`url(#claro${id})`} stroke="#291C0E" strokeWidth="6" strokeLinejoin="round" />
    </svg>
  );
}

function Navegador() {
  const id = useGrad();
  return (
    <svg viewBox="0 0 320 220">
      <Degradados id={id} />
      <rect x="4" y="4" width="312" height="212" rx="22" fill={`url(#oscuro${id})`} />
      <rect x="4" y="4" width="312" height="40" rx="22" fill="#E1D4C2" opacity=".18" />
      <circle cx="30" cy="24" r="7" fill="#E1D4C2" opacity=".8" />
      <circle cx="52" cy="24" r="7" fill="#E1D4C2" opacity=".55" />
      <circle cx="74" cy="24" r="7" fill="#E1D4C2" opacity=".35" />
      <rect x="100" y="16" width="190" height="16" rx="8" fill="#291C0E" opacity=".35" />
      <rect x="26" y="62" width="268" height="66" rx="14" fill={`url(#claro${id})`} opacity=".9" />
      <rect x="26" y="142" width="82" height="56" rx="12" fill="#E1D4C2" opacity=".45" />
      <rect x="119" y="142" width="82" height="56" rx="12" fill="#E1D4C2" opacity=".3" />
      <rect x="212" y="142" width="82" height="56" rx="12" fill="#E1D4C2" opacity=".2" />
    </svg>
  );
}

function Telefono() {
  const id = useGrad();
  return (
    <svg viewBox="0 0 140 260">
      <Degradados id={id} />
      <rect x="4" y="4" width="132" height="252" rx="28" fill={`url(#claro${id})`} />
      <rect x="14" y="14" width="112" height="232" rx="20" fill="#291C0E" opacity=".82" />
      <rect x="48" y="22" width="44" height="10" rx="5" fill="#E1D4C2" opacity=".5" />
      <rect x="24" y="48" width="92" height="64" rx="12" fill={`url(#oscuro${id})`} />
      <rect x="24" y="122" width="42" height="42" rx="10" fill="#E1D4C2" opacity=".35" />
      <rect x="74" y="122" width="42" height="42" rx="10" fill="#E1D4C2" opacity=".25" />
      <rect x="24" y="174" width="92" height="12" rx="6" fill="#E1D4C2" opacity=".3" />
      <rect x="24" y="200" width="92" height="28" rx="14" fill="#E1D4C2" opacity=".85" />
    </svg>
  );
}

function Interruptor() {
  const id = useGrad();
  return (
    <svg viewBox="0 0 200 100">
      <Degradados id={id} />
      <rect x="4" y="4" width="192" height="92" rx="46" fill={`url(#oscuro${id})`} />
      <circle cx="146" cy="50" r="36" fill={`url(#claro${id})`} />
    </svg>
  );
}

/** Guiño a tu paleta: las muestras de color apiladas. */
function Muestras() {
  const colores = ["#291C0E", "#6E473B", "#A78D78", "#BEB5A9", "#E1D4C2"];
  return (
    <svg viewBox="0 0 220 240">
      {colores.map((c, i) => (
        <rect key={c} x="10" y={10 + i * 40} width="200" height="70" rx="35" fill={c} stroke="#E1D4C2" strokeOpacity=".25" strokeWidth="2" />
      ))}
    </svg>
  );
}

function Click() {
  return (
    <svg viewBox="0 0 160 160" fill="none" stroke="#E1D4C2" strokeLinecap="round">
      <circle cx="80" cy="80" r="18" strokeWidth="8" opacity=".9" />
      <circle cx="80" cy="80" r="44" strokeWidth="6" opacity=".5" />
      <circle cx="80" cy="80" r="72" strokeWidth="4" opacity=".25" />
    </svg>
  );
}

type Pieza = {
  c: React.ComponentType;
  top: string;
  lado: "left" | "right";
  pos: string;
  ancho: number;
  vel: number;    // velocidad de parallax (negativa = sube más rápido)
  giro: number;
  op?: number;
  movil?: boolean; // mostrar también en celular
};

const PIEZAS: Pieza[] = [
  { c: Codigo, top: "11%", lado: "right", pos: "4%", ancho: 300, vel: -0.18, giro: -12, movil: true },
  { c: Cursor, top: "15.5%", lado: "right", pos: "24%", ancho: 120, vel: -0.32, giro: -8, movil: true },
  { c: Navegador, top: "19%", lado: "left", pos: "34%", ancho: 360, vel: -0.1, giro: 6 },
  { c: Isotipo, top: "26%", lado: "right", pos: "12%", ancho: 260, vel: -0.26, giro: 14, movil: true },
  { c: Interruptor, top: "31%", lado: "left", pos: "2%", ancho: 200, vel: -0.14, giro: -10 },
  { c: Llaves, top: "35%", lado: "left", pos: "40%", ancho: 260, vel: -0.22, giro: 8, movil: true },
  { c: Muestras, top: "40%", lado: "right", pos: "3%", ancho: 210, vel: -0.12, giro: -14 },
  { c: Telefono, top: "46%", lado: "right", pos: "5%", ancho: 170, vel: -0.28, giro: -10, movil: true },
  { c: Navegador, top: "51%", lado: "left", pos: "30%", ancho: 380, vel: -0.16, giro: -6 },
  { c: Click, top: "57.5%", lado: "right", pos: "2%", ancho: 200, vel: -0.3, giro: 0, movil: true },
  { c: Codigo, top: "63%", lado: "left", pos: "4%", ancho: 240, vel: -0.2, giro: 10 },
  { c: Cursor, top: "66%", lado: "right", pos: "3%", ancho: 110, vel: -0.34, giro: 12, movil: true },
  { c: Isotipo, top: "73%", lado: "right", pos: "4%", ancho: 220, vel: -0.18, giro: -16, movil: true },
  { c: Interruptor, top: "79%", lado: "right", pos: "30%", ancho: 160, vel: -0.26, giro: 12 },
  { c: Telefono, top: "90%", lado: "right", pos: "3%", ancho: 160, vel: -0.14, giro: 12, movil: true },
  { c: Llaves, top: "94%", lado: "left", pos: "38%", ancho: 230, vel: -0.24, giro: -8 },
];

/*
 * Rendimiento: un solo origen de scroll para todas las piezas (sin un listener ni resorte por pieza).
 * Lenis ya suaviza el scroll, así que el transform se calcula directo y solo toca la GPU.
 */
function PiezaFlotante({ p, i, scrollY, vh }: { p: Pieza; i: number; scrollY: MotionValue<number>; vh: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [centro, setCentro] = useState(0);
  useEffect(() => {
    const medir = () => {
      const el = ref.current;
      if (el) setCentro(el.offsetTop + el.offsetHeight / 2);
    };
    medir();
    const ro = new ResizeObserver(medir);
    if (ref.current?.parentElement) ro.observe(ref.current.parentElement);
    return () => ro.disconnect();
  }, []);
  const quieto = reduceMovimiento();
  const rango = Math.abs(p.vel) * 900;
  const giro = i % 2 ? 14 : -14;
  // progreso -1..1 según qué tan lejos está la pieza del centro de la pantalla
  const avance = (v: number) => Math.max(-1, Math.min(1, (v + vh / 2 - centro) / (vh * 0.9)));
  const y = useTransform(scrollY, (v) => (quieto ? 0 : -avance(v) * rango));
  const rotate = useTransform(scrollY, (v) => (quieto ? p.giro : p.giro + avance(v) * giro));
  const C = p.c;
  return (
    <motion.div
      ref={ref}
      className={`pieza${p.movil ? "" : " solo-compu"}`}
      style={{ top: p.top, [p.lado]: p.pos, width: p.ancho, y, rotate, opacity: p.op ?? 0.6 }}
    >
      <C />
    </motion.div>
  );
}

export function FondoNicho() {
  const { scrollY } = useScroll();
  const [vh, setVh] = useState(() => (typeof window !== "undefined" ? window.innerHeight : 800));
  const [movil, setMovil] = useState(() => typeof window !== "undefined" && window.innerWidth <= 760);
  useEffect(() => {
    const f = () => {
      setVh(window.innerHeight);
      setMovil(window.innerWidth <= 760);
    };
    window.addEventListener("resize", f);
    return () => window.removeEventListener("resize", f);
  }, []);
  // en celular ni siquiera montamos las piezas que no se ven
  const piezas = movil ? PIEZAS.filter((p) => p.movil) : PIEZAS;
  return (
    <div className="fondo-nicho" aria-hidden="true">
      {piezas.map((p, i) => (
        <PiezaFlotante key={`${p.top}-${i}`} p={p} i={i} scrollY={scrollY} vh={vh} />
      ))}
    </div>
  );
}
