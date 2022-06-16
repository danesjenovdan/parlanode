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
  leaderId: process.env.PARLASITE_LEADER_ID,
  rootOrgId: process.env.PARLASITE_ROOT_ORG_ID,
  rootOrgId2: process.env.PARLASITE_ROOT_ORG_ID2,
  mandateId: process.env.PARLASITE_MANDATE_ID,
  defaultCardDate: process.env.PARLASITE_DEFAULT_CARD_DATE,
};

if (!config.leaderId || !config.rootOrgId || !config.rootOrgId2 || !config.mandateId) {
  throw new Error('Required config values are not defined!');
}

module.exports = config;
