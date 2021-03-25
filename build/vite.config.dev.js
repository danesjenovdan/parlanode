import { defineConfig } from "vite";
import { fileURLToPath } from "url";
import { resolve, dirname } from "path";
import vue from "@vitejs/plugin-vue";
import serveDevCards from "./plugin-serve-dev-cards.js";

const dir = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  clearScreen: false,
  root: resolve(dir, "..", "cards"),
  plugins: [
    vue(),
    serveDevCards(),
  ],
  resolve: {
    alias: {
      '@': resolve(dir, '..' , "cards"),
      parlassets: resolve("parlassets"),
    },
  },
});
