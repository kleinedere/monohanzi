import { defineConfig } from "astro/config";

const base = process.env.PUBLIC_BASE_PATH ?? "/monohanzi";

export default defineConfig({
  site: process.env.PUBLIC_SITE ?? "https://sqd11.github.io",
  base,
  output: "static"
});
