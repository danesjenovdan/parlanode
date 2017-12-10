if(process.env.NODE_ENV === 'production') module.exports = require('./config.prod');
else if(process.env.NODE_ENV === 'staging') module.exports = require('./config.staging');
else if(process.env.NODE_ENV === 'development') module.exports = require('./config.dev');
else throw new Error('Missing NODE_ENV');