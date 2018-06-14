const server = require('./server/server');
const database = require('./server/database');
const chalk = require('chalk');
const mongoose = require('mongoose');
const inquirer = require('inquirer');
const bcrypt = require('bcryptjs');

/**
 * Prompt for login credentials if none exist
 * TODO: remove when removing legacy cms
 */
function initializeDeployment() {
  const Config = mongoose.model('Config');

  return Config.findOne({})
    .then((configDoc) => {
      if (configDoc && configDoc.password) {
        return Promise.resolve();
      }

      return inquirer.prompt([
        {
          type: 'email',
          message: 'Enter your email',
          name: 'email',
        },
        {
          type: 'text',
          message: 'Enter a password',
          name: 'password',
        },
      ])
        .then((response) => {
          const userData = bcrypt.genSalt(10)
            .then(salt => bcrypt.hash(response.password, salt))
            .then(hash => ({
              email: response.email,
              hash,
            }));
          return userData;
        })
        .then((userData) => {
          const config = new Config({
            email: userData.email,
            password: userData.hash,
          });
          return config.save();
        })
        .catch((err) => {
          // eslint-disable-next-line no-console
          console.log('Error while creating login:', err);
        });
    });
}

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
  if (!hasFullICU) {
    // eslint-disable-next-line no-console
    console.warn(chalk.red('Node was NOT started with FULL ICU for Intl!'));
  }

  return database.connect()
    .then(() => server.init())
    .then(initializeDeployment)
    .then(() => {
      // eslint-disable-next-line no-console
      console.log(chalk.green('All is well!'));
    })
    .catch((err) => {
      // eslint-disable-next-line no-console
      console.error(chalk.red('Failed to start:'), err);
      process.exit(1);
    });
}

/**
 * Run if main
 */
if (require.main === module) {
  init();
}

exports.app = server.app;
exports.init = init;
