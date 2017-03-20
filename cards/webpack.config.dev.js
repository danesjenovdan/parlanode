/* globals module */
const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const baseConfig = require('./webpack.config.base');

module.exports = () => {
  const cardsPath = path.resolve(__dirname)
  const cardPath = `${cardsPath}/${process.env.CARD_NAME}`;
  const statePath = `${cardPath}/state.json`;
  const config = baseConfig(cardPath);
  config.resolve.alias.stateJson$ = fs.existsSync(statePath) ? statePath : `${cardsPath}/empty.json`;

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
