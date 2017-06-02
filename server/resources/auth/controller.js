const crypto = require('crypto');
const mongoose = require('mongoose');
const randToken = require('rand-token');

const username = 'filip@danesjenovdan.si';
const password = 'Q6aTREmB2WiDp7xQ/NmoMSzLvX+fL42cRcog7+sneNU=';

exports.login = (req, res) => {

    console.log(req.body);

    req.checkBody('email', 'Email is not valid').isEmail();
    req.checkBody('password', 'Password is not valid').notEmpty().isLength({
        min: 5
    });

    const errors = req.validationErrors();
    if (errors) return res.send(errors, 400);

    const TokenModel = mongoose.model('Token');

    // const givenUsername = req.body.email; // DOES NOT WORK

    crypto.pbkdf2(req.body.password, 'IrhgN1perpLq', 20000, 32, 'sha256', function (err, derivedkey) {

        // error on failure
        if (err) {
            console.log(err);
            res.send(err, 401);
        }

        const resultHash = derivedkey.toString('base64');
        //   const password = user.password.split('$')[user.password.split('$').length-1];

        // if ((resultHash === password) && (givenUsername === username)) { // DOES NOT WORK
        if (resultHash === password) {

            const tokenValue = randToken.generate(100);
            const token = new TokenModel({
                value: tokenValue,
                userData: username
            });

            token.save()
                .then(() => {
                    res.send({
                        status: 1,
                        token: {
                            value: tokenValue,
                            doc: token
                        }
                    });
                })
                .catch((err) => {
                    console.log(err);
                    res.send(err, 401);
                });

        } else {
            console.log('Wrong email or password');
            res.send('Wrong email or password', 401);
        }

    });

};

exports.isLoggedIn = (req, res) => {

    res.send({
        status: 1
    });

};