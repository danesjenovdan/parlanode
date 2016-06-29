var server      = require('./server/server');
var database    = require('./server/database');
var chalk       = require('chalk');
var parlalizeDb = require('./server/parlalize_db');

GLOBAL.CFG = require('./config').production;

function init(){

    database.connect()
        //.then(parlalizeDb.connect)
        .then(server.init)
        .then(function(){

            console.log(chalk.green('All is well'));

        })
        .catch(function(err){
            console.log(chalk.red('Error'));
            console.log(err);
        });

}

init();

