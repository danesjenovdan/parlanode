import fs from 'fs-extra';

const createError = (statusCode, error, message) => ({
  message,
  error,
  statusCode,
});

const loadCardModule = async (cardName) => {
  let module;
  try {
    module = await import(`../dist/server/${cardName}.cjs`);
  } catch (error) {
    if (error.code !== 'ERR_MODULE_NOT_FOUND') {
      throw error;
    }
  }
  return module?.default?.default;
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
    }
  }
  return localeCache[locale];
};

export { createError, loadCardModule, loadLocale };
