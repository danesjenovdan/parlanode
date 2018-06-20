const mongoose = require('mongoose');
const chalk = require('chalk');
const config = require('../config');

function createMongoURL(host, db, user, password) {
  host = host.replace(/^mongodb:\/\//, '').replace(/\/$/, '');
  const auth = user ? `${password ? `${user}:${password}` : user}@` : '';
  return `mongodb://${auth}${host}/${db}`;
}

/**
 * Connects to MongoDB
 */
exports.connect = () => (
  new Promise((resolve, reject) => {
    // eslint-disable-next-line no-console
    console.log(`${chalk.magenta('| MONGO DATABASE |')} - ${chalk.green(`connecting to ${config.db.url}/${config.db.name}`)}`);

    // handle missing mongo username and password
    if (process.platform === 'win32') {
      // you can't create env vars as empty strings on windows so if its not defined
      // just assume it's an empty string and don't warn
      if (!config.db.user || config.db.user === 'undefined') {
        config.db.user = '';
      }
      if (!config.db.password || config.db.password === 'undefined') {
        config.db.password = '';
      }
    } else if (config.db.user == null || config.db.user === 'undefined' || config.db.password == null || config.db.password === 'undefined') {
      reject(new Error('Missing mongo username or password. Add MONGO_USERNAME and MONGO_PASSWORD environment variables.'));
      return;
    }

    const { url: host, name: db, user, password } = config.db;
    mongoose.connect(createMongoURL(host, db, user, password));

    mongoose.connection.on('error', (err) => {
      reject(err);
    });

    mongoose.connection.once('open', () => {
      // eslint-disable-next-line no-console
      console.log(`${chalk.magenta('| MONGO DATABASE |')} - ${chalk.green('connected')}`);
      resolve();
    });
  })
);
