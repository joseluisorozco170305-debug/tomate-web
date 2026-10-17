import { renderToString } from "react-dom/server";
import { Raiz } from "./Raiz";

/** Se usa solo al hacer el build: genera el HTML de la página con todo su contenido. */
export function render() {
  return renderToString(<Raiz />);
}
