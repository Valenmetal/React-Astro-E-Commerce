import { defineConfig } from "astro/config";

// https://astro.build/config
import react from "@astrojs/react";

// https://astro.build/config
import vercel from "@astrojs/vercel/serverless";

// https://astro.build/config

// https://astro.build/config
export default defineConfig({
  integrations: [react()],
  site: "https://valenmetal.github.io",
  base: "/React-Astro-E-Commerce",
  output: "server",
  adapter: vercel()
});