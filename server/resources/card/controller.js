'use strict';

const mongoose  = require('mongoose');
const Promise   = require('bluebird');
const request   = require('request');
const ejs       = require('ejs');
const fs        = require('fs');
const isDate    = require('../../utils/date').isDate;
const cheerio   = require('cheerio');
const _         = require('lodash');

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

    const Card          = mongoose.model('Card');
    const CardRender    = mongoose.model('CardRender');

    var group           = req.params.group;
    var method          = req.params.method;
    var id              = req.params.id;
    var customUrl       = req.query.customUrl;
    const frame         = req.query.frame;
    const altHeader     = req.query.altHeader;
    const embed         = req.query.embed;
    const previewWidth  = req.query.width;
    let state           = req.query.state;

    const cacheData = {
        embed       : embed,
        frame       : frame,
        altHeader   : altHeader,
        customUrl   : customUrl,
        id          : id,
        method      : method,
        group       : group
    };

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

    if(isDate(id)){
        date = id;
        cacheData.date = date;
    }
    else if(req.params['0'].length > 0 && req.params['0'] !== undefined) {
        date = req.params['0'];
        cacheData.date = date;
        getData.date = date;
    }else{
        const today = new Date();
        // ToDo - ta datum more povedat analize api ker jaz ne vem ce bom dobil podatke se od danes ali od vceraj
        date = today.getDate()+'.'+today.getUTCMonth()+'.'+today.getFullYear();
        cacheData.date = date;
    }

    CardRender.findOne(cacheData)
      .then((cardRenderDoc)=>{

          if(!cardRenderDoc){
              Card.findOne({ method:method, group:group }, function(err, doc){

                  if(err){
                      return res.status(400).send(err);
                  }

                  if(!doc){
                      return res.status(404).send('Card not found');
                  }

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

                  cacheData.dataUrl = dataUrl;
                  cacheData.card = doc._id;
                  cacheData.cardUrl =  req.protocol + '://' + req.get('host') + req.originalUrl;

                  request(dataUrl, function (err, _res, body) {

                      if (!err) {

                          try {

                              var data = JSON.parse(body);

                              try {

                                  const vocab = JSON.parse(fs.readFileSync('assets/vocab.json', 'utf-8'));

                                  const cardData = {
                                      data    : data,
                                      vocab   : vocab
                                  };

                                  try {

                                      if (state) state = JSON.parse(state);

                                      let onlyStrings = true;

                                      _.each(cardData.state, (key, val)=>{
                                          if(typeof key !== 'string' && typeof val !== 'string'){
                                              onlyStrings = false;
                                          }
                                      });

                                      if(!onlyStrings){
                                          throw new Error(err);
                                      }else{
                                          cardData.state = state;
                                      }

                                  }catch(err){
                                      throw new Error(err);
                                  }

                                  var html = ejs.render(doc.ejs, cardData);

                                  if(altHeader){

                                      var headerHtmlString = fs.readFileSync('views/alt_header.ejs', 'utf-8');
                                      var renderedHtmlHeader = ejs.render(headerHtmlString, cardData);

                                      const $ = cheerio.load(html);
                                      $('.card-header').empty().append(renderedHtmlHeader);

                                      html = $.html();

                                  }

                                  if(frame) {

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

                                  }else if(embed){

                                      var frameHtmlString = fs.readFileSync('views/embed_frame.ejs', 'utf-8');
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

                                  cacheData.html = html;

                                  const cardRender = new CardRender(cacheData);

                                  cardRender.save(function(err){

                                      console.log(err);

                                  });

                                  res.write(html);
                                  res.end();

                              }catch(err){
                                  res.send(err.toString(), 400);
                              }

                          } catch (err) {
                              res.status(400).send({err, msg:'Data source url not returning json'});
                          }

                      } else {
                          res.status(400).send({err, msg:'Data source request error'});
                      }

                  });


              });
          }
          else{

              console.log('Prerender');

              const html = cardRenderDoc.html;

              res.writeHead(200, {
                  'Content-Length': Buffer.byteLength(html),
                  'Content-Type': 'text/html; charset=utf-8'
              });

              res.write(html);
              res.end();

          }

      });



};