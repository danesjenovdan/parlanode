const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const { spawn } = require('child_process');

const dir = 'og-images';
let [currentPath, cmd] = process.argv.slice(2);

if (!cmd) {
  cmd = 'dev';
}

if (['dev', 'build'].indexOf(cmd) === -1) {
  // eslint-disable-next-line no-console
  console.error(chalk.red(`Invalid command '${cmd}', must be 'dev' or 'build'.`));
  process.exit(1);
}

if (currentPath !== 'all') {
  currentPath = path.normalize(currentPath)
    .replace(/\\/g, '/')
    .replace(new RegExp(`^${dir}\\/`), '')
    .replace(/\/$/, '');

  if (!fs.existsSync(path.join(__dirname, currentPath, 'og.vue'))) {
    // eslint-disable-next-line no-console
    console.error(chalk.red(`Invalid path. '${chalk.yellow(currentPath)}/og.vue' doesn't exist.`));
    process.exit(1);
  }
}

// eslint-disable-next-line no-console
console.log(chalk.green(cmd), chalk.yellow(currentPath));

if (cmd === 'dev') {
  const cpEnv = Object.create(process.env);
  cpEnv.CURRENT_PATH = currentPath;

  const cpArgs = ['--config', `${dir}/webpack.config.dev.js`, '--content-base', dir, '--hot', '--progress', '--open', '--inline'];

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

// if (cmd === 'build') {
//   const cpEnv = Object.create(process.env);
//   cpEnv.NODE_ENV = 'production';
//   cpEnv.CARD_NAME = cardPath;
//   cpEnv.CARD_LANG = lang;

//   const cpArgs = ['cards/build.js'];

//   const cp = spawn('node', cpArgs, { stdio: 'inherit', env: cpEnv });

//   cp.on('error', (error) => {
//     // eslint-disable-next-line no-console
//     console.error(error);
//   });

//   cp.on('close', (code) => {
//     if (code) {
//       // eslint-disable-next-line no-console
//       console.error(chalk.red('error'), `Build failed with exit code ${code}.`);
//       process.exit(code);
//     }
//   });
// }
