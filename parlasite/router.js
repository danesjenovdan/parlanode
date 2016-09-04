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

          return getMPIdByName(req.params.fullName, req)
            .then((mpData)=>{

              let mpId = mpData.mpId;
              let mpSlug = mpData.mpSlug;

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

          return getMPIdByName(req.params.fullName, req)
            .then((mpData)=>{

              let mpId = mpData.mpId;
              let mpSlug = mpData.mpSlug;

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
    path :'/p/:fullName/pregled',
    extraPaths :['/poslanci/pregled/:fullName/:date'],
    viewPath :'poslanec/pregled',
    cards :[
      {
        name:'kompas',
        sourceUrl:'/c/kompas/',
        resolve: (req, res, route, card)=>{

          return getMPIdByName(req.params.fullName, req)
            .then((mpData)=>{

              let mpId = mpData.mpId;
              let mpSlug = mpData.mpSlug;

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
        name:'povprecnoSteviloGovorovNaSejo',
        sourceUrl:'/p/povprecno-stevilo-govorov-na-sejo/:id/:date',
        resolve: (req, res, route, card)=>{

          return getMPIdByName(req.params.fullName, req)
            .then((mpData)=>{

              let mpId = mpData.mpId;
              let mpSlug = mpData.mpSlug;

              console.log('povprecnoSteviloGovorovNaSejo: ',mpId);

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

          return getMPIdByName(req.params.fullName, req)
            .then((mpData)=>{

              let mpId = mpData.mpId;
              let mpSlug = mpData.mpSlug;

              console.log('Zadnje aktivnosti: ',mpId);

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
            .then((mpData)=>{

              let mpId = mpData.mpId;
              let mpSlug = mpData.mpSlug;

              console.log('osnovneInformacije: ',mpId);

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
            .then((mpData)=>{

              let mpId = mpData.mpId;
              let mpSlug = mpData.mpSlug;

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

          console.log('razrezGlasovanj: ',req.params.fullName);

          return getMPIdByName(req.params.fullName, req)
            .then((mpData)=>{


              let mpId = mpData.mpId;
              let mpSlug = mpData.mpSlug;

              console.log('Mpdata: ',mpData);

              console.log('razrezGlasovanj: ',mpId);

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

          console.log('stilneAnalize: ',req.params.fullName);

          return getMPIdByName(req.params.fullName, req)
            .then((mpData)=>{

              let mpId = mpData.mpId;
              let mpSlug = mpData.mpSlug;

              console.log('stilneAnalize: ',mpId);

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
        name:'izracunanaPrisotnost',
        sourceUrl:'/p/izracunana-prisotnost/:id',
        resolve: (req, res, route, card)=>{

          return getMPIdByName(req.params.fullName, req)
            .then((mpData)=>{

              let mpId = mpData.mpId;
              let mpSlug = mpData.mpSlug;

              var pattern = new UrlPattern(card.sourceUrl);
              const renderedPath = pattern.stringify({id:mpId});
              const cardUrl = `${config.CARD_RENDERER_API_ROOT}${renderedPath}`;

              console.log(cardUrl);

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
        name:'clanstva',
        sourceUrl:'/p/clanstva/:id',
        resolve: (req, res, route, card)=>{

          return getMPIdByName(req.params.fullName, req)
            .then((mpData)=>{

              let mpId = mpData.mpId;
              let mpSlug = mpData.mpSlug;

              var pattern = new UrlPattern(card.sourceUrl);
              const renderedPath = pattern.stringify({id:mpId});
              const cardUrl = `${config.CARD_RENDERER_API_ROOT}${renderedPath}`;

              console.log(cardUrl);

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
    path :'/p/:fullName/glasovanja',
    extraPaths :['/poslanci/glasovanja/:fullName/:date'],
    viewPath :'poslanec/glasovanja',
    cards :[

      {
        name:'glasovanja',
        sourceUrl:'/p/glasovanja/:id/:date',
        resolve: (req, res, route, card)=>{

          return getMPIdByName(req.params.fullName, 0)
            .then((mpData)=>{

              let mpId = mpData.mpId;
              let mpSlug = mpData.mpSlug;

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
        sourceUrl:'/p/razrez-glasovanj/:id',
        resolve: (req, res, route, card)=>{

          return getMPIdByName(req.params.fullName, req)
            .then((mpData)=>{

              let mpId = mpData.mpId;
              let mpSlug = mpData.mpSlug;

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
        name:'najveckratEnako',
        sourceUrl:'/p/najveckrat-enako/:id',
        resolve: (req, res, route, card)=>{

          return getMPIdByName(req.params.fullName, req)
            .then((mpData)=>{

              let mpId = mpData.mpId;
              let mpSlug = mpData.mpSlug;

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
        name:'najmanjkratEnako',
        sourceUrl:'/p/najmanjkrat-enako/:id',
        resolve: (req, res, route, card)=>{

          return getMPIdByName(req.params.fullName, req)
            .then((mpData)=>{

              let mpId = mpData.mpId;
              let mpSlug = mpData.mpSlug;

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
    path :'/p/:fullName/govori',
    extraPaths :['/poslanci/govori/:fullName/:date'],
    viewPath :'poslanec/govori',
    cards :[
      {
        name:'povezaveDoGovorov',
        sourceUrl:'/p/povezave-do-govorov/:id',
        resolve: (req, res, route, card)=>{

          return getMPIdByName(req.params.fullName, 0)
            .then((mpData)=>{

              let mpId = mpData.mpId;
              let mpSlug = mpData.mpSlug;

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
        name:'steviloIzgovorjenihBesed',
        sourceUrl:'/p/stevilo-izgovorjenih-besed/:id',
        resolve: (req, res, route, card)=>{

          return getMPIdByName(req.params.fullName, req)
            .then((mpData)=>{

              let mpId = mpData.mpId;
              let mpSlug = mpData.mpSlug;

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
        name:'povprecnoSteviloGovorovNaSejo',
        sourceUrl:'/p/povprecno-stevilo-govorov-na-sejo/:id',
        resolve: (req, res, route, card)=>{

          return getMPIdByName(req.params.fullName, req)
            .then((mpData)=>{

              let mpId = mpData.mpId;
              let mpSlug = mpData.mpSlug;

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
        name:'besedniZaklad',
        sourceUrl:'/p/besedni-zaklad/:id',
        resolve: (req, res, route, card)=>{

          return getMPIdByName(req.params.fullName, req)
            .then((mpData)=>{

              let mpId = mpData.mpId;
              let mpSlug = mpData.mpSlug;

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
        sourceUrl:'/p/stilne-analize/:id',
        resolve: (req, res, route, card)=>{

          return getMPIdByName(req.params.fullName, req)
            .then((mpData)=>{

              let mpId = mpData.mpId;
              let mpSlug = mpData.mpSlug;

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
          getMPIdByName(req.params.fullName, req)
            .then((mpData)=>{
              res.render(route.viewPath, {query: req.query, params: req.params, mp:mpData.mp, slug:req.slug, views});
            });

        });

    }else{

        res.render(route.viewPath, { query:req.query, params:req.params, slug:req.slug });

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

  let mpId;
  let mpSlug;
  let selectedMp;

  /*return fetch('https://data.parlameter.si/v1/getMPs')
    .then((res)=> res.json())
    .then((jsonBody) => {

      let mpId;*/

      _.each(mpsList, (mp, i)=>{
        mp.nameSlug = slug(mp.name).toLowerCase();

        if(name === mp.nameSlug){
          mpId = mp.id;
          mpSlug = mp.nameSlug;
          req.slug = mpSlug;
          req.mpId = mpId;
          req.mp = mp;
          selectedMp = mp;
        }
      });



      return Promise.resolve({mpId,mpSlug, mp:selectedMp});

//    });

}