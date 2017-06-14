const server   = require('../server/server');
const database = require('../server/database');
const mongoose = require('mongoose');
const inquirer = require('inquirer');
const bcrypt   = require('bcryptjs');
global.CFG     = require('../config');

database.connect()
  .then(() => server.init(false))
  .then(() => {

    return initializeDeployment();

  })
  .then(() => {

    console.log('Done!');
    process.exit()

  })
  .catch((err) => {

    console.log(err);

  });

function initializeDeployment() {

  const Config = mongoose.model('Config');

  return Config.findOne({}).remove().then(() => Config.findOne({})
    .then((configDoc) => {

      if (configDoc && configDoc.password) return Promise.resolve();

      return inquirer.prompt([{
        type    : 'email',
        message : 'Enter your email',
        name    : 'email'
      }, {
        type    : 'text',
        message : 'Enter a password',
        name    : 'password'
      }]).then((response) => {

          return bcrypt.genSalt(10)
            .then(salt => bcrypt.hash(response.password, salt))
            .then(hash => ({
              hash,
              email : response.email
            }));

        })
        .then((userData) => {

          const config = new Config({
            password : userData.hash,
            email    : userData.email
          });

          return config.save();

        })
        .catch((err) => {
          console.log(err);
        });

    }));

}