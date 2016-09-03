const _           = require('lodash');
const fetch       = require('node-fetch');
const UrlPattern  = require('url-pattern');
const Promise     = require('bluebird');
const config      = require('./config');
const slug        = require('slug');
const mpsList     = require('./static/data/mps');

const routes = [

  {
    path:'/',
    viewPath:'landing',
    cards:[
      {
        name:'kompas',
        sourceUrl:'/c/kompas/',
        resolve: (req, res, route, card)=>{

          return getMPIdByName(req.params.fullName, 0)
            .then((mpId)=>{

              const cardUrl = `${config.CARD_RENDERER_API_ROOT}${card.sourceUrl}`;

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
        name:'zadnjaSeja',
        sourceUrl:'/c/zadnja-seja/',
        resolve: (req, res, route, card)=>{

          return getMPIdByName(req.params.fullName, 0)
            .then((mpId)=>{

              const cardUrl = `${config.CARD_RENDERER_API_ROOT}${card.sourceUrl}`;

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
    path:'/poslanci',
    viewPath:'poslanci'
  },
  {
    path :'/poslanci/:fullName',
    extraPaths :['/poslanci/:fullName/:date'],
    viewPath :'poslanec',
    cards :[
      {
        name:'povprecnoSteviloGovorovNaSejo',
        sourceUrl:'/p/povprecno-stevilo-govorov-na-sejo/:id/:date',
        resolve: (req, res, route, card)=>{

          return getMPIdByName(req.params.fullName, 0)
            .then((mpId)=>{

              var pattern = new UrlPattern(card.sourceUrl);
              const renderedPath = pattern.stringify({id:mpId, date:'23.12.2014'});
              const cardUrl = `${config.CARD_RENDERER_API_ROOT}${renderedPath}`;

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
        name:'zadnjeAktivnosti',
        sourceUrl:'/p/zadnje-aktivnosti/:id/:date',
        resolve: (req, res, route, card)=>{

          return getMPIdByName(req.params.fullName, 0)
            .then((mpId)=>{

              var pattern = new UrlPattern(card.sourceUrl);
              const renderedPath = pattern.stringify({id:mpId, date:'23.12.2014'});
              const cardUrl = `${config.CARD_RENDERER_API_ROOT}${renderedPath}`;

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
        name:'osnovneInformacije',
        sourceUrl:'/p/osnovne-informacije/:id/:date',
        resolve: (req, res, route, card)=>{

          return getMPIdByName(req.params.fullName, req)
            .then((mpId)=>{

              var pattern = new UrlPattern(card.sourceUrl);
              const renderedPath = pattern.stringify({id:mpId, date:'23.12.2014'});
              const cardUrl = `${config.CARD_RENDERER_API_ROOT}${renderedPath}`;

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
        name:'razrezGlasovanj',
        sourceUrl:'/p/razrez-glasovanj/:id/:date',
        resolve: (req, res, route, card)=>{

          return getMPIdByName(req.params.fullName, req)
            .then((mpId)=>{

              var pattern = new UrlPattern(card.sourceUrl);
              const renderedPath = pattern.stringify({id:mpId, date:'23.12.2014'});
              const cardUrl = `${config.CARD_RENDERER_API_ROOT}${renderedPath}`;

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
        name:'stilneAnalize',
        sourceUrl:'/p/stilne-analize/:id/:date',
        resolve: (req, res, route, card)=>{

          return getMPIdByName(req.params.fullName, req)
            .then((mpId)=>{

              var pattern = new UrlPattern(card.sourceUrl);
              const renderedPath = pattern.stringify({id:mpId, date:'23.12.2014'});
              const cardUrl = `${config.CARD_RENDERER_API_ROOT}${renderedPath}`;

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
    path:'/poslanske-skupine',
    viewPath:'poslanske-skupine'
  },
  {
    path:'/poslanske-skupine/:imeAnalize',
    viewPath:'poslanske-skupine/analiza',
    cards:{
      poslanec:{
        url:''
      }
    }
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

};

function createRoute(app, route){

  app.get(route.path, (req, res)=>{

    if(route.cards) {

      resolveCards(req, res, route)
        .then((views)=> {
          res.render(route.viewPath, {query: req.query, params: req.params, views});
        });

    }else{

        res.render(route.viewPath, { query:req.query, params:req.params });

    }



  });

}

function resolveCards(req, res, route){

  console.log(route.cards);

  if(!route.cards){
    return Promise.resolve({});
  }

  return Promise.reduce(route.cards, (aggregator, card) => {

    return card.resolve(req, res, route, card)
      .then((body)=>{

        aggregator[card.name] = body;
        return aggregator;

      });

  },{});

}

function getMPIdByName(name, req){

  if(req.mpId) {
    return Promise.resolve(req.mpId);
  }

  console.log(name, req.mpId);
  let mpId;

  /*return fetch('https://data.parlameter.si/v1/getMPs')
    .then((res)=> res.json())
    .then((jsonBody) => {

      let mpId;*/

      _.each(mpsList, (mp, i)=>{
        mp.nameSlug = slug(mp.name).toLowerCase();

        if(name === mp.nameSlug){
          mpId = mp.id;
          req.mpId = mpId;
        }
      });

      return Promise.resolve(mpId);

//    });

}