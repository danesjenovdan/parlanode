/* globals module */
const path = require('path');
const webpack = require('webpack');
const baseConfig = require('./webpack.config.base');

module.exports = () => {
  let cardName = process.env.CARD_NAME;

  if (cardName.indexOf('cards/') === 0) {
    cardName = cardName.replace('cards/', '');
  }

  const config = baseConfig(`${path.resolve(__dirname)}/${cardName}`);

  return Object.assign(config, {
    entry: './cards/devBundle.js',
    output: {
      path: path.resolve(__dirname, './build'),
      publicPath: '/build/',
      filename: 'bundle.js',
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: '"development"',
        },
      }),
    ],
  });
};
