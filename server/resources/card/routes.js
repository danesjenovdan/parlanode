const controller = require('./controller');

module.exports = (app) => {
  app.get('/api/cards/getUrls', controller.getUrls);
  app.get('/api/card/:cardId', controller.getCardById);

  app.get('/:group/:method/:id/*', controller.render);
  app.get('/:group/:method/*', controller.render);
};
