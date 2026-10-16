import { useEffect, useState } from "react";
import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { Logotipo, IconoWhatsApp } from "./Marca";
import { enlaceWhatsApp, MENSAJE_GENERAL } from "../data/contenido";
import { irA, pausarScroll } from "../lib/scroll";

const LINKS = [
  { id: "servicios", texto: "Qué hacemos" },
  { id: "paquetes", texto: "Paquetes" },
  { id: "portafolio", texto: "Proyectos" },
  { id: "preguntas", texto: "Preguntas" },
  { id: "contacto", texto: "Contacto" },
];

export function Nav({ listo }: { listo: boolean }) {
  const [abierto, setAbierto] = useState(false);
  const [activo, setActivo] = useState("");
  const [pegado, setPegado] = useState(false);

  useEffect(() => {
    const f = () => setPegado(window.scrollY > 40);
    f();
    window.addEventListener("scroll", f, { passive: true });
    return () => window.removeEventListener("scroll", f);
  }, []);
  const { scrollYProgress } = useScroll();
  const progreso = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entradas) => entradas.forEach((e) => e.isIntersecting && setActivo(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" }
    );
    LINKS.forEach((l) => {
      const el = document.getElementById(l.id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    pausarScroll(abierto);
    if (!abierto) return;
    const tecla = (e: KeyboardEvent) => e.key === "Escape" && setAbierto(false);
    window.addEventListener("keydown", tecla);
    return () => window.removeEventListener("keydown", tecla);
  }, [abierto]);

  const navegar = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    setAbierto(false);
    setTimeout(() => irA(`#${id}`), abierto ? 250 : 0);
  };

  return (
    <>
      <motion.div className="progreso-scroll" style={{ scaleX: progreso }} aria-hidden="true" />
      <motion.header
        className={`nav${pegado ? " pegado" : ""}`}
        initial={{ y: -40, opacity: 0 }}
        animate={listo ? { y: 0, opacity: 1 } : {}}
        transition={{ duration: 0.9, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="nav-barra">
          <a href="#inicio" className="nav-logo" onClick={(e) => { e.preventDefault(); setAbierto(false); irA(0); }} aria-label="Tomate Desarrollo Web, ir al inicio">
            <Logotipo />
          </a>
          <nav className="nav-pill" aria-label="Principal">
            <ul className="nav-links">
              {LINKS.map((l) => (
                <li key={l.id}>
                  <a href={`#${l.id}`} onClick={(e) => navegar(e, l.id)} aria-current={activo === l.id ? "true" : undefined}>
                    {l.texto}
                  </a>
                </li>
              ))}
            </ul>
            <a className="btn-oscuro" href={enlaceWhatsApp(MENSAJE_GENERAL)} target="_blank" rel="noopener noreferrer">
              Escríbenos <ArrowUpRight />
            </a>
            <button
              className="nav-menu-btn"
              aria-label={abierto ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={abierto}
              aria-controls="menu-movil"
              onClick={() => setAbierto((a) => !a)}
            >
              {abierto ? <X /> : <Menu />}
            </button>
          </nav>
        </div>
      </motion.header>

      <AnimatePresence>
        {abierto && (
          <motion.div
            id="menu-movil"
            className="nav-movil"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ul>
              {LINKS.map((l, i) => (
                <motion.li
                  key={l.id}
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 20, opacity: 0 }}
                  transition={{ delay: 0.05 + i * 0.06, ease: [0.22, 1, 0.36, 1], duration: 0.6 }}
                >
                  <a href={`#${l.id}`} onClick={(e) => navegar(e, l.id)}>{l.texto}</a>
                </motion.li>
              ))}
            </ul>
            <motion.a
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="btn btn-primario btn-ancho"
              href={enlaceWhatsApp(MENSAJE_GENERAL)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <IconoWhatsApp /> Escríbenos por WhatsApp
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
