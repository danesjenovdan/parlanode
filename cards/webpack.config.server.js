/* globals module */
/* eslint-disable global-require, import/no-dynamic-require */
const webpack = require('webpack');
const merge = require('webpack-merge');
const nodeExternals = require('webpack-node-externals');
const path = require('path');
const _ = require('lodash');
const Vue = require('vue');
const VueI18n = require('vue-i18n');
const i18nExtensions = require('vue-i18n-extensions');
const baseConfig = require('./webpack.config.base');

Vue.use(VueI18n);

// const merge = webpackMerge({
//   customizeArray: webpackMerge.unique(
//     'plugins',
//     ['DefinePlugin'],
//     plugin => plugin.constructor && plugin.constructor.name,
//   ),
// });

module.exports = (cardPath) => {
  const cardLang = process.env.CARD_LANG || 'sl';
  // gets 'ps/clani' from '/whatever/dir/parlanode/cards/ps/clani'
  const cardDir = path.resolve(cardPath)
    .replace(/\\/g, '/')
    .split('/')
    .slice(-2)
    .join('/');

  const i18nDefault = require(path.resolve(__dirname, '_i18n', cardLang, 'defaults.json'));
  const i18nCard = require(path.resolve(__dirname, '_i18n', cardLang, `${cardDir}.json`));

  const i18n = new VueI18n({
    locale: cardLang,
    messages: _.merge({}, i18nDefault, i18nCard),
  });

  return merge.smart(baseConfig(cardPath), {
    entry: './cards/serverBundle.js',
    output: {
      path: path.resolve(cardPath, 'bundles'),
      filename: 'server.js',
      libraryTarget: 'commonjs2',
    },
    target: 'node',
    externals: [nodeExternals()],
    module: {
      rules: [
        {
          test: /\.vue$/,
          loader: 'vue-loader',
          options: {
            extractCSS: true,
            compilerModules: [i18nExtensions.module(i18n)],
          },
        },
      ],
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development'),
          CARD_LANG: JSON.stringify(cardLang),
          VUE_ENV: JSON.stringify('server'),
        },
      }),
    ],
  });
};
