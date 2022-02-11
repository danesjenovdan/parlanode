const sitemap = require('../i18n/sl-obcine/sitemap.json');

const config = {
  port: 3066,
  serverTimeout: 120000,
  urls: {
    // cdn: 'http://localhost:8080',
    // cards: 'http://localhost:7004',
    // parladata: 'http://localhost:8000/v3',
    cdn: 'https://parlassets-ajdovscina.lb.djnd.si',
    cards: 'https://parlacards-ajdovscina.lb.djnd.si',
    parladata: 'https://parladata-ajdovscina.lb.djnd.si/v3',
    metaImages: 'https://meta-image-generator.lb.djnd.si/parlameter',
  },
  metaImagesTheme: 'ljubljana',
  locale: 'sl-obcine',
  leaderId: '261',
  rootOrgId: '2',
  siteMap: sitemap,
};

module.exports = config;
