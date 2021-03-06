const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const { spawn } = require('child_process');

const dir = 'og-images';
let [currentPath, cmd] = process.argv.slice(2).filter(arg => !arg.startsWith('--'));

if (!cmd) {
  cmd = 'dev';
}

if (['dev', 'build'].indexOf(cmd) === -1) {
  // eslint-disable-next-line no-console
  console.error(chalk.red(`Invalid command '${cmd}', must be 'dev' or 'build'.`));
  process.exit(1);
}

if (currentPath !== 'all') {
  // on windows sometimes path ends with \ and if the arg is quoted that escapes
  // the end quote so it's not stripped correctly; remove it here
  currentPath = currentPath.replace(/"$/, '');
  currentPath = path.normalize(currentPath)
    .replace(/\\/g, '/')
    .replace(new RegExp(`^${dir}\\/`), '')
    .replace(/\/$/, '');

  if (!fs.existsSync(path.join(__dirname, currentPath, 'og.json'))) {
    // eslint-disable-next-line no-console
    console.error(chalk.red(`Invalid path. '${chalk.yellow(currentPath)}/og.json' doesn't exist.`));
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

if (cmd === 'build') {
  /* eslint-disable global-require */
  const webpack = require('webpack');
  const serverConfig = require('./webpack.config.server');
  /* eslint-enable global-require */
  const updateTimestamp = !process.argv.slice(3).find(arg => arg === '--dont-update-timestamp');

  const config = serverConfig(currentPath);
  config.bail = true;
  webpack(config, async (error, stats) => {
    if (error || (stats.compilation.errors && stats.compilation.errors.length)) {
      const err = error || stats.compilation.errors[0];
      // eslint-disable-next-line no-console
      console.error(chalk.red('error'), 'Build failed:', err);
      process.exit(1);
    }

    // eslint-disable-next-line no-console
    console.log(stats.toString({
      colors: true,
      hash: false,
      modules: false,
      version: false,
      children: false,
    }));

    if (updateTimestamp) {
      // Update timestamp in og.json
      const jsonPath = path.join(__dirname, currentPath, 'og.json');
      const json = await fs.readJson(jsonPath);
      json.updated = new Date().toJSON();
      await fs.writeJson(jsonPath, json, { spaces: 2 });
      // eslint-disable-next-line no-console
      console.log(chalk.green('Updated og.json timestamp.'));
    }
  });
}
