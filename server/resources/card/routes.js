const controller = require('./controller');

module.exports = (app) => {
  app.get('/api/cards/getUrls', controller.getUrls);
  app.get('/api/cards/deleteAll', controller.deleteAll);
  app.get('/card/:cardId', controller.getCardById);

  app.get('/:group/:method/', controller.render);
  app.get('/:group/:method/:id(\\d+)/', controller.render);
  app.get('/:group/:method/:id(\\d+)/:date(\\d{1,2}.\\d{1,2}.\\d{4})/', controller.render);
  app.get('/:group/:method/:date(\\d{1,2}.\\d{1,2}.\\d{4})/', controller.render);

  app.get('*', (req, res) => {
    res.status(400).send({ error: 'Bad Request' });
  });
};
