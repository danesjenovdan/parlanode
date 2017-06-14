const crypto    = require('crypto');
const mongoose  = require('mongoose');
const randToken = require('rand-token');
const bcrypt    = require('bcryptjs');

exports.login = (req, res) => {

  console.log(req.body);

  req.checkBody('email', 'Email is not valid').isEmail();
  req.checkBody('password', 'Password is not valid');

  const errors = req.validationErrors();
  if (errors) return res.send(errors, 400);

  const TokenModel = mongoose.model('Token');

  const Config = mongoose.model('Config');

  return Config.findOne({ email : req.body.email })
    .then((configDoc) => {

      if (!configDoc) return res.status(401).send('Wrong email or password');

      return bcrypt.compare(req.body.password, configDoc.password);

    }).then((match) => {

      if (!match) {
        res.status(401).send('Wrong email or password');
      }

      const tokenValue = randToken.generate(100);
      const token      = new TokenModel({
        value : tokenValue,
        email : req.body.email
      });

      return token.save();

    })
    .then((tokenDoc) => {

      res.send({
        status : 1,
        token  : {
          value : tokenDoc.value,
          doc   : tokenDoc
        }
      });
    })
    .catch((err) => {
      console.log(err);
      res.send(err, 401);
    });
};

exports.isLoggedIn = (req, res) => {

  res.send({
    status : 1
  });

};