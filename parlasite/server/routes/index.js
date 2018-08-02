/* eslint-disable global-require */
module.exports = (app) => {
  app.use('/', require('./landing'));
  app.use('/zakonodaja', require('./zakonodaja'));
  app.use('/seje', require('./seje'));
  app.use('/orodja', require('./orodja'));

  app.use('/p', require('./poslanec'));
  app.use('/ps', require('./poslanska-skupina'));

  // app.use('/seja', require('./seja'));
};
