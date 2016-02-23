/**
 * Created by francizidar on 21/02/16.
 */


var express     = require('express');
var app         = express();
var chalk       = require('chalk');
var serveStatic = require('serve-static');
var bodyParser  = require('body-parser');
var cors        = require('cors')

exports.init = function(){

    setupExpress()
        .then(setupResources)
        .then(function(){

            console.log('Server initialised');

        });

};

function setupExpress(){

    return new Promise(function(resolve, reject) {

        // use ejs as the view engine
        app.set('view engine', 'ejs');
        // serve static assets on /assets
        app.use('/assets', serveStatic('assets'));
        app.use('/cms-dev', serveStatic('cms-dev'));
        app.use(cors());

        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({extended:true}));

        // start listening on port
        app.listen(CFG.port, function () {

            console.log(chalk.green(chalk.magenta('| EXPRESS SERVER |')+' - done / running on:' + CFG.port));
            resolve();

        });

    });

}

function setupResources(){

    require('./resources')(app);

}