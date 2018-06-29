/* eslint-disable global-require */
module.exports = (app) => {
  require('./card/model');
  require('./card/routes')(app);
};
