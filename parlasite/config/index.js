const sitemap = require('../i18n/sl-obcine/sitemap.json');

const env = process.env.NODE_ENV;

const config = {
  port: 3066,
  serverTimeout: 120000,
  urls: {
    cdn: 'https://cdn.ljubljana.parlameter.si',
    cards: 'https://glej.ljubljana.parlameter.si',
    parladata: 'https://data.ljubljana.parlameter.si/v3',
  },
  locale: 'sl-obcine',
  leaderId: '261',
  siteMap: sitemap,
};

module.exports = config;
