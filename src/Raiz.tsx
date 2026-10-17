import { Component, StrictMode, type ReactNode } from "react";
import { MotionConfig } from "framer-motion";
import App from "./App";

class ErrorGlobal extends Component<{ children: ReactNode }, { error: boolean }> {
  state = { error: false };
  static getDerivedStateFromError() {
    return { error: true };
  }
  render() {
    if (!this.state.error) return this.props.children;
    document.getElementById("splash")?.remove();
    return (
      <div className="error-global">
        <div className="vidrio" style={{ padding: "2.618rem", maxWidth: 440 }}>
          <h1 style={{ fontSize: "2.058rem" }}>Algo se nos quemó 🍅</h1>
          <p style={{ margin: "1rem 0 1.618rem", color: "var(--texto-2)" }}>
            La página tuvo un error al cargar. Recárgala y debería quedar.
          </p>
          <button className="btn btn-primario" onClick={() => location.reload()}>Recargar página</button>
        </div>
      </div>
    );
  }
}

/** Árbol completo de la app: lo usan el navegador (main.tsx) y el pre-renderizado (entry-server.tsx). */
export function Raiz() {
  return (
    <StrictMode>
      <ErrorGlobal>
        <MotionConfig reducedMotion="user">
          <App />
        </MotionConfig>
      </ErrorGlobal>
    </StrictMode>
  );
}
