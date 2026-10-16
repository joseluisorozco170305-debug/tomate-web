import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import { PREGUNTAS, enlaceWhatsApp } from "../data/contenido";
import { Revelar, TituloSube } from "../components/Revelar";
import { IconoWhatsApp } from "../components/Marca";

export function Preguntas() {
  const [abierta, setAbierta] = useState<number | null>(0);
  return (
    <section className="seccion" id="preguntas" aria-labelledby="faq-titulo">
      <div className="contenedor faq-grid">
        <div className="cabecera faq-cabecera">
          <TituloSube id="faq-titulo" lineas={["Preguntas", "frecuentes."]} />
          <Revelar retraso={0.15}>
            <p>Lo que casi todos nos preguntan antes de empezar. ¿Te quedó alguna duda?</p>
            <a
              className="btn btn-fantasma"
              style={{ marginTop: "var(--e-4)" }}
              href={enlaceWhatsApp("Hola Tomate 🍅, tengo una duda sobre los paquetes.")}
              target="_blank"
              rel="noopener noreferrer"
            >
              <IconoWhatsApp /> Pregúntanos directo
            </a>
          </Revelar>
        </div>
        <div className="faq-lista">
          {PREGUNTAS.map((q, i) => {
            const abiertaEsta = abierta === i;
            return (
              <Revelar key={q.p} retraso={i * 0.06}>
                <div className="faq-item vidrio">
                  <h3 style={{ margin: 0 }}>
                    <button
                      className="faq-q"
                      aria-expanded={abiertaEsta}
                      aria-controls={`faq-${i}`}
                      id={`faq-b-${i}`}
                      onClick={() => setAbierta(abiertaEsta ? null : i)}
                    >
                      {q.p}
                      <span className="mas" aria-hidden="true"><Plus /></span>
                    </button>
                  </h3>
                  <AnimatePresence initial={false}>
                    {abiertaEsta && (
                      <motion.div
                        id={`faq-${i}`}
                        role="region"
                        aria-labelledby={`faq-b-${i}`}
                        className="faq-r"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                      >
                        <p>{q.r}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Revelar>
            );
          })}
        </div>
      </div>
    </section>
  );
}
