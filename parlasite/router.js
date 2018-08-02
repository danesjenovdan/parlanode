const _ = require('lodash');
const fetch = require('node-fetch');
const UrlPattern = require('url-pattern');
const slug = require('slug');
const ejs = require('ejs');
const config = require('./config');

const routes = [
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
          if (route.viewPath.indexOf("seja") > -1) {
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
