import { createFileRoute } from "@tanstack/react-router";
import rawHtml from "../static/pagina.html?raw";
import video1 from "../../Creating_Christmas_biscuit_adver…_b65dc9a0.mp4?url";
import video2 from "../../Creating_Christmas_biscuit_adver…_ecf5fdb6.mp4?url";

import foto1 from "../assets/galletas-foto-1.webp.asset.json";
import foto2 from "../assets/galletas-foto-2.webp.asset.json";

// Fotografías ilustrativas de galletas y presentación.
const FOTO1 = foto1.url;
const FOTO2 = foto2.url;

const html = rawHtml
  .replaceAll("__VIDEO1__", video1)
  .replaceAll("__VIDEO2__", video2)
  .replaceAll("__FOTO1__", FOTO1)
  .replaceAll("__FOTO2__", FOTO2);

// Página Galletas Navideñas: HTML estático servido tal cual.
export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: 'Galletas Navideñas · Método 1 Masa' },
    { name: 'description', content: '25 variaciones de galletas, decoración y empaque con una sola masa base.' },
    { property: 'og:title', content: 'Galletas Navideñas · Método 1 Masa' },
    { property: 'og:description', content: 'Prepara galletas para regalar o presentar con una guía digital y dos bonos.' },
    { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary_large_image' },
  ] }),
  server: {
    handlers: {
      GET: () =>
        new Response(html, {
          headers: { "content-type": "text/html; charset=utf-8", "cache-control": "public, max-age=60" },
        }),
    },
  },
});
