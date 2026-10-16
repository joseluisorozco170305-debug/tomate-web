import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { pausarScroll } from "../lib/scroll";

export function Modal({
  abierto,
  alCerrar,
  titulo,
  children,
}: {
  abierto: boolean;
  alCerrar: () => void;
  titulo: string;
  children: React.ReactNode;
}) {
  const cerrarRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!abierto) return;
    const previo = document.activeElement as HTMLElement | null;
    pausarScroll(true);
    cerrarRef.current?.focus();
    const tecla = (e: KeyboardEvent) => e.key === "Escape" && alCerrar();
    window.addEventListener("keydown", tecla);
    return () => {
      pausarScroll(false);
      window.removeEventListener("keydown", tecla);
      previo?.focus();
    };
  }, [abierto, alCerrar]);

  return (
    <AnimatePresence>
      {abierto && (
        <motion.div
          className="modal-fondo"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={alCerrar}
        >
          <motion.div
            className="modal vidrio"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-titulo"
            initial={{ y: 60, opacity: 0, scale: 0.96 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 40, opacity: 0, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 260, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
            data-lenis-prevent
          >
            <div className="modal-cab">
              <h2 id="modal-titulo">{titulo}</h2>
              <button ref={cerrarRef} className="cerrar" onClick={alCerrar} aria-label="Cerrar">
                <X />
              </button>
            </div>
            <div className="modal-cuerpo">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
