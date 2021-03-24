/* eslint-disable global-require */
module.exports = (app) => {
  app.get(['/', '/hello'], (req, res) => {
    res.json({
      ok: true,
    });
  });

  require('./api/routes')(app);
  require('./og-images/routes')(app);
  require('./cards/routes')(app);
};
