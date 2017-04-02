/* globals module */
const path = require('path');
const webpack = require('webpack');
const baseConfig = require('./webpack.config.base');

module.exports = () =>
  Object.assign(baseConfig(`${path.resolve(__dirname)}/${process.env.CARD_NAME}`), {
    entry: './cards/devBundle.js',
    output: {
      filename: 'bundle.js',
    },
    plugins: [
      new webpack.LoaderOptionsPlugin({
        minimize: true,
      }),
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development'),
        },
      }),
    ],
  });
