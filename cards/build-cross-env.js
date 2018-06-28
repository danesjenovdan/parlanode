const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const { spawn } = require('child_process');

let [cardPath, cmd, lang] = process.argv.slice(2).filter(arg => !arg.startsWith('--'));

if (cmd && cmd.length === 2) {
  [cmd, lang] = [lang, cmd];
}

if (!lang) {
  lang = 'sl';
}

if (!cmd) {
  cmd = 'dev';
}

if (['dev', 'build'].indexOf(cmd) === -1) {
  // eslint-disable-next-line no-console
  console.error(chalk.red(`Invalid command '${cmd}', must be 'dev' or 'build'.`));
  process.exit(1);
}

cardPath = path.normalize(cardPath)
  .replace(/\\/g, '/')
  .replace(/^cards\//, '')
  .replace(/\/$/, '');

// eslint-disable-next-line no-console
console.log(chalk.green(cmd), `(${lang})`, chalk.yellow(cardPath));

if (!fs.existsSync(path.join(__dirname, cardPath, 'card.json'))) {
  // eslint-disable-next-line no-console
  console.error(chalk.red("Invalid card path 'card.json' doesn't exist."));
  process.exit(1);
}

const args = {};
process.argv.slice(3).forEach((arg) => {
  if (arg.startsWith('--')) {
    const [key, val] = arg.includes('=') ? arg.slice(2).split('=') : [arg.slice(2), true];
    args[key] = val;
  }
});
const isFalse = arg => [false, 0, 'false', '0', 'no', 'off'].includes(arg);

if (cmd === 'build') {
  const cpEnv = Object.create(process.env);
  cpEnv.NODE_ENV = 'production';
  cpEnv.CARD_NAME = cardPath;
  cpEnv.CARD_LANG = lang;
  if (isFalse(args['update-timestamp'])) {
    cpEnv.DONT_UPDATE_TIMESTAMP = true;
  }

  const cpArgs = ['cards/build.js'];

  const cp = spawn('node', cpArgs, { stdio: 'inherit', env: cpEnv });

  cp.on('error', (error) => {
    // eslint-disable-next-line no-console
    console.error(error);
  });

  cp.on('close', (code) => {
    if (code) {
      // eslint-disable-next-line no-console
      console.error(chalk.red('error'), `Build failed with exit code ${code}.`);
      process.exit(code);
    }
  });
}

if (cmd === 'dev') {
  const cpEnv = Object.create(process.env);
  cpEnv.CARD_NAME = cardPath;
  cpEnv.CARD_LANG = lang;

  const cpArgs = ['--config', 'cards/webpack.config.dev.js', '--content-base', 'cards', '--hot', '--progress', '--open', '--inline'];

  const proc = `webpack-dev-server${process.platform === 'win32' ? '.cmd' : ''}`;
  const cp = spawn(proc, cpArgs, { stdio: 'inherit', env: cpEnv });

  cp.on('error', (error) => {
    // eslint-disable-next-line no-console
    console.error(error);
  });

  cp.on('close', (code) => {
    if (code) {
      // eslint-disable-next-line no-console
      console.error(chalk.red('error'), `Dev server failed with exit code ${code}.`);
      process.exit(code);
    }
  });
}
