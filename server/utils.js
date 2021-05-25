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

function getCardDataUrl(cardName, id, date) {
  const searchParams = new URLSearchParams();
  if (id) {
    searchParams.set('id', id);
  }
  if (date) {
    searchParams.set('date', date);
  }
  const queryString = searchParams.toString();
  return `{parladata}/${cardName}/${queryString ? `?${queryString}` : ''}`;
}

function expandUrl(dataUrl) {
  if (typeof dataUrl === 'string') {
    return dataUrl.replace(/^{parladata}/, process.env.VITE_PARLADATA_URL);
  }
  return null;
}

const fetchCardData = async (dataUrl) => {
  const expandedUrl = expandUrl(dataUrl);
  if (expandedUrl) {
    let response;
    try {
      response = await axios.get(expandedUrl);
    } catch (error) {
      return {
        url: expandedUrl,
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
      error: false,
      data: response.data,
    };
  }
  return {
    url: expandedUrl,
    error: false,
    data: null,
  };
};

const parseCardState = (stateString) => {
  if (stateString != null) {
    let state;
    try {
      state = JSON.parse(stateString);
    } catch (error) {
      return {
        string: stateString,
        error: createError(0, error.name, error.message, error.code),
        data: state,
      };
    }
    return {
      string: stateString,
      error: false,
      data: state,
    };
  }
  return {
    string: stateString,
    error: false,
    data: null,
  };
};

export {
  createError,
  loadCardModule,
  loadLocale,
  getCardDataUrl,
  fetchCardData,
  parseCardState,
};
