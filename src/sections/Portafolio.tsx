import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { ArrowUpRight, ImageOff, Plus, RotateCw } from "lucide-react";
import { PROYECTOS, type Proyecto } from "../data/contenido";
import { Revelar, TituloSube } from "../components/Revelar";
import { irA } from "../lib/scroll";

type Estado = "espera" | "cargando" | "listo" | "error";

function Vista({ p }: { p: Proyecto }) {
  const ref = useRef<HTMLDivElement>(null);
  // la vista en vivo solo corre mientras está cerca de la pantalla (los sitios embebidos consumen mucho)
  const visible = useInView(ref, { margin: "300px 0px" });
  const [estado, setEstado] = useState<Estado>("espera");
  const [intento, setIntento] = useState(0);

  useEffect(() => {
    if (!visible) {
      setEstado("espera");
      return;
    }
    setEstado("cargando");
    const t = window.setTimeout(() => setEstado((e) => (e === "cargando" ? "error" : e)), 12000);
    return () => clearTimeout(t);
  }, [visible, intento]);

  const dominio = p.url.replace(/^https?:\/\//, "").replace(/\/$/, "");

  return (
    <div className="ventana" ref={ref}>
      <div className="ventana-chrome" aria-hidden="true">
        <i /><i /><i /><span>{dominio}</span>
      </div>
      {visible && estado !== "error" && (
        <iframe
          key={intento}
          className="ventana-marco"
          src={p.url}
          title={`Vista previa de ${p.nombre}`}
          loading="lazy"
          tabIndex={-1}
          aria-hidden="true"
          sandbox="allow-scripts allow-same-origin"
          onLoad={() => setEstado("listo")}
          style={{ opacity: estado === "listo" ? 1 : 0, transition: "opacity .6s" }}
        />
      )}
      <AnimatePresence>
        {(estado === "espera" || estado === "cargando") && (
          <motion.div className="ventana-carga" aria-hidden="true" exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
            <div className="esqueleto" />
            <div className="esqueleto txt" />
            <div className="esqueleto txt c" />
            <div className="cuad"><div className="esqueleto" /><div className="esqueleto" /><div className="esqueleto" /></div>
          </motion.div>
        )}
      </AnimatePresence>
      {estado === "cargando" && <span className="sr-only" role="status">Cargando vista previa de {p.nombre}</span>}
      {estado === "error" && (
        <div className="ventana-sin">
          <div>
            <ImageOff style={{ margin: "0 auto 10px", width: 28, height: 28 }} />
            <p>No pudimos cargar la vista previa.</p>
            <button className="btn btn-fantasma btn-chico" style={{ marginTop: 12 }} onClick={() => setIntento((n) => n + 1)}>
              <RotateCw /> Reintentar
            </button>
          </div>
        </div>
      )}
      <a className="ventana-velo" href={p.url} target="_blank" rel="noopener noreferrer" aria-label={`Abrir ${p.nombre} en una pestaña nueva`}>
        <span className="btn btn-primario btn-chico">Visitar sitio <ArrowUpRight /></span>
      </a>
    </div>
  );
}

export function Portafolio() {
  return (
    <section className="seccion" id="portafolio" aria-labelledby="port-titulo">
      <div className="contenedor">
        <div className="cabecera">
          <TituloSube id="port-titulo" lineas={["No te lo contamos,", "te lo enseñamos."]} />
          <Revelar retraso={0.15}>
            <p>Proyectos reales, en línea y funcionando. Pasa el cursor (o toca) para visitarlos.</p>
          </Revelar>
        </div>

        <div className="porta-grid">
          {PROYECTOS.map((p, i) => (
            <Revelar key={p.id} retraso={i * 0.12} style={{ height: "100%" }}>
              <article className="proyecto vidrio" style={{ height: "100%" }}>
                <Vista p={p} />
                <div className="proyecto-info">
                  <span className="tipo" style={{ color: p.color }}>{p.tipo}</span>
                  <h3>{p.nombre}</h3>
                  <p>{p.descripcion}</p>
                  <div className="tags">{p.etiquetas.map((t) => <span key={t}>{t}</span>)}</div>
                  <div className="proyecto-acc">
                    <a className="btn btn-fantasma btn-chico" href={p.url} target="_blank" rel="noopener noreferrer">
                      Ver sitio en vivo <ArrowUpRight />
                    </a>
                  </div>
                </div>
              </article>
            </Revelar>
          ))}

          {/* Estado vacío: el siguiente lugar del portafolio */}
          <Revelar retraso={0.1} style={{ gridColumn: "1 / -1" }}>
            <div className="vacio">
              <div className="vacio-izq">
                <div className="vacio-ico">
                  <Plus />
                </div>
                <div>
                  <h3>Este espacio es para tu negocio.</h3>
                  <p>Tu página podría ser el siguiente proyecto que enseñemos aquí.</p>
                </div>
              </div>
              <button className="btn btn-primario" onClick={() => irA("#contacto")}>
                Quiero ser el siguiente
              </button>
            </div>
          </Revelar>
        </div>
      </div>
    </section>
  );
}
