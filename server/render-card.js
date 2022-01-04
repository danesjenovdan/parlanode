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
  embed: fs.readFileSync('./build/card-template-embed.html', 'utf-8'),
  site: fs.readFileSync('./build/card-template-site.html', 'utf-8'),
};

const getTemplate = (templateName) => {
  if (!Object.prototype.hasOwnProperty.call(templates, templateName)) {
    throw new Error(`Template '${templateName}' not found`);
  }

  return (replacements = {}) => {
    let template = templates[templateName];

    // eslint-disable-next-line no-restricted-syntax
    for (const [key, value] of Object.entries(replacements)) {
      template = template.replaceAll(`<!--${key}-->`, value);
    }

    return template;
  };
};

const manifest = fs.readJSONSync('./dist/client/manifest.json');

const getChunkAssets = (chunkName, seenChunks = new Set()) => {
  let entry = null;
  const assets = new Set();

  if (!seenChunks.has(chunkName)) {
    seenChunks.add(chunkName);

    const chunk = manifest[chunkName];
    if (chunk) {
      entry = `${process.env.VITE_PARLACARDS_URL}/assets/${chunk.file}`;
      assets.add(entry);
      if (Array.isArray(chunk.css)) {
        chunk.css.forEach((css) => {
          assets.add(`${process.env.VITE_PARLACARDS_URL}/assets/${css}`);
        });
      }
      if (Array.isArray(chunk.imports)) {
        chunk.imports.forEach((importChunkName) => {
          const importAssets = getChunkAssets(importChunkName, seenChunks)[1];
          importAssets.forEach((importAsset) => {
            assets.add(importAsset);
          });
        });
      }
    }
  }

  return [entry, assets];
};

const getClientAssets = (cardName) => {
  return getChunkAssets(`\u0000virtual:${cardName}`);
};

const renderAssets = (cardName, modules, mountId) => {
  let preloads = '';
  let styles = '';
  let scripts = '';

  const [entry, assets] = getClientAssets(cardName);
  scripts += `<script type="module" src="${entry}?mountId=${mountId}"></script>`;
  assets.forEach((asset) => {
    if (asset.endsWith('.css')) {
      styles += `<link rel="stylesheet" href="${asset}">`;
    } else if (asset.endsWith('.js')) {
      preloads += `<link rel="modulepreload" href="${asset}">`;
    }
  });

  return { preloads, styles, scripts };
};

const renderInitialState = (state) => {
  const json = stringify(state);
  return `<script type="module">window.__INITIAL_STATE__=${json};</script>`;
};

const renderCard = async ({ cardName, id, date, locale, template, state }) => {
  if (!id) {
    throw new Error(`Query parameter 'id' missing`);
  }
  if (!template) {
    throw new Error(`Query parameter 'template' missing`);
  }

  const renderTemplate = getTemplate(template);

  const [{ render }, localeData] = await Promise.all([
    await loadCardModule(cardName),
    await loadLocale(locale),
  ]);

  if (!render) {
    throw new Error(`Card '${cardName}' not found`);
  }
  if (!localeData) {
    throw new Error(`Locale '${locale}' not found`);
  }

  const defaultMessages = localeData.defaults ?? {};
  const cardMessages = localeData[cardName] ?? {};

  let cardData = {};
  if (cardName !== 'misc/error') {
    const dataUrl = getCardDataUrl(cardName, id, date, state);
    cardData = await fetchCardData(dataUrl, id, date);

    if (cardData.error) {
      // if the API answers with a 404 we should gracefully
      // handle it instead of erroring out
      //
      // we change the name of the card to misc/error to render
      // the error card and we pass the error object to the
      // card state
      //
      // the misc/error card checks if cardState.error.statusCode
      // equals 404 and reacts accordingly
      //
      // all other cases error out completely
      if (cardData.error.statusCode === 404) {
        cardName = 'misc/error';
        state.error = cardData.error;
      } else {
        const { error, url } = cardData;
        const message = error?.message ?? 'Request failed';
        throw new Error(`${message} (${url})`);
      }
    }
  }

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
    templateName: template,
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

  const html = renderTemplate({
    'page-title': contextData.template.pageTitle,
    'parlassets-url': urls.cdn,
    'container-class': contextData.template.frameContainerClass,
    'embed-class': contextData.template.embedContainerClass,
    'context-url': contextData.template.contextUrl,
    'ssr-outlet': outputHtml,
    'debug-data-url': cardData.url,
  });

  return html;
};

// eslint-disable-next-line import/prefer-default-export
export { renderCard };
