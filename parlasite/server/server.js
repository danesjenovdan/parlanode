const express = require('express');
const chalk = require('chalk');
const serveStatic = require('serve-static');
const bodyParser = require('body-parser');
const config = require('../config');

const app = express();

function setupExpress() {
  return new Promise((resolve, reject) => {
    // eslint-disable-next-line no-console
    console.log(`${chalk.magenta('| EXPRESS SERVER |')} - ${chalk.green('starting')}`);

    // disable "X-Powered-By: Express" header
    app.disable('x-powered-by');

    // set template renderer
    app.set('view engine', 'ejs');

    // serve static assets
    app.use(serveStatic('public'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    // eslint-disable-next-line global-require
    require('./routes')(app);

    // all other routes
    app.get('*', (req, res) => {
      res.status(404).render('error/404', {
        pageTitle: '404 Not Found',
        activeMenu: '',
      });
    });

    // catch-all error handler (needs all 4 args)
    // eslint-disable-next-line no-unused-vars
    app.use((error, req, res, next) => {
      // TODO: sentry
      console.log('error', error);
      res.status(500).render('error/500', {
        pageTitle: '500 Internal Server Error',
        activeMenu: '',
        error,
      });
    });

    // start listening on port
    const server = app.listen(config.port, () => {
      // eslint-disable-next-line no-console
      console.log(`${chalk.magenta('| EXPRESS SERVER |')} - ${chalk.green(`started on: http://localhost:${config.port}/`)}`);
      resolve();
    });

    server.on('error', (err) => {
      reject(err);
    });

    server.timeout = config.serverTimeout;
  });
}

function init() {
  return Promise.resolve()
    .then(setupExpress);
}

module.exports = {
  init,
};
