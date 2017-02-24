/* globals module */
const webpack = require('webpack');
const path = require('path');

module.exports = cardPath => ({
  devtool: false,
  module: {
    rules: [
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
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
      },
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true,
    }),
  ],
});

