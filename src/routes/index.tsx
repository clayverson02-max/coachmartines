import { createFileRoute } from "@tanstack/react-router";
import html from "../static/pagina.html?raw";

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
