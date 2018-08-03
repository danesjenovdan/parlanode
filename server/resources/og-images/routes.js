const controller = require('./controller');

module.exports = (app) => {
  app.get('/og-image/:name/', controller.render);
};
