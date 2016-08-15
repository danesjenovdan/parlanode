const models  = require('../../models');
const crypto = require('crypto');
const mongoose = require('mongoose');
const randToken = require('rand-token');

exports.login = (req, res)=>{

    req.checkBody('email', 'Email is not valid').isEmail();
    req.checkBody('password', 'Password is not valid').notEmpty().isLength({min:5});

    const errors = req.validationErrors();
    if(errors) return res.send(errors, 400);

    const TokenModel = mongoose.model('Token');

    models.auth_user.find({
        where:{
            email:'filip@danesjenovdan.si'
        }
    })
        .then((user)=>{

            crypto.pbkdf2(req.body.password, 'Ov3TOthrlwCa', 20000, 32, 'sha256', function (err, derivedkey) {

                // error on failure
                if (err) return callback(err);

                const resultHash = derivedkey.toString('base64');
                const password = user.password.split('$')[user.password.split('$').length-1];

                if(resultHash === password) {

                    const tokenValue = randToken.generate(100);
                    const token = new TokenModel({
                        value       : tokenValue,
                        userData    : user.dataValues
                    });

                    token.save()
                      .then(()=>{
                          res.send({status:1, token:{value:tokenValue, doc:token}});
                      });

                }else{
                    res.send('Fail', 401);
                }

            });

        });

};

exports.isLoggedIn = (req, res)=>{

    res.send({status: 1});

};