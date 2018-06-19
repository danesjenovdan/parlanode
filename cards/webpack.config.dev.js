/* globals module */
const path = require('path');
const webpack = require('webpack');
const baseConfig = require('./webpack.config.base');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

module.exports = () => {
  let cardName = process.env.CARD_NAME;

  if (cardName.indexOf('cards/') === 0) {
    cardName = cardName.replace('cards/', '');
  }

  const config = baseConfig(`${path.resolve(__dirname)}/${cardName}`);
  config.module.rules[0].options.extractCSS = false;

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
          CARD_LANG: JSON.stringify(process.env.CARD_LANG || 'sl'),
        },
      }),
      new VueLoaderPlugin(),
    ],
  });
};
