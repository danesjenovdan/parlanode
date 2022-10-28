const config = {
  port: 3066,
  serverTimeout: 120000,
  urls: {
    // cdn: 'http://localhost:8080',
    // cards: 'http://localhost:7004',
    // parladata: 'http://localhost:8000/v3',
    cdn: 'https://cdn.lendava.parlameter.si',
    cards: 'https://glej.lendava.parlameter.si',
    parladata: 'https://data.lendava.parlameter.si/v3',
    metaImages: 'https://meta-image-generator.lb.djnd.si/parlameter',
  },
  locale: 'sl-obcina-lendava',
  leaderId: process.env.PARLASITE_LEADER_ID,
  rootOrgId: process.env.PARLASITE_ROOT_ORG_ID,
  mandateId: process.env.PARLASITE_MANDATE_ID,
  defaultCardDate: process.env.PARLASITE_DEFAULT_CARD_DATE,
  newsletterSegmentId: process.env.PARLASITE_NEWSLETTER_SEGMENT_ID,
};

if (!config.leaderId || !config.rootOrgId || !config.mandateId) {
  throw new Error('Required config values are not defined!');
}

module.exports = config;
