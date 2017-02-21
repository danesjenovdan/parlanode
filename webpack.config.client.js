/* globals module */
const webpack = require('webpack');
const baseConfig = require('./webpack.config.base');

module.exports = Object.assign(baseConfig, {
  entry: './cards/ps/glasovanja/clientBundle.js',
  output: {
    filename: 'cards/ps/glasovanja/compiledClientBundle.js',
  },
  plugins: baseConfig.plugins.concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development'),
      },
    }),
  ]),
});
