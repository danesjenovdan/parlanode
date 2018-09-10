const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const spawn = require('cross-spawn');
const kill = require('tree-kill');

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

if (cardPath !== 'all') {
  cardPath = path.normalize(cardPath)
    .replace(/\\/g, '/')
    .replace(/^cards\//, '')
    .replace(/\/$/, '');

  if (!fs.existsSync(path.join(__dirname, cardPath, 'card.json'))) {
    // eslint-disable-next-line no-console
    console.error(chalk.red(`Invalid card path. '${chalk.yellow(cardPath)}/card.json' doesn't exist.`));
    process.exit(1);
  }
}

// eslint-disable-next-line no-console
console.log(chalk.green(cmd), `(${lang})`, chalk.yellow(cardPath));

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

  const cp = spawn('node', ['cards/build.js'], { stdio: 'inherit', env: cpEnv });

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

  const cpArgs = ['--config', 'cards/webpack.config.dev.js', '--progress', '--open', '--inline'];
  const cp = spawn('webpack-dev-server', cpArgs, { stdio: 'inherit', env: cpEnv });

  const scssArgs = ['run', '--cwd=parlassets', 'dev'];
  const scssCp = spawn('yarn', scssArgs, { stdio: 'inherit' });

  cp.on('error', (error) => {
    // eslint-disable-next-line no-console
    console.error(error);
  });

  cp.on('close', (code) => {
    if (code) {
      // eslint-disable-next-line no-console
      console.error(chalk.red('error'), `Dev server failed with exit code ${code}.`);
      kill(scssCp.pid, () => {
        process.exit(code);
      });
    }
  });

  scssCp.on('error', (error) => {
    // eslint-disable-next-line no-console
    console.error(error);
  });

  scssCp.on('close', (code) => {
    if (code) {
      // eslint-disable-next-line no-console
      console.error(chalk.red('error'), `Scss watch failed with exit code ${code}.`);
      kill(cp.pid, () => {
        process.exit(code);
      });
    }
  });
}
