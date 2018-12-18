module.exports = {
  port: 7004,
  db: {
    name: 'parladb',
  },
  urls: {
    cdn: 'https://cdn.parlameter.si/v1/parlassets',
    analize: 'https://analize.parlameter.si/v1',
    data: 'https://data.parlameter.si/v1',
    isci: 'https://isci.parlameter.si',
    glej: 'https://glej.parlameter.si',
    base: 'https://parlameter.si',
  },
  cardLang: 'sl',
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
    legislation_tabs: [
      {
        title: 'Zakonodaja',
        classifications: ['zakon'],
      },
      {
        title: 'Akti',
        card_title: 'Seznam aktov',
      },
    ],
  },
};
