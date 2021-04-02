import { defineConfig, loadEnv } from 'vite';
import { fileURLToPath } from 'url';
import { resolve, dirname } from 'path';
import { get } from 'lodash-es';
import sass from 'sass';
import vue from '@vitejs/plugin-vue';
import serveDevCards from './plugin-serve-dev-cards.js';
import config from '../config/development.js';

const dir = dirname(fileURLToPath(import.meta.url));
const root = resolve(dir, '..');

export default defineConfig(({ mode }) => {
  Object.assign(process.env, loadEnv(mode, root));
  return {
    clearScreen: false,
    root,
    plugins: [vue(), serveDevCards()],
    resolve: {
      alias: {
        '@': resolve(root, 'cards'),
        parlassets: resolve(root, 'parlassets'),
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          functions: {
            'get-config-value($key)': (key) => {
              const value = get(config, key.getValue().split('.'));
              if (typeof value === 'string') {
                return new sass.types.String(value);
              }
              return key;
            },
          },
        },
      },
    },
  };
});
