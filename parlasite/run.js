"use strict";
const server  = require('./server');
const config  = require('./config');
const router  = require('./router');
const dataService = require('./services/data-service');

function init(){

  return preloadSPS()
    .then(() => preloadMPS())
    .then(() => preloadOPS())
    .then(() => preloadMPSOPS())
    .then(() => preloadMPSOPSURLS())
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
function preloadMPSOPS(){
  console.log('Preloading MPSOPS data');
  return dataService.loadMPSOPS();
}
function preloadMPSOPSURLS(){
  console.log('Preloading MPSOPSURLS data');
  return dataService.loadMPSOPSURLS();
}

if (require.main === module) {
  init();
}

exports.app = server.app;
exports.init = init;
