var fs        = require("fs");
var path      = require("path");
var Sequelize = require("sequelize");
var db        = {};

var sequelize = new Sequelize(CFG.postgres.name, CFG.postgres.user, CFG.postgres.password, {
    host: CFG.postgres.host,
    dialect: 'postgres',
    pool: {
        max: 5,
        min: 0,
        idle: 10000
    }
});

fs
    .readdirSync(__dirname)
    .filter(function(file) {
        return (file.indexOf(".") !== 0) && (file !== "index.js");
    })
    .forEach(function(file) {
        var model = sequelize.import(path.join(__dirname, file));
        db[model.name] = model;
    });

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;