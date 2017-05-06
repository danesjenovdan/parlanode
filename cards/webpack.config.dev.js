/* globals module */
const path = require('path');
const webpack = require('webpack');
const baseConfig = require('./webpack.config.base');

module.exports = () => {
  const config = baseConfig(`${path.resolve(__dirname)}/${process.env.CARD_NAME}`);
  config.module.loaders[0].options.loaders.scss = 'vue-style-loader!css-loader!sass-loader';

  return Object.assign(config, {
    entry: './cards/devBundle.js',
    output: {
      filename: 'bundle.js',
      publicPath: '/build/',
    },
    plugins: [
      new webpack.LoaderOptionsPlugin({
        minimize: true,
      }),
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: '"development"',
        },
      }),
    ],
  });
};
