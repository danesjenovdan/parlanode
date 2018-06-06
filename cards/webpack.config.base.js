/* globals module */
const webpack = require('webpack');
const fs = require('fs');
const path = require('path');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

function ensureDirs(filePath) {
  const dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return;
  }
  ensureDirs(dirname);
  fs.mkdirSync(dirname);
}

function createEmptyJsonFile(filePath) {
  if (!fs.existsSync(filePath)) {
    ensureDirs(filePath);
    fs.writeFileSync(filePath, '{ "sl": { "info": { "lead": "", "text": "" } } }', 'utf8');
  }
}

module.exports = (cardPath) => {
  const cardLang = process.env.CARD_LANG || 'sl';
  // gets 'ps/clani' from '/whatever/dir/parlanode/cards/ps/clani'
  const cardDir = path.resolve(cardPath)
    .replace(/\\/g, '/')
    .split('/')
    .slice(-2)
    .join('/');

  const i18nDefaultPath = path.resolve(__dirname, '_i18n', cardLang, 'defaults.json');
  createEmptyJsonFile(i18nDefaultPath);
  const i18nCardPath = path.resolve(__dirname, '_i18n', cardLang, `${cardDir}.json`);
  createEmptyJsonFile(i18nCardPath);

  return {
    devtool: false,
    module: {
      loaders: [
        {
          test: /\.vue$/,
          loader: 'vue-loader',
          options: {
            extractCSS: true,
          },
        },
        {
          test: /\.js$/,
          loader: 'babel-loader',
          exclude: /node_modules/,
        },
      ],
    },
    resolve: {
      alias: {
        vue$: 'vue/dist/vue.esm.js',
        cardPath: `${path.resolve(cardPath)}`,
        components: `${path.resolve(__dirname)}/_components`,
        helpers: `${path.resolve(__dirname)}/_helpers`,
        mixins: `${path.resolve(__dirname)}/_mixins`,
        directives: `${path.resolve(__dirname)}/_directives`,
        'i18n/card.json$': i18nCardPath,
        'i18n/defaults.json$': i18nDefaultPath,
        i18n: `${path.resolve(__dirname)}/_i18n`,
      },
    },
    devServer: {
      historyApiFallback: true,
      publicPath: '/build/',
      stats: 'minimal',
    },
    performance: {
      hints: false,
    },
    plugins: [
      new LodashModuleReplacementPlugin({
        shorthands: true,
        collections: true,
      }),
      // disable this whole plugin to get better debugging output
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false,
          screw_ie8: true,
          conditionals: true,
          unused: true,
          comparisons: true,
          sequences: true,
          dead_code: true,
          evaluate: true,
          if_return: true,
          join_vars: true,
        },
        output: {
          comments: false,
        },
      }),
      new webpack.LoaderOptionsPlugin({
        minimize: true,
      }),
      new ExtractTextPlugin({
        filename: `${cardPath}/bundles/style.css`,
      }),
    ],
  };
};
