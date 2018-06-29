const express = require('express');
const chalk = require('chalk');
const serveStatic = require('serve-static');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');
const _ = require('lodash');
const config = require('../config');

const app = express();

const assetsPath = path.resolve(__dirname, '../assets');
const urlSlugsPath = path.resolve(assetsPath, 'urls.json');
const urlSlugsUrl = `${config.urls.analize}/p/getSlugs/`;

/* eslint-disable no-underscore-dangle */
async function fetchUrlSlugs(compare = false) {
  try {
    const res = await axios.get(urlSlugsUrl);
    if (typeof res.data !== 'object') {
      throw new Error(`Request did not return JSON (${urlSlugsUrl})`);
    }
    const newData = { ...res.data };
    // allow replacing urls in config
    newData.urls = { ...newData.urls, ...config.urls };

    if (compare) {
      const fileData = await fs.readJson(urlSlugsPath);
      delete fileData.__lastUpdate;
      if (!_.isEqual(newData, fileData)) {
        newData.__lastUpdate = Date.now();
      }
    } else {
      newData.__lastUpdate = Date.now();
    }

    await fs.ensureDir(assetsPath);
    await fs.writeJson(urlSlugsPath, newData);
  } catch (error) {
    if (!compare) {
      throw error;
    } else {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  }
}

async function preloadUrlSlugs() {
  // eslint-disable-next-line no-console
  console.log('Preloading url slugs');
  await fetchUrlSlugs(fs.existsSync(urlSlugsPath));
}

function setupExpress() {
  return new Promise((resolve, reject) => {
    // eslint-disable-next-line no-console
    console.log(`${chalk.magenta('| EXPRESS SERVER |')} - ${chalk.green('starting')}`);

    // use ejs as the view engine
    app.set('view engine', 'ejs');
    // serve static assets on /assets
    app.use('/assets', serveStatic('assets'));
    app.use('/og_cards', serveStatic('og'));
    app.use(cors());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    // eslint-disable-next-line global-require
    require('./resources')(app);

    app.get('*', (req, res) => {
      res.status(400).send('Bad Request');
    });

    // start listening on port
    const server = app.listen(config.port, () => {
      // eslint-disable-next-line no-console
      console.log(`${chalk.magenta('| EXPRESS SERVER |')} - ${chalk.green(`started on: http://localhost:${config.port}/`)}`);
      resolve();
    });

    server.on('error', (err) => {
      reject(err);
    });

    server.timeout = config.serverTimeout;
  });
}

exports.init = () => (
  Promise.resolve()
    .then(preloadUrlSlugs)
    .then(setupExpress)
);
