/* eslint-disable global-require */
module.exports = (app) => {
  require('./og/model');
  require('./og/routes')(app);

  require('./card/model');
  require('./card/routes')(app);
};
