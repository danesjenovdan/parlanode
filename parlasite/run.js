"use strict";
const server  = require('./server');
const config  = require('./config');
const router  = require('./router');

function init(){

  return server.start()
    .then(router)
    .then(() => {
      console.log(`All is well on port ${config.PORT}`);
    })
    .catch((err)=>{
      console.log(err);
    });

}

if (require.main === module) {
  init();
}

exports.app = server.app;
exports.init = init;
