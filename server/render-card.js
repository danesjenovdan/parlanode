import fs from 'fs-extra';
import {
  createError,
  loadLocale,
  loadCardModule,
  getCardDataUrl,
  fetchCardData,
  parseCardState,
} from './utils.js';

const template = fs.readFileSync('./build/card-entry-client.html', 'utf-8');
const manifest = fs.readJSONSync('./dist/client/manifest.json');
const ssrManifest = fs.readJSONSync('./dist/client/ssr-manifest.json');

const slugs = fs.readJSONSync('./data/slugs.dev.json'); // TODO: get from parladata
const siteMap = fs.readJSONSync('./data/siteMap.default.json'); // TODO: get from parlasite

const getClientAssets = (cardName) => {
  const assets = new Set();
  const chunk = manifest[`\u0000virtual:${cardName}`];
  assets.add(`/assets/${chunk.file}`);
  if (Array.isArray(chunk.css)) {
    assets.add(...chunk.css.map((css) => `/assets/${css}`));
  }
  return assets;
};

const getRelatedAssets = (modules) => {
  const assets = new Set();
  modules.forEach((module) => {
    const files = ssrManifest[module];
    if (files) {
      files.forEach((file) => {
        assets.add(`/assets${file}`);
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
  return `<script type="module">window.__INITIAL_STATE__=${json};</script>`;
};

const renderCard = async ({ cardName, id, date, locale, state }) => {
  const [{ render }, localeData] = await Promise.all([
    await loadCardModule(cardName),
    await loadLocale(locale),
  ]);

  if (!render) {
    return [createError(404, 'Not Found', `Card ${cardName} not found`)];
  }
  if (!localeData) {
    return [createError(404, 'Not Found', `Locale ${locale} not found`)];
  }

  const defaultMessages = localeData.defaults ?? {};
  const cardMessages = localeData[cardName] ?? {};

  // TODO: support custom data url?
  const dataUrl = getCardDataUrl(cardName, id, date);

  const cardData = await fetchCardData(dataUrl);
  const cardState = parseCardState(state);

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
    defaultMessages,
    cardMessages,
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

  return [null, html];
};

// eslint-disable-next-line import/prefer-default-export
export { renderCard };
