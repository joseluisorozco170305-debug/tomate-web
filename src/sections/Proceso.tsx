import { useRef } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { PROCESO, enlaceWhatsApp, MENSAJE_GENERAL } from "../data/contenido";
import { Revelar, TituloSube } from "../components/Revelar";
import { Isotipo, IconoWhatsApp } from "../components/Marca";
import { irA } from "../lib/scroll";

export function Proceso() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "end 55%"] });
  const avance = useSpring(scrollYProgress, { stiffness: 90, damping: 25 });

  return (
    <section className="seccion" id="proceso" aria-labelledby="proc-titulo">
      <div className="contenedor">
        <div className="cabecera centro">
          <TituloSube id="proc-titulo" lineas={["De tu idea a internet", "en 4 pasos."]} />
          <Revelar retraso={0.15}>
            <p>Sin tecnicismos ni vueltas. Tú nos cuentas, nosotros lo hacemos realidad.</p>
          </Revelar>
        </div>
        <div className="proceso" ref={ref} role="list">
          <div className="proceso-linea" aria-hidden="true">
            <motion.i style={{ scaleX: avance }} />
          </div>
          {PROCESO.map((p, i) => (
            <Revelar key={p.titulo} retraso={i * 0.12}>
              <div className="paso vidrio" role="listitem" style={{ height: "100%" }}>
                <span className="paso-num">{i + 1}</span>
                <h3>{p.titulo}</h3>
                <p>{p.texto}</p>
              </div>
            </Revelar>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CtaBanda() {
  return (
    <div className="contenedor">
      <Revelar>
        <div className="cta-banda vidrio">
          <Isotipo className="tomate-gigante" />
          <div>
            <h2>¿Ya te imaginaste tu página?</h2>
            <p>Cuéntanos tu idea en 1 minuto y te decimos qué paquete te conviene.</p>
          </div>
          <div className="botones">
            <button className="btn btn-primario" onClick={() => irA("#contacto")}>
              Cotizar mi página <ArrowRight className="mueve" />
            </button>
            <a className="btn btn-fantasma" href={enlaceWhatsApp(MENSAJE_GENERAL)} target="_blank" rel="noopener noreferrer">
              <IconoWhatsApp /> Mejor por WhatsApp
            </a>
          </div>
        </div>
      </Revelar>
    </div>
  );
}
