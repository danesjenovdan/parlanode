const _ = require('lodash');
const sass = require('node-sass');
const config = require('../config');

module.exports = {
  'getConfig($key)': (key) => {
    const value = _.get(config, key.getValue().split('.'));
    if (typeof value === 'string') {
      return sass.types.String(value);
    }
    return sass.types.String(key.getValue());
  },
};
