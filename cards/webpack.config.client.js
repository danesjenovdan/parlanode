/* globals module */
const path = require('path');
const merge = require('webpack-merge');
const baseConfig = require('./webpack.config.base');

module.exports = cardPath => (
  merge(baseConfig(cardPath), {
    entry: path.resolve(__dirname, 'bundle-client.js'),
    output: {
      path: path.resolve(__dirname, cardPath, 'bundles'),
      filename: 'client.js',
    },
  })
);
