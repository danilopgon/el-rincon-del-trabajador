import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://elrincondeltrabajador.com",
  integrations: [
    react(),
    sitemap({
      filter: (page) =>
        !page.includes("/aviso-legal") &&
        !page.includes("/privacidad") &&
        !page.includes("/cookies"),
    }),
  ],
  vite: { plugins: [tailwindcss()] },
});
