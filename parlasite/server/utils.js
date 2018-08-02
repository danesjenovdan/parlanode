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

async function fetchCard(cardPath, { customUrl } = {}) {
  console.log('fetch card called', cardPath, customUrl);

  const cardUrl = `${config.urls.glej}${cardPath}`;
  console.log(cardUrl);

  const res = await fetch(cardUrl);
  const text = await res.text();
  return text;
}

module.exports = {
  asyncRoute,
  asyncRender,
  fetchCard,
};
