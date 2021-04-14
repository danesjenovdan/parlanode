import fs from 'fs-extra';
import path from 'path';
import { fastify } from 'fastify';
import fastifyStatic from 'fastify-static';

const server = fastify({ logger: true });

server.register(fastifyStatic, {
  root: path.resolve('./dist/client'),
});

const template = fs.readFileSync('./build/card-entry-client.html', 'utf-8');
const manifest = fs.readJSONSync('./dist/client/manifest.json');
const ssrManifest = fs.readJSONSync('./dist/client/ssr-manifest.json');
const slugs = fs.readJSONSync('./data/slugs.dev.json');
const siteMap = fs.readJSONSync('./data/siteMap.default.json');

const getClientAssets = (cardName) => {
  const assets = new Set();
  const chunk = manifest[`\u0000virtual:${cardName}`];
  assets.add(chunk.file);
  if (Array.isArray(chunk.css)) {
    assets.add(...chunk.css);
  }
  return assets;
};

const getRelatedAssets = (modules) => {
  const assets = new Set();
  modules.forEach((module) => {
    const files = ssrManifest[module];
    if (files) {
      files.forEach((file) => {
        assets.add(file);
      });
    }
  });
  return assets;
};

const renderAssets = (cardName, modules) => {
  let preloads = '';
  let styles = '';
  let scripts = '';
  getClientAssets(cardName).forEach((asset) => {
    if (asset.endsWith('.css')) {
      styles += `<link rel="stylesheet" href="${asset}">`;
    } else if (asset.endsWith('.js')) {
      scripts += `<script type="module" src="${asset}"></script>`;
    }
  });
  getRelatedAssets(modules).forEach((asset) => {
    if (asset.endsWith('.css')) {
      styles += `<link rel="stylesheet" href="${asset}">`;
    } else if (asset.endsWith('.js')) {
      preloads += `<link rel="modulepreload" href="${asset}">`;
    }
  });
  return { preloads, styles, scripts };
};

const renderInitialState = (state) => {
  const json = JSON.stringify(state);
  return `<script>window.__INITIAL_STATE__=${json};</script>`;
};

const renderCard = async (cardName) => {
  const locale = 'sl'; // TODO: from request
  const [cardData, cardState, i18nDefault, i18nCard] = await Promise.all([
    fs.readJSON(`./cards/${cardName}/data.json`), // TODO: fetch
    fs.readJSON(`./cards/${cardName}/state.json`), // TODO: from request
    fs.readJSON(`./cards/_i18n/${locale}/defaults.json`), // TODO: preload on start
    fs.readJSON(`./cards/_i18n/${locale}/${cardName}.json`), // TODO: preload on start
  ]);

  const {
    default: { default: render },
  } = await import(`../dist/server/${cardName}.cjs`);

  const uid = Math.random().toString(36).slice(2);
  const mountId = `${cardName.replace(/\//g, '_')}__${uid}`;
  const contextData = {
    mountId,
    cardName,
    cardData,
    cardState,
    slugs,
    siteMap,
  };
  const i18nData = {
    locale,
    i18nDefault,
    i18nCard,
  };

  const [cardHtml, ctx] = await render(contextData, i18nData);
  const initialState = renderInitialState({ contextData, i18nData });
  const { preloads, styles, scripts } = renderAssets(cardName, ctx.modules);

  const html = template
    .replace(
      `<!--ssr-outlet-->`,
      styles + preloads + cardHtml + initialState + scripts
    )
    .replace(
      '<!--container-class-->',
      contextData.template.frameContainerClass
    );

  return html;
};

server.get('/test', async (request, reply) => {
  const html = await renderCard('group/osnovne-informacije');
  reply.type('text/html').send(html);
});

(async () => {
  try {
    await server.listen(3000); // TODO: from config
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
})();
