const sitemap = require('../i18n/sl-obcine/sitemap.json');

const env = process.env.NODE_ENV;

const config = {
  port: 3066,
  serverTimeout: 120000,
  urls: {
    cdn: 'https://parlassets-ajdovscina.lb.djnd.si',
    cards: 'https://parlacards-ajdovscina.lb.djnd.si',
    parladata: 'https://parladata-ajdovscina.lb.djnd.si/v3'
  },
  locale: 'sl-obcine',
  leaderId: '261',
  rootOrgId: '2',
  siteMap: sitemap,
};

module.exports = config;
