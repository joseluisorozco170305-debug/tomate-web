import Lenis from "lenis";

let lenis: Lenis | null = null;

export const reduceMovimiento = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function iniciarScroll() {
  if (reduceMovimiento()) return;
  lenis = new Lenis({ duration: 1.15, smoothWheel: true });
  const raf = (t: number) => {
    lenis?.raf(t);
    requestAnimationFrame(raf);
  };
  requestAnimationFrame(raf);
}

export function irA(destino: string | number) {
  if (lenis) {
    lenis.scrollTo(destino as string | number, { offset: typeof destino === "string" ? -88 : 0 });
    return;
  }
  if (typeof destino === "number") {
    window.scrollTo({ top: destino, behavior: reduceMovimiento() ? "auto" : "smooth" });
  } else {
    document.querySelector(destino)?.scrollIntoView({ behavior: reduceMovimiento() ? "auto" : "smooth" });
  }
}

export function pausarScroll(pausa: boolean) {
  if (pausa) lenis?.stop();
  else lenis?.start();
  document.documentElement.style.overflow = pausa ? "hidden" : "";
}
