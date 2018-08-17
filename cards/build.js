const webpack = require('webpack');
const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const glob = require('glob');
const clientConfig = require('./webpack.config.client');
const serverConfig = require('./webpack.config.server');

// Runs webpack compilation with passed configuration
const compileWithWebpack = config => (
  new Promise((resolve, reject) => {
    config.bail = true;
    webpack(config, (err, stats) => {
      if (err || (stats.compilation.errors && stats.compilation.errors.length)) {
        reject(err || stats.compilation.errors[0]);
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
  })
);

// Refreshes lastUpdate param in card.json file on passed path
const refreshLastUpdate = async (cardPath) => {
  const cardJsonPath = `./cards/${cardPath}/card.json`;
  const json = await fs.readJson(cardJsonPath);
  json.lastUpdate = new Date().toJSON();
  await fs.writeJson(cardJsonPath, json, { spaces: 2 });
  // eslint-disable-next-line no-console
  console.log(chalk.green('Updated card.json timestamp.'));
};

const compileAndRefresh = (cardPath) => {
  // eslint-disable-next-line no-console
  console.log(chalk.green(`Building ${chalk.yellow(cardPath)}`));
  const compile = Promise.all([
    compileWithWebpack(clientConfig(cardPath)),
    compileWithWebpack(serverConfig(cardPath)),
  ]);
  if (!process.env.DONT_UPDATE_TIMESTAMP) {
    return compile.then(() => refreshLastUpdate(cardPath));
  }
  return compile;
};

if (!process.env.CARD_NAME) {
  // eslint-disable-next-line no-console
  console.log(`${chalk.red('ERROR:')} Specify card path (e.g. ${chalk.yellow('s/seznam-sej')} or ${chalk.yellow('all')}) to build one or all cards.`);
} else if (process.env.CARD_NAME.toLowerCase() === 'all') {
  glob('./cards/**/card.json', (error, files) => {
    if (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      process.exit(1);
    }

    const allCards = files
      .filter(f => !f.includes('_empty'))
      .map(f => (
        path.resolve(f)
          .replace(/\\/g, '/')
          .split('/')
          .slice(-3, -1)
          .join('/')
      ));

    allCards.reduce((p, c) => p.then(() => compileAndRefresh(c)), Promise.resolve())
      .catch((pError) => {
        // eslint-disable-next-line no-console
        console.error(pError);
        process.exit(1);
      });
  });
} else {
  const cardName = process.env.CARD_NAME;
  compileAndRefresh(cardName)
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.error(error);
      process.exit(1);
    });
}
