module.exports = process.env.NODE_ENV === 'production' ? require('./config.prod') : process.env.NODE_ENV === 'stage' ? require('./config.stage')  : require('./config.dev');