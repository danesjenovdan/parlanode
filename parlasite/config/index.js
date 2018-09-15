const _ = require('lodash');

const env = process.env.NODE_ENV;
let config;

const defaultConfig = {
  port: 3066,
  serverTimeout: 120000,
  urls: {
    cdn: 'https://cdn.parlameter.si/v1/parlassets',
    analize: 'https://analize.parlameter.si/v1',
    // data: 'https://data.parlameter.si/v1',
    // isci: 'https://isci.parlameter.si',
    // glej: 'https://glej.parlameter.si',
    // base: 'https://parlameter.si',
  },
  siteLang: 'sl',
  siteMap: {
    landing: {
      legislation: 'zakonodaja',
      sessions: 'seje',
      members: 'poslanci',
      parties: 'poslanske-skupine',
      tools: 'orodja',
      about: 'o-projektu',
      media: 'za-medije',
      legal: 'pravno-obvestilo',
    },
    sessions: {
      search: {
        base: 'isci',
        filter: 'filter',
      },
    },
    tools: {
      notifications: 'obvestila',
      voteComparator: 'primerjalnik-glasovanj',
      discord: 'raziskovalec-neenotnosti',
      compass: 'parlamentarni-kompas',
      wordGroups: 'skupine-besed',
    },
    member: {
      base: 'p',
      overview: 'pregled',
      votings: 'glasovanja',
      speeches: 'govori',
    },
    party: {
      base: 'ps',
      overview: 'pregled',
      votings: 'glasovanja',
      speeches: 'govori',
    },
    session: {
      base: 'seja',
      legislation: 'zakonodaja',
      otherVotings: 'druga-glasovanja',
      transcript: 'transkript',
      vote: 'glasovanje',
    },
  },
};

if (env === 'production') {
  // eslint-disable-next-line global-require, import/no-unresolved
  config = require('./production');
} else if (env === 'development') {
  // eslint-disable-next-line global-require, import/no-unresolved
  config = require('./development');
  console.log(config);
} else {
  // eslint-disable-next-line global-require
  config = require('./sample');
}

module.exports = _.merge({}, defaultConfig, config);
