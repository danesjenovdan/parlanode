module.exports = {
  port: 7004,
  db: {
    name: 'parladb',
  },
  urls: {
    cdn: 'https://cdn.parlametar.hr/v1/parlassets',
    analize: 'https://analize.parlametar.hr/v1',
    data: 'https://data.parlametar.hr/v1',
    isci: 'https://isci.parlametar.hr',
    glej: 'https://glej.parlametar.hr',
    base: 'https://parlametar.hr',
  },
  cardLang: 'hr',
  cardGlobals: {
    timeRangeStart: '2016-10-14',
    parliament_id: 199,
    session_list_tabs: [
      {
        title: 'Seje sabora',
        org_ids: [199],
      },
      {
        title: 'Ostale seje',
      },
    ],
    legislation_tabs: [
      {
        title: 'Zakonodaja',
      },
    ],
  },
};
