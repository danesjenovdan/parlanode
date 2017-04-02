/* globals module */
const webpack = require('webpack');
const packageJson = require('../package.json');
const baseConfig = require('./webpack.config.base');

module.exports = (cardPath) => {
  const config = baseConfig(cardPath);
  return Object.assign(config, {
    entry: './cards/serverBundle.js',
    output: {
      filename: `${cardPath}/bundles/server.js`,
      libraryTarget: 'commonjs2',
    },
    externals: Object.keys(packageJson.dependencies),
    target: 'node',
    plugins: config.plugins.concat([
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development'),
          VUE_ENV: '"server"',
        },
      }),
    ]),
  });
};
