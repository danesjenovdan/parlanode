const path = require('path');
const fs = require('fs-extra');
const fetch = require('node-fetch');
const { CronJob } = require('cron');
const config = require('../config');

const dataPath = path.resolve(__dirname, '../data');
fs.ensureDirSync(dataPath);

const dataFiles = {
  urls: `${config.urls.analize}/p/getSlugs/`,
  mps: `${config.urls.analize}/p/getAllActiveMembers/`,
  pgs: `${config.urls.data}/getAllPGs/`,
  sessions: `${config.urls.analize}/s/getSessionsByClassification/`,
  laws: `${config.urls.analize}/s/getAllLegislation/`,
};

const dataTransforms = {
  urls(data) {
    // allow replacing urls in config
    data.urls = { ...data.urls, ...config.urls };
    return data;
  },
  pgs(data) {
    return Object.keys(data).map(key => data[key]);
  },
  laws(data) {
    return data.results;
  },
};

const loadedData = {};

async function fetchData(name) {
  const filePath = path.resolve(dataPath, `${name}.json`);
  const res = await fetch(dataFiles[name]);
  if (res.ok && res.status >= 200 && res.status < 400) {
    let data = await res.json();
    data = dataTransforms[name] ? dataTransforms[name](data) : data;
    await fs.writeJson(filePath, data, {
      spaces: 2,
    });
    loadedData[name] = data;
    return loadedData[name];
  }
  throw new Error(`Failed fetching data for '${name}': ${dataFiles[name]} status: ${res.status}`);
}

async function loadData(name) {
  const filePath = path.resolve(dataPath, `${name}.json`);
  if (fs.existsSync(filePath)) {
    try {
      loadedData[name] = await fs.readJsonSync(filePath);
      return loadedData[name];
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed loading data from file:', error);
      return fetchData(name);
    }
  } else {
    return fetchData(name);
  }
}

function refetch() {
  // eslint-disable-next-line no-console
  console.log('Refetching data...');
  Promise.all(Object.keys(dataFiles).map(name => fetchData(name)))
    .then(() => {
      // eslint-disable-next-line no-console
      console.log('Finished refetch');
    })
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.error('Failed refetch:', error);
    });
}

async function preload() {
  // eslint-disable-next-line no-console
  console.log('Preloading data files');
  return Promise.all(Object.keys(dataFiles).map(name => loadData(name)));
}

// fetch new data one minute after restart
// setTimeout(refetch, 60000);

// fetch new data every day at 4am
const cron = new CronJob('00 04 * * *', refetch);
cron.start();

module.exports = {
  preload,
  get urls() {
    return loadedData.urls;
  },
  get mps() {
    return loadedData.mps;
  },
  get pgs() {
    return loadedData.pgs;
  },
  get sessions() {
    return loadedData.sessions;
  },
  get laws() {
    return loadedData.laws;
  },
};
