module.exports = {
  port: 7004,
  db: {
    name: 'parladb',
  },
  urls: {
    cdn: 'http://cdn.english.parlameter.si/v1/parlassets',
    analize: 'https://analize.parlameter.si/v1',
    data: 'https://data.parlameter.si/v1',
    isci: 'https://isci.parlameter.si',
    glej: 'http://glej.english.parlameter.si',
    base: 'http://english.parlameter.si',
  },
  cardLang: 'en',
  cardConfig: {
    parliament_id: 95,
    session_list_tabs: [
      {
        title: 'Seje DZ',
        org_ids: [95, 1],
      },
      {
        title: 'Seje kolegija predsednika DZ',
        org_ids: [9],
      },
      {
        title: 'Seje delovnih teles',
      },
    ],
  },
};
