/* globals module */
const webpack = require('webpack');
const baseConfig = require('./webpack.config.base');

module.exports = () => {
  const config = baseConfig(`./cards/${process.env.npm_config_card}`);
  return Object.assign(config, {
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
};
