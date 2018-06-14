const controller = require('./controller');

module.exports = (app) => {
  app.get('/api/cards/getUrls', controller.getUrls);
  app.get('/:group/:method/:id/*', controller.render);
  app.get('/:group/:method/*', controller.render);

  app.get('/card/:cardId', controller.getCardById);
};
