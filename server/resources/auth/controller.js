const models  = require('../../models');
const crypto = require('crypto');

exports.login = (req, res)=>{

    req.checkBody('email', 'Email is not valid').isEmail();
    req.checkBody('password', 'Password is not valid').notEmpty().isLength({min:5});

    const errors = req.validationErrors();
    if(errors) return res.send(errors, 400);

    models.auth_user.find({
        where:{
            email:'filip@danesjenovdan.si'
        }
    })
        .then((user)=>{

            crypto.pbkdf2(req.body.password, user.password, 1, 32, function (err, derivedkey) {

                // error on failure
                if (err) return callback(err);

                // result otherwise
                //const result = key.toString() == derivedkey.toString();
                //console.log(result);
                res.send(user);

            });
            res.send(users);

        });

};