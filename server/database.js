const mongoose = require('mongoose');
const chalk    = require('chalk');
const Promise  = require('bluebird');
const config   = require('../config');
const _        = require('lodash');

/**
 * Connects to MongoDB
 * @param cb
 */
exports.connect = function ( cb ) {

  return new Promise(function ( resolve, reject ) {

    console.log(chalk.magenta(`| MONGO DATABASE |`) + ` -` + chalk.green(` Connecting to ${CFG.db.url + CFG.db.name}`));

    // handle missing mongo username and password
    if ( _.isNil(config.db.user) || config.db.user === 'undefined' || _.isNil(!config.db.password) || config.db.password === 'undefined' ) {
      return reject('Missing mongo username or password. Add MONGO_USERNAME and MONGO_PASSWORD environment variables.');
    }

    mongoose.connect(CFG.db.url + CFG.db.name, {
      useMongoClient : true,
      user           : config.db.user,
      pass           : config.db.password
    });

    mongoose.connection.on('error', function ( err ) {
      reject(err);
    });

    mongoose.connection.once('open', function () {

      if ( cb ) {
        cb();
      }
      console.log(chalk.green(chalk.magenta('| MONGO DATABASE |') + ' - connected'));
      resolve();

    });

  });

};