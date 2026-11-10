import { useState } from "react";
import { ArrowUpRight, Plus } from "lucide-react";
import { PROYECTOS, type Proyecto } from "../data/contenido";
import { Revelar, TituloSube } from "../components/Revelar";
import { irA } from "../lib/scroll";

/**
 * Portada fija del proyecto: nada de iframes (cargaban lento, a veces nunca, y gastaban batería).
 * Si el proyecto trae `imagen`, se muestra la captura; si no (o si falla), una portada diseñada con su nombre y color.
 */
function Vista({ p }: { p: Proyecto }) {
  const [fallo, setFallo] = useState(false);
  const dominio = p.url.replace(/^https?:\/\//, "").replace(/\/$/, "");
  const conImagen = Boolean(p.imagen) && !fallo;

  return (
    <div className="ventana" style={{ "--tono": p.color } as React.CSSProperties}>
      <div className="ventana-chrome" aria-hidden="true">
        <i /><i /><i /><span>{dominio}</span>
      </div>

      {conImagen ? (
        <img
          className="ventana-img"
          src={p.imagen}
          alt={`Captura del sitio de ${p.nombre}`}
          width={1600}
          height={1040}
          loading="lazy"
          decoding="async"
          onError={() => setFallo(true)}
        />
      ) : (
        <div className="portada" aria-hidden="true">
          <span className="portada-letra">{p.nombre.charAt(0)}</span>
          <div className="portada-nav"><b /><i /><i /><i /><em /></div>
          <div className="portada-cuerpo">
            <strong className="portada-nombre">{p.nombre}</strong>
            <span className="portada-linea" />
            <span className="portada-linea corta" />
          </div>
          <div className="portada-grid"><i /><i /><i /></div>
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
            <p>Proyectos reales, en línea y funcionando. Dale clic a cualquiera y pruébalo tú mismo.</p>
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
