let config;
const env = process.env.NODE_ENV;

if ( env === 'develop' ) config = require('./config.dev.js');
else if ( env === 'staging' ) config = require('./config.staging.js');
else if ( env === 'production' ) config = require('./config.prod.js');
else {
  throw new Error('Invalid environment. "development", "staging" or "production" allowed.');
}

module.exports = config;