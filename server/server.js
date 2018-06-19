const express = require('express');
const chalk = require('chalk');
const serveStatic = require('serve-static');
const bodyParser = require('body-parser');
const cors = require('cors');
const expressValidator = require('express-validator');
const config = require('../config');

const app = express();

function setupExpress() {
  return new Promise((resolve, reject) => {
    // eslint-disable-next-line no-console
    console.log(`${chalk.magenta('| EXPRESS SERVER |')} - ${chalk.green('starting')}`);

    // use ejs as the view engine
    app.set('view engine', 'ejs');
    // serve static assets on /assets
    app.use('/assets', serveStatic('assets'));
    app.use('/og_cards', serveStatic('og'));
    app.use(cors());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(expressValidator());

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

function setupResources() {
  // eslint-disable-next-line global-require
  require('./resources')(app);
}

exports.init = () => (
  Promise.resolve()
    .then(setupExpress)
    .then(setupResources)
);
