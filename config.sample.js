/* global console */

const dev = {
  port: 3000,
  serverTimeout: 600000,
  db: {
    name: 'parla-db',
    url: 'mongodb://localhost/',
  },
  urls: {
    analize: 'http://localhost:8000', // DATA URL BASE
  },
  apiPrefix: '/api',
  ogCapturePath: './og',
  ogRootUrl: 'https://cdn.whatever.com/og_cards/', // root url for OG images
  cardCapturePath: './card_captures', // where cards are stored
};

const production = {
  port: 3000,
  serverTimeout: 600000,
  db: {
    name: 'parla-db',
    url: 'mongodb://localhost/',
  },
  urls: {
    analize: 'http://localhost:8000', // DATA URL BASE
  },
  apiPrefix: '/api',
  ogCapturePath: './og',
  ogRootUrl: 'https://cdn.whatever.com/og_cards/', // root url for OG images
  cardCapturePath: './card_captures', // where cards are stored
};

const stage = {
  port: 3000,
  serverTimeout: 600000,
  db: {
    name: 'parla-db',
    url: 'mongodb://localhost/',
  },
  urls: {
    analize: 'http://localhost:8000', // DATA URL BASE
  },
  apiPrefix: '/api',
  ogCapturePath: './og',
  ogRootUrl: 'https://cdn.whatever.com/og_cards/', // root url for OG images
  cardCapturePath: './card_captures', // where cards are stored
};

const test = {
  port: 3000,
  serverTimeout: 600000,
  db: {
    name: 'parla-db',
    url: 'mongodb://localhost/',
  },
  urls: {
    analize: 'http://localhost:8000', // DATA URL BASE
  },
  apiPrefix: '/api',
  ogCapturePath: './og',
  ogRootUrl: 'https://cdn.whatever.com/og_cards/', // root url for OG images
  cardCapturePath: './card_captures', // where cards are stored
};


if (!process.env.NODE_ENV) throw new Error('NODE_ENV environment variable missing. Use either "development" or "production"');

let cfg = process.env.NODE_ENV === 'development' ? dev : production;

cfg = process.env.NODE_ENV === 'stage' ? stage : cfg;

console.log(`CFG: ${JSON.stringify(cfg)}`);

if (process.env.NODE_ENV === 'test') {
  cfg = test;
}

module.exports = cfg;
