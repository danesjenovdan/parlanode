/* globals module */
const path = require('path');
const merge = require('webpack-merge');
const baseConfig = require('./webpack.config.base');

module.exports = (cardPath) => {
  return merge(baseConfig(cardPath), {
    entry: './cards/clientBundle.js',
    output: {
      path: path.resolve(cardPath, 'bundles'),
      filename: 'client.js',
    },
  });
};
