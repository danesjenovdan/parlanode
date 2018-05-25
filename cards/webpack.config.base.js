/* globals module */
const webpack = require('webpack');
const path = require('path');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = (cardPath) => {
  // gets 'ps/clani' from '/whatever/dir/parlanode/cards/ps/clani'
  const cardDir = path.resolve(cardPath)
    .replace(/\\/g, '/')
    .split('/')
    .slice(-2)
    .join('/');
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
        'i18n/card.json$': path.resolve(__dirname, '_i18n', `${cardDir}.json`),
        i18n: path.resolve(__dirname, '_i18n'),
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

