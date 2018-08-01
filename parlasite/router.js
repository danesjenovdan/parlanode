const _ = require('lodash');
const fetch = require('node-fetch');
const UrlPattern = require('url-pattern');
const slug = require('slug');
const ejs = require('ejs');
const config = require('./config');

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

const routes = [
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
              let cardUrl        = `${config.CARD_RENDERER_API_ROOT}${renderedPath}?customUrl=${encodeURIComponent('http://isci.hr.parlameter.si/filter/*/0?parties=' + psId)}&state=${JSON.stringify({parties: psId})}`;

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
        resolve   : (req, res, route, card) => {
          var pattern        = new UrlPattern(card.sourceUrl);
          const renderedPath = pattern.stringify({ id : req.params.id });
          let cardUrl        = `${config.CARD_RENDERER_API_ROOT}${renderedPath}?customUrl=${encodeURIComponent(`http://analize.hr.parlameter.si/v1/s/getLegislationList/${req.params.id}`)}`;

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
];

module.exports = (app) => {
  _.each(routes, (route, i) => {
    createRoute(app, route);
    _.each(route.extraPaths, (path, i) => {
      route.path = path;
      createRoute(app, route);
    });
  });
};

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
  // return fetch('http://data.hr.parlameter.si/v1/getMPs')
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
  // return fetch('http://analize.hr.parlameter.si/v1/s/getSessionsByClassification')
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
  // return fetch('http://analize.hr.parlameter.si/v1/s/getSessionsByClassification')
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
