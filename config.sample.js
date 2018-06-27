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
    analize: 'https://analize.parlameter.si',
    isci: 'https://isci.parlameter.si',
    data: 'https://data.parlameter.si',
  },
  cardLang: 'sl',
  ogCapturePath: './og',
  ogRootUrl: `http://localhost:${port}/og_cards`,
  cardRootUrl: `http://localhost:${port}`,
};

module.exports = config;
