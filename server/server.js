/**
 * Created by francizidar on 21/02/16.
 */


var express     = require('express');
var app         = express();
var chalk       = require('chalk');
var serveStatic = require('serve-static');
var bodyParser  = require('body-parser');
var cors        = require('cors');
var siteRouter  = require('./site-router');
var session     = require('express-session');
var expressValidator = require('express-validator');


exports.init = function(){

    return setupExpress()
        .then(setupResources)
        .catch(function(err){

            console.log(err);

        });

};

exports.app = app;

function setupExpress(){

    return new Promise(function(resolve, reject) {

        // use ejs as the view engine
        app.set('view engine', 'ejs');
        // serve static assets on /assets
        app.use('/assets', serveStatic('assets'));
        app.use('/cms-dev', serveStatic('cms-dev'));
        app.use('/cms', serveStatic('cms-dev/dist'));
        app.use(cors());
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({extended:true}));
        app.use(expressValidator());

        siteRouter(app);

        // start listening on port
        const server = app.listen(CFG.port, function () {

            console.log(chalk.green(chalk.magenta('| EXPRESS SERVER |')+' - done / running on:' + CFG.port));
            resolve();

        });

        server.timeout = CFG.serverTimeout;

    });

}

function setupResources(){

    require('./resources')(app);

}

function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
}