/* globals module */
const webpack = require('webpack');
const packageJson = require('./package.json');
const baseConfig = require('./webpack.config.base');

module.exports = Object.assign(baseConfig, {
  entry: './cards/ps/glasovanja/serverBundle.js',
  output: {
    filename: 'cards/ps/glasovanja/compiledServerBundle.js',
    libraryTarget: 'commonjs2',
  },
  externals: Object.keys(packageJson.dependencies),
  target: 'node',
  plugins: baseConfig.plugins.concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development'),
        VUE_ENV: '"server"',
      },
    }),
  ]),
});
