/* eslint-disable global-require, no-console */
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

if (env === 'development') {
  config = require('./config.dev.js');
} else if (env === 'staging') {
  config = require('./config.staging.js');
} else if (env === 'production') {
  config = require('./config.prod.js');
} else {
  config = require('./config.sample.js');
  console.warn('Using sample config. Please copy and edit it accordingly, this probably won\'t run.');
  console.warn('Technically, this is an invalid environment. "development", "staging" or "production" required.');
}

module.exports = _.merge({}, defaultConfig, config);
