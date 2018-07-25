/* eslint-disable global-require */
module.exports = (app) => {
  require('./og/model');
  require('./og/routes')(app);

  require('./cards/model');
  require('./cards/routes')(app);
};
