const _ = require('lodash');

const models = require('require-all')({
  dirname     : __dirname,
  filter      : /(model)\.js$/,
  excludeDirs : /^\.(git|svn)$/,
  recursive   : true
});

const routers = require('require-all')({
  dirname     : __dirname,
  filter      : /(routes)\.js$/,
  excludeDirs : /^\.(git|svn)$/,
  recursive   : true
});

// Set Mongoose Promise to BlueBird
require('mongoose').Promise = require('bluebird');

module.exports = app => _.each(routers, resource => _.each(resource, router => router(app)));