'use strict';

const Sequelize = require("sequelize");

var sequelize = new Sequelize(CFG.postgres.name, CFG.postgres.user, CFG.postgres.password, {
    host: CFG.postgres.host,
    dialect: 'postgres',
    pool: {
        max: 5,
        min: 0,
        idle: 10000
    }
});

var db;

exports.connect = function(){

    console.log('Connect to parlalize');

    return sequelize
        .authenticate()
        .then(function(err) {
            console.log('Connection has been established successfully.');
        })
        .catch(function (err) {
            console.log('Unable to connect to the database:', err);
        });

};

exports.getDb = function(){

    return db;

};
