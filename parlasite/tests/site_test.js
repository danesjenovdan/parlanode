var Horseman = require('node-horseman');
var horseman = new Horseman();
const request   = require('supertest');
const server    = require('../run');
const config    = require('../config');

before(function (done) {
  server.init()
    .then(()=>{
      done();
    });
});

describe('Load poslanci page and navigate to landing', function() {
  it('respond success', function(done) {

    this.timeout(15000);

        horseman
          .userAgent('Mozilla/5.0 (Windows NT 6.1; WOW64; rv:27.0) Gecko/20100101 Firefox/27.0')
          .open('http://localhost:'+config.PORT+'/poslanci')
          .click('.logo')
          .count('div')
          .log() // prints out the number of results
          .then((result) => {

            done();

          })
          .close(function(){



          });

  });
});