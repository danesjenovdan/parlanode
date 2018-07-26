const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const nodeExternals = require('webpack-node-externals');
const baseConfig = require('./webpack.config.base');

module.exports = currentPath => merge.smart(baseConfig(currentPath), {
  entry: path.resolve(__dirname, 'bundle-server.js'),
  output: {
    path: path.resolve(__dirname, currentPath, 'bundles'),
    filename: 'server.js',
    libraryTarget: 'commonjs2',
  },
  target: 'node',
  externals: [nodeExternals()],
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
        VUE_ENV: JSON.stringify('server'),
      },
    }),
  ],
});
