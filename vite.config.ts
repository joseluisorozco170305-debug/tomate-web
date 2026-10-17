import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import { INSTAGRAM, MENSUALIDAD_CUBRE, PAQUETES, PREGUNTAS, PROCESO, PROYECTOS, WHATSAPP } from "./src/data/contenido";

/*
 * URL pública del sitio para Open Graph, canonical, sitemap y llms.txt (las redes exigen URLs absolutas).
 * En Vercel se toma sola del dominio de producción; si conectas un dominio propio, Vercel la actualiza.
 * Si quieres forzarla, crea la variable SITE_URL en Vercel (p. ej. https://tomateweb.mx).
 */
function urlDelSitio() {
  const propia = process.env.SITE_URL;
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL;
  const url = propia || (vercel ? `https://${vercel}` : "http://localhost:4173");
  return url.replace(/\/$/, "");
}

const tel = `+52 ${WHATSAPP.slice(2, 4)} ${WHATSAPP.slice(4, 8)} ${WHATSAPP.slice(8)}`;

/** Datos estructurados (schema.org): negocio, paquetes con precio y sitio. Todo sale de contenido.ts. */
function jsonLd(url: string) {
  const negocio = {
    "@type": "ProfessionalService",
    "@id": `${url}/#negocio`,
    name: "Tomate Desarrollo Web",
    slogan: "Tu marca en cada click",
    description:
      "Desarrollo de páginas web a la medida para emprendimientos y negocios locales: menús, catálogos, pedidos por WhatsApp y panel de control.",
    url: `${url}/`,
    image: `${url}/og-image.jpg`,
    logo: `${url}/icon-512.png`,
    telephone: tel,
    areaServed: { "@type": "Country", name: "México" },
    priceRange: `$${Math.min(...PAQUETES.map((p) => p.precio))} - $${Math.max(...PAQUETES.map((p) => p.precio))} MXN`,
    sameAs: [INSTAGRAM],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Paquetes de páginas web",
      itemListElement: PAQUETES.map((p) => ({
        "@type": "Offer",
        name: p.nombre,
        description: `${p.gancho} Incluye: ${p.incluye.join(", ")}. Mantenimiento de $${p.mensualidad} MXN al mes.`,
        price: p.precio,
        priceCurrency: "MXN",
        url: `${url}/#paquetes`,
        itemOffered: { "@type": "Service", name: `Página web: ${p.nombre}`, serviceType: "Desarrollo web" },
      })),
    },
  };
  const sitio = {
    "@type": "WebSite",
    "@id": `${url}/#sitio`,
    url: `${url}/`,
    name: "Tomate Desarrollo Web",
    inLanguage: "es-MX",
    publisher: { "@id": `${url}/#negocio` },
  };
  // "<" escapado para que ningún texto pueda cerrar la etiqueta <script>
  return JSON.stringify({ "@context": "https://schema.org", "@graph": [negocio, sitio] }).replace(/</g, "\\u003c");
}

/** llms.txt: resumen en texto plano para que asistentes de IA (ChatGPT, Claude, Perplexity) entiendan y recomienden el servicio. */
function llmsTxt(url: string) {
  const paquetes = PAQUETES.map(
    (p) =>
      `### ${p.nombre}: $${p.precio} MXN + $${p.mensualidad} MXN/mes\n${p.gancho} ${p.ideal}\n- Incluye: ${p.incluye.join("; ")}\n- Alcance: ${p.topes.join("; ")}`
  ).join("\n\n");
  const pasos = PROCESO.map((p, i) => `${i + 1}. ${p.titulo}: ${p.texto}`).join("\n");
  const faq = PREGUNTAS.map((q) => `- ${q.p} ${q.r}`).join("\n");
  const proyectos = PROYECTOS.map((p) => `- [${p.nombre}](${p.url}): ${p.tipo}. ${p.descripcion}`).join("\n");
  return `# Tomate Desarrollo Web

> Desarrollamos páginas web a la medida para emprendimientos y negocios locales en México: menús, catálogos, pedidos directo a WhatsApp y panel de control. Paquetes desde $${Math.min(...PAQUETES.map((p) => p.precio))} MXN con 1 mes de garantía. Eslogan: "Tu marca en cada click".

Sitio: ${url}/
Contacto por WhatsApp: ${tel} (https://wa.me/${WHATSAPP})
Instagram: ${INSTAGRAM}
Idioma: español (México). Precios en pesos mexicanos (MXN).

## Paquetes

Los paquetes no son una escalera: son tres opciones según presupuesto y funciones.

${paquetes}

Mensualidad: ${MENSUALIDAD_CUBRE}

## Cómo trabajamos

${pasos}

## Proyectos reales

${proyectos}

## Preguntas frecuentes

${faq}
`;
}

function seo(): Plugin {
  const url = urlDelSitio();
  return {
    name: "tomate-seo",
    transformIndexHtml: {
      order: "pre",
      handler: (html) => html.replaceAll("%SITE_URL%", url).replace("%JSON_LD%", jsonLd(url)),
    },
    generateBundle(opciones) {
      if (opciones.dir?.includes("dist-ssr")) return;
      const hoy = new Date().toISOString().slice(0, 10);
      this.emitFile({
        type: "asset",
        fileName: "robots.txt",
        // Abierto a buscadores y asistentes de IA a propósito: que te encuentren y te recomienden es el objetivo de la página.
        source: `User-agent: *\nAllow: /\n\nSitemap: ${url}/sitemap.xml\n`,
      });
      this.emitFile({
        type: "asset",
        fileName: "sitemap.xml",
        source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url>\n    <loc>${url}/</loc>\n    <lastmod>${hoy}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>1.0</priority>\n  </url>\n</urlset>\n`,
      });
      this.emitFile({ type: "asset", fileName: "llms.txt", source: llmsTxt(url) });
    },
  };
}

export default defineConfig(({ isSsrBuild }) => ({
  base: "/",
  plugins: [react(), seo()],
  build: {
    // Sin sourcemaps en producción: nadie puede ver tu código original desde el navegador.
    sourcemap: false,
    // El build del pre-renderizado (SSR) no separa en trozos; solo el del navegador.
    rollupOptions: isSsrBuild
      ? {}
      : { output: { manualChunks: { motion: ["framer-motion"], react: ["react", "react-dom"] } } },
  },
}));
