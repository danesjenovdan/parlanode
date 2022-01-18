const sitemap = require('../i18n/sl-obcine/sitemap.json');

const env = process.env.NODE_ENV;

const config = {
  port: 3066,
  serverTimeout: 120000,
  urls: {
    cdn: 'https://parlassets-slovenija.lb.djnd.si',
    cards: 'https://parlacards-slovenija.lb.djnd.si',
    parladata: 'https://parladata-slovenija.lb.djnd.si/v3',
  },
  locale: 'sl',
  leaderId: '261',
  rootOrgId: '1',
  siteMap: sitemap,
};

module.exports = config;
