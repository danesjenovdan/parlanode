/* globals CFG */
/* eslint no-underscore-dangle: "off", no-param-reassign: "off" */

const mongoose = require('mongoose');
const Promise = require('bluebird');
const request = require('request');
const ejs = require('ejs');
const fs = require('fs');
const isDate = require('../../utils/date').isDate;
const cheerio = require('cheerio');
const _ = require('lodash');
const webshot = require('webshot');
const Pageres = require('pageres');
global.Vue = require('vue');
const renderer = require('vue-server-renderer');

const replaceHeader = function (cardData, html) {
  const headerHtmlString = fs.readFileSync('views/alt_header.ejs', 'utf-8');
  const renderedHtmlHeader = ejs.render(headerHtmlString, cardData);

  const $ = cheerio.load(html, { decodeEntities: false });
  $('.card-header').empty().append(renderedHtmlHeader);

  return $.html();
};

const addFrame = function (templateName, previewWidth, cardData, html) {
  const htmlString = fs.readFileSync(`views/${templateName}.ejs`, 'utf-8');
  const renderedHtmlString = ejs.render(htmlString, cardData);
  const $ = cheerio.load(renderedHtmlString, { decodeEntities: false });

  if (previewWidth) {
    $('#card-container').css({
      width: `${previewWidth}px`,
      margin: 'auto',
    });
  }

  $('#card-container').html(html);

  return $.html();
};


/**
 * PUT rest method
 * @param req
 * @param res
 */
exports.update = function (req, res) {
  const id = req.params.id;
  const data = req.body;

  const Card = mongoose.model('Card');

  data.lastUpdate = new Date();

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
  const cardData = req.body;

  cardData.uniquePath = `${cardData.group}/${cardData.method}`;

  const Card = mongoose.model('Card');

  Card.findOne({ group: cardData.group, method: cardData.method }, (err, doc) => {
    if (!doc) {
      const card = new Card(cardData);

      card.save((error) => {
        console.log(error);
        res.send(card);
      });
    } else {
      // conflict
      res.status(409).send('Card with this group and method already exists');
    }
  });
};

/**
 * DELETE rest method
 * @param req
 * @param res
 */
exports.delete = function (req, res) {
  const id = req.params.id;

  const Card = mongoose.model('Card');

  Card.findByIdAndRemove(id, (err, doc) => {
    if (!err) {
      res.send(doc);
    } else {
      console.log(err);
      res.status(400).send(err);
    }
  });
};

exports.get = (req, res) => {
  const Card = mongoose.model('Card');

  // eslint-disable-next-line array-callback-return
  Card.find((err, docs) => {
    if (err) {
      res.status(400).send(err);
    } else {
      res.send(docs);
    }
  });
};

exports.updateEjs = (req, res) => {
  const cardId = req.params.cardId;
  const ejsString = req.body.ejs;

  if (!ejsString) {
    res.status(400).send('Missing ejs');
    return;
  }

  const Card = mongoose.model('Card');

  Card.findByIdAndUpdate(cardId, { ejsString, lastUpdate: new Date() })
    .then((doc) => {
      res.status(200).send({
        _id: doc._id,
        name: doc.name,
        group: doc.group,
        method: doc.method,
        dataUrl: doc.dataUrl,
      });
    })
    .catch((err) => {
      res.status(400).send(err);
    });
};

exports.getCardById = (req, res) => {
  const cardId = req.params.cardId;
  const CardRender = mongoose.model('CardRender');

  CardRender.findOne({ _id: cardId })
    .then((cardDoc) => {
      if (!cardDoc) {
        res.status(404).send();
      } else {
        res.send(cardDoc.html);
      }
    })
    .catch((err) => {
      res.status(400).send(err);
    });
};

exports.getUrls = (req, res) => {
  const Card = mongoose.model('Card');

  Card.find({})
    .then((cardDocs) => {
      const cards = cardDocs.map(cardDoc => ({
        group: cardDoc.group,
        method: cardDoc.method,
        uniquePath: cardDoc.uniquePath,
      }));

      res.send(cards);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
};

/**
 *
 * @param req
 * @param res
 */
exports.render = function (req, res) {
  const Card = mongoose.model('Card');
  const CardRender = mongoose.model('CardRender');

  const group = req.params.group;
  const method = req.params.method;
  const id = req.params.id;
  const customUrl = req.query.customUrl;
  const frame = req.query.frame;
  const altHeader = req.query.altHeader;
  const embed = req.query.embed;
  const previewWidth = req.query.width;
  const getImage = req.query.image;
  let state = req.query.state || '{}';
  const cacheState = req.query.state || '{}';
  const forceRender = req.query.forceRender;

  const cacheData = {
    embed,
    frame,
    altHeader,
    customUrl,
    id,
    method,
    group,
    state: cacheState,
  };

  let date;

  const getData = {
    group,
    method,
    id,
  };

  /**
   * Creates image from html and saves the path to cardRenderDoc if no image generated yet.
   * If image is already attached to cardRenderDoc grab path.
   * Attach the image to the html and return the html with appended image.
   * @param cardRenderDoc
   * @param selector
   * @param force
   */
  function getCardImage(cardRenderDoc, selector, force) {
    console.log('getCardImage');

    if (cardRenderDoc.imageLocalPath && !force) {
      return Promise.resolve(cardRenderDoc.imageLocalPath);
    }

    return new Promise((resolve, reject) => {
      new Pageres({ delay: 2, filename: cardRenderDoc._id, selector, scale: 2, format: 'jpg' })
        .src(`https://glej.parlameter.si/card/${cardRenderDoc._id}`, ['480x320'], { crop: true })
        .dest(CFG.cardCapturePath)
        .run()
        .then(() => {
          cardRenderDoc.imageUrl = `${CFG.cardCaptureRootUrl}/${cardRenderDoc._id}.jpg`;
          cardRenderDoc.imageLocalPath = `${CFG.cardCapturePath}/${cardRenderDoc._id}.jpg`;

          cardRenderDoc.save()
            .then(() => {
              resolve(cardRenderDoc.imageLocalPath);
            })
            .catch((err) => {
              reject(err);
            });
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  function respondWithImage(rspns, imagePath) {
    const img = fs.readFileSync(imagePath);
    rspns.writeHead(200, { 'Content-Type': 'image/jpeg' });
    rspns.end(img, 'binary');
  }

  function cardResponse(rqst, rspns, cardRenderDoc, html, _options) {
    const options = {};

    _.extend(options, _options);

    if (options.image) {
      getCardImage(cardRenderDoc, '.card-', rqst.query.forceRenderImage || false)
        .then(imagePath => respondWithImage(rspns, imagePath))
        .catch((err) => {
          const errMsg = {
            err,
            stack: err.stack || 'no stack',
            url: `https://glej.parlameter.si/card/${cardRenderDoc._id}`,
          };
          rspns.status(400).send(errMsg);
        });
    } else {
      rspns.send(html);
    }
  }

  function compileCard() {
    console.log('Compile card');

    Card.findOne({ method, group }).lean().then((cardDoc) => {
      const localPath = `cards/${group}/${method}/data.json`;
      if (!cardDoc && fs.existsSync(localPath)) {
        cardDoc = JSON.parse(fs.readFileSync(localPath));
      }

      if (!cardDoc) {
        res.status(404).send('Card not found');
        return;
      }

      let dataUrl;

      if (!customUrl) {
        let analizeUrl = cardDoc.dataUrl;

        if (!isDate(id)) {
          if (id && id !== undefined && typeof id === 'string' && id.length > 0) {
            analizeUrl = `${analizeUrl}/${id}`;
          }
        }

        if (date) {
          analizeUrl = `${analizeUrl}/${date}`;
        }
        // dataUrl = analizeUrl;
        dataUrl = 'https://jsonblob.com/api/becddf1d-f6c2-11e6-95c2-95e999eab494';
      } else {
        dataUrl = decodeURI(customUrl);
      }

      cacheData.dataUrl = dataUrl;
      cacheData.card = cardDoc._id;
      cacheData.cardUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
      cacheData.cardLastUpdate = cardDoc.lastUpdate;
      console.log('pred fetchem')

      request(dataUrl, (err, _res, body) => {
        console.log('fetch je nazaj')

        if (!err) {
          try {
            const data = JSON.parse(body);

            try {
              const vocab = JSON.parse(fs.readFileSync('assets/vocab.json', 'utf-8'));
              const urlsData = JSON.parse(fs.readFileSync('assets/urls.json', 'utf-8'));

              const cardData = {
                data,
                vocab,
                cardData: cardDoc,
                customUrl,
                urlsData,
              };

              if (embed || frame) {
                cardData.cardData.isEmbedded = true;
              }

              try {
                if (state) state = JSON.parse(state);

                let onlyStrings = true;

                _.each(cardData.state, (key, val) => {
                  if (typeof key !== 'string' && typeof val !== 'string') {
                    onlyStrings = false;
                  }
                });

                if (!onlyStrings) {
                  throw new Error(err);
                } else {
                  cardData.state = state;
                }
              } catch (error) {
                throw new Error(error);
              }


              /**
               * Rendering ejs from the stored cardDocument (from CMS)
               * @type {String}
               */
              const render = function (html) {
                if (altHeader) {
                  html = replaceHeader(cardData, html);
                }

                if (frame || embed) {
                  const templateName = frame ? 'card_frame' : 'embed_frame';
                  html = addFrame(templateName, previewWidth, cardData, html);
                }

                cacheData.html = html;

                const cardRender = new CardRender(cacheData);
                cardRender.save((err3) => {
                  /**
                   * RENDER OG IMAGE IF CARD TYPE IS DEFINED
                   */
                  if (cardDoc.type && cardDoc.type !== 'iskanje') {
                    try {
                      const ogEjs = fs.readFileSync(`views/og/${cardDoc.type}.ejs`, 'utf-8');

                      if (ogEjs) {
                        const ogHtml = ejs.render(ogEjs, cardData);

                        webshot(ogHtml, `${CFG.ogCapturePath}/${cardRender._id}.jpeg`, {
                          siteType: 'html',
                          captureSelector: '#og-container',
                          quality: 80,
                        }, (err1) => {
                          if (err1) {
                            console.log('Err:1 ', err1);
                          } else {
                            cardRender.ogImageUrl = `${CFG.ogRootUrl + cardRender._id}.jpeg`;

                            const $ = cheerio.load(html, { decodeEntities: false });
                            $('head').append(`<meta property="og:image" content="${cardRender.ogImageUrl}" />`);
                            $('head').append(`<meta name="twitter:image" content="${cardRender.ogImageUrl}" />`);

                            cardRender.html = $.html();

                            cardRender.save()
                              .then(() => {
                                cardResponse(req, res, cardRender, cardRender.html, {
                                  image: getImage,
                                });
                              });
                          }
                        });
                      }
                    } catch (err2) {
                      console.log('Err:2 ', err2);
                      res.status(400).send({ err: err2.stack, data: cardData });
                    }
                  } else {
                    console.log('No card type');
                    cardResponse(req, res, cardRender, cardRender.html, {
                      image: getImage,
                    });
                    res.end();
                  }

                  if (err3) {
                    console.log('Err:3 ', err3);
                    res.status(400).send(err3);
                  }
                });
              };

              if (!cardDoc.vue) {
                const html = ejs.render(cardDoc.ejs, cardData);
                render(html);
              } else {
                console.log('zacel rendrat z bundleom')
                const cardBundle = fs.readFileSync(`cards/${group}/${method}/compiledBundle.js`, 'utf-8');
                // const testCardContents = fs.readFileSync('cards/card.js');
                const rendererInstance = renderer.createBundleRenderer(cardBundle);

                rendererInstance.renderToString(
                  cardData,
                  (error, html) => {
                    if (error) throw error;

                    const extendedHtml =
                      `<script src="https://unpkg.com/vue/dist/vue.js"></script>
                        ${html}
                        <script>window.__INITIAL_STATE__ = ${JSON.stringify(cardData)}</script>`;
                        // <script>a</script>
                        // <script>app.$mount('#app')</script>;
                    render(extendedHtml);
                  }
                );
              }
            } catch (err4) {
              console.log('Err:4 ', err4);
              res.send(err4.toString(), 400);
            }
          } catch (err5) {
            console.log('Err:5 ', err5);
            res.status(400).send({ body, dataUrl, err: err5, stack: err5.stack, msg: 'Data source url not returning json' });
          }
        } else {
          console.log('Err:6 ', err);
          res.status(400).send({ err, msg: 'Data source request error' });
        }
      });
    })
    .catch((err) => {
      console.log('Err:7 ', err);
      res.status(400).send(err);
    });
  }

  if (customUrl) {
    if (!customUrl.match('.parlameter.')) {
      res.send('Invalid customUrl');
      return;
    }
  }

  if (isDate(id)) {
    date = id;
    cacheData.date = date;
  } else if (req.params['0'].length > 0 && req.params['0'] !== undefined) {
    date = req.params['0'];
    cacheData.date = date;
    getData.date = date;
  } else {
    const today = new Date();
    // ToDo - ta datum more povedat analize api ker jaz ne vem
    // ce bom dobil podatke se od danes ali od vceraj
    date = `${today.getDate()}.${today.getUTCMonth() + 1}.${today.getFullYear()}`;
    cacheData.date = date;
  }

  CardRender.findOne(cacheData).sort({ dateTime: -1 })
    .then((cardRenderDoc) => {
      if (!cardRenderDoc) {
        console.log('No render found in database');
        compileCard();
      } else if (forceRender) {
        console.log('Force rendering card');
        compileCard();
      } else {
        const html = cardRenderDoc.html;

        Card.findById(cardRenderDoc.card)
          .then((cardDoc) => {
            // plus Date changes the string Date into milliseconds so it's possible to compare
            if (+cardDoc.lastUpdate !== +cardRenderDoc.cardLastUpdate) {
              compileCard();
            } else {
              cardResponse(req, res, cardRenderDoc, html, {
                image: getImage,
              });
            }
          });
      }
    });
};
