const mongoose = require('mongoose');
const chalk    = require('chalk');
const Promise  = require('bluebird');

/**
 * Connects to MongoDB
 * @param cb
 */
exports.connect = function (cb) {

  return new Promise(function (resolve, reject) {

    console.log(chalk.magenta(`| MONGO DATABASE |`) + ` -` + chalk.green(` Connecting to ${CFG.db.url + CFG.db.name}`));
    mongoose.connect(CFG.db.url + CFG.db.name);

    mongoose.connection.on('error', function (err) {

      reject(err);
      console.log(chalk.red(err));

    });

    mongoose.connection.once('open', function () {

      if (cb) {
        cb();
      }
      console.log(chalk.green(chalk.magenta('| MONGO DATABASE |') + ' - connected'));
      resolve();

    });

  });

};