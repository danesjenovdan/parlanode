'use strict';

const mongoose  = require('mongoose');
const Promise   = require('bluebird');
const request   = require('request');
const ejs       = require('ejs');
const fs        = require('fs');
const isDate    = require('../../utils/date').isDate;
const cheerio   = require('cheerio');

/**
 * PUT rest method
 * @param req
 * @param res
 */
exports.update = function(req, res){

    var id      = req.params.id;
    var data    = req.body;

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
    const isPreview = req.query.isPreview;
    const previewWidth = req.query.width;

    if(customUrl){
        if(!customUrl.match('.parlameter.')){
            return res.send('Invalid customUrl');
        }
    }

    var getData = {
        group   : group,
        method  : method,
        id      : id
    };

    var date;

    console.log(id);

    if(isDate(id)){
        date = id;
    }
    else if(req.params['0'].length > 0 && req.params['0'] !== undefined) {
        date = req.params['0'];
        getData.date = date;
    }

    var Card = mongoose.model('Card');

    Card.findOne({ method:method, group:group }, function(err, doc){

        if(!err) {

            if(doc) {

                var dataUrl;

                if(!customUrl){

                    var analizeUrl = doc.dataUrl;

                    if(!isDate(id)){
                        if(id && id !== undefined && typeof id === 'string' && id.length > 0) {
                            analizeUrl = analizeUrl + '/' + id;
                        }
                    }

                    if(date){
                        analizeUrl = analizeUrl+'/'+date;
                    }
                    dataUrl = analizeUrl;
                }else{
                    dataUrl = customUrl;
                }

                request(dataUrl, function (err, _res, body) {

                    if (!err) {

                        try {

                            var data = JSON.parse(body);

                            try {

                                var html = ejs.render(doc.ejs, {data: data});

                                if(isPreview) {
                                    var frameHtmlString = fs.readFileSync('views/card_frame.ejs', 'utf-8');
                                    var $ = cheerio.load(frameHtmlString);

                                    if(previewWidth){
                                        $('#card-container').css({
                                            width:previewWidth+'px',
                                            margin:'auto'
                                        });
                                    }

                                    $('#card-container').html(html);

                                    html = $.html();

                                }

                                res.writeHead(200, {
                                    'Content-Length': Buffer.byteLength(html),
                                    'Content-Type': 'text/html; charset=utf-8'
                                });

                                res.write(html);
                                res.end();

                            }catch(err){
                                res.send(err.toString(), 400);
                            }

                        } catch (err) {
                            res.status(400).send('Data source url not returning json');
                        }

                    } else {
                        res.status(400).send('Data source request error');
                    }

                });
            }else{
                res.status(404).send('Card not found');
            }

        }else{
            res.status(400).send(err);
        }

    });

};