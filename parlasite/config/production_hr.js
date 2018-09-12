module.exports = {
  port: 7005,
  urls: {
    cdn: 'https://cdn.parlametar.hr/v1/parlassets',
    analize: 'https://analize.parlametar.hr/v1',
    data: 'https://data.parlametar.hr/v1',
    isci: 'https://isci.parlametar.hr',
    glej: 'https://glej.parlametar.hr',
    base: 'https://beta.parlametar.hr',
  },
  siteLang: 'hr',
  siteMap: {
    landing: {
      legislation: 'glasanja',
      sessions: 'sjednice',
      members: 'zastupnice',
      parties: 'klubovi',
      tools: 'alati',
      about: 'o-projektu',
      media: 'za-medije',
      legal: 'pravne-napomene',
    },
    sessions: {
      search: {
        base: 'trazi',
        filter: 'filter',
      },
    },
    tools: {
      notifications: 'https://obvestila.parlameter.si', // TODO: i18n
      voteComparator: 'komparator-glasanja',
      discord: 'pretrazivac-razjedinjenosti',
      compass: 'saborski-kompas',
      wordGroups: 'grupe-rijeci',
    },
    member: {
      base: 'zastupnica',
      overview: 'pregled',
      votings: 'glasanja',
      speeches: 'govori',
    },
    party: {
      base: 'klub',
      overview: 'pregled',
      votings: 'glasanja',
      speeches: 'govori',
    },
    session: {
      base: 'sjednica',
      legislation: 'pregled', // doesn't exist
      otherVotings: 'glasanja',
      transcript: 'transkript',
      vote: 'glasanje',
    },
  },
};
