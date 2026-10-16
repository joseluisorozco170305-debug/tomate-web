import { useRef } from "react";
import { motion, useInView, type HTMLMotionProps } from "framer-motion";

type Props = HTMLMotionProps<"div"> & { retraso?: number; distancia?: number };

/** Aparece de abajo hacia arriba al entrar en pantalla (una sola vez). */
export function Revelar({ retraso = 0, distancia = 34, children, ...resto }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: distancia }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 0.8, delay: retraso, ease: [0.22, 1, 0.36, 1] }}
      {...resto}
    >
      {children}
    </motion.div>
  );
}

/** Título que sube línea por línea desde una máscara. */
export function TituloSube({
  lineas,
  como: Etiqueta = "h2",
  className,
  id,
}: {
  lineas: React.ReactNode[];
  como?: "h1" | "h2";
  className?: string;
  id?: string;
}) {
  // Observamos el título completo (las líneas ocultas bajo la máscara no "se ven" para el observador).
  const ref = useRef<HTMLHeadingElement>(null);
  const visto = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  return (
    <Etiqueta className={className} id={id} ref={ref}>
      {lineas.map((l, i) => (
        <span key={i} style={{ display: "block", overflow: "hidden", paddingBottom: "0.1em", marginBottom: "-0.1em" }}>
          <motion.span
            style={{ display: "inline-block" }}
            initial={{ y: "110%" }}
            animate={visto ? { y: "0%" } : { y: "110%" }}
            transition={{ duration: 0.95, delay: i * 0.09, ease: [0.22, 1, 0.36, 1] }}
          >
            {l}
          </motion.span>
        </span>
      ))}
    </Etiqueta>
  );
}
