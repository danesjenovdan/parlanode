/* globals module */
const webpack = require('webpack');
const path = require('path');
const merge = require('webpack-merge');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const baseConfig = require('./webpack.config.base');

module.exports = () => {
  const cardName = process.env.CARD_NAME;
  return merge.smart(baseConfig(`${path.resolve(__dirname)}/${cardName}`), {
    mode: 'development',
    optimization: {
      minimize: false,
    },
    devtool: 'cheap-module-eval-source-map',
    entry: './cards/devBundle.js',
    output: {
      path: path.resolve(__dirname, './build'),
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
      stats: 'minimal',
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
};
