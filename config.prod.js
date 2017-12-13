module.exports = {
  port            : 7004,
  serverTimeout   : 600000,
  db              : {
    name: 'parladb',
    url: 'mongodb://localhost/',
    user: `${process.env.MONGO_USERNAME}`,
    password: `${process.env.MONGO_PASSWORD}`,
  },
  urls            : {
    analize : 'https://analize.parlameter.si', // DATA URL BASE
  },
  apiPrefix       : '/api',
  ogCapturePath   : './og',
  ogRootUrl       : 'https://cdn.parlametre.si/v1/parlassets/og_cards/', // root url for OG images
  cardCapturePath : '/home/parladaddy/parlacdn/v1/parlassets/card_captures', // where cards are stored
};
