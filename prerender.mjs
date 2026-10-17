// Pre-renderizado: mete el HTML real de la página dentro de dist/index.html,
// para que Google, las redes y "ver código fuente" vean todo el contenido sin esperar al JavaScript.
import { readFileSync, writeFileSync, rmSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";

const salida = resolve("dist/index.html");
const { render } = await import(pathToFileURL(resolve("dist-ssr/entry-server.js")).href);

const html = readFileSync(salida, "utf8");
const marca = '<div id="root"></div>';
if (!html.includes(marca)) throw new Error("No encontré <div id=\"root\"></div> en dist/index.html");

writeFileSync(salida, html.replace(marca, `<div id="root">${render()}</div>`));
rmSync(resolve("dist-ssr"), { recursive: true, force: true });
console.log("✓ Página pre-renderizada: dist/index.html ya trae todo el contenido");
