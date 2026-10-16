import { useEffect, useRef, useState } from "react";
import { AnimatePresence, animate, motion, useInView, useMotionTemplate, useMotionValue, useSpring } from "framer-motion";
import { ArrowRight, Check, ChevronDown, Info, ShieldCheck } from "lucide-react";
import { MENSUALIDAD_CUBRE, PAQUETES, type Paquete } from "../data/contenido";
import { Revelar, TituloSube } from "../components/Revelar";
import { reduceMovimiento } from "../lib/scroll";

function Contador({ valor }: { valor: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const visto = useInView(ref, { once: true, margin: "-15% 0px" });
  useEffect(() => {
    if (!visto || !ref.current) return;
    if (reduceMovimiento()) {
      ref.current.textContent = valor.toLocaleString("es-MX");
      return;
    }
    const c = animate(0, valor, {
      duration: 1.6,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => {
        if (ref.current) ref.current.textContent = Math.round(v).toLocaleString("es-MX");
      },
    });
    return () => c.stop();
  }, [visto, valor]);
  return <span ref={ref} className="num">0</span>;
}

function Tarjeta({ p, i, alElegir }: { p: Paquete; i: number; alElegir: (id: string) => void }) {
  const [abierto, setAbierto] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const px = useMotionValue(50);
  const py = useMotionValue(50);
  const rx = useSpring(0, { stiffness: 150, damping: 18 });
  const ry = useSpring(0, { stiffness: 150, damping: 18 });
  const escala = useSpring(1, { stiffness: 200, damping: 20 });
  const brillo = useMotionTemplate`radial-gradient(420px circle at ${px}% ${py}%, rgba(255,255,255,0.14), transparent 45%)`;

  const mover = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || reduceMovimiento()) return;
    const r = ref.current!.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    px.set(x * 100);
    py.set(y * 100);
    rx.set((0.5 - y) * 6);
    ry.set((x - 0.5) * 6);
  };

  const estrella = p.id === "controles";

  return (
    <Revelar retraso={i * 0.12} style={{ perspective: 1200, height: "100%" }}>
      <motion.article
        ref={ref}
        className={`paquete vidrio${estrella ? " estrella" : ""}`}
        style={{ rotateX: rx, rotateY: ry, scale: escala, height: "100%" }}
        onPointerMove={mover}
        onPointerEnter={(e) => e.pointerType === "mouse" && !reduceMovimiento() && escala.set(1.025)}
        onPointerLeave={() => { rx.set(0); ry.set(0); escala.set(1); }}
        aria-labelledby={`paq-${p.id}`}
      >
        <motion.span className="paquete-brillo" style={{ background: brillo }} aria-hidden="true" />
        <div className="paquete-tope">
          {p.destacado && <span className={`etiqueta${estrella ? " caliente" : ""}`}>{p.destacado}</span>}
        </div>
        <h3 id={`paq-${p.id}`}>{p.nombre}</h3>
        <p className="gancho">{p.gancho} {p.ideal}</p>

        <div className="precio-bloque">
          <div className="precio-grande" aria-label={`${p.precio} pesos mexicanos`}>
            <span className="signo">$</span>
            <Contador valor={p.precio} />
            <span className="mxn">MXN</span>
          </div>
          <p className="mensual">+ <b>${p.mensualidad}</b> al mes de mantenimiento</p>
        </div>

        <ul className="claves">
          {p.claves.map((c) => (
            <li key={c}><Check /> {c}</li>
          ))}
        </ul>

        <div className="acciones">
          <button className={`btn ${estrella ? "btn-primario" : "btn-fantasma"} btn-ancho`} onClick={() => alElegir(p.id)}>
            Lo quiero <ArrowRight className="mueve" />
          </button>
          <p className="garantia"><ShieldCheck /> Garantía de 1 mes incluida</p>
          <button
            className="detalle-btn"
            aria-expanded={abierto}
            aria-controls={`det-${p.id}`}
            onClick={() => setAbierto((a) => !a)}
          >
            {abierto ? "Ocultar detalle" : "Ver todo lo que incluye"} <ChevronDown />
          </button>
          <AnimatePresence initial={false}>
            {abierto && (
              <motion.div
                id={`det-${p.id}`}
                className="detalle"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="detalle-in">
                  <div>
                    <h4>Incluye</h4>
                    <ul>{p.incluye.map((x) => <li key={x}>{x}</li>)}</ul>
                  </div>
                  <div>
                    <h4>Alcance</h4>
                    <ul>{p.topes.map((x) => <li key={x}>{x}</li>)}</ul>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.article>
    </Revelar>
  );
}

export function Paquetes({ alElegir }: { alElegir: (id: string) => void }) {
  return (
    <section className="seccion" id="paquetes" aria-labelledby="paq-titulo">
      <div className="contenedor">
        <div className="cabecera centro">
          <TituloSube id="paq-titulo" lineas={["Elige tu paquete,", "pa' que lo disfrutes."]} />
          <Revelar retraso={0.15}>
            <p>No es una escalera: son tres opciones según tu presupuesto y lo que necesitas. Con cualquiera haces una gran inversión.</p>
          </Revelar>
        </div>
        <div className="paquetes-grid">
          {PAQUETES.map((p, i) => (
            <Tarjeta key={p.id} p={p} i={i} alElegir={alElegir} />
          ))}
        </div>
        <Revelar retraso={0.1}>
          <div className="nota-mensual vidrio">
            <Info />
            <p>{MENSUALIDAD_CUBRE}</p>
          </div>
        </Revelar>
      </div>
    </section>
  );
}
