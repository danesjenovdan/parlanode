const chalk = require('chalk');
const data = require('./server/data');
const server = require('./server/server');

function init() {
  return Promise.resolve()
    .then(data.preload)
    .then(server.init)
    .then(() => {
      // eslint-disable-next-line no-console
      console.log(chalk.green('All is well!'));
    })
    .catch((err) => {
      // eslint-disable-next-line no-console
      console.error(chalk.red('Failed to start:'), err);
      process.exit(1);
    });
}

if (require.main === module) {
  init();
}

module.exports = {
  app: server.app,
  init,
};
