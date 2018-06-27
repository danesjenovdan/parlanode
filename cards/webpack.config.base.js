/* globals module */
const webpack = require('webpack');
const fs = require('fs-extra');
const path = require('path');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

process.traceDeprecation = true;

function createEmptyTranslationFile(filePath, cardLang) {
  if (!fs.existsSync(filePath)) {
    fs.ensureFileSync(filePath);
    fs.writeFileSync(filePath, `{ "${cardLang}": { "info": { "lead": "", "text": "" } } }`, 'utf8');
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
  createEmptyTranslationFile(i18nDefaultPath, cardLang);
  const i18nCardPath = path.resolve(__dirname, '_i18n', cardLang, `${cardDir}.json`);
  createEmptyTranslationFile(i18nCardPath, cardLang);

  return {
    mode: 'production',
    optimization: {
      minimize: true,
    },
    devtool: false,
    module: {
      rules: [
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
        {
          test: /\.scss$/,
          use: ExtractTextPlugin.extract({
            fallback: 'vue-style-loader',
            use: [
              {
                loader: 'css-loader',
                options: {
                  url: false,
                  minimize: true,
                  sourceMap: true,
                },
              },
              {
                loader: 'sass-loader',
                options: {
                  sourceMap: true,
                },
              },
            ],
          }),
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
    plugins: [
      new VueLoaderPlugin(),
      new LodashModuleReplacementPlugin({
        shorthands: true,
        collections: true,
      }),
      new ExtractTextPlugin({
        filename: 'style.css',
      }),
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development'),
          CARD_LANG: JSON.stringify(process.env.CARD_LANG || 'sl'),
        },
      }),
    ],
  };
};
