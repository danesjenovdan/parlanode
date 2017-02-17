"use strict";
const server  = require('./server');
const config  = require('./config');
const router  = require('./router');
const dataService = require('./services/data-service');

function init(){

  return preload()
    .then(server.start)
    .then(router)
    .then(() => {
      console.log(`All is well on port ${config.PORT}`);
    })
    .catch((err)=>{
      console.log(err);
    });

}

function preload(){

  console.log('Preloading data');

  return dataService.loadSPS();

}

if (require.main === module) {
  init();
}

exports.app = server.app;
exports.init = init;
