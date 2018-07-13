const _ = require('lodash');

let config;
const env = process.env.NODE_ENV;

const defaultConfig = {
  port: 3000,
  serverTimeout: 30000,
  db: {
    name: 'parla-db',
    url: 'localhost:27017',
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
  ogRootUrl: 'http://localhost:3000/og_cards',
};

if (env === 'production') {
  // eslint-disable-next-line global-require, import/no-unresolved
  config = require('./production');
} else if (env === 'development') {
  // eslint-disable-next-line global-require, import/no-unresolved
  config = require('./development');
} else {
  // eslint-disable-next-line global-require
  config = require('./sample');
}

module.exports = _.merge({}, defaultConfig, config);
