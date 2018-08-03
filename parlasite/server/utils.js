const chalk = require('chalk');
const fs = require('fs-extra');
const _ = require('lodash');
const fetch = require('node-fetch');
const data = require('./data');

function stringifyParams(params) {
  if (Object.keys(params).length > 0) {
    const query = Object.keys(params)
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

async function fetchCard(cardPath, id, params = {}) {
  // optional second argument
  if (typeof id === 'object') {
    params = id;
    id = undefined;
  }

  if (this.req.query.forceRender) {
    params.forceRender = true;
  }

  const idParam = id != null ? id : '';
  const cardUrl = `${data.urls.glej}${cardPath}${idParam}${stringifyParams(params)}`;

  // eslint-disable-next-line no-console
  console.log('Fetching:', cardUrl);

  // TODO: if fetch errors dont show 500 but return like for non ok response
  const res = await fetch(cardUrl);
  if (res.ok) {
    const text = await res.text();
    return text;
  }
  return `<div class="alert alert-danger">Failed to render card: ${cardPath}</div>`;
}

const asyncRoute = fn => (...args) => fn(...args).catch(args[2]);

const asyncRender = fn => (req, res, next) => {
  const render = (view, opts) => {
    const options = {
      ...opts,
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
  fn(render, req, res, next);
};

function expandProps(msg, data) {
  msg = String(msg);
  Object.keys(data).forEach((key) => {
    msg = msg.replace(`{${key}}`, String(data[key]));
  });
  return msg;
}

function i18n(lang) {
  const messages = fs.readJsonSync(`./i18n/${lang}/defaults.json`);

  return (path, data = {}) => {
    const msg = messages[path] || _.get(messages, path);
    if (!msg) {
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
    return expandProps(msg, data);
  };
}

module.exports = {
  fetchCard,
  asyncRoute,
  asyncRender,
  i18n,
};
