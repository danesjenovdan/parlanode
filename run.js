var server      = require('./server/server');
var database    = require('./server/database');
var Promise     = require('bluebird');

GLOBAL.CFG = require('./config').dev;

function init(){

    database.connect()
        .then(server.init)
        .then(function(){

        });

}

init();

