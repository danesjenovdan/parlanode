/* global console */

/* global console */

const sample = {
  port: 3000,
  serverTimeout: 600000,
  db: {
    name: 'parla-db',
    url: 'mongodb://localhost/',
    user: `${process.env.MONGO_USERNAME}`, // or username in plaintext
    password: `${process.env.MONGO_PASSWORD}`, // or password in plaintext
  },
  urls: {
    analize: 'https://analize.parlameter.si', // DATA URL BASE
  },
  apiPrefix: '/api',
  ogCapturePath: './og',
  ogRootUrl: 'https://cdn.parlameter.si/v1/parlassets/og_cards', // root url for OG images
  cardCapturePath: './card_captures', // where cards are stored
};

module.exports = sample;
