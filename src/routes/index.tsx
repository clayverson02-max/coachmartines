import { createFileRoute } from "@tanstack/react-router";
import rawHtml from "../static/pagina.html?raw";
import { CHECKOUT_PRICE_ES, CHECKOUT_URL, CHECKOUT_VALUE } from "../config/galletas";

import foto1 from "../assets/galletas-foto-1.webp.asset.json";
import foto2 from "../assets/galletas-foto-2.webp.asset.json";

// Fotografías ilustrativas de galletas y presentación.
const FOTO1 = foto1.url;
const FOTO2 = foto2.url;

const html = rawHtml
  .replaceAll("__CHECKOUT_PRICE__", CHECKOUT_PRICE_ES)
  .replaceAll("__CHECKOUT_URL__", CHECKOUT_URL)
  .replaceAll("__CHECKOUT_VALUE__", String(CHECKOUT_VALUE))
  .replaceAll("__VIDEO1__", "/videos/galletas-presentacion.mp4")
  .replaceAll("__VIDEO2__", "/videos/galletas-compartir.mp4")
  .replaceAll("__FOTO1__", FOTO1)
  .replaceAll("__FOTO2__", FOTO2);

// Página Galletas Navideñas: HTML estático servido tal cual.
export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: 'Galletas Navideñas · Método 1 Masa' },
    { name: 'description', content: 'Prepara 25 variedades de galletas navideñas con una masa. Aprende a decorar, armar tus cajitas y calcular el precio si decides venderlas.' },
    { property: 'og:title', content: 'Galletas Navideñas · Método 1 Masa' },
    { property: 'og:description', content: 'De una sola masa a tus primeras cajitas navideñas. Método digital paso a paso y 2 bonos incluidos.' },
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
