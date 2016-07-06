"use strict";

module.exports = (sequelize, DataTypes)=>{

    var AuthUser = sequelize.define('auth_user', {
        password: DataTypes.STRING(128),
        username: DataTypes.STRING(30),
        email   : DataTypes.STRING(254)
    }, {
        freezeTableName: true,
        tableName:'auth_user',
        timestamps:false
    });

    return AuthUser;

};