const path = require('path');
const merge = require('webpack-merge');
const baseConfig = require('./webpack.config.base');

module.exports = merge.smart(baseConfig(process.env.CURRENT_PATH), {
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
  devServer: {
    historyApiFallback: true,
    publicPath: '/build/',
    stats: 'minimal',
  },
});
