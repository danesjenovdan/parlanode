

var mongoose    = require('mongoose');
var chalk       = require('chalk');
var Promise     = require('bluebird');

exports.connect = function(cb){

    return new Promise(function(resolve, reject){

        //mongoose.connect('mongodb://localhost/'+CFG.db.name);
        console.log(`| MONGO | Connecting to ${CFG.db.url+CFG.db.name}`);
        mongoose.connect(CFG.db.url+CFG.db.name);

        mongoose.connection.on('error', function(err){

            reject(err);
            console.log(chalk.red(err));

        });

        mongoose.connection.once('open', function(){

            if(cb){
                cb();
            }
            console.log(chalk.green(chalk.magenta('| MONGO DATABASE |')+' - connected'));
            resolve();

        });

    });


};