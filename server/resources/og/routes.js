const controller = require('./controller');

module.exports = (app) => {
  app.get('/og-image/', controller.render);
};
