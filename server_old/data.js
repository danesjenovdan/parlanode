const path = require('path');
const fs = require('fs-extra');
const fetch = require('node-fetch');
const { CronJob } = require('cron');
const config = require('../config');

const dataPath = path.resolve(__dirname, '../data');
fs.ensureDirSync(dataPath);

const dataFiles = {
  urls: `${config.urls.analize}/p/getSlugs/`,
  siteMap: `${config.urls.base}/api/sitemap`,
};

const dataTransforms = {
  urls(data) {
    // allow replacing urls in config
    data.urls = { ...data.urls, ...config.urls };
    return data;
  },
};

const dataOnFetchFailure = {
  siteMap(error) {
    // eslint-disable-next-line no-console
    console.warn('Failed fetching siteMap:', error.message, '\nTrying to use local siteMap.');
    const filePath = path.resolve(dataPath, 'siteMap.json');
    if (fs.existsSync(filePath)) {
      return fs.readJsonSync(filePath);
    }
    return fs.readJsonSync(path.resolve(dataPath, 'siteMap.default.json'));
  },
};

const loadedData = {};

async function fetchData(name) {
  try {
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
  } catch (error) {
    if (dataOnFetchFailure[name]) {
      loadedData[name] = dataOnFetchFailure[name](error);
      return loadedData[name];
    }
    throw error;
  }
}

async function loadData(name) {
  const filePath = path.resolve(dataPath, `${name}.json`);
  if (fs.existsSync(filePath)) {
    try {
      loadedData[name] = await fs.readJson(filePath);
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
  return Promise.all(Object.keys(dataFiles).map(name => fetchData(name)))
    .then(() => {
      // eslint-disable-next-line no-console
      console.log('Finished refetch');
    })
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.error('Failed refetch:', error);
      return error;
    });
}

async function preload() {
  // eslint-disable-next-line no-console
  console.log('Preloading data files');
  return Promise.all(Object.keys(dataFiles).map(name => loadData(name)))
    .then(() => {
      // async fetch new data since everything could have been loaded from old files
      if (import.meta.env.NODE_ENV === 'production') {
        refetch();
      }
    });
}

// fetch new data every day at 4am
const cron = new CronJob('00 04 * * *', refetch);
cron.start();

module.exports = {
  preload,
  refetch,
  get urls() {
    return loadedData.urls;
  },
  get siteMap() {
    return loadedData.siteMap;
  },
};
