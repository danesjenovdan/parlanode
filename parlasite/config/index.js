const env = process.env.NODE_ENV;

const config = {
  port: 3066,
  serverTimeout: 120000,
  urls: {
    cdn: 'https://parlassets-ljubljana.lb.djnd.si',
    cards: 'https://parlacards.lb.djnd.si',
    parladata: 'https://parladata.lb.djnd.si/v3',
  },
  locale: 'sl-obcine',
  leaderId: '261',
  siteMap: {
    landing: {
      legislation: 'zakonodaja',
      sessions: 'seje',
      members: 'poslanci',
      parties: 'poslanske-skupine',
      tools: 'orodja',
      about: 'https://parlameter.org/sl/',
      media: 'za-medije',
      legal: 'pravno-obvestilo',
      thankYou: 'hvala',
      error: 'ups',
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
      leaderBase: 'zupan',
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
      agenda: 'dnevni-red',
      vote: 'glasovanje',
    },
  },
};

module.exports = config;
