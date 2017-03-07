const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server')
const fs = require('fs');
const webpackConfig = require('./webpack.config.dev');

var config = webpackConfig('./cards/s/seznam-sej')
// config.entry.app.unshift("webpack-dev-server/client?http://localhost:8080/");
var compiler = webpack(config);
var server = new WebpackDevServer(compiler);
server.listen(8080);


// // Returns all directories on certain path
// const dirs = p =>
//   fs.readdirSync(p)
//     .filter(f =>
//       fs.statSync(`${p}/${f}`).isDirectory()
//     )
//     .map(f => `${p}/${f}`);

// // Runs webpack compilation with passed configuration
// const compileWithWebpack = config =>
//   new Promise((resolve, reject) => {
//     webpack(config, (err, stats) => {
//       if (err) { reject(err); }
//       console.log(stats.toString({
//         chunks: false, // Makes the build much quieter
//         colors: true,
//       }));
//       resolve();
//     });
//   });

// // Refreshes lastUpdate param in data.json file on passed path
// const refreshLastUpdate = (path) => {
//   const dataJsonPath = `${path}/data.json`;
//   fs.readFile(dataJsonPath, (err, data) => {
//     if (err) throw err;
//     const dataObject = JSON.parse(data);
//     dataObject.lastUpdate = new Date().toJSON();
//     fs.writeFile(
//       dataJsonPath,
//       JSON.stringify(dataObject, null, 2),
//       (error) => { if (error) throw Error(error); }
//     );
//   });
// };

// const allPaths = dirs('./cards/p').concat(dirs('./cards/ps')).concat(dirs('./cards/s'));

// allPaths.forEach(path =>
//   Promise.all([
//     compileWithWebpack(clientConfig(path)),
//     compileWithWebpack(serverConfig(path)),
//   ]).then(() => refreshLastUpdate(path))
// );
