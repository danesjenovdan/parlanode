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
      if (err) { reject(err); }
      console.log(stats.toString({
        colors: true,
        hash: false,
        modules: false,
        version: false,
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

if (process.env.CARD_NAME === '') {
  const error = chalk.styles.red;
  const path = {
    open: chalk.styles.yellow.open + chalk.styles.italic.open,
    close: chalk.styles.yellow.close + chalk.styles.italic.close,
  };
  console.log(`${error.open}ERROR:${error.close} Specify card path (e.g. ${path.open}s/seznam-sej${path.close}) to build one cards or ${path.open}all${path.close} to build all cards.`);
} else if (process.env.CARD_NAME.toLowerCase() === 'all') {
  const paths = dirs('./cards/p').concat(dirs('./cards/ps')).concat(dirs('./cards/s').concat(dirs('./cards/c')));
  paths.reduce((promise, path) => promise.then(() => compileAndRefresh(path)), Promise.resolve());
} else {
  let cardName = process.env.CARD_NAME;

  if (cardName.indexOf('cards/') === 0) {
    cardName = cardName.replace('cards/', '');
  }

  compileAndRefresh(`./cards/${cardName}`);
}

