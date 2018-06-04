/**
 * Set CFG as global variable ( sorry )
 */
global.CFG = require('./config');

const server   = require('./server/server');
const database = require('./server/database');
const chalk    = require('chalk');
const mongoose = require('mongoose');
const inquirer = require('inquirer');
const bcrypt   = require('bcryptjs');

/**
 * Init app
 * @returns {Promise.<T>|Promise|*}
 */
function init() {

  const hasFullICU = (() => {
    try {
      const january = new Date(9e8);
      const spanish = new Intl.DateTimeFormat('es', { month: 'long' });
      return spanish.format(january) === 'enero';
    } catch (err) {
      return false;
    }
  })();
  if (hasFullICU) {
    console.log(chalk.green('Node started with FULL ICU for Intl!'));
  } else {
    console.warn(chalk.red('Node was NOT started with FULL ICU for Intl!'));
  }

  return database.connect()
    .then(() => server.init(true))
    .then(initializeDeployment)
    .then(() => {

      console.log(chalk.green('All is well!'));

    })
    .catch(( err ) => {
      console.error(chalk.red('Error: ', err));
    });

}

function initializeDeployment() {

  const Config = mongoose.model('Config');

  return Config.findOne({})
    .then(( configDoc ) => {

      if ( configDoc && configDoc.password ) return Promise.resolve();

      return inquirer.prompt([{
        type    : 'email',
        message : 'Enter your email',
        name    : 'email'
      }, {
        type    : 'text',
        message : 'Enter a password',
        name    : 'password'
      }]).then(( response ) => {

          return bcrypt.genSalt(10)
            .then(salt => bcrypt.hash(response.password, salt))
            .then(hash => ({
              hash,
              email : response.email
            }));

        })
        .then(( userData ) => {

          const config = new Config({
            password : userData.hash,
            email    : userData.email
          });

          return config.save();

        })
        .catch(( err ) => {
          console.log(err);
        });

    });

}

/**
 * Run if main
 */
if ( require.main === module ) {
  init();
}

exports.app  = server.app;
exports.init = init;
