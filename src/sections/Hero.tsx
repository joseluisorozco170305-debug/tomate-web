import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, BadgeCheck, MessageCircleHeart, Nfc, PencilLine, ShieldCheck, Wallet } from "lucide-react";
import { Seda } from "../components/Seda";
import { irA, reduceMovimiento } from "../lib/scroll";

const EASE = [0.22, 1, 0.36, 1] as const;

const AVISOS = [
  { icono: MessageCircleHeart, titulo: "¡Pedido nuevo!", texto: "Llegó directo a tu WhatsApp" },
  { icono: PencilLine, titulo: "Precio actualizado", texto: "Desde tu panel, en segundos" },
  { icono: Nfc, titulo: "Toque NFC", texto: "Tu página abierta en su celular" },
];

/** Tarjeta de vidrio que va contando lo que pasa en una página de Tomate. */
function Aviso({ listo }: { listo: boolean }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (!listo || reduceMovimiento()) return;
    const t = window.setInterval(() => setI((n) => (n + 1) % AVISOS.length), 3400);
    return () => clearInterval(t);
  }, [listo]);
  const a = AVISOS[i];
  return (
    <motion.div
      className="hero-aviso"
      aria-hidden="true"
      initial={{ opacity: 0, x: 40 }}
      animate={listo ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 1, delay: 1.3, ease: EASE }}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={i}
          style={{ display: "flex", alignItems: "center", gap: 12 }}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -14 }}
          transition={{ duration: 0.4, ease: EASE }}
        >
          <span className="ico"><a.icono /></span>
          <span><b>{a.titulo}</b><small>{a.texto}</small></span>
        </motion.div>
      </AnimatePresence>
      <span className="puntos">
        {AVISOS.map((_, n) => <i key={n} className={n === i ? "on" : ""} />)}
      </span>
    </motion.div>
  );
}

export function Hero({ listo }: { listo: boolean }) {
  const sube = (n: number) => ({
    initial: { y: "110%" },
    animate: listo ? { y: "0%" } : {},
    transition: { duration: 1.15, delay: 0.35 + n * 0.11, ease: EASE },
  });
  const aparece = (n: number) => ({
    initial: { opacity: 0, y: 40 },
    animate: listo ? { opacity: 1, y: 0 } : {},
    transition: { duration: 1, delay: 0.75 + n * 0.12, ease: EASE },
  });

  return (
    <section className="hero" id="inicio" aria-labelledby="hero-titulo">
      <motion.div
        className="hero-marco"
        initial={{ opacity: 0, scale: 0.965 }}
        animate={listo ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 1.3, ease: EASE }}
      >
        <div className="hero-lienzo">
          <Seda className="hero-canvas" />
          <div className="hero-velo" />

          <h1 className="hero-titulo" id="hero-titulo">
            <span className="linea"><motion.span {...sube(0)}>Tu marca</motion.span></span>
            <span className="linea"><motion.span {...sube(1)}>en cada click.</motion.span></span>
          </h1>

          <Aviso listo={listo} />

          <div className="hero-pie">
            <div className="hero-izq">
              <motion.ul className="hero-datos" {...aparece(0)}>
                <li><Wallet /> Desde $800 MXN</li>
                <li><ShieldCheck /> 1 mes de garantía</li>
                <li><BadgeCheck /> 100% a tu medida</li>
              </motion.ul>
              <motion.p className="hero-sub" {...aparece(1)}>
                Desarrollamos tu página web a tu estilo y a la medida de tu negocio: menús, catálogos y pedidos directo a tu WhatsApp. Con precios accesibles para todos.
              </motion.p>
            </div>
            <motion.div className="hero-ctas" {...aparece(2)}>
              <a className="btn btn-fantasma btn-mono" href="#portafolio" onClick={(e) => { e.preventDefault(); irA("#portafolio"); }}>
                Ver proyectos
              </a>
              <a className="btn btn-primario btn-mono" href="#paquetes" onClick={(e) => { e.preventDefault(); irA("#paquetes"); }}>
                Ver paquetes <ArrowRight className="mueve" />
              </a>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
