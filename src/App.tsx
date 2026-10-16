import { useCallback, useEffect, useState } from "react";
import { Nav } from "./components/Nav";
import { Hero } from "./sections/Hero";
import { Banda, Servicios } from "./sections/Servicios";
import { Paquetes } from "./sections/Paquetes";
import { Portafolio } from "./sections/Portafolio";
import { CtaBanda, Proceso } from "./sections/Proceso";
import { Preguntas } from "./sections/Preguntas";
import { Contacto } from "./sections/Contacto";
import { Flotantes, Pie } from "./sections/Pie";
import { irA } from "./lib/scroll";
import { FondoNicho } from "./components/FondoNicho";

function Fondo() {
  return (
    <div className="fondo" aria-hidden="true">
      <span className="orbe o1" />
      <span className="orbe o2" />
      <span className="orbe o3" />
      <span className="orbe o4" />
      <span className="rejilla" />
      <span className="grano" />
    </div>
  );
}

export default function App() {
  const [listo, setListo] = useState(false);
  const [eleccion, setEleccion] = useState({ id: "", v: 0 });
  const [fondoListo, setFondoListo] = useState(false);

  // El fondo temático se monta cuando el navegador está libre, para que la carga inicial sea instantánea.
  useEffect(() => {
    if (!listo) return;
    const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number };
    if (w.requestIdleCallback) w.requestIdleCallback(() => setFondoListo(true), { timeout: 1500 });
    else setTimeout(() => setFondoListo(true), 600);
  }, [listo]);

  // Quita la pantalla de carga cuando las fuentes estén listas (máximo 1.6 s).
  useEffect(() => {
    const splash = document.getElementById("splash");
    let hecho = false;
    const quitar = () => {
      if (hecho) return;
      hecho = true;
      splash?.classList.add("fuera");
      setTimeout(() => splash?.remove(), 700);
      setListo(true);
    };
    const minimo = new Promise((r) => setTimeout(r, 700));
    Promise.all([document.fonts?.ready ?? Promise.resolve(), minimo]).then(quitar);
    const t = setTimeout(quitar, 1600);
    return () => clearTimeout(t);
  }, []);

  const elegirPaquete = useCallback((id: string) => {
    setEleccion((e) => ({ id, v: e.v + 1 }));
    irA("#contacto");
  }, []);

  return (
    <>
      <a href="#contenido" className="salto">Saltar al contenido</a>
      <Fondo />
      <Nav listo={listo} />
      <div className="capa">
      {fondoListo && <FondoNicho />}
      <main id="contenido">
        <Hero listo={listo} />
        <Banda />
        <Servicios />
        <Paquetes alElegir={elegirPaquete} />
        <Portafolio />
        <Proceso />
        <CtaBanda />
        <Preguntas />
        <Contacto paqueteElegido={eleccion.id} version={eleccion.v} />
      </main>
      <Pie />
      </div>
      <Flotantes />
    </>
  );
}
