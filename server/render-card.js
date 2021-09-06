import fs from 'fs-extra';
import stringify from 'html-safe-json';
import {
  loadLocale,
  loadCardModule,
  getCardDataUrl,
  fetchCardData,
  getUrls,
  fetchSiteMap,
} from './utils.js';

const templates = {
  dev: fs.readFileSync('./build/card-template-dev.html', 'utf-8'),
  share: fs.readFileSync('./build/card-template-share.html', 'utf-8'),
  // embed: fs.readFileSync('./build/card-template-embed.html', 'utf-8'),
  site: fs.readFileSync('./build/card-template-site.html', 'utf-8'),
};

const getTemplate = (name, replacements = {}) => {
  if (!Object.prototype.hasOwnProperty.call(templates, name)) {
    throw new Error(`Template ${name} not found`);
  }

  let template = templates[name];
  // eslint-disable-next-line no-restricted-syntax
  for (const [key, value] of Object.entries(replacements)) {
    template = template.replaceAll(`<!--${key}-->`, value);
  }

  return template;
};

const manifest = fs.readJSONSync('./dist/client/manifest.json');
const ssrManifest = fs.readJSONSync('./dist/client/ssr-manifest.json');

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

const renderAssets = (cardName, modules, mountId) => {
  const preloads = '';
  let styles = '';
  let scripts = '';
  getClientAssets(cardName).forEach((asset) => {
    if (asset.endsWith('.css')) {
      styles += `<link rel="stylesheet" href="${asset}">`;
    } else if (asset.endsWith('.js')) {
      scripts += `<script type="module" src="${asset}?mountId=${mountId}"></script>`;
    }
  });
  getRelatedAssets(modules).forEach((asset) => {
    if (asset.endsWith('.css')) {
      styles += `<link rel="stylesheet" href="${asset}">`;
    } /* else if (asset.endsWith('.js')) {
      preloads += `<link rel="modulepreload" href="${asset}?mid=${mountId}">`;
    } */
  });
  return { preloads, styles, scripts };
};

const renderInitialState = (state) => {
  const json = stringify(state);
  return `<script type="module">window.__INITIAL_STATE__=${json};</script>`;
};

const renderCard = async ({ cardName, id, date, locale, template, state }) => {
  const [{ render }, localeData] = await Promise.all([
    await loadCardModule(cardName),
    await loadLocale(locale),
  ]);

  if (!render) {
    throw new Error(`Card ${cardName} not found`);
  }
  if (!localeData) {
    throw new Error(`Locale ${locale} not found`);
  }

  const defaultMessages = localeData.defaults ?? {};
  const cardMessages = localeData[cardName] ?? {};

  const dataUrl = getCardDataUrl(cardName, id, date, state);
  const cardData = await fetchCardData(dataUrl, id, date);
  const cardState = { ...state };
  const urls = getUrls();
  const siteMap = await fetchSiteMap();

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
  const { preloads, styles, scripts } = renderAssets(
    cardName,
    ctx.modules,
    mountId
  );

  const outputHtml = `${styles}${preloads}<div id="${mountId}">${cardHtml}</div>${initialState}${scripts}`;

  const html = getTemplate(template, {
    'page-title': contextData.template.pageTitle,
    'parlassets-url': urls.cdn,
    'container-class': contextData.template.frameContainerClass,
    'ssr-outlet': outputHtml,
    'debug-data-url': cardData.url,
  });

  return html;
};

// eslint-disable-next-line import/prefer-default-export
export { renderCard };
