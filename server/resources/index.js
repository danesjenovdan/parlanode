/* eslint-disable global-require */
module.exports = (app) => {
  require('./og-images/model');
  require('./og-images/routes')(app);

  require('./cards/model');
  require('./cards/routes')(app);

  require('./api/routes')(app);
};
