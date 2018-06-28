const webpack = require('webpack');
const fs = require('fs');
const clientConfig = require('./webpack.config.client');
const serverConfig = require('./webpack.config.server');
const chalk = require('chalk');

// Returns all directories on certain path
const dirs = p =>
  fs.readdirSync(p)
    .filter(f => fs.statSync(`${p}/${f}`).isDirectory())
    .map(f => `${p}/${f}`);

// Runs webpack compilation with passed configuration
const compileWithWebpack = config =>
  new Promise((resolve, reject) => {
    webpack(config, (err, stats) => {
      if (err) {
        reject(err);
      }
      // eslint-disable-next-line no-console
      console.log(stats.toString({
        colors: true,
        hash: false,
        modules: false,
        version: false,
        children: false,
      }));
      resolve();
    });
  });

// Refreshes lastUpdate param in card.json file on passed path
const refreshLastUpdate = (path) => {
  const dataJsonPath = `${path}/card.json`;
  fs.readFile(dataJsonPath, (err, data) => {
    if (err) throw err;
    const dataObject = JSON.parse(data);
    dataObject.lastUpdate = new Date().toJSON();
    fs.writeFile(
      dataJsonPath,
      JSON.stringify(dataObject, null, 2),
      (error) => { if (error) throw Error(error); },
    );
  });
};

const compileAndRefresh = path =>
  Promise.all([
    compileWithWebpack(clientConfig(path)),
    compileWithWebpack(serverConfig(path)),
  ]).then(() => {
    refreshLastUpdate(path);
  });

if (!process.env.CARD_NAME) {
  // eslint-disable-next-line no-console
  console.log(`${chalk.red('ERROR:')} Specify card path (e.g. ${chalk.yellow('s/seznam-sej')} or ${chalk.yellow('all')}) to build one or all cards.`);
} else if (process.env.CARD_NAME.toLowerCase() === 'all') {
  const paths = dirs('./cards/p').concat(dirs('./cards/ps')).concat(dirs('./cards/s').concat(dirs('./cards/c')));
  paths.reduce((promise, path) => promise.then(() => compileAndRefresh(path)), Promise.resolve())
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.error(error);
      process.exit(1);
    });
} else {
  let cardName = process.env.CARD_NAME;

  if (cardName.indexOf('cards/') === 0) {
    cardName = cardName.replace('cards/', '');
  }

  compileAndRefresh(`./cards/${cardName}`)
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.error(error);
      process.exit(1);
    });
}
