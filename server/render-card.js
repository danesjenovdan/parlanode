import fs from 'fs-extra';
import {
  createError,
  loadLocale,
  loadCardModule,
  getCardDataUrl,
  fetchCardData,
  parseCardState,
  getUrls,
} from './utils.js';

const templates = {
  dev: fs.readFileSync('./build/card-template-dev.html', 'utf-8'),
  // frame: fs.readFileSync('./build/card-template-frame.html', 'utf-8'),
  // embed: fs.readFileSync('./build/card-template-embed.html', 'utf-8'),
  site: fs.readFileSync('./build/card-template-site.html', 'utf-8'),
};

const getTemplate = (template) => {
  if (Object.prototype.hasOwnProperty.call(templates, template)) {
    return templates[template];
  }
  return templates.dev;
};

const manifest = fs.readJSONSync('./dist/client/manifest.json');
const ssrManifest = fs.readJSONSync('./dist/client/ssr-manifest.json');

const siteMap = fs.readJSONSync('./data/siteMap.default.json'); // TODO: get from parlasite

const getClientAssets = (cardName) => {
  const assets = new Set();
  const chunk = manifest[`\u0000virtual:${cardName}`];
  assets.add(`${process.env.VITE_PARLACARDS_URL}/assets/${chunk.file}`);
  if (Array.isArray(chunk.css)) {
    assets.add(
      ...chunk.css.map(
        (css) => `${process.env.VITE_PARLACARDS_URL}/assets/${css}`
      )
    );
  }
  return assets;
};

const getRelatedAssets = (modules) => {
  const assets = new Set();
  modules.forEach((module) => {
    const files = ssrManifest[module];
    if (files) {
      files.forEach((file) => {
        assets.add(`${process.env.VITE_PARLACARDS_URL}/assets${file}`);
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

const renderCard = async ({ cardName, id, date, locale, template, state }) => {
  const [{ render }, localeData] = await Promise.all([
    await loadCardModule(cardName),
    await loadLocale(locale),
  ]);

  if (!render) {
    throw createError(404, 'Not Found', `Card ${cardName} not found`);
  }
  if (!localeData) {
    throw createError(404, 'Not Found', `Locale ${locale} not found`);
  }

  const defaultMessages = localeData.defaults ?? {};
  const cardMessages = localeData[cardName] ?? {};

  const dataUrl = getCardDataUrl(cardName, id, date);
  const cardData = await fetchCardData(dataUrl, id, date);
  const cardState = parseCardState(state);
  const urls = getUrls();

  const uid = Math.random().toString(36).slice(2);
  const mountId = `${cardName.replace(/\//g, '_')}__${uid}`;
  const contextData = {
    mountId,
    cardName,
    cardData,
    cardState,
    urls,
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

  const html = getTemplate(template)
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

// eslint-disable-next-line import/prefer-default-export
export { renderCard };
