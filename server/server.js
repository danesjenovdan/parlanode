const express          = require('express');
const app              = express();
const chalk            = require('chalk');
const serveStatic      = require('serve-static');
const bodyParser       = require('body-parser');
const cors             = require('cors');
const session          = require('express-session');
const expressValidator = require('express-validator');

exports.init = function (startListening) {

  return setupExpress(startListening)
    .then(setupResources)
    .catch(function (err) {

      console.log(err);

    });

};

exports.app = app;

function setupExpress(startListening) {

  return new Promise(function (resolve, reject) {

    // use ejs as the view engine
    app.set('view engine', 'ejs');
    // serve static assets on /assets
    app.use('/assets', serveStatic('assets'));
    app.use('/cms-dev', serveStatic('cms-dev'));
    app.use('/cms', serveStatic('cms-dev/dist'));
    app.use(cors());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended : true }));
    app.use(expressValidator());

    // start listening on port
    if (startListening) {

      const server   = app.listen(CFG.port, function () {

        console.log(chalk.green(chalk.magenta('| EXPRESS SERVER |') + ' - running on: http://localhost:' + CFG.port));
        resolve();

      });
      server.timeout = CFG.serverTimeout;
    } else {
      resolve();
    }

  });

}

function setupResources() {

  require('./resources')(app);

}