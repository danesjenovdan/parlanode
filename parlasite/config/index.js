const config = {
  port: 3066,
  serverTimeout: 120000,
  urls: {
    // cdn: 'http://localhost:8080',
    // cards: 'http://localhost:7004',
    // parladata: 'http://localhost:8000/v3',
    cdn: 'https://parlassets-ua.lb.djnd.si',
    cards: 'https://parlacards-ua.lb.djnd.si',
    parladata: 'https://parladata-ua.lb.djnd.si/v3',
    metaImages: 'https://meta-image-generator.lb.djnd.si/parlameter',
  },
  metaImagesTheme: 'ua',
  locale: 'ua',
  leaderId: 'changeme',
  rootOrgId: '1',
  mandateId: '1',
};

module.exports = config;
