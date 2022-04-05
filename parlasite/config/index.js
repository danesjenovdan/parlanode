const config = {
  port: 3066,
  serverTimeout: 120000,
  urls: {
    // cdn: 'http://localhost:8080',
    // cards: 'http://localhost:7004',
    // parladata: 'http://localhost:8000/v3',
    cdn: 'https://parlassets-bosna.lb.djnd.si',
    cards: 'https://parlacards-bosna.lb.djnd.si',
    parladata: 'https://parladata-bosna.lb.djnd.si/v3',
    metaImages: 'https://meta-image-generator.lb.djnd.si/parlameter',
  },
  locale: 'bs',
  leaderId: '261',
  rootOrgId: '6',
  rootOrgId2: '23',
  mandateId: '1',
};

module.exports = config;
