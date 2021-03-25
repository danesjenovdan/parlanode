import { defineConfig } from "vite";
import { readFileSync } from "fs";
import { resolve } from "path";
import vue from "@vitejs/plugin-vue";
import virtual from "@rollup/plugin-virtual";
// import legacy from "@vitejs/plugin-legacy";
import glob from 'glob';

const buildClient = readFileSync("./cards/entry-client.js", "utf-8");

const files = glob.sync('./cards/**/card.json');
// console.log(files)

const inputs = files.reduce((prev, curr) => {
  const cardName = curr.split('/').slice(-3, -1).join('/');
  prev[cardName] = `entry_${cardName.replace(/\//g, '_')}`;
  return prev;
}, {});
console.log(inputs);

const virtuals = files.reduce((prev, curr) => {
  const cardName = curr.split('/').slice(-3, -1).join('/');
  prev[`entry_${cardName.replace(/\//g, '_')}`] = buildClient.replace(/{cardName}/g, cardName);
  return prev;
}, {});
// console.log(virtuals)

// https://vitejs.dev/config/
export default defineConfig({
  clearScreen: false,
  // root: './cards/_/simple-test-card',
  build: {
    manifest: true,
    target: "es2015",
    cssCodeSplit: false,
    assetsInlineLimit: Number.MAX_SAFE_INTEGER,
    rollupOptions: {
      // input: './cards/p/osnovne-informacije/card.vue',
      // input: {
      //   "p/osnovne-informacije": "entryPOsnovneInformacije",
      //   "ps/osnovne-informacije": "entryPSOsnovneInformacije",
      // },
      input: {...inputs, index: './cards/index.html'},
      // output: {
      //   // inlineDynamicImports: true,
			// 	manualChunks(id, {getModuleInfo}) {
      //     if (id.includes('node_modules')) {
      //       return 'vendor';
      //     }

      //   //   console.log('---START');
      //   //   console.log(id);
      //   //   const dependentEntryPoints = [];

      //   //   // we use a Set here so we handle each module at most once. This
      //   //   // prevents infinite loops in case of circular dependencies
      //   //   // const idsToHandle = new Set(getModuleInfo(id).dynamicImporters);

      //   //   // for (const moduleId of idsToHandle) {
      //   //   //   const { isEntry, dynamicImporters, importers } = getModuleInfo(moduleId);
      //   //   //   if (isEntry || dynamicImporters.length > 0) dependentEntryPoints.push(moduleId);

      //   //   //   // The Set iterator is intelligent enough to iterate over elements that
      //   //   //   // are added during iteration
      //   //   //   for (const importerId of importers) idsToHandle.add(importerId);
      //   //   // }
      //   //   console.log('isEntry', getModuleInfo(id).isEntry);
      //   //   console.log('dynamicImporters', getModuleInfo(id).dynamicImporters);
      //   //   console.log('importers', getModuleInfo(id).importers);
      //   //   console.log('---END');

      //     return 'everythingelse';
      //   },
			// },
    },
  },
  plugins: [
    virtual(virtuals),
    // virtual({
    //   entryPOsnovneInformacije: buildClient
    //     .replace(/{cardName}/g, "p/osnovne-informacije"),
    //   entryPSOsnovneInformacije: buildClient
    //     .replace(/{cardName}/g, "ps/osnovne-informacije"),
    // }),
    vue(),
    // legacy({
    //   targets: ["defaults", "not IE 11"],
    // }),
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
