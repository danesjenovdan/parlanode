const Promise = require('bluebird');
const request = require('request');
const CronJob = require('cron').CronJob;
const fs      = require('fs');

const dataDir = __dirname + '/../data';
if (!fs.existsSync(dataDir)){
  fs.mkdirSync(dataDir);
}

const spsFilePath = __dirname + '/../data/sps.json';
const mpsFilePath = __dirname + '/../data/mps.json';
const opsFilePath = __dirname + '/../data/ops.json';
const mpsopsurlsFilePath = __dirname + '/../data/mpsopsurls.json';
const mpsopsFilePath = __dirname + '/../data/mpsops.json';

exports.sps = [];
exports.mps = [];
exports.ops = {};
exports.mpsopsurls = {};
exports.mpsops = [];

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

    request('http://analize.hr.parlameter.si/v1/s/getSessionsByClassification/', (err, res, body) => {

      if (err) return reject(err);

      try {
        // parse before writing to file so you don't write a bad file to disk if it can't be parsed
        const parsedBody = JSON.parse(body);
        fs.writeFileSync(spsFilePath, body);
        // TODO - legacy array wrap
        resolve([parsedBody]);
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

    request('http://data.hr.parlameter.si/v1/getMPs/', (err, res, body) => {

      if (err) return reject(err);

      try {
        // parse before writing to file so you don't write a bad file to disk if it can't be parsed
        const parsedBody = JSON.parse(body);
        fs.writeFileSync(mpsFilePath, body);
        resolve(parsedBody);
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

    request('http://data.hr.parlameter.si/v1/getAllPGs/', (err, res, body) => {

      if (err) return reject(err);

      try {
        // parse before writing to file so you don't write a bad file to disk if it can't be parsed
        const parsedBody = JSON.parse(body);
        fs.writeFileSync(opsFilePath, body);
        resolve(parsedBody);
      }
      catch (err) {
        reject(err);
      }

    });

  });

}

/**
 * Request MPSOPS data from parlalize and save the result to disk as cache
 * @param force
 * @returns {Promise.<TResult>}
 */
exports.loadMPSOPS = (force) => {

  return Promise.resolve()
    .then(() => {

      const mpsopsExists = fs.existsSync(mpsopsFilePath);

      if (mpsopsExists && !force) {
        mpsopsRequest();
        return Promise.resolve(JSON.parse(fs.readFileSync(mpsopsFilePath, 'UTF-8')));
      }

      return mpsopsRequest();

    })
    .then(mpsopsData => {
      exports.mpsops.length = 0;
      Object.assign(exports.mpsops, mpsopsData);
      return mpsopsData;
    });

};

/**
 * Get mpsops
 */
function mpsopsRequest() {

  return new Promise((resolve, reject) => {

    request('http://analize.hr.parlameter.si/v1/p/getAllActiveMembers/', (err, res, body) => {

      if (err) return reject(err);

      try {
        // parse before writing to file so you don't write a bad file to disk if it can't be parsed
        const parsedBody = JSON.parse(body);
        fs.writeFileSync(mpsopsFilePath, body);
        resolve(parsedBody);
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

    request('http://analize.hr.parlameter.si/v1/p/getSlugs/', (err, res, body) => {

      if (err) return reject(err);

      try {
        // parse before writing to file so you don't write a bad file to disk if it can't be parsed
        const parsedBody = JSON.parse(body);
        fs.writeFileSync(mpsopsurlsFilePath, body);
        resolve(parsedBody);
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
  mpsopsRequest();
  mpsopsurlsRequest();
}, null, true);
