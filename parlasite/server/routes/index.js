/* eslint-disable global-require */
module.exports = (app) => {
  app.use('/', require('./landing'));
  app.use('/zakonodaja', require('./zakonodaja'));
  app.use('/seje', require('./seje'));
  app.use('/orodja', require('./orodja'));
};
