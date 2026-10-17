import { createRoot, hydrateRoot } from "react-dom/client";
import { Raiz } from "./Raiz";
import { iniciarScroll } from "./lib/scroll";
import "./styles.css";

iniciarScroll();

const raiz = document.getElementById("root")!;
// Si el HTML ya viene pre-renderizado (producción), React solo "despierta" lo que ya está; si no (modo dev), lo dibuja.
if (raiz.hasChildNodes()) hydrateRoot(raiz, <Raiz />);
else createRoot(raiz).render(<Raiz />);
