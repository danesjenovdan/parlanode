const config = {
  port: 3066,
  serverTimeout: 120000,
  urls: {
    // cdn: 'http://localhost:8080',
    // cards: 'http://localhost:7004',
    // parladata: 'http://localhost:8000/v3',
    cdn: 'https://cdn.ljubljana.parlameter.si',
    cards: 'https://glej.ljubljana.parlameter.si',
    parladata: 'https://data.ljubljana.parlameter.si/v3',
    metaImages: 'https://meta-image-generator.lb.djnd.si/parlameter',
  },
  locale: 'sl-obcina-ljubljana',
  leaderId: '261',
  rootOrgId: '1',
  mandateId: '1',
};

module.exports = config;
