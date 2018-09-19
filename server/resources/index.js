/* eslint-disable global-require */
module.exports = (app) => {
  require('./og-images/model');
  require('./cards/model');

  require('./api/routes')(app);
  require('./og-images/routes')(app);
  require('./cards/routes')(app);
};
