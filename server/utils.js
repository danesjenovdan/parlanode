import fs from 'fs-extra';
import axios from 'axios';

const createError = (statusCode, error, message, code) => {
  const obj = {
    message,
    error,
    statusCode,
  };
  if (code) {
    obj.code = code;
  }
  return obj;
};

const loadCardModule = async (cardName) => {
  let module;
  try {
    module = await import(`../dist/server/${cardName}.cjs`);
  } catch (error) {
    if (error.code !== 'ERR_MODULE_NOT_FOUND') {
      throw error;
    }
  }
  return {
    render: module?.default?.default,
  };
};

const localeCache = {};

const loadLocale = async (locale) => {
  if (!(locale in localeCache)) {
    try {
      localeCache[locale] = await fs.readJSON(`./dist/locales/${locale}.json`);
    } catch (error) {
      if (error.code !== 'ENOENT') {
        throw error;
      }
      localeCache[locale] = null;
    }
  }
  return localeCache[locale];
};

function getCardDataUrl(cardName, id, date, state) {
  const searchParams = new URLSearchParams();

  // base params
  if (id) {
    searchParams.set('id', id);
  }
  if (date) {
    searchParams.set('date', date);
  }

  // search params
  if (state?.text) {
    searchParams.set('text', state?.text);
  }
  if (state?.months) {
    searchParams.set('months', state?.months);
  }
  if (state?.people) {
    searchParams.set('people', state?.people);
  }
  if (state?.groups) {
    searchParams.set('groups', state?.groups);
  }

  const qs = searchParams.toString();
  return `{parladata}/cards/${cardName}/${qs ? `?${qs}` : ''}`;
}

function expandUrl(dataUrl) {
  if (typeof dataUrl === 'string') {
    return dataUrl.replace(/^{parladata}/, process.env.VITE_PARLADATA_URL);
  }
  return null;
}

const fetchCardData = async (dataUrl, id, date) => {
  const expandedUrl = expandUrl(dataUrl);
  if (expandedUrl) {
    let response;
    try {
      response = await axios.get(expandedUrl);
    } catch (error) {
      return {
        url: expandedUrl,
        id,
        date,
        error: createError(
          error.response?.status ?? 0,
          error.name,
          error.message,
          error.code
        ),
        data: error.response?.data,
      };
    }
    if (typeof response.data !== 'object') {
      return {
        url: expandedUrl,
        id,
        date,
        error: createError(
          response.status ?? 0,
          'Error',
          'Request did not return valid json data'
        ),
        data: response.data,
      };
    }
    return {
      url: expandedUrl,
      id,
      date,
      error: false,
      data: response.data,
    };
  }
  return {
    url: expandedUrl,
    id,
    date,
    error: false,
    data: null,
  };
};

const getUrls = () => {
  return {
    site: process.env.VITE_PARLASITE_URL,
    cards: process.env.VITE_PARLACARDS_URL,
    data: process.env.VITE_PARLADATA_URL,
    cdn: process.env.VITE_PARLASSETS_URL,
  };
};

const siteMapCache = {
  value: null,
  default: fs.readJSONSync('./data/siteMap.default.json'),
};

const fetchSiteMap = async () => {
  if (siteMapCache.value) {
    return siteMapCache.value;
  }
  try {
    const response = await axios.get(
      `${process.env.VITE_PARLASITE_URL}/api/sitemap`
    );
    siteMapCache.value = response.data;
    return siteMapCache.value;
  } catch (error) {
    return siteMapCache.default;
  }
};

export {
  createError,
  loadCardModule,
  loadLocale,
  getCardDataUrl,
  fetchCardData,
  getUrls,
  fetchSiteMap,
};
