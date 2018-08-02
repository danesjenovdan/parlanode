const fetch = require('node-fetch');
const config = require('../config');

const asyncRoute = fn => (...args) => fn(...args).catch(args[2]);

const asyncRender = fn => (req, res, next) => {
  const render = (view, opts) => {
    res.render(view, { ...opts, async: true }, (error, promise) => {
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

  // TODO: forceRender
  // if (req.query.forceRender) {
  //   params.forceRender = true;
  // }

  const idParam = id != null ? id : '';
  const cardUrl = `${config.urls.glej}${cardPath}${idParam}${stringifyParams(params)}`;

  // eslint-disable-next-line no-console
  console.log('Fetching:', cardUrl);

  const res = await fetch(cardUrl);
  if (res.ok) {
    const text = await res.text();
    return text;
  }
  return `<div class="alert alert-danger">Failed to render card: ${cardPath}</div>`;
}

module.exports = {
  asyncRoute,
  asyncRender,
  fetchCard,
};
