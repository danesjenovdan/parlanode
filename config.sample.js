const port = 3000;

const config = {
  port,
  serverTimeout: 30000,
  db: {
    name: 'parla-db',
    url: 'localhost',
    user: `${process.env.MONGO_USERNAME}`,
    password: `${process.env.MONGO_PASSWORD}`,
  },
  urls: {
    analize: 'https://analize.parlameter.si/v1',
    data: 'https://data.parlameter.si/v1',
    isci: 'https://isci.parlameter.si',
    glej: `http://localhost:${port}`,
    base: 'http://localhost:3066',
  },
  cardLang: 'sl',
  ogCapturePath: './og',
  ogRootUrl: `http://localhost:${port}/og_cards`,
};

module.exports = config;
