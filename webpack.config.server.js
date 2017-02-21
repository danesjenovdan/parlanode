/* globals module */
// const path = require('path');
const webpack = require('webpack');
const packageJson = require('./package.json');

module.exports = {
  externals: Object.keys(packageJson.dependencies),
  target: 'node',
  devtool: false,
  entry: './cards/ps/glasovanja/serverBundle.js',
  output: {
    filename: 'cards/ps/glasovanja/compiledServerBundle.js',
    libraryTarget: 'commonjs2',
  },
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
};

module.exports.plugins = (module.exports.plugins || []).concat([
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development'),
      VUE_ENV: '"server"',
    },
  }),
  // new webpack.optimize.UglifyJsPlugin({
  //   compress: {
  //     warnings: false,
  //   },
  // }),
  new webpack.LoaderOptionsPlugin({
    minimize: true,
  }),
]);
