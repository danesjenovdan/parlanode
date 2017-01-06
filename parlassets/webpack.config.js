const path = require('path');
const webpack = require('webpack');

module.exports = {
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          // vue-loader options go here
        },
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]?[hash]',
        },
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
  devtool: '#eval-source-map',
  performance: {
    hints: false,
  },
};

if (process.env.NODE_ENV === 'production') {
  module.exports.devtool = '#source-map';
  // http://vue-loader.vuejs.org/en/workflow/production.html
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"',
      },
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
      },
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true,
    }),
  ]);
  module.exports.entry = './components/components.js';
  module.exports.output = {
    path: path.resolve(__dirname, './js'),
    publicPath: '/js/',
    filename: 'components.js',
  };
} else {
  module.exports.entry = './components/main.js';
  module.exports.output = {
    path: path.resolve(__dirname, './js'),
    publicPath: '/js/',
    filename: 'main.js',
  };
}
