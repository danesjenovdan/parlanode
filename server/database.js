

var mongoose    = require('mongoose');
var chalk       = require('chalk');
var Promise     = require('bluebird');

exports.connect = function(cb){

    return new Promise(function(resolve, reject){

        mongoose.connect('admin:mypassword@ds047945.mongolab.com:47945/heroku_72h76cfr');
        //mongoose.connect(CFG.db.url+CFG.db.name);

        mongoose.connection.on('error', function(err){

            reject(err);
            console.log(chalk.red(err));

        });

        mongoose.connection.once('open', function(){

            if(cb){
                cb();
            }
            console.log(chalk.green(chalk.magenta('| DATABASE |')+' - done'));
            resolve();

        });

    });


};