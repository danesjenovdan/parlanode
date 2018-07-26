const controller = require('./controller');

module.exports = (app) => {
  app.get('/api/og-images/getRenders', controller.getRenders);
  app.get('/api/og-images/getBuilds', controller.getBuilds);
  app.get('/api/og-images/deleteRenders', controller.deleteRenders);
  app.get('/api/og-images/deleteBuilds', controller.deleteBuilds);

  app.get('/og-image/:name/', controller.render);
};
