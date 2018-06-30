"use strict";
const _           = require('lodash');
const fetch       = require('node-fetch');
const UrlPattern  = require('url-pattern');
const Promise     = require('bluebird');
const config      = require('./config');
const slug        = require('slug');
const mpsList     = require('./services/data-service').mps;
const opsList     = require('./services/data-service').ops;
const spsList     = require('./services/data-service').sps;
const mpsopsList  = require('./services/data-service').mpsops;
const ejs         = require('ejs');
const webshot     = require('webshot');
const fs          = require('fs');
const hash        = require('object-hash');
const https       = require('https');
const dataService = require('./services/data-service');


function resolve_card(req, card, state = {}) {
  let cardUrl = `${config.CARD_RENDERER_API_ROOT}${card.sourceUrl}`;
  if (Object.keys(state).length !== 0) {
    let pattern        = new UrlPattern(card.sourceUrl);
    const renderedPath = pattern.stringify(state);
    // console.log(renderedPath);
    cardUrl            = `${config.CARD_RENDERER_API_ROOT}${renderedPath}`;
  }

  // console.log(cardUrl);

  if (req.query.forceRender) {
    cardUrl += '?forceRender=true';
  }

  return fetch(cardUrl).then((res) => {
    return res.text();
  })
  .then((body) => {
    return body;
  });
}

function resolve_card_with_custom_url(url, req, card, state = {}) {
  // console.log(`resolving card with url ${url}`);
  let cardUrl = `${config.CARD_RENDERER_API_ROOT}${card.sourceUrl}?customUrl=${encodeURIComponent(url)}`;
  // console.log(cardUrl, 'prvic');
  if (Object.keys(state).length !== 0) {
    const stateString = encodeURIComponent(JSON.stringify(state));
    cardUrl = `${cardUrl}&state=${stateString}`;
  }

  // console.log(cardUrl);

  return fetch(cardUrl).then((res) => {
    return res.text();
  })
  .then((body) => {
    return body;
  });
}

const routes = [
  {
    path      : '/',
    viewPath  : 'landing',
    pageTitle : 'Parlameter',
    cards     : [
      {
        name      : 'izpostavljenaZakonodaja',
        sourceUrl : '/c/izpostavljena-zakonodaja/',
        resolve   : (req, res, route, card) => {
          return resolve_card(req, card);
        },
      },
      {
        name      : 'zadnjaSeja',
        sourceUrl : '/c/zadnja-seja/',
        resolve   : (req, res, route, card) => {

          return getMPIdByName(req.params.fullName, req)
            .then((mpData) => {

              let mpId   = mpData.mpId;
              let mpSlug = mpData.mpSlug;

              let cardUrl = `${config.CARD_RENDERER_API_ROOT}${card.sourceUrl}`;

              if (req.query.forceRender) {
                cardUrl += '?forceRender=true';
              }

              return fetch(cardUrl)
                .then((res) => {

                  return res.text();

                })
                .then((body) => {

                  return body;

                });

            });

        }
      },
      // {
      //   name      : 'besedniZaklad',
      //   sourceUrl : '/c/besedni-zaklad-vsi/',
      //   resolve   : (req, res, route, card) => {
      //     return getMPIdByName(req.params.fullName, req)
      //       .then((mpData) => {
      //         let mpId    = mpData.mpId;
      //         let mpSlug  = mpData.mpSlug;
      //         let cardUrl = `${config.CARD_RENDERER_API_ROOT}${card.sourceUrl}`;

      //         if (req.query.forceRender) {
      //           cardUrl += '?forceRender=true';
      //         }

      //         return fetch(cardUrl)
      //           .then((res) => {
      //             return res.text();
      //           })
      //           .then((body) => {
      //             return body;
      //           });
      //       });
      //   }
      // },
      {
        name      : 'zadnjeSeje',
        sourceUrl : '/s/zadnjih-5-sej/?customUrl=https%3A%2F%2Fanalize.parlameter.si%2Fv1%2Fs%2FgetSessionsList&state=%7B"onlyLatest"%3Atrue%7D',
        resolve   : (req, res, route, card) => {

          return getMPIdByName(req.params.fullName, req)
            .then((mpData) => {

              let mpId   = mpData.mpId;
              let mpSlug = mpData.mpSlug;

              let cardUrl = `${config.CARD_RENDERER_API_ROOT}${card.sourceUrl}`;

              if (req.query.forceRender) {
                cardUrl += '?forceRender=true';
              }

              return fetch(cardUrl, { rejectUnauthorized : false })
                .then((res) => {

                  return res.text();

                })
                .then((body) => {

                  return body;

                });

            });

        }
      }
    ]
  },
  {
    path        : '/zakonodaja',
    viewPath    : 'zakonodaja',
    pageTitle   : 'Zakonodaja',
    cards       : [{
      name: 'zakonodaja',
      sourceUrl: '/c/zakonodaja/',
      resolve: (req, res, route, card) => resolve_card_with_custom_url('https://analize.parlameter.si/v1/s/getAllLegislation/', req, card, {generator: true})
    }]
  },
  {
    path        : '/zakonodaja/:epa',
    viewPath    : 'zakonodaja/zakon',
    pageTitle   : 'Zakonodaja',
    cards       : [{
      name: 'zakon',
      sourceUrl: '/s/zakon/',
      resolve: (req, res, route, card) => resolve_card_with_custom_url('https://analize.parlameter.si/v1/s/getLegislation/' + req.params.epa, req, card, {})
    }]
  },
  {
      path      : '/orodja',
      viewPath  : 'orodja',
      pageTitle : 'Orodja'
  },
  {
    path        : '/orodja/primerjalnik-glasovanj',
    viewPath    : 'orodja/primerjalnik-glasovanj',
    pageTitle   : 'Primerjalnik Glasovanj',
    cards       : [{
      name: 'primerjalnikGlasovanj',
      sourceUrl: '/c/primerjalnik/',
      resolve: (req, res, route, card) => resolve_card(req, card, {generator: true})
    }]
  },
  {
    path        : '/orodja/raziskovalec-neenotnosti',
    viewPath    : 'orodja/raziskovalec-neenotnosti',
    pageTitle   : 'Raziskovalec neenotnosti',
    cards       : [
      {
        name: 'raziskovalecNeenotnosti',
        sourceUrl: '/ps/glasovanja-neenotnost/',
        resolve: (req, res, route, card) => resolve_card(req, card, {generator: true})
      },
    ]
  },
  {
    path: '/orodja/parlamentarni-kompas',
    viewPath: 'orodja/parlamentarni-kompas',
    pageTitle: 'Parlamentarni kompas',
    cards: [
      {
        name      : 'kompas',
        sourceUrl : '/c/kompas/',
        resolve   : (req, res, route, card) => {

          // console.log('loading kompas');



          let cardUrl = `${config.CARD_RENDERER_API_ROOT}${card.sourceUrl}`;

          if (req.query.forceRender) {
            cardUrl += '?forceRender=true';
          }

          return fetch(cardUrl)
            .then((res) => {

              // console.log('kompas fetched');

              return res.text();

            })
            .then((body) => {

              return body;

            });

        }
      },
    ],
  },
  {
    path        : '/orodja/skupine-besed',
    viewPath    : 'orodja/skupine-besed',
    pageTitle   : 'Skupine besed',
    cards       : [
      {
        name: 'skupineBesed',
        sourceUrl: '/c/skupine-besed/',
        resolve: (req, res, route, card) => resolve_card(req, card, {generator: true})
      },
    ]
  },
  {
    path      : '/poslanci',
    viewPath  : 'poslanci',
    pageTitle : 'Seznam poslancev',
    cards     : [
      {
        name      : 'seznamPoslancev',
        sourceUrl : '/p/seznam-poslancev/',
        resolve   : (req, res, route, card) => {

          //var pattern = new UrlPattern(card.sourceUrl);
          //const renderedPath = pattern.stringify({motionid: req.params.motionid});

          let cardUrl = `${config.CARD_RENDERER_API_ROOT}${card.sourceUrl}?state=%7B"generator"%3Atrue%7D`;
          // console.log(cardUrl);

          if (req.query.forceRender) {
            cardUrl += '&forceRender=true';
          }

          return fetch(cardUrl)
            .then((res) => {
              return res.text();
            })
            .then((body) => {
              return body;
            });
        }
      },
    ],
  },
  {
    path       : '/p/:fullName',
    extraPaths : ['/poslanci/pregled/:fullName/:date', '/p/id/:id', '/p/:fullName/pregled', '/p/id/:id/:date', '/p/:fullName/pregled/:date', '/poslanec/:fullName/pregled', '/poslanec/:fullName/pregled/:date'],
    viewPath   : 'poslanec/pregled',
    pageTitle  : 'Pregled - <%- name %>',
    cards      : [
      {
        name      : 'povprecnoSteviloGovorovNaSejo',
        sourceUrl : '/p/povprecno-stevilo-govorov-na-sejo/:id',
        resolve   : (req, res, route, card) => {

          return getMPIdByName(req.params.fullName, req)
            .then((mpData) => {

              let mpId   = mpData.mpId;
              let mpSlug = mpData.mpSlug;

              var pattern        = new UrlPattern(card.sourceUrl);
              const renderedPath = pattern.stringify({ id : mpId });
              let cardUrl        = `${config.CARD_RENDERER_API_ROOT}${renderedPath}`;

              if (req.query.forceRender) {
                cardUrl += '?forceRender=true';
              }

              return fetch(cardUrl)
                .then((res) => {

                  return Promise.resolve(res.text());

                })
                .then((body) => {

                  return Promise.resolve(body);

                });

            });

        }
      },
      {
        name      : 'zadnjeAktivnosti',
        sourceUrl : '/p/zadnje-aktivnosti/:id',
        resolve   : (req, res, route, card) => {

          return getMPIdByName(req.params.fullName, req)
            .then((mpData) => {

              let mpId   = mpData.mpId;
              let mpSlug = mpData.mpSlug;

              var pattern        = new UrlPattern(card.sourceUrl);
              const renderedPath = pattern.stringify({ id : mpId });
              let cardUrl        = `${config.CARD_RENDERER_API_ROOT}${renderedPath}`;

              if (req.query.forceRender) {
                cardUrl += '?forceRender=true';
              }

              return fetch(cardUrl)
                .then((res) => {

                  return Promise.resolve(res.text());

                })
                .then((body) => {

                  return Promise.resolve(body);

                });

            });

        }
      },
      {
        name      : 'prisotnostSkoziCas',
        sourceUrl : '/p/prisotnost-skozi-cas/:id',
        resolve   : (req, res, route, card) => {

          return getMPIdByName(req.params.fullName, req)
            .then((mpData) => {

              let mpId   = mpData.mpId;
              let mpSlug = mpData.mpSlug;

              var pattern        = new UrlPattern(card.sourceUrl);
              const renderedPath = pattern.stringify({ id : mpId });
              let cardUrl        = `${config.CARD_RENDERER_API_ROOT}${renderedPath}`;

              if (req.query.forceRender) {
                cardUrl += '?forceRender=true';
              }

              return fetch(cardUrl)
                .then((res) => {

                  return Promise.resolve(res.text());

                })
                .then((body) => {

                  return Promise.resolve(body);

                });

            });

        }
      },
      {
        name      : 'prisotnostSkoziCas',
        sourceUrl : '/p/prisotnost-skozi-cas/:id',
        resolve   : (req, res, route, card) => {

          return getMPIdByName(req.params.fullName, req)
            .then((mpData) => {

              let mpId   = mpData.mpId;
              let mpSlug = mpData.mpSlug;

              var pattern        = new UrlPattern(card.sourceUrl);
              const renderedPath = pattern.stringify({ id : mpId });
              let cardUrl        = `${config.CARD_RENDERER_API_ROOT}${renderedPath}`;

              if (req.query.forceRender) {
                cardUrl += '?forceRender=true';
              }

              return fetch(cardUrl)
                .then((res) => {

                  return Promise.resolve(res.text());

                })
                .then((body) => {

                  return Promise.resolve(body);

                });

            });

        }
      },
      {
        name      : 'osnovneInformacije',
        sourceUrl : '/p/osnovne-informacije/:id',
        resolve   : (req, res, route, card) => {

          return getMPIdByName(req.params.fullName, req)
            .then((mpData) => {

              let mpId   = mpData.mpId;
              let mpSlug = mpData.mpSlug;

              //console.log('osnovneInformacije: ',mpId);

              var pattern        = new UrlPattern(card.sourceUrl);
              const renderedPath = pattern.stringify({ id : mpId });
              let cardUrl        = `${config.CARD_RENDERER_API_ROOT}${renderedPath}`;

              if (req.query.forceRender) {
                cardUrl += '?forceRender=true';
              }

              return fetch(cardUrl)
                .then((res) => {

                  return Promise.resolve(res.text());

                })
                .then((body) => {

                  return Promise.resolve(body);

                });

            });

        }
      },
      {
        name      : 'stilneAnalize',
        sourceUrl : '/p/stilne-analize/:id',
        resolve   : (req, res, route, card) => {

          //console.log('stilneAnalize: ',req.params.fullName);

          return getMPIdByName(req.params.fullName, req)
            .then((mpData) => {

              let mpId   = mpData.mpId;
              let mpSlug = mpData.mpSlug;

              //console.log('stilneAnalize: ',mpId);

              var pattern        = new UrlPattern(card.sourceUrl);
              const renderedPath = pattern.stringify({ id : mpId });
              let cardUrl        = `${config.CARD_RENDERER_API_ROOT}${renderedPath}`;

              if (req.query.forceRender) {
                cardUrl += '?forceRender=true';
              }

              return fetch(cardUrl)
                .then((res) => {

                  return Promise.resolve(res.text());

                })
                .then((body) => {

                  return Promise.resolve(body);

                });

            });

        }
      },
      {
        name      : 'izracunanaPrisotnostGlasovanja',
        sourceUrl : '/p/prisotnost-na-glasovanjih-sej-dz/:id',
        resolve   : (req, res, route, card) => {

          return getMPIdByName(req.params.fullName, req)
            .then((mpData) => {

              let mpId   = mpData.mpId;
              let mpSlug = mpData.mpSlug;

              var pattern        = new UrlPattern(card.sourceUrl);
              const renderedPath = pattern.stringify({ id : mpId });
              let cardUrl        = `${config.CARD_RENDERER_API_ROOT}${renderedPath}`;

              if (req.query.forceRender) {
                cardUrl += '?forceRender=true';
              }

              return fetch(cardUrl)
                .then((res) => {

                  return Promise.resolve(res.text());

                })
                .then((body) => {

                  return Promise.resolve(body);

                });

            });

        }
      },
      {
        name      : 'izracunanaPrisotnostSeje',
        sourceUrl : '/p/prisotnost-na-sejah-dz/:id',
        resolve   : (req, res, route, card) => {

          return getMPIdByName(req.params.fullName, req)
            .then((mpData) => {

              let mpId   = mpData.mpId;
              let mpSlug = mpData.mpSlug;

              var pattern        = new UrlPattern(card.sourceUrl);
              const renderedPath = pattern.stringify({ id : mpId });
              let cardUrl        = `${config.CARD_RENDERER_API_ROOT}${renderedPath}`;

              if (req.query.forceRender) {
                cardUrl += '?forceRender=true';
              }

              return fetch(cardUrl)
                .then((res) => {

                  return Promise.resolve(res.text());

                })
                .then((body) => {

                  return Promise.resolve(body);

                });

            });

        }
      },
      {
        name      : 'clanstva',
        sourceUrl : '/p/clanstva/:id',
        resolve   : (req, res, route, card) => {

          return getMPIdByName(req.params.fullName, req)
            .then((mpData) => {

              let mpId   = mpData.mpId;
              let mpSlug = mpData.mpSlug;

              var pattern        = new UrlPattern(card.sourceUrl);
              const renderedPath = pattern.stringify({ id : mpId });
              let cardUrl        = `${config.CARD_RENDERER_API_ROOT}${renderedPath}`;

              if (req.query.forceRender) {
                cardUrl += '?forceRender=true';
              }

              return fetch(cardUrl)
                .then((res) => {

                  return Promise.resolve(res.text());

                })
                .then((body) => {

                  return Promise.resolve(body);

                });

            });

        }
      },
      {
        name      : 'stVprasanj',
        sourceUrl : '/p/st-poslanskih-vprasanj-in-pobud/:id',
        resolve   : (req, res, route, card) => {

          return getMPIdByName(req.params.fullName, req)
            .then((mpData) => {

              let mpId   = mpData.mpId;
              let mpSlug = mpData.mpSlug;

              var pattern        = new UrlPattern(card.sourceUrl);
              const renderedPath = pattern.stringify({ id : mpId });
              let cardUrl        = `${config.CARD_RENDERER_API_ROOT}${renderedPath}`;

              if (req.query.forceRender) {
                cardUrl += '?forceRender=true';
              }

              return fetch(cardUrl)
                .then((res) => {

                  return Promise.resolve(res.text());

                })
                .then((body) => {

                  return Promise.resolve(body);

                });

            });

        }
      },
      {
        name      : 'vprasanja',
        sourceUrl : '/p/poslanska-vprasanja-in-pobude/:id',
        resolve   : (req, res, route, card) => {

          return getMPIdByName(req.params.fullName, req)
            .then((mpData) => {

              let mpId   = mpData.mpId;
              let mpSlug = mpData.mpSlug;

              var pattern        = new UrlPattern(card.sourceUrl);
              const renderedPath = pattern.stringify({ id : mpId });
              let cardUrl        = `${config.CARD_RENDERER_API_ROOT}${renderedPath}`;

              if (req.query.forceRender) {
                cardUrl += '?forceRender=true';
              }

              return fetch(cardUrl)
                .then((res) => {

                  return Promise.resolve(res.text());

                })
                .then((body) => {

                  return Promise.resolve(body);

                });

            });

        }
      }
    ]
  },
  {
    path       : '/p/:fullName/glasovanja',
    extraPaths : ['/poslanci/glasovanja/:fullName/:date', '/p/:fullName/glasovanja/:date', '/poslanec/:fullName/glasovanja', '/poslanec/:fullName/glasovanja/:date'],
    viewPath   : 'poslanec/glasovanja',
    pageTitle  : 'Glasovanja - <%- name %>',
    cards      : [
      {
        name      : 'glasovanjaPoslanec',
        sourceUrl : '/p/glasovanja/:id',
        resolve   : (req, res, route, card) => {
          return getMPIdByName(req.params.fullName, req)
            .then((mpData) => {
              let mpId           = mpData.mpId;
              let mpSlug         = mpData.mpSlug;
              var pattern        = new UrlPattern(card.sourceUrl);
              const renderedPath = pattern.stringify({ id : mpId });
              let cardUrl        = `${config.CARD_RENDERER_API_ROOT}${renderedPath}`;

              if (req.query.forceRender) {
                cardUrl += '?forceRender=true';
              }

              return fetch(cardUrl)
                .then((res) => {
                  return res.text();
                })
                .then((body) => {
                  return body;
                });
            });
        }
      },
      {
        name      : 'najveckratEnako',
        sourceUrl : '/p/najveckrat-enako/:id',
        resolve   : (req, res, route, card) => {

          return getMPIdByName(req.params.fullName, req)
            .then((mpData) => {

              let mpId   = mpData.mpId;
              let mpSlug = mpData.mpSlug;

              var pattern        = new UrlPattern(card.sourceUrl);
              const renderedPath = pattern.stringify({ id : mpId });
              let cardUrl        = `${config.CARD_RENDERER_API_ROOT}${renderedPath}`;

              if (req.query.forceRender) {
                cardUrl += '?forceRender=true';
              }

              return fetch(cardUrl)
                .then((res) => {

                  return res.text();

                })
                .then((body) => {

                  return body;

                });

            });

        }
      },
      {
        name      : 'najmanjkratEnako',
        sourceUrl : '/p/najmanjkrat-enako/:id',
        resolve   : (req, res, route, card) => {

          return getMPIdByName(req.params.fullName, req)
            .then((mpData) => {

              let mpId   = mpData.mpId;
              let mpSlug = mpData.mpSlug;

              var pattern        = new UrlPattern(card.sourceUrl);
              const renderedPath = pattern.stringify({ id : mpId });
              let cardUrl        = `${config.CARD_RENDERER_API_ROOT}${renderedPath}`;

              if (req.query.forceRender) {
                cardUrl += '?forceRender=true';
              }

              return fetch(cardUrl)
                .then((res) => {

                  return res.text();

                })
                .then((body) => {

                  return body;

                });

            });

        }
      },
      {
        name      : 'neujemanjeSPs',
        sourceUrl : '/p/neujemanje-s-poslansko-skupino/:id',
        resolve   : (req, res, route, card) => {

          return getMPIdByName(req.params.fullName, req)
            .then((mpData) => {

              let mpId   = mpData.mpId;
              let mpSlug = mpData.mpSlug;

              var pattern        = new UrlPattern(card.sourceUrl);
              const renderedPath = pattern.stringify({ id : mpId });
              let cardUrl        = `${config.CARD_RENDERER_API_ROOT}${renderedPath}`;

              // console.log(cardUrl);

              if (req.query.forceRender) {
                cardUrl += '?forceRender=true';
              }

              return fetch(cardUrl)
                .then((res) => {

                  return res.text();

                })
                .then((body) => {

                  return body;

                });

            });

        }
      },
    ]
  },
  {
    path       : '/p/:fullName/govori',
    extraPaths : ['/poslanci/govori/:fullName/:date', '/p/:fullName/govori/:date', '/poslanec/:fullName/govori', '/poslanec/:fullName/govori/:date'],
    viewPath   : 'poslanec/govori',
    pageTitle  : 'Govori <%- name %>',
    cards      : [
      {
        name      : 'besedeKiDelajoPosebno',
        sourceUrl : '/p/tfidf/:id',
        resolve   : (req, res, route, card) => {
          // console.log(req.params.fullName);
          return getMPIdByName(req.params.fullName, req)
            .then((mpData) => {
              let mpId = mpData.mpId;

              var pattern        = new UrlPattern(card.sourceUrl);
              const renderedPath = pattern.stringify({ id : mpId });
              let cardUrl        = `${config.CARD_RENDERER_API_ROOT}${renderedPath}`;

              if (req.query.forceRender) {
                cardUrl += '?forceRender=true';
              }

              return fetch(cardUrl)
                .then((res) => {
                  return res.text();
                })
                .then((body) => {
                  return body;
                });
            });
        }

      },
      {
        name      : 'govori',
        sourceUrl : '/p/govori/:id',
        resolve   : (req, res, route, card) => {

          return getMPIdByName(req.params.fullName, req)
            .then((mpData) => {
              let mpId = mpData.mpId;

              var pattern        = new UrlPattern(card.sourceUrl);
              const renderedPath = pattern.stringify({ id : mpId });
              let cardUrl        = `${config.CARD_RENDERER_API_ROOT}${renderedPath}?customUrl=${encodeURIComponent('https://isci.parlameter.si/filter/*/0?people=' + mpId)}&state=${JSON.stringify({person: mpId})}`;

              if (req.query.forceRender) {
                cardUrl += '&forceRender=true';
              }

              return fetch(cardUrl)
                .then((res) => {
                  return res.text();
                })
                .then((body) => {
                  return body;
                });
            });
        }
      },
      {
        name      : 'steviloIzgovorjenihBesed',
        sourceUrl : '/p/stevilo-izgovorjenih-besed/:id',
        resolve   : (req, res, route, card) => {

          return getMPIdByName(req.params.fullName, req)
            .then((mpData) => {

              let mpId   = mpData.mpId;
              let mpSlug = mpData.mpSlug;

              var pattern        = new UrlPattern(card.sourceUrl);
              const renderedPath = pattern.stringify({ id : mpId });
              let cardUrl        = `${config.CARD_RENDERER_API_ROOT}${renderedPath}`;

              if (req.query.forceRender) {
                cardUrl += '?forceRender=true';
              }

              return fetch(cardUrl)
                .then((res) => {

                  return res.text();

                })
                .then((body) => {

                  return body;

                });

            });

        }
      },
      {
        name      : 'povprecnoSteviloGovorovNaSejo',
        sourceUrl : '/p/povprecno-stevilo-govorov-na-sejo/:id',
        resolve   : (req, res, route, card) => {

          return getMPIdByName(req.params.fullName, req)
            .then((mpData) => {

              let mpId   = mpData.mpId;
              let mpSlug = mpData.mpSlug;

              var pattern        = new UrlPattern(card.sourceUrl);
              const renderedPath = pattern.stringify({ id : mpId });
              let cardUrl        = `${config.CARD_RENDERER_API_ROOT}${renderedPath}`;

              if (req.query.forceRender) {
                cardUrl += '?forceRender=true';
              }

              return fetch(cardUrl)
                .then((res) => {

                  return res.text();

                })
                .then((body) => {

                  return body;

                });

            });

        }
      },
      {
        name      : 'besedniZaklad',
        sourceUrl : '/p/besedni-zaklad/:id',
        resolve   : (req, res, route, card) => {

          return getMPIdByName(req.params.fullName, req)
            .then((mpData) => {

              let mpId   = mpData.mpId;
              let mpSlug = mpData.mpSlug;

              var pattern        = new UrlPattern(card.sourceUrl);
              const renderedPath = pattern.stringify({ id : mpId });
              let cardUrl        = `${config.CARD_RENDERER_API_ROOT}${renderedPath}`;

              if (req.query.forceRender) {
                cardUrl += '?forceRender=true';
              }

              return fetch(cardUrl)
                .then((res) => {

                  return res.text();

                })
                .then((body) => {

                  return body;

                });

            });

        }
      },
      {
        name      : 'stilneAnalize',
        sourceUrl : '/p/stilne-analize/:id',
        resolve   : (req, res, route, card) => {

          return getMPIdByName(req.params.fullName, req)
            .then((mpData) => {

              let mpId   = mpData.mpId;
              let mpSlug = mpData.mpSlug;

              var pattern        = new UrlPattern(card.sourceUrl);
              const renderedPath = pattern.stringify({ id : mpId });
              let cardUrl        = `${config.CARD_RENDERER_API_ROOT}${renderedPath}`;

              if (req.query.forceRender) {
                cardUrl += '?forceRender=true';
              }

              return fetch(cardUrl)
                .then((res) => {

                  return res.text();

                })
                .then((body) => {

                  return body;

                });

            });

        }
      }
    ]
  },
  {
    path      : '/poslanske-skupine',
    viewPath  : 'poslanske-skupine',
    pageTitle : 'Seznam poslanskih skupin',
    cards     : [
      {
        name      : 'seznamPoslanskihSkupin',
        sourceUrl : '/ps/seznam-poslanskih-skupin/',
        resolve   : (req, res, route, card) => {

          //var pattern = new UrlPattern(card.sourceUrl);
          //const renderedPath = pattern.stringify({motionid: req.params.motionid});

          let cardUrl = `${config.CARD_RENDERER_API_ROOT}${card.sourceUrl}?state=%7B"generator"%3Atrue%7D`;
          // console.log(cardUrl);

          if (req.query.forceRender) {
            cardUrl += '&forceRender=true';
          }

          return fetch(cardUrl)
            .then((res) => {
              return res.text();
            })
            .then((body) => {
              return body;
            });
        }
      },
    ]
  },
  {
    path      : '/poslanske-skupine/:imeAnalize',
    viewPath  : 'poslanske-skupine/analiza',
    pageTitle : 'Poslanske skupine - <%- imeAnalize %>',
    cards     : {
      poslanec : {
        url : ''
      }
    }
  },
  {
    path       : '/poslanska-skupina/pregled/:fullName',
    extraPaths : ['/poslanska-skupina/pregled/:fullName/:date', '/poslanska-skupina/:fullName/pregled', '/ps/id/:id', '/ps/pregled/id/:id', '/ps/id/:id/:date', '/ps/pregled/id/:id/:date'],
    viewPath   : 'poslanska-skupina/pregled',
    pageTitle  : 'Pregled - <%- fullName %>',
    cards      : [
      {
        name      : 'prisotnostSkoziCas',
        sourceUrl : '/ps/prisotnost-skozi-cas/:id',
        resolve   : (req, res, route, card) => {

          return getPSIdByName(req.params.fullName, req)
            .then((psData) => {
              let psId           = psData.psId;
              let psSlug         = psData.psSlug;
              var pattern        = new UrlPattern(card.sourceUrl);
              const renderedPath = pattern.stringify({ id : psId });
              let cardUrl        = `${config.CARD_RENDERER_API_ROOT}${renderedPath}`;

              if (req.query.forceRender) {
                cardUrl += '?forceRender=true';
              }

              return fetch(cardUrl)
                .then((res) => {
                  return res.text();
                })
                .then((body) => {
                  return body;
                });
            });

        }
      },
      {
        name      : 'osnovneInformacije',
        sourceUrl : '/ps/osnovne-informacije/:id',
        resolve   : (req, res, route, card) => {

          return getPSIdByName(req.params.fullName, req)
            .then((psData) => {
              let psId           = psData.psId;
              let psSlug         = psData.psSlug;
              var pattern        = new UrlPattern(card.sourceUrl);
              const renderedPath = pattern.stringify({ id : psId });
              let cardUrl        = `${config.CARD_RENDERER_API_ROOT}${renderedPath}`;

              if (req.query.forceRender) {
                cardUrl += '?forceRender=true';
              }

              return fetch(cardUrl)
                .then((res) => {
                  return res.text();
                })
                .then((body) => {
                  return body;
                });
            });

        }
      },
      {
        name      : 'claniceInClani',
        sourceUrl : '/ps/clanice-in-clani/:id',
        resolve   : (req, res, route, card) => {

          return getPSIdByName(req.params.fullName, req)
            .then((psData) => {
              let psId           = psData.psId;
              let psSlug         = psData.psSlug;
              var pattern        = new UrlPattern(card.sourceUrl);
              const renderedPath = pattern.stringify({ id : psId });
              let cardUrl        = `${config.CARD_RENDERER_API_ROOT}${renderedPath}`;

              if (req.query.forceRender) {
                cardUrl += '?forceRender=true';
              }

              return fetch(cardUrl)
                .then((res) => {
                  return res.text();
                })
                .then((body) => {
                  return body;
                });
            });

        }
      },
      {
        name      : 'izracunanaPrisotnostGlasovanja',
        sourceUrl : '/ps/prisotnost-na-glasovanjih-sej-dz/:id',
        resolve   : (req, res, route, card) => {
          return getPSIdByName(req.params.fullName, req)
            .then((psData) => {
              let psId           = psData.psId;
              let psSlug         = psData.psSlug;
              var pattern        = new UrlPattern(card.sourceUrl);
              const renderedPath = pattern.stringify({ id : psId });
              let cardUrl        = `${config.CARD_RENDERER_API_ROOT}${renderedPath}`;

              if (req.query.forceRender) {
                cardUrl += '?forceRender=true';
              }

              return fetch(cardUrl)
                .then((res) => {
                  return res.text();
                })
                .then((body) => {
                  return body;
                });
            });
        }
      },
      {
        name      : 'izracunanaPrisotnostSeje',
        sourceUrl : '/ps/prisotnost-na-sejah-dz/:id',
        resolve   : (req, res, route, card) => {
          return getPSIdByName(req.params.fullName, req)
            .then((psData) => {
              let psId           = psData.psId;
              let psSlug         = psData.psSlug;
              var pattern        = new UrlPattern(card.sourceUrl);
              const renderedPath = pattern.stringify({ id : psId });
              let cardUrl        = `${config.CARD_RENDERER_API_ROOT}${renderedPath}`;

              if (req.query.forceRender) {
                cardUrl += '?forceRender=true';
              }

              return fetch(cardUrl)
                .then((res) => {
                  return res.text();
                })
                .then((body) => {
                  return body;
                });
            });
        }
      },
      {
        name      : 'stVprasanj',
        sourceUrl : '/ps/st-poslanskih-vprasanj-in-pobud/:id',
        resolve   : (req, res, route, card) => {
          return getPSIdByName(req.params.fullName, req)
            .then((psData) => {
              let psId           = psData.psId;
              let psSlug         = psData.psSlug;
              var pattern        = new UrlPattern(card.sourceUrl);
              const renderedPath = pattern.stringify({ id : psId });
              let cardUrl        = `${config.CARD_RENDERER_API_ROOT}${renderedPath}`;

              if (req.query.forceRender) {
                cardUrl += '?forceRender=true';
              }

              return fetch(cardUrl)
                .then((res) => {
                  return res.text();
                })
                .then((body) => {
                  return body;
                });
            });
        }
      },
      {
        name      : 'vprasanja',
        sourceUrl : '/ps/poslanska-vprasanja-in-pobude/:id',
        resolve   : (req, res, route, card) => {

          return getPSIdByName(req.params.fullName, req)
            .then((psData) => {
              let psId           = psData.psId;
              let psSlug         = psData.psSlug;
              var pattern        = new UrlPattern(card.sourceUrl);
              const renderedPath = pattern.stringify({ id : psId });
              let cardUrl        = `${config.CARD_RENDERER_API_ROOT}${renderedPath}`;

              if (req.query.forceRender) {
                cardUrl += '?forceRender=true';
              }

              return fetch(cardUrl)
                .then((res) => {
                  return res.text();
                })
                .then((body) => {
                  return body;
                });
            });

        }
      },
      {
        name      : 'steviloVlozenihAmandmajev',
        sourceUrl : '/ps/st-vlozenih-amandmajev/:id',
        resolve   : (req, res, route, card) => {

          return getPSIdByName(req.params.fullName, req)
            .then((psData) => {
              let psId           = psData.psId;
              let psSlug         = psData.psSlug;
              var pattern        = new UrlPattern(card.sourceUrl);
              const renderedPath = pattern.stringify({ id : psId });
              let cardUrl        = `${config.CARD_RENDERER_API_ROOT}${renderedPath}`;

              if (req.query.forceRender) {
                cardUrl += '?forceRender=true';
              }

              return fetch(cardUrl)
                .then((res) => {
                  return res.text();
                })
                .then((body) => {
                  return body;
                });
            });

        }
      },
    ]
  },
  {
    path       : '/poslanska-skupina/glasovanja/:fullName',
    extraPaths : ['/poslanska-skupina/glasovanja/:fullName/:date', '/poslanska-skupina/:fullName/glasovanja', '/ps/glasovanja/id/:id', '/ps/glasovanja/id/:id/:date'],
    viewPath   : 'poslanska-skupina/glasovanja',
    pageTitle  : 'Glasovanja - <%- fullName %>',
    cards      : [
      {
        name      : 'glasovanja',
        sourceUrl : '/ps/glasovanja/:id',
        resolve   : (req, res, route, card) => {

          return getPSIdByName(req.params.fullName, req)
            .then((psData) => {
              let psId           = psData.psId;
              let psSlug         = psData.psSlug;
              var pattern        = new UrlPattern(card.sourceUrl);
              const renderedPath = pattern.stringify({ id : psId });
              let cardUrl        = `${config.CARD_RENDERER_API_ROOT}${renderedPath}`;

              if (req.query.forceRender) {
                cardUrl += '?forceRender=true';
              }

              return fetch(cardUrl)
                .then((res) => {
                  return res.text();
                })
                .then((body) => {
                  return body;
                });
            });

        }
      },
      {
        name      : 'neenotnostGlasovanj',
        sourceUrl : '/ps/neenotnost-glasovanj/:id',
        resolve   : (req, res, route, card) => {

          // console.log('something else');

          return getPSIdByName(req.params.fullName, req)
            .then((psData) => {
              let psId           = psData.psId;
              let psSlug         = psData.psSlug;
              var pattern        = new UrlPattern(card.sourceUrl);
              const renderedPath = pattern.stringify({ id : psId });
              let cardUrl        = `${config.CARD_RENDERER_API_ROOT}${renderedPath}`;

              if (req.query.forceRender) {
                cardUrl += '?forceRender=true';
              }

              return fetch(cardUrl)
                .then((res) => {
                  return res.text();
                })
                .then((body) => {
                  return body;
                });
            });

        }
      },
      {
        name      : 'najtezjeBiSeJimPridruziji',
        sourceUrl : '/ps/najtezje-pridruzili/:id',
        resolve   : (req, res, route, card) => {

          return getPSIdByName(req.params.fullName, req)
            .then((psData) => {
              let psId           = psData.psId;
              let psSlug         = psData.psSlug;
              var pattern        = new UrlPattern(card.sourceUrl);
              const renderedPath = pattern.stringify({ id : psId });
              let cardUrl        = `${config.CARD_RENDERER_API_ROOT}${renderedPath}`;

              if (req.query.forceRender) {
                cardUrl += '?forceRender=true';
              }

              return fetch(cardUrl)
                .then((res) => {
                  return res.text();
                })
                .then((body) => {
                  return body;
                });
            });

        }
      },
      {
        name      : 'najlazjeBiSeJimPridruziji',
        sourceUrl : '/ps/najlazje-pridruzili/:id',
        resolve   : (req, res, route, card) => {

          return getPSIdByName(req.params.fullName, req)
            .then((psData) => {
              let psId           = psData.psId;
              let psSlug         = psData.psSlug;
              var pattern        = new UrlPattern(card.sourceUrl);
              const renderedPath = pattern.stringify({ id : psId });
              let cardUrl        = `${config.CARD_RENDERER_API_ROOT}${renderedPath}`;

              if (req.query.forceRender) {
                cardUrl += '?forceRender=true';
              }

              return fetch(cardUrl)
                .then((res) => {
                  return res.text();
                })
                .then((body) => {
                  return body;
                });
            });

        }
      },
      {
        name      : 'odstopanjaOdPoslanskeSkupine',
        sourceUrl : '/ps/neujemanje-s-poslansko-skupino/:id',
        resolve   : (req, res, route, card) => {

          return getPSIdByName(req.params.fullName, req)
            .then((psData) => {
              let psId           = psData.psId;
              let psSlug         = psData.psSlug;
              var pattern        = new UrlPattern(card.sourceUrl);
              const renderedPath = pattern.stringify({ id : psId });
              let cardUrl        = `${config.CARD_RENDERER_API_ROOT}${renderedPath}`;

              if (req.query.forceRender) {
                cardUrl += '?forceRender=true';
              }

              return fetch(cardUrl)
                .then((res) => {
                  return res.text();
                })
                .then((body) => {
                  return body;
                });
            });

        }
      }
    ]
  },
  {
    path       : '/poslanska-skupina/govori/:fullName',
    extraPaths : ['/poslanska-skupina/govori/:fullName/:date', '/poslanska-skupina/:fullName/govori', '/ps/govori/id/:id', '/ps/govori/id/:id/:date'],
    viewPath   : 'poslanska-skupina/govori',
    pageTitle  : 'Govori - <%- fullName %>',
    cards      : [
      {
        name      : 'besedeKiJihDelajoPosebne',
        sourceUrl : '/ps/tfidf/:id',
        resolve   : (req, res, route, card) => {

          return getPSIdByName(req.params.fullName, req)
            .then((psData) => {
              let psId           = psData.psId;
              let psSlug         = psData.psSlug;
              var pattern        = new UrlPattern(card.sourceUrl);
              const renderedPath = pattern.stringify({ id : psId });
              let cardUrl        = `${config.CARD_RENDERER_API_ROOT}${renderedPath}`;

              if (req.query.forceRender) {
                cardUrl += '?forceRender=true';
              }

              return fetch(cardUrl)
                .then((res) => {
                  return res.text();
                })
                .then((body) => {
                  return body;
                });
            });

        }
      },
      {
        name      : 'govori',
        sourceUrl : '/ps/govori/:id',
        resolve   : (req, res, route, card) => {

          return getPSIdByName(req.params.fullName, req)
            .then((psData) => {
              let psId           = psData.psId;
              let psSlug         = psData.psSlug;
              var pattern        = new UrlPattern(card.sourceUrl);
              const renderedPath = pattern.stringify({ id : psId });
              let cardUrl        = `${config.CARD_RENDERER_API_ROOT}${renderedPath}?customUrl=${encodeURIComponent('https://isci.parlameter.si/filter/*/0?parties=' + psId)}&state=${JSON.stringify({parties: psId})}`;

              if (req.query.forceRender) {
                cardUrl += '&forceRender=true';
              }

              return fetch(cardUrl)
                .then((res) => {
                  return res.text();
                })
                .then((body) => {
                  return body;
                });
            });
        }
      },
      {
        name      : 'besedniZaklad',
        sourceUrl : '/ps/besedni-zaklad/:id',
        resolve   : (req, res, route, card) => {

          return getPSIdByName(req.params.fullName, req)
            .then((psData) => {
              let psId           = psData.psId;
              let psSlug         = psData.psSlug;
              var pattern        = new UrlPattern(card.sourceUrl);
              const renderedPath = pattern.stringify({ id : psId });
              let cardUrl        = `${config.CARD_RENDERER_API_ROOT}${renderedPath}`;

              if (req.query.forceRender) {
                cardUrl += '?forceRender=true';
              }

              return fetch(cardUrl)
                .then((res) => {
                  return res.text();
                })
                .then((body) => {
                  return body;
                });
            });

        }
      },
      {
        name      : 'stilneAnalize',
        sourceUrl : '/ps/stilne-analize/:id',
        resolve   : (req, res, route, card) => {

          return getPSIdByName(req.params.fullName, req)
            .then((psData) => {
              let psId           = psData.psId;
              let psSlug         = psData.psSlug;
              var pattern        = new UrlPattern(card.sourceUrl);
              const renderedPath = pattern.stringify({ id : psId });
              let cardUrl        = `${config.CARD_RENDERER_API_ROOT}${renderedPath}`;

              if (req.query.forceRender) {
                cardUrl += '?forceRender=true';
              }

              return fetch(cardUrl)
                .then((res) => {
                  return res.text();
                })
                .then((body) => {
                  return body;
                });
            });

        }
      }
    ]
  },
  {
    path      : '/seje',
    viewPath  : 'seje',
    pageTitle : 'Seznam sej',
    cards     : [
      {
        name      : 'seznamSej',
        sourceUrl : '/s/seznam-sej/',
        resolve   : (req, res, route, card) => {

          //var pattern = new UrlPattern(card.sourceUrl);
          //const renderedPath = pattern.stringify({motionid: req.params.motionid});

          let cardUrl = `${config.CARD_RENDERER_API_ROOT}${card.sourceUrl}?state=%7B"generator"%3Atrue%7D`;

          if (req.query.forceRender) {
            cardUrl += '?forceRender=true';
          }

          return fetch(cardUrl)
            .then((res) => {
              return res.text();
            })
            .then((body) => {
              return body;
            });
        }
      },
    ]
  },
  {
    path       : '/seje/isci/',
    extraPaths : ['/search/', '/seje/search/', '/isci/'],
    viewPath   : 'seje/search',
    pageTitle  : 'Išči seje',
  },
  {
    path       : '/seje/isci/filter/',
    extraPaths : ['/search/filter/', '/seje/search/filter/', '/isci/filter/'],
    viewPath   : 'seje/search/filter',
    pageTitle  : 'Išči seje',
  },
  {
    path       : '/seje/tip/:fullName',
    extraPaths : ['/seje/tip/:fullName/:date'],
    viewPath   : 'seje/tip',
    pageTitle  : 'Seja <%- name %>',
    cards      : []
  },
  {
    path       : '/seja/glasovanje/:id/:motionid',
    extraPaths : ['/seja/glasovanje/:id/:motionid/:date', '/s/glasovanje/:id/:motionid', '/s/glasovanje/:id/:motionid/:date'],
    viewPath   : 'seja/glasovanje',
    pageTitle  : 'Seja - glasovanje',
    cards      : [
      {
        name      : 'glasovanjeSeja',
        sourceUrl : '/s/glasovanje/:motionid',
        resolve   : (req, res, route, card) => {

          var pattern        = new UrlPattern(card.sourceUrl);
          const renderedPath = pattern.stringify({ motionid : req.params.motionid });
          let cardUrl        = `${config.CARD_RENDERER_API_ROOT}${renderedPath}`;

          if (req.query.forceRender) {
            cardUrl += '?forceRender=true';
          }

          return fetch(cardUrl)
            .then((res) => {
              return res.text();
            })
            .then((body) => {
              return body;
            });
        }
      },
    ]
  },
  {
    path       : '/seja/druga-glasovanja/:id',
    extraPaths : ['/seja/druga-glasovanja/:id/:date', '/seja/druga-glasovanja/:id', '/s/druga-glasovanja/:id', '/s/druga-glasovanja/:id/:date'],
    viewPath   : 'seja/druga-glasovanja',
    pageTitle  : 'Seja - druga-glasovanja',
    cards      : [
      {
        name      : 'glasovanjaSeja',
        sourceUrl : '/s/seznam-glasovanj/:id',
        resolve   : (req, res, route, card) => {
          var pattern        = new UrlPattern(card.sourceUrl);
          const renderedPath = pattern.stringify({ id : req.params.id });
          let cardUrl        = `${config.CARD_RENDERER_API_ROOT}${renderedPath}?state=${JSON.stringify({ onlyOther: true })}`;

          if (req.query.forceRender) {
            cardUrl += '&forceRender=true';
          }

          return fetch(cardUrl)
            .then((res) => {
              return res.text();
            })
            .then((body) => {
              return body;
            });
        }
      },
    ]
  },
  {
    path       : '/seja/zakonodaja/:id',
    extraPaths : ['/seja/zakonodaja/:id/:date', '/seja/zakonodaja/:id', '/s/zakonodaja/:id', '/s/zakonodaja/:id/:date'],
    viewPath   : 'seja/zakonodaja',
    pageTitle  : 'Seja - zakonodaja',
    cards      : [
      {
        name      : 'zakonodajaSeja',
        sourceUrl : '/c/zakonodaja/:id',
        resolve: (req, res, route, card) => resolve_card_with_custom_url(`https://analize.parlameter.si/v1/s/getLegislationList/${req.params.id}`, req, card, {})
        // resolve   : (req, res, route, card) => {
        //   var pattern        = new UrlPattern(card.sourceUrl);
        //   const renderedPath = pattern.stringify({ id : req.params.id });
        //   let cardUrl        = `${config.CARD_RENDERER_API_ROOT}${renderedPath}`;

        //   if (req.query.forceRender) {
        //     cardUrl += '?forceRender=true';
        //   }

        //   return fetch(cardUrl)
        //     .then((res) => {
        //       return res.text();
        //     })
        //     .then((body) => {
        //       return body;
        //     });
        // }
      },
    ]
  },
  {
    path       : '/seja/prisotnost/:id',
    extraPaths : ['/seja/prisotnost/:id/:date', '/seja/prisotnost/:id', '/s/prisotnost/:id', '/s/prisotnost/:id/:date'],
    viewPath   : 'seja/prisotnost',
    pageTitle  : 'Seja - prisotnost',
    cards      : [
      {
        name      : 'prisotnostPoPoslanskihSkupinah',
        sourceUrl : '/s/prisotnost-po-poslanskih-skupinah/:id',
        resolve   : (req, res, route, card) => {
          var pattern        = new UrlPattern(card.sourceUrl);
          const renderedPath = pattern.stringify({ id : req.params.id });
          let cardUrl        = `${config.CARD_RENDERER_API_ROOT}${renderedPath}`;

          if (req.query.forceRender) {
            cardUrl += '?forceRender=true';
          }

          return fetch(cardUrl)
            .then((res) => {
              return res.text();
            })
            .then((body) => {
              return body;
            });
        }
      },
      {
        name      : 'seznamOdsotnihPoslancev',
        sourceUrl : '/s/seznam-odsotnih-poslancev/:id',
        resolve   : (req, res, route, card) => {
          var pattern        = new UrlPattern(card.sourceUrl);
          const renderedPath = pattern.stringify({ id : req.params.id });
          let cardUrl        = `${config.CARD_RENDERER_API_ROOT}${renderedPath}`;

          if (req.query.forceRender) {
            cardUrl += '?forceRender=true';
          }

          return fetch(cardUrl)
            .then((res) => {
              return res.text();
            })
            .then((body) => {
              return body;
            });
        }
      },
    ]
  },
  {
    path       : '/seja/transkript/:id',
    extraPaths : ['/seja/transkript/:id/:date', '/seja/transkript/:id', '/s/transkript/:id', '/s/transkript/:id/:date', '/seja/:dt/transkript/:id/:date'],
    viewPath   : 'seja/transkript',
    pageTitle  : 'Seja - transkript',
    cards      : [
      {
        name      : 'besedeKiSoZaznamovaleSejo',
        sourceUrl : '/s/tfidf/:id',
        resolve   : (req, res, route, card) => {

          //console.log(spsList);

          var pattern        = new UrlPattern(card.sourceUrl);
          const renderedPath = pattern.stringify({ id : req.params.id });
          let cardUrl        = `${config.CARD_RENDERER_API_ROOT}${renderedPath}`;

          if (req.query.forceRender) {
            cardUrl += '?forceRender=true';
          }

          return fetch(cardUrl)
            .then((res) => {
              return res.text();
            })
            .then((body) => {
              return body;
            });
        }
      },
      {
        name      : 'govori',
        sourceUrl : '/s/govori/:id',
        resolve   : (req, res, route, card) => {

          //console.log(spsList);

          var pattern        = new UrlPattern(card.sourceUrl);
          const renderedPath = pattern.stringify({ id : req.params.id });
          let cardUrl        = `${config.CARD_RENDERER_API_ROOT}${renderedPath}`;

          if (req.query.forceRender) {
            cardUrl += '?forceRender=true';
          }

          return fetch(cardUrl)
            .then((res) => {
              return res.text();
            })
            .then((body) => {
              return body;
            });
        }
      }
      // ,{
      //     name: 'transkript',
      //     sourceUrl: '/s/speeches/:id',
      //     resolve: (req, res, route, card)=> {
      //         var pattern = new UrlPattern(card.sourceUrl);
      //         const renderedPath = pattern.stringify({id: req.params.id});
      //         let cardUrl = `${config.CARD_RENDERER_API_ROOT}${renderedPath}`;
      //         return fetch(cardUrl)
      //             .then((res) => {
      //                 return res.text();
      //             })
      //             .then((body) => {
      //                 return body;
      //             });
      //     }
      // },
    ]
  },
  {
    path      : '/seje/:imeAnalize',
    viewPath  : 'seje/seja',
    pageTitle : 'Seja - <%- imeAnalize %>',
    cards     : {
      poslanec : {
        url : ''
      }
    }
  },
  {
    path      : '/pravno-obvestilo',
    viewPath  : 'about/pravno-obvestilo',
    pageTitle : 'Pravno obvestilo',
  },
  {
    path      : '/za-medije',
    viewPath  : 'about/za-medije',
    pageTitle : 'Za medije'
  },
  {
    path      : '/o-projektu',
    viewPath  : 'about/o-projektu',
    pageTitle : 'O projektu',
  },
  {
    path      : '/parlameter-obvestila',
    viewPath  : 'obvestila',
    pageTitle : 'Parlameter obvestila',
  },
  {
    path      : '/parlameter-obvestila/settings',
    viewPath  : 'obvestila/settings',
    pageTitle : 'Parlameter obvestila - nastavitve',
  }
];

module.exports = (app) => {
  _.each(routes, (route, i) => {
    createRoute(app, route);
    _.each(route.extraPaths, (path, i) => {
      route.path = path;
      createRoute(app, route);
    });
  });

  /**
   * Fetch and update sps data
   */
  app.get('/fetch/sps', (req, res) => {

    if (req.query.t !== 'vkSzv8Nu4eDkLBk7kUw4BBhyLjysJm') return res.status(400).send('Missing or wrong token');

    dataService.loadSPS(true)
      .then(spsData => res.send(spsData))
      .catch(err => res.status(400).send(err || err.stack));

  });

  // redirect from glasovanja to druga-glasovanja
  app.get('/seja/glasovanja/:sessionId', (req, res) => {
    res.redirect('/seja/druga-glasovanja/' + req.params.sessionId);
  });

  app.get('/*', function (req, res) {
    res.status(404).render('error/404', { pageTitle : "Sorry, page not found", activeMenu : "", ogImageUrl : "" });
  });
};


/**
 * Render og image
 * @param {String} ejsPath
 * @param {String} ogPath
 * @param {Object} data
 */
function renderOg(ejsPath, ogPath, data) {

  return new Promise((resolve, reject) => {

    try {

      const ogEjs  = fs.readFileSync(ejsPath, 'utf-8');
      const ogHtml = ejs.render(ogEjs, data);

      webshot(ogHtml, ogPath, {
        siteType        : 'html',
        captureSelector : '#og-container',
        quality         : 80
      }, (err) => {

        if (err) return reject(err);

        resolve();

      });

    }
    catch (err) {

      reject(err);

    }

  });

}

function createRoute(app, route) {
  app.get(route.path, (req, res) => {

    const forceRenderOg = req.query.forceRenderOg;

    const common = {
      query      : req.query,
      params     : req.params,
      ogImageUrl : config.OG_ROOT_URL
    };

    if (route.cards) {
      resolveCards(req, res, route)
        .then((views) => {

          if (route.viewPath.indexOf("poslanske-skupine") > -1) {
            getPSIdByName(req.params.fullName, req)
              .then((psData) => {

                const pageTitle = ejs.render(route.pageTitle);

                const dataExtend = {
                  ps         : psData.ps,
                  slug       : req.slug,
                  activeMenu : 'poslanske-skupine',
                  views,
                  pageTitle
                };

                const hashObject = {
                  ps : psData.ps
                };

                Object.assign(common, dataExtend);

                const hashString = hash(hashObject);
                const ogPath     = config.OG_CAPTURE_PATH + hashString + '.jpeg';

                // console.log('Poslanske skupine');

                common.ogImageUrl = config.OG_ROOT_URL + hashString + '.jpeg';

                if (forceRenderOg) {

                  renderOg('views/og/seznam_poslanskih_skupin.ejs', ogPath, common)
                    .then(() => {

                      res.render(route.viewPath, common);

                    });

                }
                else {

                  res.render(route.viewPath, common);

                }

              });

          }
          else if (route.viewPath.indexOf("poslanska-skupina") > -1) {
            getPSIdByName(req.params.fullName, req)
              .then((psData) => {

                const pageTitle = ejs.render(route.pageTitle, { fullName : psData.ps.name });

                const dataExtend = {
                  ps          : psData.ps,
                  slug        : req.slug,
                  activeMenu  : 'PS',
                  realAcronym : psData,
                  views,
                  pageTitle
                };

                Object.assign(common, dataExtend);

                const hashObject = {
                  activeMenu : 'PS',
                  psId       : psData.psId,
                  psSlug     : psData.psSlug
                };

                const hashString = hash(hashObject);
                const ogPath     = config.OG_CAPTURE_PATH + hashString + '.jpeg';

                // console.log('Poslanska skupina');

                common.ogImageUrl = config.OG_ROOT_URL + hashString + '.jpeg';
                ;

                if (forceRenderOg) {

                  renderOg('views/og/poslanska_skupina.ejs', ogPath, common)
                    .then(() => {

                      res.render(route.viewPath, common);

                    });

                }
                else {

                  res.render(route.viewPath, common);

                }

              });

          }
          else if (route.viewPath.indexOf("search") > -1) {

            const pageTitle = ejs.render(route.pageTitle);

            const dataExtend = {
              sesData    : sesData.s,
              slug       : req.slug,
              activeMenu : 'search',
              views,
              pageTitle
            };

            Object.assign(common, dataExtend);

            const hashString = hash(common);
            const ogPath     = config.OG_CAPTURE_PATH + hashString + '.jpeg';

            // console.log('Search');

            common.ogImageUrl = config.OG_ROOT_URL + hashString + '.jpeg';

            if (forceRenderOg) {

              renderOg('views/og/iskanje.ejs', ogPath, common)
                .then(() => {

                  res.render(route.viewPath, common);

                });

            }
            else {

              res.render(route.viewPath, common);

            }

          }
          else if (route.viewPath.indexOf("seje") > -1) {

            getSessionsByType(req.params, req)
              .then((sesData) => {

                // const pageTitle = ejs.render(route.pageTitle, {name: req.params.fullName.split('-').join(' ')});

                const dataExtend = {
                  sesData     : sesData,
                  slug        : req.slug,
                  activeMenu  : route.viewPath,
                  views,
                  'pageTitle' : 'Seznam sej'
                };

                Object.assign(common, dataExtend);

                const hashObject = {
                  sesData : sesData.s
                };

                // console.log(sesData);

                const hashString = hash(hashObject);
                const ogPath     = config.OG_CAPTURE_PATH + hashString + '.jpeg';

                // console.log('Seje');

                common.ogImageUrl = config.OG_ROOT_URL + hashString + '.jpeg';

                if (forceRenderOg) {

                  renderOg('views/og/seznam_sej.ejs', ogPath, common)
                    .then(() => {

                      res.render(route.viewPath, common);

                    });

                }
                else {

                  res.render(route.viewPath, common);

                }

              });

          }
          else if (route.viewPath.indexOf("seja") > -1) {
            var session_type = '';
            if (route.viewPath.indexOf("/transkript/dt/")) {
              session_type = 'dt';
            }
            getSessionIds(req.params, req, session_type)
              .then((sesData) => {

                const pageTitle = ejs.render(route.pageTitle);

                const dataExtend = {
                  sesData    : sesData.s,
                  slug       : req.slug,
                  activeMenu : route.viewPath,
                  views,
                  pageTitle
                };

                Object.assign(common, dataExtend);

                // console.log('Seja');

                const hashObject = {
                  spsId   : sesData.spsId,
                  spsSlug : sesData.spsSlug
                };

                const hashString = hash(hashObject);
                const ogPath     = config.OG_CAPTURE_PATH + hashString + '.jpeg';

                common.ogImageUrl = config.OG_ROOT_URL + hashString + '.jpeg';

                if (forceRenderOg) {

                  renderOg('views/og/seja.ejs', ogPath, common)
                    .then(() => {

                      res.render(route.viewPath, common);

                    });

                }
                else {

                  res.render(route.viewPath, common);

                }

              });

          } else if (route.viewPath.indexOf('zakonodaja') !== -1) {
            if (route.viewPath.indexOf('/zakon') !== -1) {

              getLawDataByEPA(req.params.epa).then((lawData) => {
                // console.log(lawData);

                const dataExtend = {
                  slug: req.slug,
                  activeMenu: route.viewPath,
                  pageTitle: lawData.text,
                  lawData,
                  views,
                };

                Object.assign(common, dataExtend);

                common.ogImageUrl = 'https://cdn.parlameter.si/v1/parlassets/og_cards/site/og-parlameter.png';

                res.render(route.viewPath, common);
              });
            } else {

              const dataExtend = {
                slug: req.slug,
                activeMenu: 'zakonodaja',
                pageTitle: 'Zakonodaja',
                views,
              };

              Object.assign(common, dataExtend);

              common.ogImageUrl = 'https://cdn.parlameter.si/v1/parlassets/og_cards/site/og-parlameter.png';

              res.render(route.viewPath, common);
            }

          } else if (route.viewPath.indexOf('orodja') > -1) {
            // console.log('orodja');
            const pageTitle = route.pageTitle;

            let dataExtend;
            if (route.viewPath.indexOf('orodja/') > -1) {
              dataExtend = {
                slug: req.slug,
                activeMenu: '',
                pageTitle: route.pageTitle,
                views: views,
              };
            } else {
              dataExtend = {
                slug: req.slug,
                activeMenu: 'orodja',
                pageTitle: route.pageTitle,
                views: views,
              };
            }

            Object.assign(common, dataExtend);

            // OG IMAGE STUFF
            //
            const hashObj = {
              nameSlug : route.pageTitle
            };

            const hashString = hash(hashObj);
            const ogPath     = config.OG_CAPTURE_PATH + hashString + '.jpeg';

            common.ogImageUrl = config.OG_ROOT_URL + hashString + '.jpeg';

            // if (forceRenderOg) {
            //   renderOg('views/og/poslanec.ejs', ogPath, common)
            //     .then(() => {
            //       res.render(route.viewPath, common);
            //     });
            // }
            // else {
              res.render(route.viewPath, common);
            // }
          } else {

            var activeMenu = (route.viewPath == 'landing') ? route.viewPath : 'P';
            getMPIdByName(req.params.fullName, req)
              .then((mpData) => {

                // POSLANEC

                let pageTitle = 'Parlameter';

                // console.log('Landing');

                if (mpData.mp) {
                  pageTitle = ejs.render(route.pageTitle, { name : mpData.mp.name });

                  const dataExtend = {
                    mp         : mpData.mp,
                    slug       : req.slug,
                    activeMenu : route.viewPath,
                    pageTitle  : pageTitle,
                    views
                  };

                  Object.assign(common, dataExtend);

                  const hashObj = {
                    mpId     : mpData.mpId,
                    nameSlug : mpData.mp.nameSlug
                  };

                  const hashString = hash(hashObj);
                  const ogPath     = config.OG_CAPTURE_PATH + hashString + '.jpeg';

                  common.ogImageUrl = config.OG_ROOT_URL + hashString + '.jpeg';

                  if (forceRenderOg) {

                    renderOg('views/og/poslanec.ejs', ogPath, common)
                      .then(() => {

                        res.render(route.viewPath, common);

                      });

                  }
                  else {

                    res.render(route.viewPath, common);

                  }

                }
                else {

                  const dataExtend = {
                    mp         : mpData.mp,
                    slug       : req.slug,
                    activeMenu : route.viewPath,
                    pageTitle  : pageTitle,
                    views
                  };

                  Object.assign(common, dataExtend);

                  common.ogImageUrl = 'https://cdn.parlameter.si/v1/parlassets/og_cards/site/og-parlameter.png';

                  res.render(route.viewPath, common);

                }

              });
          }

        });
    }
    else {

      if (route.viewPath.indexOf("seje") > -1) {
        getSessionsByType(req.params, req)
          .then((sesData) => {

            if (route.viewPath.indexOf("search") > -1) {

              const pageTitle = ejs.render(route.pageTitle);

              const dataExtend = {
                slug       : req.slug,
                activeMenu : 'search',
                pageTitle,
                q          : req.query.q
              };

              Object.assign(common, dataExtend);

              const hashString = hash({
                slug       : req.slug,
                activeMenu : 'search',
                pageTitle
              });
              const ogPath     = config.OG_CAPTURE_PATH + hashString + '.jpeg';

              common.ogImageUrl = 'https://cdn.parlameter.si/v1/parlassets/og_cards/site/iskanje-og.jpg';

              if (forceRenderOg) {

                renderOg('views/og/iskanje.ejs', ogPath, common)
                  .then(() => {

                    res.render(route.viewPath, common);

                  });

              }
              else {

                res.render(route.viewPath, common);

              }

            }
            else {

              const pageTitle = ejs.render(route.pageTitle);

              const dataExtend = {
                sesData    : sesData,
                slug       : req.slug,
                activeMenu : route.viewPath,
                pageTitle
              };

              Object.assign(common, dataExtend);

              const hashObject = {
                viewPath : route.viewPath
              };

              const hashString = hash(hashObject);
              const ogPath     = config.OG_CAPTURE_PATH + hashString + '.jpeg';

              common.ogImageUrl = config.OG_ROOT_URL + hashString + '.jpeg';

              // console.log('Default 1 session');

              if (forceRenderOg) {

                renderOg('views/og/seznam_sej.ejs', ogPath, common)
                  .then(() => {

                    res.render(route.viewPath, common);

                  });

              }
              else {

                res.render(route.viewPath, common);

              }

            }

          });

      }
      else {

        if (route.viewPath.indexOf("poslanci") > -1) {

          const pageTitle = ejs.render(route.pageTitle);
          // console.log(route.viewPath);

          const dataExtend = {
            slug       : req.slug,
            activeMenu : route.viewPath,
            pageTitle
          };

          // console.log('Poslanci');

          Object.assign(common, dataExtend);

          const hashString = hash({
            viewPath : route.viewPath
          });

          const ogPath = config.OG_CAPTURE_PATH + hashString + '.jpeg';

          common.ogImageUrl = config.OG_ROOT_URL + hashString + '.jpeg';

          if (forceRenderOg) {

            renderOg('views/og/seznam_poslancev.ejs', ogPath, common)
              .then(() => {

                res.render(route.viewPath, common);

              });

          }
          else {

            res.render(route.viewPath, common);

          }

        }
        else {

          const pageTitle = ejs.render(route.pageTitle);

          const dataExtend = {
            slug       : req.slug,
            activeMenu : route.viewPath,
            pageTitle
          };

          // console.log('Default');

          Object.assign(common, dataExtend);

          common.ogImageUrl = 'https://cdn.parlameter.si/v1/parlassets/og_cards/site/parlameter_og.jpg';

          res.render(route.viewPath, common);

        }

      }
    }
  });

}

function resolveCards(req, res, route) {
  if (!route.cards) {
    return Promise.resolve({});
  }
  return Promise.reduce(route.cards, (aggregator, card) => {
      return card.resolve(req, res, route, card)
        .then((body) => {

          if (aggregator[card.name]) {
            console.error(`Duplicate card definition (${card.name}) in route (${route.path})`);
          }

          aggregator[card.name] = body;
          return aggregator;

        });
    }, {})
    .then((aggregator) => {

      return Promise.resolve(aggregator);

    });
}

function getMPIdByName(name, req) {
  let mpId;
  let mpSlug;
  let selectedMp;

  //works ok
  // return fetch('https://data.parlameter.si/v1/getMPs')
  //     .then((res)=> res.json())
  //     .then((jsonBody) => {
  //            var mpsList = jsonBody;

  _.each(mpsList, (mp, i) => {
    mp.nameSlug = slug(mp.name).toLowerCase();

    if ((name === mp.nameSlug) | (req.params.id == mp.id)) {
      mpId   = mp.id;
      mpSlug = mp.nameSlug;

      req.slug = mpSlug;
      req.mpId = mpId;
      req.mp   = mp;


      _.each(mpsopsList, (mpps, i) => {

        if (mpId == mpps.id) {
          mp.party = mpps.party;
        }

      });
      selectedMp = mp;


    }
  });
  return Promise.resolve({ mpId, mpSlug, mp : selectedMp });
  // });
}

function getLawDataByEPA(epa, req) {
  return fetch(`https://analize.parlameter.si/v1/s/getLegislation/${epa}`)
    .then((res) => res.json());
}


function getPSIdByName(name, req) {
  let psId;
  let psSlug;
  let selectedPs;
  let realAcronym;

  // console.log(name);

  Object.keys(opsList).forEach(function (key, index) {
    if (parseInt(key, 10)) {
      // console.log(key);
      const ps = opsList[key];
      var realAcronym2 = ps.acronym;
      ps.nameSlug      = slug(ps.name).toLowerCase();
      ps.acronym_slug  = slug(ps.acronym).toLowerCase();

      if ((name === ps.nameSlug) | (name === ps.acronym_slug) | (req.params.id == ps.id)) {
        //if(id == ps.id){
        psId        = ps.id;
        psSlug      = ps.acronym_slug;
        req.slug    = psSlug;
        req.psId    = psId;
        req.ps      = ps;
        selectedPs  = ps;
        realAcronym = realAcronym2;
      }
    }
  });

  return Promise.resolve({ psId, psSlug, ps : selectedPs, realAcronym });
}

function getSessionIds(params, req, session_type) {
  let spsId;
  let spsSlug;
  let selectedSps;
  let type;

  //works ok
  // return fetch('https://analize.parlameter.si/v1/s/getSessionsByClassification')
  //     .then((res)=> res.json())
  //     .then((jsonBody) => {
  //          //var spsList = jsonBody;

  // console.log(JSON.stringify(spsList[0]));


  //session_type

  var tmp = spsList[0];
  for (var key in tmp) {
    var sejetip = tmp[key];
    type        = key;
    for (var seja in sejetip) {

      var s = sejetip[seja];

      s.nameSlug = slug(s.name).toLowerCase();

      if ((params.id == s.id) | (params.name == s.nameSlug)) {

        spsId       = s.id;
        spsSlug     = s.nameSlug;
        req.slug    = spsSlug;
        req.spsId   = spsId;
        req.s       = s;
        s.type      = type;
        selectedSps = s;

        break;
      }

    }
    if (typeof selectedSps !== 'undefined') {
      break;
    }

  }

  if (typeof selectedSps === 'undefined') {
    var dt = tmp["dt"];
    type   = 'dt';
    for (var dtseja in dt) {
      for (var seja in dt[dtseja].sessions) {
        var sdt = dt[dtseja].sessions[seja];

        sdt.nameSlug = slug(sdt.name).toLowerCase();

        if ((params.id == sdt.id) | (params.name == sdt.nameSlug)) {
          spsId       = sdt.id;
          spsSlug     = sdt.nameSlug;
          req.slug    = spsSlug;
          req.spsId   = spsId;
          req.s       = sdt;
          sdt.type    = type;
          selectedSps = sdt;
          break;
        }
      }
      if (typeof selectedSps !== 'undefined') {
        break;
      }
    }
  }


  return Promise.resolve({ spsId, spsSlug, s : selectedSps });
  // });
}

function getSessionsByType(params, req) {

  let psId;
  let psSlug;
  let selectedPs;
  let returnData;
  let type;

  //works ok
  // return fetch('https://analize.parlameter.si/v1/s/getSessionsByClassification')
  //     .then((res)=> res.json())
  //     .then((jsonBody) => {
  //         //var spsList = jsonBody;

  _.each(spsList, (spsSingle, iii) => {
    switch (params.fullName) {
      case 'seje-delovnih-teles':
        returnData = spsSingle.dt;
        type       = 1;
        break;
      case 'seje-kolegija-predsednika-dz':
        returnData = spsSingle.kolegij;
        type       = 2;
        break;
      case 'seje-dz':
        returnData = spsSingle.dz;
        type       = 3;
        break;
      default:
        returnData = spsSingle.dz;
        type       = 3;
        break;
    }
  });

  return Promise.resolve({ psId, psSlug, sesData : returnData, type : type });
  // });

}


//https://analize.parlameter.si/v1/p/getSlugs/
function getAllLinks() {

}
