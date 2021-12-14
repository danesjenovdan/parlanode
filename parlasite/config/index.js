const sitemap = require('../i18n/sl-obcine/sitemap.json');

const env = process.env.NODE_ENV;

const config = {
  port: 3066,
  serverTimeout: 120000,
  urls: {
    cdn: 'https://parlassets-lendava.lb.djnd.si',
    cards: 'https://parlacards-lendava.lb.djnd.si',
    parladata: 'https://parladata-lendava.lb.djnd.si/v3',
  },
  locale: 'sl-obcine',
  leaderId: '261',
  siteMap: sitemap,
};

module.exports = config;
