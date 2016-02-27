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
    var card = new Card(cardData);

    card.save(function(err){

        console.log(err);
        res.send(card);

    });

};

/**
 * DELETE rest method
 * @param req
 * @param res
 */
exports.delete = function(req, res){



};

exports.get = function(req, res){


    var Card = mongoose.model('Card');

    Card.find(function(err, docs){

        if(err){
            res.sendStatus(400);
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

    console.log(group);

    Card.findOne({ method:method, group:group }, function(err, doc){

        if(!err) {

            if(doc) {

                var analizeUrl = doc.dataUrl+'/'+id;
                if(date){
                    analizeUrl += '/'+date
                }

                request(analizeUrl, function (err, _res, body) {

                    if (!err) {

                        try {
                            var data = JSON.parse(body);
                            var mDoc = doc.toObject();

                            console.log(body);

                            var html = ejs.render(doc.ejs, {data: data});

                            var body = html;
                            res.writeHead(200, {
                                'Content-Length': Buffer.byteLength(body),
                                'Content-Type': 'text/html; charset=utf-8'
                            });
                            res.write(body);
                            res.end();

                        } catch (err) {
                            res.sendStatus(400);
                        }

                    } else {
                        res.sendStatus(400);
                    }

                });
            }else{
                res.sendStatus(404);
            }

        }else{
            res.sendStatus(400);
        }

    });


};