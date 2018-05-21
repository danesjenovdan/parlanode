/* globals module */
const webpack = require('webpack');
const packageJson = require('../package.json');
const baseConfig = require('./webpack.config.base');

const path = require('path');
const _ = require('lodash');
const Vue = require('vue');
const VueI18n = require('vue-i18n');
const i18nExtensions = require('vue-i18n-extensions');

Vue.use(VueI18n);

module.exports = (cardPath) => {
  const config = baseConfig(cardPath);

  // gets 'ps/clani' from '/whatever/dir/parlanode/cards/ps/clani'
  const cardDir = path.resolve(cardPath).split('/').slice(-2).join('/');
  // eslint-disable-next-line global-require, import/no-dynamic-require
  const i18nDefault = require(path.resolve(__dirname, '_i18n', 'defaults.json'));
  // eslint-disable-next-line global-require, import/no-dynamic-require
  const i18nCard = require(path.resolve(__dirname, '_i18n', `${cardDir}.json`));
  const i18n = new VueI18n({
    locale: process.env.CARD_LANG || 'sl',
    messages: _.merge({}, i18nDefault, i18nCard),
  });
  config.module.loaders[0].options.compilerModules = [i18nExtensions.module(i18n)];

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
          CARD_LANG: JSON.stringify(process.env.CARD_LANG || 'sl'),
        },
      }),
    ]),
  });
};
