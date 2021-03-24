const chalk = require('chalk');
const data = require('./data');
const server = require('./server');

/**
 * Init app
 */
function init() {
  const hasFullICU = (() => {
    try {
      const january = new Date(9e8);
      const spanish = new Intl.DateTimeFormat('es', { month: 'long' });
      return spanish.format(january) === 'enero';
    } catch (err) {
      return false;
    }
  })();

  if (!hasFullICU) {
    // eslint-disable-next-line no-console
    console.warn(chalk.red('Node was NOT started with FULL ICU for Intl!'));
  }

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

/**
 * Run if main
 */
if (require.main === module) {
  init();
}

module.exports = {
  app: server.app,
  init,
};
