/* globals module */
const webpack = require('webpack');
const baseConfig = require('./webpack.config.base');

module.exports = (cardPath) => {
  const config = baseConfig(cardPath);
  return Object.assign(config, {
    entry: './cards/clientBundle.js',
    output: {
      filename: `${cardPath}/compiledClientBundle.js`,
    },
    plugins: config.plugins.concat([
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development'),
        },
      }),
    ]),
  });
};
