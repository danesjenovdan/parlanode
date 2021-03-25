import { defineConfig } from "vite";
import { fileURLToPath } from "url";
import { resolve, dirname } from "path";
import vue from "@vitejs/plugin-vue";
import serveDevCards from "./plugin-serve-dev-cards.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  clearScreen: false,
  root: resolve(__dirname, "..", "cards"),
  plugins: [
    vue(),
    serveDevCards(),
  ],
  resolve: {
    alias: {
      // TODO: use ~ and/or @ alias for all of these
      components: resolve("cards", "_components"),
      helpers: resolve("cards", "_helpers"),
      mixins: resolve("cards", "_mixins"),
      directives: resolve("cards", "_directives"),
      i18n: resolve("cards", "_i18n"),
      // 'i18n/card.json$': i18nCardPath,
      // 'i18n/defaults.json$': i18nDefaultPath,
      parlassets: resolve("parlassets"),
    },
  },
});
