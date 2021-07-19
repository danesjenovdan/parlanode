const chalk = require('chalk');
const server = require('./server/server');

function init() {
  return Promise.resolve()
    .then(server.init)
    .then(() => {
      // eslint-disable-next-line no-console
      console.log(chalk.green('All is well!'));
    })
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.error(chalk.red('Failed to start:'), error);
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
