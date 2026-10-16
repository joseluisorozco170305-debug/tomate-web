import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, ArrowLeft, ArrowRight, ArrowUpRight, Check, CircleCheckBig, RotateCcw, Send, TriangleAlert } from "lucide-react";
import { INSTAGRAM, INSTAGRAM_USUARIO, PAQUETES, WHATSAPP, enlaceWhatsApp, MENSAJE_GENERAL } from "../data/contenido";
import { Revelar, TituloSube } from "../components/Revelar";
import { IconoInstagram, IconoWhatsApp } from "../components/Marca";
import { limpiar } from "../lib/limpiar";

const FUNCIONES = [
  "Menú o catálogo",
  "Pedidos por WhatsApp",
  "Panel para editar precios",
  "Galería de fotos",
  "Citas o reservaciones",
  "Logo y marca",
  "Estampas NFC",
  "Otra cosa",
];

const MATERIAL = [
  { v: "Sí, tengo logo y fotos", d: "Listo para arrancar" },
  { v: "Tengo algunas cosas", d: "Nos falta completar" },
  { v: "Aún no tengo nada", d: "Empezamos desde cero" },
];

const PASOS = ["Tu negocio", "Lo que necesitas", "Tu idea"];

type Datos = {
  nombre: string;
  negocio: string;
  paquete: string;
  funciones: string[];
  idea: string;
  material: string;
};
type Errores = Partial<Record<keyof Datos, string>>;
type Envio = "editando" | "enviando" | "exito" | "error";

const VACIO: Datos = { nombre: "", negocio: "", paquete: "", funciones: [], idea: "", material: "" };

function validar(paso: number, d: Datos): Errores {
  const e: Errores = {};
  if (paso === 0) {
    if (limpiar(d.nombre).length < 2) e.nombre = "Escribe tu nombre para saber cómo llamarte.";
    if (limpiar(d.negocio).length < 3) e.negocio = "Cuéntanos el nombre o giro de tu negocio.";
  }
  if (paso === 1) {
    if (!d.paquete) e.paquete = "Elige un paquete o marca “Aún no sé”.";
  }
  if (paso === 2) {
    if (limpiar(d.idea).length < 15) e.idea = "Danos un poquito más de detalle (mínimo 15 caracteres).";
  }
  return e;
}

function armarMensaje(d: Datos) {
  const paquete = PAQUETES.find((p) => p.id === d.paquete);
  return [
    "Hola Tomate 🍅, quiero cotizar mi página web.",
    "",
    `👤 Nombre: ${limpiar(d.nombre, 80)}`,
    `🏪 Negocio: ${limpiar(d.negocio, 120)}`,
    `📦 Paquete: ${paquete ? `${paquete.nombre} ($${paquete.precio} MXN)` : "Aún no sé, quiero que me orienten"}`,
    d.funciones.length ? `🧩 Me interesa: ${d.funciones.join(", ")}` : "",
    d.material ? `🎨 Material: ${d.material}` : "",
    "",
    `💡 Mi idea: ${limpiar(d.idea, 600)}`,
  ]
    .filter((l, i, a) => !(l === "" && a[i - 1] === ""))
    .join("\n");
}

function ErrorCampo({ id, texto }: { id: string; texto?: string }) {
  return (
    <AnimatePresence>
      {texto && (
        <motion.p
          id={id}
          className="error-campo"
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
        >
          <AlertCircle /> {texto}
        </motion.p>
      )}
    </AnimatePresence>
  );
}

export function Contacto({ paqueteElegido, version }: { paqueteElegido: string; version: number }) {
  const [paso, setPaso] = useState(0);
  const [dir, setDir] = useState(1);
  const [datos, setDatos] = useState<Datos>(VACIO);
  const [errores, setErrores] = useState<Errores>({});
  const [envio, setEnvio] = useState<Envio>("editando");
  const [enlace, setEnlace] = useState("");
  const cajaRef = useRef<HTMLDivElement>(null);

  // Si eligen paquete desde una tarjeta, lo dejamos marcado.
  useEffect(() => {
    if (!paqueteElegido) return;
    setDatos((d) => ({ ...d, paquete: paqueteElegido }));
    setEnvio("editando");
  }, [paqueteElegido, version]);

  const poner = <K extends keyof Datos>(k: K, v: Datos[K]) => {
    setDatos((d) => ({ ...d, [k]: v }));
    if (errores[k]) setErrores((e) => ({ ...e, [k]: undefined }));
  };

  const enfocarError = (e: Errores) => {
    const primero = Object.keys(e)[0];
    if (primero) setTimeout(() => cajaRef.current?.querySelector<HTMLElement>(`[data-campo="${primero}"]`)?.focus(), 60);
  };

  const avanzar = () => {
    const e = validar(paso, datos);
    setErrores(e);
    if (Object.keys(e).length) return enfocarError(e);
    setDir(1);
    setPaso((p) => p + 1);
  };

  const regresar = () => {
    setDir(-1);
    setErrores({});
    setPaso((p) => p - 1);
  };

  const enviar = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (paso < 2) return avanzar();
    const e = validar(2, datos);
    setErrores(e);
    if (Object.keys(e).length) return enfocarError(e);
    const url = enlaceWhatsApp(armarMensaje(datos));
    setEnlace(url);
    setEnvio("enviando");
    window.setTimeout(() => {
      // Abrimos sin "noopener" para poder detectar si el navegador bloqueó la ventana,
      // y cortamos el vínculo a mano por seguridad.
      const ventana = window.open(url, "_blank");
      if (ventana) {
        ventana.opener = null;
        setEnvio("exito");
      } else {
        setEnvio("error");
      }
    }, 900);
  };

  const reiniciar = () => {
    setDatos(VACIO);
    setPaso(0);
    setErrores({});
    setEnvio("editando");
  };

  const variantes = {
    entra: (d: number) => ({ x: d * 40, opacity: 0 }),
    centro: { x: 0, opacity: 1 },
    sale: (d: number) => ({ x: d * -40, opacity: 0 }),
  };

  return (
    <section className="seccion" id="contacto" aria-labelledby="cont-titulo">
      <div className="contenedor contacto-grid">
        <div className="cabecera" style={{ marginBottom: 0 }}>
          <TituloSube id="cont-titulo" lineas={["Hagamos tu", "página realidad."]} />
          <Revelar retraso={0.15}>
            <p>Llena estos 3 pasos y te llega todo ordenado a WhatsApp. Te respondemos con una propuesta para tu negocio.</p>
          </Revelar>
          <div className="canales">
            <Revelar retraso={0.2}>
              <a className="canal vidrio" href={enlaceWhatsApp(MENSAJE_GENERAL)} target="_blank" rel="noopener noreferrer">
                <span className="ico" style={{ background: "var(--crema)", color: "var(--cafe)" }}><IconoWhatsApp /></span>
                <span><b>WhatsApp</b><small>{`${WHATSAPP.slice(2, 4)} ${WHATSAPP.slice(4, 8)} ${WHATSAPP.slice(8)}`}</small></span>
                <ArrowUpRight className="flecha" />
              </a>
            </Revelar>
            <Revelar retraso={0.28}>
              <a className="canal vidrio" href={INSTAGRAM} target="_blank" rel="noopener noreferrer">
                <span className="ico" style={{ background: "rgba(167,141,120,.3)", color: "var(--crema)" }}><IconoInstagram /></span>
                <span><b>Instagram</b><small>{INSTAGRAM_USUARIO}</small></span>
                <ArrowUpRight className="flecha" />
              </a>
            </Revelar>
          </div>
        </div>

        <Revelar retraso={0.1}>
          <div className="form vidrio" ref={cajaRef}>
            <AnimatePresence mode="wait" initial={false}>
              {envio === "exito" || envio === "error" ? (
                <motion.div
                  key={envio}
                  className="estado-final"
                  role="status"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.45 }}
                >
                  <motion.div
                    className="icono"
                    style={envio === "exito"
                      ? { background: "rgba(225,212,194,.16)", color: "var(--crema)", border: "1px solid rgba(225,212,194,.4)" }
                      : { background: "rgba(232,136,112,.15)", color: "#f0a48f", border: "1px solid rgba(232,136,112,.4)" }}
                    initial={{ scale: 0, rotate: -40 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.1 }}
                  >
                    {envio === "exito" ? <CircleCheckBig /> : <TriangleAlert />}
                  </motion.div>
                  <h3>{envio === "exito" ? "¡Listo, ya casi!" : "No se abrió WhatsApp"}</h3>
                  <p>
                    {envio === "exito"
                      ? "Abrimos WhatsApp con tu mensaje armado. Solo dale enviar y te respondemos con tu propuesta."
                      : "Tu navegador bloqueó la ventana. Usa el botón para abrir WhatsApp con tu mensaje listo."}
                  </p>
                  <div className="botones">
                    <a className="btn btn-primario" href={enlace} target="_blank" rel="noopener noreferrer">
                      <IconoWhatsApp /> {envio === "exito" ? "Abrir WhatsApp otra vez" : "Abrir WhatsApp"}
                    </a>
                    <button className="btn btn-fantasma" onClick={reiniciar}>
                      <RotateCcw /> Nueva cotización
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.form key="form" onSubmit={enviar} noValidate initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <div className="form-pasos" aria-hidden="true">
                    {PASOS.map((_, i) => (
                      <span className="barra" key={i}>
                        <motion.i initial={false} animate={{ scaleX: i <= paso ? 1 : 0 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }} />
                      </span>
                    ))}
                  </div>
                  <div className="form-titulo">
                    <h3>{PASOS[paso]}</h3>
                    <span>Paso {paso + 1} de {PASOS.length}</span>
                  </div>

                  <div style={{ position: "relative", overflow: "hidden", margin: "-6px", padding: "6px" }}>
                    <AnimatePresence mode="wait" custom={dir} initial={false}>
                      <motion.div
                        key={paso}
                        custom={dir}
                        variants={variantes}
                        initial="entra"
                        animate="centro"
                        exit="sale"
                        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                      >
                        {paso === 0 && (
                          <>
                            <div className="campo">
                              <label htmlFor="f-nombre">¿Cómo te llamas?</label>
                              <input
                                id="f-nombre" data-campo="nombre" className="entrada" autoComplete="name" maxLength={80}
                                placeholder="Tu nombre" value={datos.nombre}
                                onChange={(e) => poner("nombre", e.target.value)}
                                aria-invalid={!!errores.nombre} aria-describedby={errores.nombre ? "e-nombre" : undefined}
                              />
                              <ErrorCampo id="e-nombre" texto={errores.nombre} />
                            </div>
                            <div className="campo">
                              <label htmlFor="f-negocio">¿Cuál es tu negocio?</label>
                              <input
                                id="f-negocio" data-campo="negocio" className="entrada" maxLength={120}
                                placeholder="Ej. Taquería Don Pepe, venta de postres…" value={datos.negocio}
                                onChange={(e) => poner("negocio", e.target.value)}
                                aria-invalid={!!errores.negocio} aria-describedby={errores.negocio ? "e-negocio" : "a-negocio"}
                              />
                              <span className="ayuda" id="a-negocio">Nombre, giro o lo que vendes.</span>
                              <ErrorCampo id="e-negocio" texto={errores.negocio} />
                            </div>
                          </>
                        )}

                        {paso === 1 && (
                          <>
                            <div className="campo" role="radiogroup" aria-labelledby="l-paquete" aria-describedby={errores.paquete ? "e-paquete" : undefined}>
                              <span className="lbl" id="l-paquete">¿Qué paquete te late?</span>
                              <div className="opciones">
                                {[...PAQUETES.map((p) => ({ id: p.id, t: p.nombre, d: `$${p.precio} MXN` })), { id: "nose", t: "Aún no sé", d: "Oriéntenme" }].map((o, i) => (
                                  <button
                                    type="button" key={o.id} role="radio" className="opcion"
                                    data-campo={i === 0 ? "paquete" : undefined}
                                    aria-checked={datos.paquete === o.id}
                                    onClick={() => poner("paquete", o.id)}
                                  >
                                    <span className="check">{datos.paquete === o.id && <Check />}</span>
                                    <span>{o.t}<small>{o.d}</small></span>
                                  </button>
                                ))}
                              </div>
                              <ErrorCampo id="e-paquete" texto={errores.paquete} />
                            </div>
                            <div className="campo">
                              <span className="lbl" id="l-func">¿Qué te gustaría que tenga? <span className="ayuda">(opcional)</span></span>
                              <div className="opciones" role="group" aria-labelledby="l-func">
                                {FUNCIONES.map((f) => {
                                  const on = datos.funciones.includes(f);
                                  return (
                                    <button
                                      type="button" key={f} className="opcion" aria-pressed={on}
                                      onClick={() => poner("funciones", on ? datos.funciones.filter((x) => x !== f) : [...datos.funciones, f])}
                                    >
                                      <span className="check">{on && <Check />}</span>
                                      {f}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          </>
                        )}

                        {paso === 2 && (
                          <>
                            <div className="campo">
                              <label htmlFor="f-idea">Cuéntanos tu idea</label>
                              <textarea
                                id="f-idea" data-campo="idea" className="entrada" maxLength={600}
                                placeholder="¿Qué vendes, a quién y qué quieres que pueda hacer la gente en tu página?"
                                value={datos.idea} onChange={(e) => poner("idea", e.target.value)}
                                aria-invalid={!!errores.idea} aria-describedby={errores.idea ? "e-idea" : "a-idea"}
                              />
                              <span className="ayuda" id="a-idea">{datos.idea.length}/600</span>
                              <ErrorCampo id="e-idea" texto={errores.idea} />
                            </div>
                            <div className="campo" role="radiogroup" aria-labelledby="l-mat">
                              <span className="lbl" id="l-mat">¿Ya tienes logo y fotos? <span className="ayuda">(opcional)</span></span>
                              <div className="opciones">
                                {MATERIAL.map((m) => (
                                  <button
                                    type="button" key={m.v} role="radio" className="opcion"
                                    aria-checked={datos.material === m.v}
                                    onClick={() => poner("material", datos.material === m.v ? "" : m.v)}
                                  >
                                    <span className="check">{datos.material === m.v && <Check />}</span>
                                    <span>{m.v}<small>{m.d}</small></span>
                                  </button>
                                ))}
                              </div>
                            </div>
                          </>
                        )}
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  <div className="form-acciones">
                    {paso > 0 ? (
                      <button type="button" className="btn btn-fantasma" onClick={regresar} disabled={envio === "enviando"}>
                        <ArrowLeft /> Atrás
                      </button>
                    ) : <span />}
                    <button type="submit" className="btn btn-primario" disabled={envio === "enviando"} aria-busy={envio === "enviando"}>
                      {envio === "enviando" ? (
                        <><span className="cargando-spin" aria-hidden="true" /> Preparando mensaje…</>
                      ) : paso < 2 ? (
                        <>Siguiente <ArrowRight className="mueve" /></>
                      ) : (
                        <>Enviar por WhatsApp <Send className="mueve" /></>
                      )}
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </Revelar>
      </div>
    </section>
  );
}
