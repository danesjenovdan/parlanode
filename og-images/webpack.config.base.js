const path = require('path');
const webpack = require('webpack');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const sass = require('node-sass');
const _ = require('lodash');
const config = require('../config');

process.traceDeprecation = true;

module.exports = currentPath => ({
  mode: 'production',
  optimization: {
    minimize: true,
  },
  devtool: false,
  module: {
    rules: [
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
      {
        test: /\.scss$/,
        use: [
          import.meta.env.NODE_ENV === 'production'
            ? MiniCssExtractPlugin.loader
            : 'vue-style-loader',
          'css-loader',
          {
            loader: 'sass-loader',
            options: {
              sassOptions: {
                functions: {
                  'getConfig($key)': (key) => {
                    const value = _.get(config, key.getValue().split('.'));
                    if (typeof value === 'string') {
                      return sass.types.String(value);
                    }
                    return sass.types.String(key.getValue());
                  },
                },
              },
            },
          },
        ],
      },
    ],
  },
  resolve: {
    alias: {
      vue$: 'vue/dist/vue.esm.js',
      '~': `${path.resolve(__dirname, currentPath)}`,
      parlassets: `${path.resolve(__dirname, '..', 'parlassets')}`,
    },
  },
  plugins: [
    new VueLoaderPlugin(),
    new MiniCssExtractPlugin({
      filename: 'style.css',
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(import.meta.env.NODE_ENV || 'development'),
      },
    }),
  ],
});
