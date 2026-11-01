import { createFileRoute } from "@tanstack/react-router";
import rawHtml from "../static/pagina.html?raw";
import video1 from "../../Creating_Christmas_biscuit_adver…_b65dc9a0.mp4?url";
import video2 from "../../Creating_Christmas_biscuit_adver…_ecf5fdb6.mp4?url";

// Fotos ilustrativas: reemplazar por los pointers de Lovable Assets cuando estén disponibles.
const FOTO1 = "img/gancho1.jpg";
const FOTO2 = "img/gancho3.jpg";

const html = rawHtml
  .replaceAll("__VIDEO1__", video1)
  .replaceAll("__VIDEO2__", video2)
  .replaceAll("__FOTO1__", FOTO1)
  .replaceAll("__FOTO2__", FOTO2);

// Página Galletas Navideñas: HTML estático servido tal cual.
export const Route = createFileRoute("/")({
  server: {
    handlers: {
      GET: () =>
        new Response(html, {
          headers: { "content-type": "text/html; charset=utf-8", "cache-control": "public, max-age=60" },
        }),
    },
  },
});
