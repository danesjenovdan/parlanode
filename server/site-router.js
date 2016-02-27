/**
 * Created by francizidar on 27/02/16.
 */


module.exports = function(app){

    app.get('/knedl', function(req, res){

        res.render('home', {});

    });

};