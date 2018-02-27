const Promise = require('bluebird');
const request = require('request');
const CronJob = require('cron').CronJob;
const fs      = require('fs');

const spsFilePath = __dirname + '/../data/sps.json';
const mpsFilePath = __dirname + '/../data/mps.json';
const opsFilePath = __dirname + '/../data/ops.json';
const mpsopsurlsFilePath = __dirname + '/../data/mpsopsurls.json';

exports.sps = [];
exports.mps = [];
exports.ops = {};
exports.mpsopsurls = {};

/**
 * Request SPS data from parlalize and save the result to disk as cache
 * @param force
 * @returns {Promise.<TResult>}
 */
exports.loadSPS = (force) => {

  return Promise.resolve()
    .then(() => {

      const spsExists = fs.existsSync(spsFilePath);

      if (spsExists && !force) {
        spsRequest();
        // TODO - legacy array wrap
        return Promise.resolve([JSON.parse(fs.readFileSync(spsFilePath, 'UTF-8'))]);
      }

      return spsRequest();

    })
    .then(spsData => {
      exports.sps.length = 0;
      Object.assign(exports.sps, spsData);
      return spsData;
    });

};

/**
 * Get sps
 */
function spsRequest() {

  return new Promise((resolve, reject) => {

    request('https://analize.parlameter.si/v1/s/getSessionsByClassification/', (err, res, body) => {

      if (err) return reject(err);

      try {
        fs.writeFileSync(spsFilePath, body);
        // TODO - legacy array wrap
        resolve([JSON.parse(body)]);
      }
      catch (err) {
        reject(err);
      }

    });

  });

}

/**
 * Request MPS data from parlalize and save the result to disk as cache
 * @param force
 * @returns {Promise.<TResult>}
 */
exports.loadMPS = (force) => {

  return Promise.resolve()
    .then(() => {

      const mpsExists = fs.existsSync(mpsFilePath);

      if (mpsExists && !force) {
        mpsRequest();
        return Promise.resolve(JSON.parse(fs.readFileSync(mpsFilePath, 'UTF-8')));
      }

      return mpsRequest();

    })
    .then(mpsData => {
      exports.mps.length = 0;
      Object.assign(exports.mps, mpsData);
      return mpsData;
    });

};

/**
 * Get mps
 */
function mpsRequest() {

  return new Promise((resolve, reject) => {

    request('https://data.parlameter.si/v1/getMPs/', (err, res, body) => {

      if (err) return reject(err);

      try {
        fs.writeFileSync(mpsFilePath, body);
        resolve(JSON.parse(body));
      }
      catch (err) {
        reject(err);
      }

    });

  });

}

/**
 * Request OPS data from parlalize and save the result to disk as cache
 * @param force
 * @returns {Promise.<TResult>}
 */
exports.loadOPS = (force) => {

  return Promise.resolve()
    .then(() => {

      const opsExists = fs.existsSync(opsFilePath);

      if (opsExists && !force) {
        opsRequest();
        return Promise.resolve(JSON.parse(fs.readFileSync(opsFilePath, 'UTF-8')));
      }

      return opsRequest();

    })
    .then(opsData => {
      exports.ops.length = 0;
      Object.assign(exports.ops, opsData);
      return opsData;
    });

};

/**
 * Get ops
 */
function opsRequest() {

  return new Promise((resolve, reject) => {

    request('https://data.parlameter.si/v1/getAllPGs/', (err, res, body) => {

      if (err) return reject(err);

      try {
        fs.writeFileSync(opsFilePath, body);
        resolve(JSON.parse(body));
      }
      catch (err) {
        reject(err);
      }

    });

  });

}

/**
 * Request MPSOPSURLS data from parlalize and save the result to disk as cache
 * @param force
 * @returns {Promise.<TResult>}
 */
exports.loadMPSOPSURLS = (force) => {

  return Promise.resolve()
    .then(() => {

      const mpsopsurlsExists = fs.existsSync(mpsopsurlsFilePath);

      if (mpsopsurlsExists && !force) {
        mpsopsurlsRequest();
        return Promise.resolve(JSON.parse(fs.readFileSync(mpsopsurlsFilePath, 'UTF-8')));
      }

      return mpsopsurlsRequest();

    })
    .then(mpsopsurlsData => {
      exports.mpsopsurls.length = 0;
      Object.assign(exports.mpsopsurls, mpsopsurlsData);
      return mpsopsurlsData;
    });

};

/**
 * Get mpsopsurls
 */
function mpsopsurlsRequest() {

  return new Promise((resolve, reject) => {

    request('https://analize.parlameter.si/v1/p/getSlugs/', (err, res, body) => {

      if (err) return reject(err);

      try {
        fs.writeFileSync(mpsopsurlsFilePath, body);
        resolve(JSON.parse(body));
      }
      catch (err) {
        reject(err);
      }

    });

  });

}

/**
 * Cronjob refetching data every midnight
 */
new CronJob('00 4 * * *', () => {
  spsRequest();
  mpsRequest();
  opsRequest();
  mpsopsurlsRequest();
}, null, true);