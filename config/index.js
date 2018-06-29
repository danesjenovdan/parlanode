/* eslint-disable global-require */
const _ = require('lodash');

let config;
const env = process.env.NODE_ENV;
const port = Number.parseInt(process.env.PORT, 10) || 3000;

const defaultConfig = {
  port,
  serverTimeout: 30000,
  db: {
    name: 'parla-db',
    url: 'localhost',
    user: `${process.env.MONGO_USERNAME}`,
    password: `${process.env.MONGO_PASSWORD}`,
  },
  urls: {
    analize: 'https://analize.parlameter.si/v1',
    // data: 'https://data.parlameter.si/v1',
    // isci: 'https://isci.parlameter.si',
    // glej: 'https://glej.parlameter.si',
    // base: 'https://parlameter.si',
  },
  cardLang: 'sl',
  ogCapturePath: './og',
  ogRootUrl: `http://localhost:${port}/og_cards`,
};

if (env === 'production') {
  config = require('./production');
} else if (env === 'development') {
  config = require('./development');
} else {
  config = require('./sample');
}

module.exports = _.merge({}, defaultConfig, config);
