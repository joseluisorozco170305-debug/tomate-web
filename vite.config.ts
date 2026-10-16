import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";

/*
 * URL pública del sitio para Open Graph, canonical y sitemap (las redes exigen URLs absolutas).
 * En Vercel se toma sola del dominio de producción; si conectas un dominio propio, Vercel la actualiza.
 * Si quieres forzarla, crea la variable SITE_URL en Vercel (p. ej. https://tomateweb.mx).
 */
function urlDelSitio() {
  const propia = process.env.SITE_URL;
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL;
  const url = propia || (vercel ? `https://${vercel}` : "http://localhost:4173");
  return url.replace(/\/$/, "");
}

function seo(): Plugin {
  const url = urlDelSitio();
  return {
    name: "tomate-seo",
    transformIndexHtml: { order: "pre", handler: (html) => html.replaceAll("%SITE_URL%", url) },
    generateBundle() {
      const hoy = new Date().toISOString().slice(0, 10);
      this.emitFile({
        type: "asset",
        fileName: "robots.txt",
        source: `User-agent: *\nAllow: /\n\nSitemap: ${url}/sitemap.xml\n`,
      });
      this.emitFile({
        type: "asset",
        fileName: "sitemap.xml",
        source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url>\n    <loc>${url}/</loc>\n    <lastmod>${hoy}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>1.0</priority>\n  </url>\n</urlset>\n`,
      });
    },
  };
}

export default defineConfig({
  base: "./",
  plugins: [react(), seo()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: { motion: ["framer-motion"], react: ["react", "react-dom"] },
      },
    },
  },
});
