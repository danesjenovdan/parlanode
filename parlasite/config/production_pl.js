module.exports = {
  port: 7005,
  urls: {
    cdn: 'https://cdn.parlametr.pl/v1/parlassets',
    analize: 'https://analize.parlametr.pl/v1',
    data: 'https://data.parlametr.pl/v1',
    isci: 'https://isci.parlametr.pl',
    glej: 'https://glej.parlametr.pl',
    base: 'https://parlametr.pl',
  },
  siteLang: 'pl',
  siteMap: {
    landing: {
      legislation: 'ustawodastwo',
      sessions: 'posiedzenia',
      members: 'poslowie',
      parties: 'kluby-poselskie',
      tools: 'narzedzia',
      about: 'https://parlameter.org/',
      media: 'dla-mediow',
      legal: 'informacje-prawne',
      thankYou: 'dziekujemy',
      error: 'ups',
    },
    sessions: {
      search: {
        base: 'szukaj',
        filter: 'filtr',
      },
    },
    tools: {
      notifications: 'powiadomienia',
      voteComparator: 'komparator-glosowan',
      discord: 'wykrywacz-niezgodnosci',
      compass: 'sejmowy-kompas',
      wordGroups: 'grupy-slow',
    },
    member: {
      base: 'p',
      overview: 'przeglad',
      votings: 'glosowania',
      speeches: 'wystapienia',
    },
    party: {
      base: 'k',
      overview: 'przeglad',
      votings: 'glosowania',
      speeches: 'wystapienia',
    },
    session: {
      base: 'posiedzenie',
      legislation: 'debaty',
      otherVotings: 'inne-glosowania',
      transcript: 'transkrypcja',
      vote: 'glosowanie',
    },
  },
};
