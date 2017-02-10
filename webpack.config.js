const path = require('path');
const webpack = require('webpack');
const packageJson = require('./package.json');

module.exports = {
  externals: Object.keys(packageJson.dependencies),
  target: 'node',
  devtool: false,
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
      }
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

// if (process.env.NODE_ENV === 'production') {
  // module.exports.devtool = '#source-map';
  // http://vue-loader.vuejs.org/en/workflow/production.html
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
  module.exports.entry = './cards/bundle.js';
  module.exports.output = {
    // path: path.resolve(__dirname, '/cards'),
    filename: 'cards/compiledBundle.js',
    libraryTarget: 'commonjs2'
  };
// } else {
//   module.exports.entry = './components/main.js';
//   module.exports.output = {
//     path: path.resolve(__dirname, './js'),
//     publicPath: '/js/',
//     filename: 'main.js',
//   };
// }
