const mongoose = require('mongoose');
const request  = require('request');
const ejs      = require('ejs');

/**
 * PUT rest method
 * @param req
 * @param res
 */
exports.update = function (req, res) {

  const id   = req.params.id;
  const data = req.body;

  console.log('Update card');

  const Card = mongoose.model('Card');

  Card.findByIdAndUpdate(id, data, (err, doc) => {

    if (!err) {
      res.send(doc);
    } else {
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
exports.save = function (req, res) {

  var cardData = req.body;

  cardData.uniquePath = cardData.group + '/' + cardData.method;

  var Card = mongoose.model('Card');

  Card.findOne({ group : cardData.group, method : cardData.method }, function (err, doc) {

    if (!doc) {

      var card = new Card(cardData);

      card.save(function (err) {

        console.log(err);
        res.send(card);

      });

    } else {
      //conflict

      console.log('conflict');
      res.sendStatus(409);

    }

  });


};

/**
 * DELETE rest method
 * @param req
 * @param res
 */
exports.delete = function (req, res) {

  var id = req.params.id;

  var Card = mongoose.model('Card');

  Card.findByIdAndRemove(id, function (err, doc) {

    if (!err) {
      res.send(doc);
    } else {
      console.log(err);
      res.sendStatus(400);
    }

  });

};

exports.get = function (req, res) {

  var Card = mongoose.model('Card');

  Card.find(function (err, docs) {

    if (err) {
      res.sendStatus(400);
    } else {
      res.send(docs);
    }

  });


};

/**
 *
 * @param req
 * @param res
 */
exports.render = function (req, res) {

  var group  = req.params.group;
  var method = req.params.method;
  var id     = req.params.id;

  var getData = {
    group  : group,
    method : method,
    id     : id
  };

  var date;

  if (req.params['0'].length > 0 && req.params['0'] !== undefined) {
    date         = req.params['0'];
    getData.date = date;
  }

  var Card = mongoose.model('Card');

  console.log(group);

  Card.findOne({ method : method, group : group }, function (err, doc) {

    if (!err) {

      if (doc) {

        var analizeUrl = doc.dataUrl + '/' + id;
        if (date) {
          analizeUrl += '/' + date
        }

        request(analizeUrl, { rejectUnauthorized : false }, function (err, _res, body) {

          if (!err) {

            try {
              var data = JSON.parse(body);
              var mDoc = doc.toObject();

              console.log(body);

              var html = ejs.render(doc.ejs, { data : data });

              var body = html;
              res.writeHead(200, {
                'Content-Length' : Buffer.byteLength(body),
                'Content-Type'   : 'text/html; charset=utf-8'
              });
              res.write(body);
              res.end();

            } catch (err) {
              console.log(err);
              res.sendStatus(400);
            }

          } else {
            res.sendStatus(400);
          }

        });
      } else {
        console.log(err);
        res.sendStatus(404);
      }

    } else {
      console.log(err);
      res.sendStatus(400);
    }

  });


};
