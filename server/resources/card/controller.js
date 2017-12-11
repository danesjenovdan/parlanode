/* globals CFG */
/* eslint no-underscore-dangle: "off", no-param-reassign: "off" */

const mongoose = require('mongoose');
const Promise = require('bluebird');
const request = require('request');
const ejs = require('ejs');
const fs = require('fs');
const { isDate } = require('../../utils/date');
const cheerio = require('cheerio');
const _ = require('lodash');
const webshot = require('webshot');
const Pageres = require('pageres');
global.Vue = require('vue');
const renderer = require('vue-server-renderer');

const replaceHeader = (cardData, html) => {
  const headerHtmlString = fs.readFileSync('views/alt_header.ejs', 'utf-8');
  const renderedHtmlHeader = ejs.render(headerHtmlString, cardData);

  const $ = cheerio.load(html, { decodeEntities: false });
  $('.card-header').empty().append(renderedHtmlHeader);

  return $.html();
};

const addFrame = (templateName, previewWidth, cardData, html) => {
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
exports.update = (req, res) => {
  const { id } = req.params;
  const data = req.body;

  const Card = mongoose.model('Card');

  data.lastUpdate = new Date();

  Card.findByIdAndUpdate(id, data)
    .then((doc) => {
      if (!doc) return res.status(404).send('Card with this id not found');
      doc.uniquePath = `${doc.group}/${doc.method}`;
      return doc.save();
    })
    .then(doc => res.send(doc))
    .catch((err) => {
      console.log(err || err.stack);
      res.sendStatus(400);
    });
};


/**
 * POST rest method
 * @param req
 * @param res
 */
exports.save = (req, res) => {
  const cardData = req.body;

  cardData.uniquePath = `${cardData.group}/${cardData.method}`;

  const Card = mongoose.model('Card');

  Card.findOne({ group: cardData.group, method: cardData.method })
    .then((doc) => {
      if (doc) return res.status(409).send('Card with this group and method already exists');
      const card = new Card(cardData);
      return card.save();
    })
    .then(card => res.send(card))
    .catch(err => res.status(400).send(err || err.stack));
};

/**
 * DELETE rest method
 * @param req
 * @param res
 */
exports.delete = (req, res) => {
  const { id } = req.params;

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

exports.getCardById = (req, res) => {
  const { cardId } = req.params;
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
exports.render = (req, res) => {
  const Card = mongoose.model('Card');
  const CardRender = mongoose.model('CardRender');

  const { group, method, id } = req.params;
  const {
    customUrl,
    frame,
    altHeader,
    embed,
    forceRender,
    image,
    width,
  } = req.query;

  let state = req.query.state || '{}';
  const cacheState = req.query.state || '{}';

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
      new Pageres({
        delay: 2, filename: cardRenderDoc._id, selector, scale: 2, format: 'jpg',
      })
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

  function loadCardFromFile(groupName, methodName) {
    const localPath = `cards/${groupName}/${methodName}/card.json`;
    if (!fs.existsSync(localPath)) throw Error();
    const cardDoc = JSON.parse(fs.readFileSync(localPath));
    cardDoc.lastUpdate = new Date(cardDoc.lastUpdate);
    return cardDoc;
  }

  function compileCard() {
    console.log('Compile card');

    Card.findOne({ method, group }).lean().then((cardDoc) => {
      if (!cardDoc) {
        try {
          // Vue based cards are loaded locally
          cardDoc = loadCardFromFile(group, method);
          cardDoc.vue = true;
          cardDoc.altHeader = altHeader;
        } catch (error) {
          res.status(404).send('Card not found');
          return;
        }
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
        dataUrl = analizeUrl;
      } else {
        dataUrl = decodeURI(customUrl);
      }

      cacheData.dataUrl = dataUrl;
      cacheData.card = cardDoc._id;
      cacheData.cardUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
      cacheData.cardLastUpdate = cardDoc.lastUpdate;

      request(dataUrl, { rejectUnauthorized: false }, (err, _res, body) => {
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
              const render = (html, vue) => {
                if (altHeader && !vue) {
                  html = replaceHeader(cardData, html);
                }

                if ((frame || embed) && !vue) {
                  const templateName = frame ? 'card_frame' : 'embed_frame';
                  html = addFrame(templateName, width, cardData, html);
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
                                  image,
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
                      image,
                    });
                    res.end();
                  }

                  if (err3) {
                    console.log('Err:3 ', err3);
                    res.status(400).send(err3);
                  }
                })
                  .catch((err4) => {
                    console.log('Err:4 ', err4);
                    res.status(400).send(err4);
                  });
              };

              if (!cardDoc.vue) {
                const html = ejs.render(cardDoc.ejs, cardData);
                render(html);
              } else {
                const bundlesPath = `cards/${group}/${method}/bundles/`;
                const serverBundle = fs.readFileSync(`${bundlesPath}server.js`, 'utf-8');
                const clientBundle = fs.readFileSync(`${bundlesPath}client.js`, 'utf-8');
                let vueTemplateName = 'default';
                if (frame) {
                  vueTemplateName = 'frame';
                } else if (embed) {
                  vueTemplateName = 'embed';
                }
                const rendererInstance = renderer.createBundleRenderer(serverBundle, {
                  template: fs.readFileSync(`cards/template_${vueTemplateName}.html`, 'utf-8'),
                  runInNewContext: false,
                });
                const stringifiedCardData = JSON.stringify(cardData);

                const context = JSON.parse(stringifiedCardData);

                context.clientBundle = clientBundle;

                console.log('server-side context');
                console.log(context.state);

                context.parlaState = context.state;

                rendererInstance.renderToString(
                  context,
                  (error, html) => {
                    if (error) throw error;
                    render(html, true);
                  },
                );
              }
            } catch (err4) {
              console.log('Err:4 ', err4);
              res.send(err4.toString(), 400);
            }
          } catch (err5) {
            console.log('Err:5 ', err5);
            res.status(400).send({
              body,
              dataUrl,
              err: err5,
              stack: err5.stack,
              msg: 'Data source url not returning json',
            });
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
        const { html } = cardRenderDoc;
        const compileOrRespond = (cardDoc) => {
          if (+cardDoc.lastUpdate !== +cardRenderDoc.cardLastUpdate) {
            compileCard();
          } else {
            cardResponse(req, res, cardRenderDoc, html, {
              image,
            });
          }
        };

        Card.findById(cardRenderDoc.card)
          .then((cardDoc) => {
            cardDoc = cardDoc || loadCardFromFile(cacheData.group, cacheData.method);
            compileOrRespond(cardDoc);
          })
          .catch(() => {
            const cardDoc = loadCardFromFile(cacheData.group, cacheData.method);
            compileOrRespond(cardDoc);
          });
      }
    });
};
