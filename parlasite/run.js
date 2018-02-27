"use strict";
const server  = require('./server');
const config  = require('./config');
const router  = require('./router');
const dataService = require('./services/data-service');

function init(){

  return preloadSPS()
    .then(preloadMPS())
    .then(preloadOPS())
    .then(server.start)
    .then(router)
    .then(() => {
      console.log(`All is well on port ${config.PORT}`);
    })
    .catch((err)=>{
      console.log(err);
    });

}

function preloadSPS(){

  console.log('Preloading SPS data');

  return dataService.loadSPS();

}
function preloadMPS(){

  console.log('Preloading MPS data');

  return dataService.loadMPS();

}
function preloadOPS(){

  console.log('Preloading OPS data');

  return dataService.loadOPS();

}

if (require.main === module) {
  init();
}

exports.app = server.app;
exports.init = init;
