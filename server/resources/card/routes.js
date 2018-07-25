const controller = require('./controller');

module.exports = (app) => {
  app.get('/api/cards/getRenders', controller.getRenders);
  app.get('/api/cards/getBuilds', controller.getBuilds);
  app.get('/api/cards/deleteRenders', controller.deleteRenders);
  app.get('/api/cards/deleteBuilds', controller.deleteBuilds);
  app.get('/api/cards/deleteBuild/:id', controller.deleteBuildId);
  app.get('/api/cards/rebuildUpdated', controller.rebuildUpdated);

  app.get('/:group/:method/', controller.render);
  app.get('/:group/:method/:id(\\d+)/', controller.render);
  app.get('/:group/:method/:id(\\d+)/:date(\\d{1,2}.\\d{1,2}.\\d{4})/', controller.render);
  app.get('/:group/:method/:date(\\d{1,2}.\\d{1,2}.\\d{4})/', controller.render);
};
