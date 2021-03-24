const controller = require('./controller');

module.exports = (app) => {
  app.get('/:group/:method/', controller.render);
  app.get('/:group/:method/:id(\\d+)/', controller.render);
  app.get('/:group/:method/:id(\\d+)/:date(\\d{1,2}.\\d{1,2}.\\d{4})/', controller.render);
  app.get('/:group/:method/:date(\\d{1,2}.\\d{1,2}.\\d{4})/', controller.render);
};
