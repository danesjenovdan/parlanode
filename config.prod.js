module.exports = {
  port            : 3000,
  serverTimeout   : 600000,
  db              : {
    name     : 'parla-db',
    url      : 'mongodb://localhost/',
    username : `${process.env.MONGO_USERNAME}`,
    password : `${process.env.MONGO_PASSWORD}`,
  },
  urls            : {
    analize : 'http://localhost:8000', // DATA URL BASE
  },
  apiPrefix       : '/api',
  ogCapturePath   : './og',
  ogRootUrl       : 'https://cdn.whatever.com/og_cards/', // root url for OG images
  cardCapturePath : './card_captures', // where cards are stored
};