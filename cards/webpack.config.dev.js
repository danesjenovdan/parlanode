const webpack = require('webpack');
const path = require('path');
const merge = require('webpack-merge');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const baseConfig = require('./webpack.config.base');

module.exports = merge.smart(baseConfig(process.env.CARD_NAME), {
  mode: 'development',
  optimization: {
    minimize: false,
  },
  devtool: 'cheap-module-eval-source-map',
  entry: path.resolve(__dirname, 'bundle-dev.js'),
  output: {
    path: path.resolve(__dirname, 'build'),
    publicPath: '/build/',
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          extractCSS: false,
        },
      },
    ],
  },
  devServer: {
    historyApiFallback: true,
    publicPath: '/build/',
    contentBase: [path.resolve(__dirname), path.resolve(__dirname, '..', 'parlassets')],
    watchContentBase: true,
    stats: 'minimal',
    watchOptions: {
      aggregateTimeout: 1000,
    },
  },
  plugins: [
    new ExtractTextPlugin({
      disable: true,
    }),
    new webpack.NormalModuleReplacementPlugin(
      /data\/urls\.json$/,
      require.resolve('../data/urls.dev.json'),
    ),
    new webpack.NormalModuleReplacementPlugin(
      /data\/siteMap\.json$/,
      require.resolve('../data/siteMap.default.json'),
    ),
  ],
});
