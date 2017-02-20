const Promise = require('bluebird');
const request = require('request');
const CronJob = require('cron').CronJob;
const fs      = require('fs');

const spsFilePath = __dirname + '/../data/sps.json';

exports.sps = {};

exports.loadSPS = () => {

  return Promise.resolve()
    .then(() => {

      const spsExists = fs.existsSync(spsFilePath);

      if ( spsExists ) {
        spsRequest();
        return Promise.resolve(JSON.parse(fs.readFileSync(spsFilePath, 'UTF-8')));
      }

      return spsRequest();

    })
    .then(spsData => exports.sps = spsData);

};

function spsRequest() {

  return new Promise(( resolve, reject ) => {

    request('https://analize.parlameter.si/v1/s/getSessionsByClassification/', {rejectUnauthorized: false}, ( err, res, body ) => {

      if ( err ) return reject(err);

      try {
        fs.writeFileSync(spsFilePath, body);
        resolve(JSON.parse(body));
      }
      catch ( err ) {
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
}, null, true);