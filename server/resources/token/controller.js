/**
 * Created by francizidar on 21/02/16.
 */

var mongoose = require('mongoose');
var Promise = require('bluebird');
var request = require('request');
var ejs = require('ejs');

/**
 * PUT rest method
 * @param req
 * @param res
 */
exports.update = function(req, res){

    var id      = req.params.id;
    var data    = req.body;

    console.log('Update card');

    var Card = mongoose.model('Card');

    Card.findByIdAndUpdate(id, data, function(err, doc){

        if(!err) {
            res.send(doc);
        }else{
            console.log(err);
            res.sendStatus(400);
        }

    });

};


/**
 * POST rest method
 * @param req
 * @param res
 */
exports.save = function(req, res){

    var cardData = req.body;

    cardData.uniquePath = cardData.group+'/'+cardData.method;

    var Card = mongoose.model('Card');

    Card.findOne({group:cardData.group, method:cardData.method}, function(err, doc){

        if(!doc) {

            var card = new Card(cardData);

            card.save(function (err) {

                console.log(err);
                res.send(card);

            });

        }else{
            //conflict
            res.status(409).send('Card with this group and method already exists');

        }

    });

};

/**
 * DELETE rest method
 * @param req
 * @param res
 */
exports.delete = function(req, res){

    var id = req.params.id;

    var Card = mongoose.model('Card');

    Card.findByIdAndRemove(id, function(err, doc){

        if(!err) {
            res.send(doc);
        }else{
            console.log(err);
            res.status(400).send(err);
        }

    });

};

exports.get = function(req, res){

    var Card = mongoose.model('Card');

    Card.find(function(err, docs){

        if(err){
            res.status(400).send(err);
        }else {
            res.send(docs);
        }

    });



};

/**
 *
 * @param req
 * @param res
 */
exports.render = function(req, res){

    var group   = req.params.group;
    var method  = req.params.method;
    var id      = req.params.id;
    var customUrl = req.query.customUrl;

    console.log('Render');

    var getData = {
        group   : group,
        method  : method,
        id      : id
    };

    var date;

    if(req.params['0'].length > 0 && req.params['0'] !== undefined) {
        date = req.params['0'];
        getData.date = date;
    }

    var Card = mongoose.model('Card');

    Card.findOne({ method:method, group:group }, function(err, doc){

        if(!err) {

            if(doc) {

                var dataUrl;

                if(!customUrl){
                    var analizeUrl = doc.dataUrl+'/'+id;
                    if(date){
                        analizeUrl += '/'+date
                    }
                    dataUrl = analizeUrl;
                }else{
                    dataUrl = customUrl;
                }

                request(dataUrl, function (err, _res, body) {

                    if (!err) {

                        try {

                            var data = JSON.parse(body);
                            var mDoc = doc.toObject();

                            try {

                                var html = ejs.render(doc.ejs, {data: data});

                                var body = html;
                                res.writeHead(200, {
                                    'Content-Length': Buffer.byteLength(body),
                                    'Content-Type': 'text/html; charset=utf-8'
                                });
                                console.log('Body: ',body);
                                res.write(body);
                                res.end();
                            }catch(err){
                                console.log('Error: ', err+'error');
                                res.send(err.toString(), 400);
                            }

                        } catch (err) {
                            console.log(err);
                            res.status(400).send(err);
                        }

                    } else {
                        res.status(400).send(err);
                    }

                });
            }else{
                console.log(err);
                res.status(404).send('Card definition not found by the passed parameters');
            }

        }else{
            console.log(err);
            res.status(400).send(err);
        }

    });


};