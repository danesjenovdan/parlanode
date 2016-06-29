'use strict';

const Sequelize = require("sequelize");

var sequelize = new Sequelize('parlalize', 'parladaddy', 'razvrat', {
    host: '192.168.110.31',
    dialect: 'postgres',
    pool: {
        max: 5,
        min: 0,
        idle: 10000
    }
});

//var sequelize = new Sequelize('postgres://parladaddy:razvrat@192.168.110.31/parlalize');

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
