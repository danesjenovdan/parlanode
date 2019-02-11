module.exports = {
  port: 7004,
  db: {
    name: 'parladb',
  },
  urls: {
    cdn: 'https://cdn.parlametr.pl/v1/parlassets',
    analize: 'https://analize.parlametr.pl/v1',
    data: 'https://data.parlametr.pl/v1',
    isci: 'https://isci.parlametr.pl',
    glej: 'https://glej.parlametr.pl',
    base: 'https://parlametr.pl',
  },
  cardLang: 'pl',
  cardGlobals: {
    parliament_id: 1,
    session_list_tabs: [
      {
        title: 'Posiedzenia Sejmu',
      },
    ],
    legislation_tabs: [
      {
        title: 'Ustawodawstwo',
      },
    ],
  },
};
