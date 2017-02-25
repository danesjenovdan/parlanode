const webpack = require('webpack');
const fs = require('fs');
const clientConfig = require('./webpack.config.client');
const serverConfig = require('./webpack.config.server');

const dirs = p =>
  fs.readdirSync(p)
    .filter(f =>
      fs.statSync(`${p}/${f}`).isDirectory()
    )
    .map(f => `${p}/${f}`);

const allPaths = dirs('./cards/p').concat(dirs('./cards/ps'));

allPaths.forEach((path) => {
  webpack(clientConfig(path), (err, stats) => {
    if (err) { throw new Error(err); }
    console.log(stats.toString({
      chunks: false, // Makes the build much quieter
      colors: true,
    }));
  });

  webpack(serverConfig(path), (err, stats) => {
    if (err) { throw new Error(err); }
    console.log(stats.toString({
      chunks: false, // Makes the build much quieter
      colors: true,
    }));
  });
});
