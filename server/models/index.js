var fs        = require("fs");
var path      = require("path");

const models = {};

exports.init = (sequelize) => {

    fs
      .readdirSync(__dirname)
      .filter(function(file) {
          return (file.indexOf(".") !== 0) && (file !== "index.js");
      })
      .forEach(function(file) {
          var model = sequelize.import(path.join(__dirname, file));
          models[model.name] = model;
      });

};

exports.models = models;


