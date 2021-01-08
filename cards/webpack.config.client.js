/* globals module */
const path = require('path');
const merge = require('webpack-merge');
const baseConfig = require('./webpack.config.base');

module.exports = cardPath => {
  const cardLang = process.env.CARD_LANG || 'sl';

  return merge(baseConfig(cardPath), {
    entry: path.resolve(__dirname, 'bundle-client.js'),
    output: {
      path: path.resolve(__dirname, cardPath, 'bundles', cardLang),
      filename: 'client.js',
    },
  })
};
