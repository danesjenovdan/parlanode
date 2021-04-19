import { defineConfig, loadEnv } from 'vite';
import { fileURLToPath } from 'url';
import { resolve, dirname } from 'path';
import yaml from '@rollup/plugin-yaml';
import vue from '@vitejs/plugin-vue';
import serveDevCards from './plugin-serve-dev-cards.js';
import scssFunctions from './scss-functions.js';

const dir = dirname(fileURLToPath(import.meta.url));
const root = resolve(dir, '..');

export default defineConfig(({ mode }) => {
  Object.assign(process.env, loadEnv(mode, root));
  return {
    clearScreen: false,
    root,
    plugins: [yaml(), vue(), serveDevCards()],
    resolve: {
      alias: {
        '@': resolve(root, 'cards'),
        parlassets: resolve(root, 'parlassets'),
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          functions: scssFunctions,
        },
      },
    },
  };
});
