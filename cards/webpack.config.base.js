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
        options: {
          loaders: {
            sass: 'vue-style-loader!css-loader!sass-loader?includePaths[]=node_modules',
          },
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
      vue$: 'vue/dist/vue',
      card: `${path.resolve(cardPath)}/card.vue`,
      components: `${path.resolve(__dirname)}/_components`,
      helpers: `${path.resolve(__dirname)}/_helpers`,
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
    new LodashModuleReplacementPlugin(),
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

