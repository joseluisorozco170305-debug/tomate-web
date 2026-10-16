import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ArrowUp } from "lucide-react";
import { INSTAGRAM, TERMINOS, enlaceWhatsApp, MENSAJE_GENERAL } from "../data/contenido";
import { IconoInstagram, IconoWhatsApp, Isotipo } from "../components/Marca";
import { Modal } from "../components/Modal";
import { Revelar, TituloSube } from "../components/Revelar";
import { irA } from "../lib/scroll";

export function Pie() {
  const [terminos, setTerminos] = useState(false);
  const anio = new Date().getFullYear();
  return (
    <footer className="pie">
      <div className="contenedor">
        <Revelar>
          <div className="pie-cta vidrio">
            <motion.div
              style={{ width: 72, height: 72, margin: "0 auto var(--e-4)" }}
              initial={{ y: -40, opacity: 0, rotate: -20 }}
              whileInView={{ y: 0, opacity: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 200, damping: 12, delay: 0.2 }}
            >
              <Isotipo />
            </motion.div>
            <TituloSube lineas={["Tu marca merece", "estar a un click."]} />
            <p>Empieza hoy. Desde $800 MXN con garantía de un mes.</p>
            <div className="botones">
              <button className="btn btn-primario" onClick={() => irA("#contacto")}>
                Cotizar mi página <ArrowRight className="mueve" />
              </button>
              <button className="btn btn-fantasma" onClick={() => irA("#paquetes")}>
                Ver paquetes
              </button>
            </div>
          </div>
        </Revelar>

        <div className="pie-fila">
          <span>© {anio} Tomate Desarrollo Web · Hecho en México</span>
          <div className="pie-links">
            <button onClick={() => setTerminos(true)}>Términos y condiciones</button>
            <a href="#preguntas" onClick={(e) => { e.preventDefault(); irA("#preguntas"); }}>Preguntas frecuentes</a>
          </div>
          <div className="redes">
            <a href={enlaceWhatsApp(MENSAJE_GENERAL)} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp de Tomate">
              <IconoWhatsApp />
            </a>
            <a href={INSTAGRAM} target="_blank" rel="noopener noreferrer" aria-label="Instagram de Tomate">
              <IconoInstagram />
            </a>
          </div>
        </div>
      </div>

      <Modal abierto={terminos} alCerrar={() => setTerminos(false)} titulo="Términos y condiciones">
        <p className="fecha">Última actualización: octubre de {anio}</p>
        {TERMINOS.map((t) => (
          <div key={t.t}>
            <h3>{t.t}</h3>
            <p>{t.c}</p>
          </div>
        ))}
      </Modal>
    </footer>
  );
}

/** Botón de WhatsApp siempre visible + "volver arriba" que solo aparece al subir. */
export function Flotantes() {
  const [arriba, setArriba] = useState(false);
  const [tip, setTip] = useState(false);
  const [mostrar, setMostrar] = useState(false);
  const ultimo = useRef(0);

  useEffect(() => {
    const f = () => {
      const y = window.scrollY;
      setArriba(y > 600 && y < ultimo.current);
      setMostrar(y > window.innerHeight * 0.6); // en el hero no estorba a los botones
      ultimo.current = y;
    };
    window.addEventListener("scroll", f, { passive: true });
    const t1 = window.setTimeout(() => setTip(window.scrollY > window.innerHeight * 0.6), 9000);
    const t2 = window.setTimeout(() => setTip(false), 14000);
    return () => {
      window.removeEventListener("scroll", f);
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  return (
    <div className="flotantes">
      <AnimatePresence>
        {arriba && (
          <motion.button
            className="flot flot-arriba"
            aria-label="Volver arriba"
            onClick={() => irA(0)}
            initial={{ opacity: 0, y: 16, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.8 }}
          >
            <ArrowUp />
          </motion.button>
        )}
      </AnimatePresence>
      <AnimatePresence>
      {mostrar && (
      <motion.a
        key="wa"
        className="flot flot-wa"
        href={enlaceWhatsApp(MENSAJE_GENERAL)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Escríbenos por WhatsApp"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 15 }}
        onMouseEnter={() => setTip(true)}
        onMouseLeave={() => setTip(false)}
      >
        <IconoWhatsApp />
        <AnimatePresence>
          {tip && (
            <motion.span
              className="flot-tip vidrio"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
            >
              ¿Dudas? Escríbenos 👋
            </motion.span>
          )}
        </AnimatePresence>
      </motion.a>
      )}
      </AnimatePresence>
    </div>
  );
}
