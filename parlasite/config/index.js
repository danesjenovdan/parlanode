const sitemap = require('../i18n/ua/sitemap.json');

const env = process.env.NODE_ENV;

const config = {
  port: 3066,
  serverTimeout: 120000,
  urls: {
    cdn: 'https://parlassets-ua.lb.djnd.si',
    cards: 'https://parlacards-ua.lb.djnd.si',
    parladata: 'https://parladata-ua.lb.djnd.si/v3',
  },
  locale: 'ua',
  leaderId: 'changeme',
  siteMap: sitemap
};

module.exports = config;
