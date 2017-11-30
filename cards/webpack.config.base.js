/* globals module */
const webpack = require('webpack');
const path = require('path');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');

module.exports = cardPath => ({
  devtool: false,
  module: {
    loaders: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
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
    },
  },
  devServer: {
    historyApiFallback: true,
    noInfo: true,
    publicPath: '/build/',
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
  ],
});

