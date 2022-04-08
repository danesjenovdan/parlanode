const config = {
  port: 3066,
  serverTimeout: 120000,
  urls: {
    // cdn: 'http://localhost:8080',
    // cards: 'http://localhost:7004',
    // parladata: 'http://localhost:8000/v3',
    cdn: 'https://parlassets-hrastnik.lb.djnd.si',
    cards: 'https://parlacards-hrastnik.lb.djnd.si',
    parladata: 'https://parladata-hrastnik.lb.djnd.si/v3',
    metaImages: 'https://meta-image-generator.lb.djnd.si/parlameter',
  },
  locale: 'sl-obcina-hrastnik',
  leaderId: '261',
  rootOrgId: '6',
  mandateId: '1',
};

module.exports = config;
