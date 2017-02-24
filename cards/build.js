const webpack = require('webpack');
const clientConfig = require('./webpack.config.client');
const serverConfig = require('./webpack.config.server');

const path = './cards/ps/glasovanja';

webpack(clientConfig(path), (err, stats) => {
  if (err) { throw new Error(err); }
  console.log(stats.toString({
    chunks: false, // Makes the build much quieter
    colors: true,
  }));
});

webpack(clientConfig(path), (err, stats) => {
  if (err) { throw new Error(err); }
  console.log(stats.toString({
    chunks: false, // Makes the build much quieter
    colors: true,
  }));
});
