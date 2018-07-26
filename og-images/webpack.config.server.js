const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const nodeExternals = require('webpack-node-externals');
const VueSSRServerPlugin = require('vue-server-renderer/server-plugin');
const baseConfig = require('./webpack.config.base');

module.exports = currentPath => merge.smart(baseConfig(currentPath), {
  entry: path.resolve(__dirname, 'bundle-server.js'),
  output: {
    path: path.resolve(currentPath, 'bundles'),
    filename: 'server.js',
    libraryTarget: 'commonjs2',
  },
  target: 'node',
  externals: [nodeExternals()],
  plugins: [
    // This is the plugin that turns the entire output of the server build
    // into a single JSON file. The default file name will be
    // `vue-ssr-server-bundle.json`
    new VueSSRServerPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
        VUE_ENV: JSON.stringify('server'),
      },
    }),
  ],
});
