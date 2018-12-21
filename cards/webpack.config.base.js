const fs = require('fs-extra');
const path = require('path');
const webpack = require('webpack');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const sass = require('node-sass');
const _ = require('lodash');
const config = require('../config');

process.traceDeprecation = true;

function createEmptyTranslationFile(filePath) {
  if (!fs.existsSync(filePath)) {
    fs.ensureFileSync(filePath);
    fs.writeJsonSync(filePath, {}, {
      spaces: 2,
    });
  }
}

module.exports = (cardPath) => {
  const cardLang = process.env.CARD_LANG || 'sl';

  const i18nDefaultPath = path.resolve(__dirname, '_i18n', cardLang, 'defaults.json');
  createEmptyTranslationFile(i18nDefaultPath);
  const i18nCardPath = path.resolve(__dirname, '_i18n', cardLang, `${cardPath}.json`);
  createEmptyTranslationFile(i18nCardPath);

  return {
    mode: 'production',
    optimization: {
      minimize: true,
    },
    devtool: 'source-map',
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
          test: /\.css$/,
          loader: 'style-loader/url!file-loader',
        },
        {
          test: /\.csv$/,
          loader: 'raw-loader',
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
                  functions: {
                    'getConfig($key)': (key) => {
                      const value = _.get(config, key.getValue().split('.'));
                      if (typeof value === 'string') {
                        return sass.types.String(value);
                      }
                      return sass.types.String(key.getValue());
                    },
                  },
                },
              },
            ],
          }),
        },
      ],
    },
    resolve: {
      alias: {
        vue$: 'vue/dist/vue.esm.js',
        cardPath: `${path.resolve(__dirname, cardPath)}`,
        components: `${path.resolve(__dirname)}/_components`,
        helpers: `${path.resolve(__dirname)}/_helpers`,
        mixins: `${path.resolve(__dirname)}/_mixins`,
        directives: `${path.resolve(__dirname)}/_directives`,
        'i18n/card.json$': i18nCardPath,
        'i18n/defaults.json$': i18nDefaultPath,
        i18n: `${path.resolve(__dirname)}/_i18n`,
        parlassets: `${path.resolve(__dirname, '..', 'parlassets')}`,
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
          CARD_NAME: JSON.stringify(process.env.CARD_NAME),
        },
      }),
    ],
  };
};
