const chalk = require('chalk');
const fs = require('fs-extra');
const _ = require('lodash');
const fetch = require('node-fetch');
const { urls, locale, defaultCardDate } = require('../config');

function stringifyParams(params) {
  if (Object.keys(params).length > 0) {
    const query = Object.keys(params)
      .filter(key => params[key] != null) // maybe params[key] is undefined
      .map((key) => {
        const val = (typeof params[key] === 'object')
          ? JSON.stringify(params[key])
          : String(params[key]);
        return `${key}=${encodeURIComponent(val)}`;
      })
      .join('&');
    return `?${query}`;
  }
  return '';
}

function slovenianDate(isoDate) {
  if (!isoDate) {
    return 'Invalid Date';
  }
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) {
    return 'Invalid Date';
  }
  return `${date.getDate()}. ${date.getMonth() + 1}. ${date.getFullYear()}`;
}

async function fetchCard(cardPath, id, params = {}) {
  // optional second argument
  if (typeof id === 'object') {
    params = id;
    id = undefined;
  }

  if (id) {
    params.id = id;
  }

  params.template = 'site';
  params.locale = locale;

  if (!params.date && defaultCardDate) {
    params.date = defaultCardDate;
  }

  const cardUrl = `${urls.cards}${cardPath}${stringifyParams(params)}`;

  // eslint-disable-next-line no-console
  console.log('Fetching:', cardUrl);

  try {
    // TODO: if fetch errors dont show 500 but return like for non ok response
    const res = await fetch(cardUrl);
    if (res.ok) {
      const text = await res.text();
      return text;
    }
    const text = await res.text();
    // eslint-disable-next-line no-console
    console.error(`Failed to fetch card: status=${res.status} text=${text}`);
    if (cardPath === '/misc/error') {
      return `<div class="alert alert-danger" style="margin-top:20px;text-align:left">Failed to fetch card: ${cardPath}<pre>Status: ${res.status}</pre><pre>${text}</pre></div>`;
    }
    return fetchCard.call(this, '/misc/error', id, { message: `Failed to fetch card: ${cardPath} (${res.status}) ${text}` });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to fetch card:', error);
    if (cardPath === '/misc/error') {
      return `<div class="alert alert-danger" style="margin-top:20px;text-align:left">Failed to fetch card: ${cardPath}<pre>${error}</pre><pre>${error.stack}</pre></div>`;
    }
    return fetchCard.call(this, '/misc/error', id, { message: `Failed to fetch card: ${cardPath}` });
  }
}

const asyncRoute = fn => (...args) => fn(...args).catch(args[2]);

const asyncRender = fn => (req, res, next) => {
  const render = (view, opts) => {
    const options = {
      ...opts,
      slovenianDate,
      fetchCard: fetchCard.bind({ req, res }),
      async: true,
    };
    res.render(view, options, (error, promise) => {
      if (error) {
        next(error);
      } else {
        promise
          .then(html => res.send(html))
          .catch(pError => next(pError));
      }
    });
  };
  try {
    const ret = fn(render, req, res, next);
    // if return value is a promise (also true with async functions)
    if (ret && ret.then && ret.catch) {
      // catch any async errors
      ret.catch(error => next(error));
    }
  } catch (error) {
    // catch any sync errors
    next(error);
  }
};

function expandProps(msg, props) {
  msg = String(msg);
  Object.keys(props).forEach((key) => {
    msg = msg.replace(`{${key}}`, String(props[key]));
  });
  return msg;
}

function i18n(lang) {
  const messages = fs.readJsonSync(`./i18n/${lang}/defaults.json`);
  const siteMap = fs.readJsonSync(`./i18n/${lang}/sitemap.json`);

  const get = (path, props = {}) => {
    const msg = messages[path] || _.get(messages, path);
    if (msg == null || msg === '[empty]' || msg === '') {
      // eslint-disable-next-line no-console
      console.warn(chalk.yellow(`[i18n] Translation value for lang="${lang}" path="${path}" is missing.`));
      return path;
    }
    if (typeof msg !== 'string') {
      // eslint-disable-next-line no-console
      console.warn(chalk.yellow(`[i18n] Translation value for lang="${lang}" path="${path}" is not a string.`));
      if (typeof msg === 'object') {
        return JSON.stringify(msg);
      }
      return String(msg);
    }
    return expandProps(msg, props);
  };

  get.exists = (path) => {
    const msg = messages[path] || _.get(messages, path);
    return !(msg == null || msg === '[empty]' || msg === '');
  };

  get.siteMap = siteMap;

  return get;
}

function getOgImageUrl(type, params = {}) {
  const url = `${urls.metaImages}/${type}`;
  const query = stringifyParams({ theme: locale, ...params });
  return `${url}${query}`;
}

module.exports = {
  stringifyParams,
  slovenianDate,
  fetchCard,
  asyncRoute,
  asyncRender,
  i18n,
  getOgImageUrl,
};
