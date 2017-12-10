let config;
const env = process.env.NODE_ENV;

if (env === 'development') {
  config = require('./config.dev.js');
} else if (env === 'staging') {
  config = require('./config.staging.js');
} else if (env === 'production') {
  config = require('./config.prod.js');
} else {
  config = require('./config.sample.js');
  console.log('Using sample config. Please copy and edit it accordingly, this probably won\'t run.');
  console.log('Technically, this is an invalid environment. "development", "staging" or "production" required.');
}

module.exports = config;
