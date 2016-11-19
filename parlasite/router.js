"use strict";
const _ = require('lodash');
const fetch = require('node-fetch');
const UrlPattern = require('url-pattern');
const Promise = require('bluebird');
const config = require('./config');
const slug = require('slug');
const mpsList = require('./static/data/mps');
const opsList = require('./static/data/ops');
const spsList = require('./static/data/sps');

const routes = [
    {
        path: '/',
        viewPath: 'landing',
        cards: [
            {
                name: 'kompas',
                sourceUrl: '/c/kompas/',
                resolve: (req, res, route, card)=> {

                    return getMPIdByName(req.params.fullName, req)
                        .then((mpData)=> {

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
                name: 'zadnjaSeja',
                sourceUrl: '/c/zadnja-seja/',
                resolve: (req, res, route, card)=> {

                    return getMPIdByName(req.params.fullName, req)
                        .then((mpData)=> {

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
                name: 'besedniZaklad',
                sourceUrl: '/c/besedni-zaklad-vsi/',
                resolve: (req, res, route, card)=> {
                    return getMPIdByName(req.params.fullName, req)
                        .then((mpData)=> {
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
    }, {
        path: '/poslanci',
        viewPath: 'poslanci'
    }, {
        path: '/p/:fullName',
        extraPaths: ['/poslanci/pregled/:fullName/:date', '/p/id/:id', '/p/:fullName/pregled', '/p/id/:id/:date', '/p/:fullName/pregled/:date'],
        viewPath: 'poslanec/pregled',
        cards: [
            {
                name: 'kompas',
                sourceUrl: '/c/kompas/',
                resolve: (req, res, route, card)=> {

                    return getMPIdByName(req.params.fullName, req)
                        .then((mpData)=> {

                            let mpId = mpData.mpId;
                            let mpSlug = mpData.mpSlug;
                            let state = encodeURIComponent('{"people": [{"id": ' + mpId + ' }], "parties": []}');

                            const cardUrl = `${config.CARD_RENDERER_API_ROOT}${card.sourceUrl}?state=${state}`;

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
                name: 'povprecnoSteviloGovorovNaSejo',
                sourceUrl: '/p/povprecno-stevilo-govorov-na-sejo/:id',
                resolve: (req, res, route, card)=> {

                    return getMPIdByName(req.params.fullName, req)
                        .then((mpData)=> {

                            let mpId = mpData.mpId;
                            let mpSlug = mpData.mpSlug;

                            var pattern = new UrlPattern(card.sourceUrl);
                            const renderedPath = pattern.stringify({id: mpId});
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
                name: 'zadnjeAktivnosti',
                sourceUrl: '/p/zadnje-aktivnosti/:id',
                resolve: (req, res, route, card)=> {

                    return getMPIdByName(req.params.fullName, req)
                        .then((mpData)=> {

                            let mpId = mpData.mpId;
                            let mpSlug = mpData.mpSlug;

                            var pattern = new UrlPattern(card.sourceUrl);
                            const renderedPath = pattern.stringify({id: mpId});
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
                name: 'osnovneInformacije',
                sourceUrl: '/p/osnovne-informacije/:id',
                resolve: (req, res, route, card)=> {

                    return getMPIdByName(req.params.fullName, req)
                        .then((mpData)=> {

                            let mpId = mpData.mpId;
                            let mpSlug = mpData.mpSlug;

                            //console.log('osnovneInformacije: ',mpId);

                            var pattern = new UrlPattern(card.sourceUrl);
                            const renderedPath = pattern.stringify({id: mpId});
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
                name: 'razrezGlasovanj',
                sourceUrl: '/p/razrez-glasovanj/:id',
                resolve: (req, res, route, card)=> {

                    //console.log('razrezGlasovanj: ',req.params.fullName);

                    return getMPIdByName(req.params.fullName, req)
                        .then((mpData)=> {


                            let mpId = mpData.mpId;
                            let mpSlug = mpData.mpSlug;

                            //console.log('Mpdata: ',mpData);

                            //console.log('razrezGlasovanj: ',mpId);

                            var pattern = new UrlPattern(card.sourceUrl);
                            const renderedPath = pattern.stringify({id: mpId});
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
                name: 'stilneAnalize',
                sourceUrl: '/p/stilne-analize/:id',
                resolve: (req, res, route, card)=> {

                    //console.log('stilneAnalize: ',req.params.fullName);

                    return getMPIdByName(req.params.fullName, req)
                        .then((mpData)=> {

                            let mpId = mpData.mpId;
                            let mpSlug = mpData.mpSlug;

                            //console.log('stilneAnalize: ',mpId);

                            var pattern = new UrlPattern(card.sourceUrl);
                            const renderedPath = pattern.stringify({id: mpId});
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
                name: 'izracunanaPrisotnostGlasovanja',
                sourceUrl: '/p/izracunana-prisotnost-glasovanja/:id',
                resolve: (req, res, route, card)=> {

                    return getMPIdByName(req.params.fullName, req)
                        .then((mpData)=> {

                            let mpId = mpData.mpId;
                            let mpSlug = mpData.mpSlug;

                            var pattern = new UrlPattern(card.sourceUrl);
                            const renderedPath = pattern.stringify({id: mpId});
                            const cardUrl = `${config.CARD_RENDERER_API_ROOT}${renderedPath}`;

                            //console.log(cardUrl);

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
                name: 'izracunanaPrisotnostSeje',
                sourceUrl: '/p/izracunana-prisotnost-seje/:id',
                resolve: (req, res, route, card)=> {

                    return getMPIdByName(req.params.fullName, req)
                        .then((mpData)=> {

                            let mpId = mpData.mpId;
                            let mpSlug = mpData.mpSlug;

                            var pattern = new UrlPattern(card.sourceUrl);
                            const renderedPath = pattern.stringify({id: mpId});
                            const cardUrl = `${config.CARD_RENDERER_API_ROOT}${renderedPath}`;

                            //console.log(cardUrl);

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
                name: 'clanstva',
                sourceUrl: '/p/clanstva/:id',
                resolve: (req, res, route, card)=> {

                    return getMPIdByName(req.params.fullName, req)
                        .then((mpData)=> {

                            let mpId = mpData.mpId;
                            let mpSlug = mpData.mpSlug;

                            var pattern = new UrlPattern(card.sourceUrl);
                            const renderedPath = pattern.stringify({id: mpId});
                            const cardUrl = `${config.CARD_RENDERER_API_ROOT}${renderedPath}`;

                            //console.log(cardUrl);

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
    }, {
        path: '/p/:fullName/glasovanja',
        extraPaths: ['/poslanci/glasovanja/:fullName/:date', '/p/:fullName/glasovanja/:date'],
        viewPath: 'poslanec/glasovanja',
        cards: [

            {
                name: 'glasovanjaPoslanec',
                sourceUrl: '/p/glasovanja/:id',
                resolve: (req, res, route, card)=> {
                    return getMPIdByName(req.params.fullName, req)
                        .then((mpData)=> {
                            let mpId = mpData.mpId;
                            let mpSlug = mpData.mpSlug;
                            var pattern = new UrlPattern(card.sourceUrl);
                            const renderedPath = pattern.stringify({id: mpId});
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
                name: 'razrezGlasovanj',
                sourceUrl: '/p/razrez-glasovanj/:id',
                resolve: (req, res, route, card)=> {
                    return getMPIdByName(req.params.fullName, req)
                        .then((mpData)=> {
                            let mpId = mpData.mpId;
                            let mpSlug = mpData.mpSlug;
                            var pattern = new UrlPattern(card.sourceUrl);
                            const renderedPath = pattern.stringify({id: mpId});
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
                name: 'najveckratEnako',
                sourceUrl: '/p/najveckrat-enako/:id',
                resolve: (req, res, route, card)=> {

                    return getMPIdByName(req.params.fullName, req)
                        .then((mpData)=> {

                            let mpId = mpData.mpId;
                            let mpSlug = mpData.mpSlug;

                            var pattern = new UrlPattern(card.sourceUrl);
                            const renderedPath = pattern.stringify({id: mpId});
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
                name: 'najmanjkratEnako',
                sourceUrl: '/p/najmanjkrat-enako/:id',
                resolve: (req, res, route, card)=> {

                    return getMPIdByName(req.params.fullName, req)
                        .then((mpData)=> {

                            let mpId = mpData.mpId;
                            let mpSlug = mpData.mpSlug;

                            var pattern = new UrlPattern(card.sourceUrl);
                            const renderedPath = pattern.stringify({id: mpId});
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
    }, {
        path: '/p/:fullName/govori',
        extraPaths: ['/poslanci/govori/:fullName/:date', '/p/:fullName/govori/:date'],
        viewPath: 'poslanec/govori',
        cards: [

            {
                name: 'besedeKiDelajoPosebno',
                sourceUrl: '/p/tfidf/:id',
                resolve: (req, res, route, card)=> {
                    console.log(req.params.fullName);
                    return getMPIdByName(req.params.fullName, req)
                        .then((mpData)=> {
                            let mpId = mpData.mpId;

                            var pattern = new UrlPattern(card.sourceUrl);
                            const renderedPath = pattern.stringify({id: mpId});
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
                name: 'povezaveDoGovorov',
                sourceUrl: '/p/povezave-do-govorov/:id',
                resolve: (req, res, route, card)=> {

                    return getMPIdByName(req.params.fullName, req)
                        .then((mpData)=> {
                            let mpId = mpData.mpId;

                            var pattern = new UrlPattern(card.sourceUrl);
                            const renderedPath = pattern.stringify({id: mpId});
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
                name: 'steviloIzgovorjenihBesed',
                sourceUrl: '/p/stevilo-izgovorjenih-besed/:id',
                resolve: (req, res, route, card)=> {

                    return getMPIdByName(req.params.fullName, req)
                        .then((mpData)=> {

                            let mpId = mpData.mpId;
                            let mpSlug = mpData.mpSlug;

                            var pattern = new UrlPattern(card.sourceUrl);
                            const renderedPath = pattern.stringify({id: mpId});
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
                name: 'povprecnoSteviloGovorovNaSejo',
                sourceUrl: '/p/povprecno-stevilo-govorov-na-sejo/:id',
                resolve: (req, res, route, card)=> {

                    return getMPIdByName(req.params.fullName, req)
                        .then((mpData)=> {

                            let mpId = mpData.mpId;
                            let mpSlug = mpData.mpSlug;

                            var pattern = new UrlPattern(card.sourceUrl);
                            const renderedPath = pattern.stringify({id: mpId});
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
                name: 'besedniZaklad',
                sourceUrl: '/p/besedni-zaklad/:id',
                resolve: (req, res, route, card)=> {

                    return getMPIdByName(req.params.fullName, req)
                        .then((mpData)=> {

                            let mpId = mpData.mpId;
                            let mpSlug = mpData.mpSlug;

                            var pattern = new UrlPattern(card.sourceUrl);
                            const renderedPath = pattern.stringify({id: mpId});
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
                name: 'stilneAnalize',
                sourceUrl: '/p/stilne-analize/:id',
                resolve: (req, res, route, card)=> {

                    return getMPIdByName(req.params.fullName, req)
                        .then((mpData)=> {

                            let mpId = mpData.mpId;
                            let mpSlug = mpData.mpSlug;

                            var pattern = new UrlPattern(card.sourceUrl);
                            const renderedPath = pattern.stringify({id: mpId});
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
    }, {
        path: '/poslanske-skupine',
        viewPath: 'poslanske-skupine',
        cards: []
    }, {
        path: '/poslanske-skupine/:imeAnalize',
        viewPath: 'poslanske-skupine/analiza',
        cards: {
            poslanec: {
                url: ''
            }
        }
    }, {
        path: '/poslanska-skupina/pregled/:fullName',
        extraPaths: ['/poslanska-skupina/pregled/:fullName/:date', '/ps/id/:id', '/ps/pregled/id/:id', '/ps/id/:id/:date', '/ps/pregled/id/:id/:date'],
        viewPath: 'poslanska-skupina/pregled',
        cards: [
            {
                name: 'osnovneInformacije',
                sourceUrl: '/ps/osnovne-informacije-poslanska-skupina/:id',
                resolve: (req, res, route, card)=> {

                    return getPSIdByName(req.params.fullName, req)
                        .then((psData)=> {
                            let psId = psData.psId;
                            let psSlug = psData.psSlug;
                            var pattern = new UrlPattern(card.sourceUrl);
                            const renderedPath = pattern.stringify({id: psId});
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
            }, {
                name: 'claniceInClani',
                sourceUrl: '/ps/clanice-in-clani-poslanske-skupine/:id',
                resolve: (req, res, route, card)=> {

                    return getPSIdByName(req.params.fullName, req)
                        .then((psData)=> {
                            let psId = psData.psId;
                            let psSlug = psData.psSlug;
                            var pattern = new UrlPattern(card.sourceUrl);
                            const renderedPath = pattern.stringify({id: psId});
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
            }, {
                name: 'kompas',
                sourceUrl: '/c/kompas/:id',
                resolve: (req, res, route, card)=> {

                    return getPSIdByName(req.params.fullName, req)
                        .then((psData)=> {
                            let psId = psData.psId;
                            let psSlug = psData.psSlug;
                            var pattern = new UrlPattern(card.sourceUrl);
                            const renderedPath = pattern.stringify({id: psId});
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
            }, {
                name: 'izracunanaPrisotnost',
                sourceUrl: '/pg/izracunana-prisotnost/:id',
                resolve: (req, res, route, card)=> {

                    return getPSIdByName(req.params.fullName, req)
                        .then((psData)=> {
                            let psId = psData.psId;
                            let psSlug = psData.psSlug;
                            var pattern = new UrlPattern(card.sourceUrl);
                            const renderedPath = pattern.stringify({id: psId});
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
        ]
    }, {
        path: '/poslanska-skupina/glasovanja/:fullName',
        extraPaths: ['/poslanska-skupina/glasovanja/:fullName/:date', '/ps/glasovanja/id/:id', '/ps/glasovanja/id/:id/:date'],
        viewPath: 'poslanska-skupina/glasovanja',
        cards: [
            {
                name: 'glasovanja',
                sourceUrl: '/pg/glasovanja/:id',
                resolve: (req, res, route, card)=> {

                    return getPSIdByName(req.params.fullName, req)
                        .then((psData)=> {
                            let psId = psData.psId;
                            let psSlug = psData.psSlug;
                            var pattern = new UrlPattern(card.sourceUrl);
                            const renderedPath = pattern.stringify({id: psId});
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
                name: 'razrezGlasovanj',
                sourceUrl: '/pg/razrez-glasovanj/:id',
                resolve: (req, res, route, card)=> {

                    return getPSIdByName(req.params.fullName, req)
                        .then((psData)=> {
                            let psId = psData.psId;
                            let psSlug = psData.psSlug;
                            var pattern = new UrlPattern(card.sourceUrl);
                            const renderedPath = pattern.stringify({id: psId});
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
                name: 'najtezjeBiSeJimPridruziji',
                sourceUrl: '/pg/najtezje-pridruzili/:id',
                resolve: (req, res, route, card)=> {

                    return getPSIdByName(req.params.fullName, req)
                        .then((psData)=> {
                            let psId = psData.psId;
                            let psSlug = psData.psSlug;
                            var pattern = new UrlPattern(card.sourceUrl);
                            const renderedPath = pattern.stringify({id: psId});
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
            }, {
                name: 'najlazjeBiSeJimPridruziji',
                sourceUrl: '/pg/najlazje-pridruzili/:id',
                resolve: (req, res, route, card)=> {

                    return getPSIdByName(req.params.fullName, req)
                        .then((psData)=> {
                            let psId = psData.psId;
                            let psSlug = psData.psSlug;
                            var pattern = new UrlPattern(card.sourceUrl);
                            const renderedPath = pattern.stringify({id: psId});
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
            }, {
                name: 'odstopanjaOdPoslanskeSkupine',
                sourceUrl: '/pg/odstopanje-od-poslanske-skupine/:id',
                resolve: (req, res, route, card)=> {

                    return getPSIdByName(req.params.fullName, req)
                        .then((psData)=> {
                            let psId = psData.psId;
                            let psSlug = psData.psSlug;
                            var pattern = new UrlPattern(card.sourceUrl);
                            const renderedPath = pattern.stringify({id: psId});
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
            }]
    }, {
        path: '/poslanska-skupina/govori/:fullName',
        extraPaths: ['/poslanska-skupina/govori/:fullName/:date', '/ps/govori/id/:id', '/ps/govori/id/:id/:date'],
        viewPath: 'poslanska-skupina/govori',
        cards: [
            {
                name: 'besedeKiJihDelajoPosebne',
                sourceUrl: '/ps/tfidf/:id',
                resolve: (req, res, route, card)=> {

                    return getPSIdByName(req.params.fullName, req)
                        .then((psData)=> {
                            let psId = psData.psId;
                            let psSlug = psData.psSlug;
                            var pattern = new UrlPattern(card.sourceUrl);
                            const renderedPath = pattern.stringify({id: psId});
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
            }, {
                name: 'vsiGovoriPoslanskeSkupine',
                sourceUrl: '/ps/vsi-govori-poslanske-skupine/:id',
                resolve: (req, res, route, card)=> {

                    return getPSIdByName(req.params.fullName, req)
                        .then((psData)=> {
                            let psId = psData.psId;
                            let psSlug = psData.psSlug;
                            var pattern = new UrlPattern(card.sourceUrl);
                            const renderedPath = pattern.stringify({id: psId});
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
            }, {
                name: 'besedniZaklad',
                sourceUrl: '/ps/besedni-zaklad/:id',
                resolve: (req, res, route, card)=> {

                    return getPSIdByName(req.params.fullName, req)
                        .then((psData)=> {
                            let psId = psData.psId;
                            let psSlug = psData.psSlug;
                            var pattern = new UrlPattern(card.sourceUrl);
                            const renderedPath = pattern.stringify({id: psId});
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
            //,{
            //     name:'stilneAnalize',
            //     sourceUrl:'/pg/stilne-analize/:id',
            //     resolve: (req, res, route, card)=>{
            //
            //         return getPSIdByName(req.params.fullName, req)
            //             .then((psData)=>{
            //                 let psId = psData.psId;
            //                 let psSlug = psData.psSlug;
            //                 var pattern = new UrlPattern(card.sourceUrl);
            //                 const renderedPath = pattern.stringify({id:psId});
            //                 const cardUrl = `${config.CARD_RENDERER_SEARCH_API_ROOT}${renderedPath}`;
            //                 console.log(cardUrl);
            //                 return fetch(cardUrl)
            //                     .then((res) => {
            //                         return res.text();
            //                     })
            //                     .then((body) => {
            //                         return body;
            //                     });
            //             });
            //
            //     }
            // }
        ]
    },
    {
        path: '/seje',
        viewPath: 'seje'
    },
    {
        path: '/seje/isci/',
        extraPaths: ['/search/', '/seje/search/', '/isci/' ],
        viewPath: 'seje/search'
    },
    {
        path: '/seje/tip/:fullName',
        extraPaths: ['/seje/tip/:fullName/:date'],
        viewPath: 'seje/tip',
        cards: []
    },

    {
        path: '/seja/glasovanje/:id/:motionid',
        extraPaths: ['/seja/glasovanje/:id/:motionid/:date', '/s/glasovanje/:id/:motionid', '/s/glasovanje/:id/:motionid/:date'],
        viewPath: 'seja/glasovanje',
        cards: [
            {
                name: 'glasovanjeSeja',
                sourceUrl: '/s/glasovanje-layered/:motionid',
                resolve: (req, res, route, card)=> {

                    var pattern = new UrlPattern(card.sourceUrl);
                    const renderedPath = pattern.stringify({motionid: req.params.motionid});
                    const cardUrl = `${config.CARD_RENDERER_API_ROOT}${renderedPath}`;
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
        path: '/seja/glasovanja/:id',
        extraPaths: ['/seja/glasovanja/:id/:date', '/s/glasovanja/:id', '/s/glasovanja/:id/:date'],
        viewPath: 'seja/glasovanja',
        cards: [
            {
                name: 'glasovanjaSeja',
                sourceUrl: '/s/glasovanja-seja/:id',
                resolve: (req, res, route, card)=> {
                    var pattern = new UrlPattern(card.sourceUrl);
                    const renderedPath = pattern.stringify({id: req.params.id});
                    const cardUrl = `${config.CARD_RENDERER_API_ROOT}${renderedPath}`;
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
        path: '/seja/prisotnost/:id',
        extraPaths: ['/seja/prisotnost/:id/:date', '/s/prisotnost/:id', '/s/prisotnost/:id/:date'],
        viewPath: 'seja/prisotnost',
        cards: [
            {
                name: 'prisotnostPoPoslanskihSkupinah',
                sourceUrl: '/s/prisotnost-po-poslanskih-skupinah/:id',
                resolve: (req, res, route, card)=> {
                    var pattern = new UrlPattern(card.sourceUrl);
                    const renderedPath = pattern.stringify({id: req.params.id});
                    const cardUrl = `${config.CARD_RENDERER_API_ROOT}${renderedPath}`;
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
                name: 'seznamOdsotnihPoslancev',
                sourceUrl: '/s/seznam-odsotnih-poslancev/:id',
                resolve: (req, res, route, card)=> {
                    var pattern = new UrlPattern(card.sourceUrl);
                    const renderedPath = pattern.stringify({id: req.params.id});
                    const cardUrl = `${config.CARD_RENDERER_API_ROOT}${renderedPath}`;
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
        path: '/seja/transkript/:id',
        extraPaths: ['/seja/transkript/:id/:date', '/s/transkript/:id', '/s/transkript/:id/:date'],
        viewPath: 'seja/transkript',
        cards: [
            {
                name: 'besedeKiSoZaznamovaleSejo',
                sourceUrl: '/s/besede-ki-so-zaznamovale-sejo/:id',
                resolve: (req, res, route, card)=> {
                    var pattern = new UrlPattern(card.sourceUrl);
                    const renderedPath = pattern.stringify({id: req.params.id});
                    const cardUrl = `${config.CARD_RENDERER_API_ROOT}${renderedPath}`;
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
            //     sourceUrl: '/s/transkript/:id',
            //     resolve: (req, res, route, card)=> {
            //         var pattern = new UrlPattern(card.sourceUrl);
            //         const renderedPath = pattern.stringify({id: req.params.id});
            //         const cardUrl = `${config.CARD_RENDERER_API_ROOT}${renderedPath}`;
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
        path: '/seje/:imeAnalize',
        viewPath: 'seje/seja',
        cards: {
            poslanec: {
                url: ''
            }
        }
    }
    ,{
        path: '/pravno-obvestilo',
        viewPath: 'about/pravno-obvestilo'
    },{
        path: '/za-medije',
        viewPath: 'about/za-medije'
    },{
        path: '/o-projektu',
        viewPath: 'about/o-projektu'
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
    app.get('/*', function(req, res){
        res.status(404).render('error/404', {title: "Sorry, page not found", activeMenu: ""});
    });
};

function createRoute(app, route) {
    app.get(route.path, (req, res)=> {
        if (route.cards) {
            resolveCards(req, res, route)
                .then((views)=> {

                    if (route.viewPath.indexOf("poslanske-skupine") > -1) {
                        getPSIdByName(req.params.fullName, req)
                            .then((psData) => {
                                res.render(route.viewPath, {
                                    query: req.query,
                                    params: req.params,
                                    ps: psData.ps,
                                    slug: req.slug,
                                    activeMenu: 'poslanske-skupine',
                                    views
                                });
                            });

                    } else if (route.viewPath.indexOf("poslanska-skupina") > -1) {
                        getPSIdByName(req.params.fullName, req)
                            .then((psData) => {
                                res.render(route.viewPath, {
                                    query: req.query,
                                    params: req.params,
                                    ps: psData.ps,
                                    slug: req.slug,
                                    activeMenu: 'PS',
                                    views
                                });
                            });

                    } else if (route.viewPath.indexOf("search") > -1) {
                        res.render(route.viewPath, {
                            query: req.query,
                            params: req.params,
                            sesData: sesData.s,
                            slug: req.slug,
                            activeMenu: 'S',
                            views
                        });

                    } else if (route.viewPath.indexOf("seje") > -1) {

                        getSessionsByType(req.params, req)
                            .then((sesData)=> {

                                res.render(route.viewPath, {
                                    query: req.query,
                                    params: req.params,
                                    sesData: sesData,
                                    slug: req.slug,
                                    activeMenu: 'S',
                                    views
                                });
                            });

                    } else if (route.viewPath.indexOf("seja") > -1) {
                        getSessionIds(req.params, req)
                            .then((sesData)=> {

                                res.render(route.viewPath, {
                                    query: req.query,
                                    params: req.params,
                                    sesData: sesData.s,
                                    slug: req.slug,
                                    activeMenu: 'S',
                                    views
                                });
                            });

                    } else {
                        var activeMenu = (route.viewPath == 'landing') ? route.viewPath : 'P';
                        getMPIdByName(req.params.fullName, req)
                            .then((mpData)=> {

                                res.render(route.viewPath, {
                                    query: req.query,
                                    params: req.params,
                                    mp: mpData.mp,
                                    slug: req.slug,
                                    activeMenu: activeMenu,
                                    views
                                });
                            });
                    }

                });
        } else {

            if (route.viewPath.indexOf("seje") > -1) {
                getSessionsByType(req.params, req)
                    .then((sesData)=> {

                        res.render(route.viewPath, {
                            query: req.query,
                            params: req.params,
                            sesData: sesData,
                            slug: req.slug,
                            activeMenu: 'S',
                        });
                    });

            } else {


                res.render(route.viewPath, {
                    query: req.query,
                    params: req.params,
                    slug: req.slug,
                    activeMenu: route.viewPath,
                });
            }
        }
        /*
        app.get('*', function(req, res){
            res.status(404).render('404', {title: "Sorry, page not found", activeMenu: ""});
        });
        */
    });

}

function resolveCards(req, res, route) {
    if (!route.cards) {
        return Promise.resolve({});
    }
    return Promise.reduce(route.cards, (aggregator, card) => {
        return card.resolve(req, res, route, card)
            .then((body)=> {

                aggregator[card.name] = body;
                return aggregator;

            });
    }, {});
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

    _.each(mpsList, (mp, i)=> {
        mp.nameSlug = slug(mp.name).toLowerCase();

        if ((name === mp.nameSlug) | (req.params.id == mp.id)) {
            mpId = mp.id;
            mpSlug = mp.nameSlug;

            req.slug = mpSlug;
            req.mpId = mpId;
            req.mp = mp;
            selectedMp = mp;
        }
    });
    return Promise.resolve({mpId, mpSlug, mp: selectedMp});
    // });
}


function getPSIdByName(name, req) {
    let psId;
    let psSlug;
    let selectedPs;

    // return fetch('https://data.parlameter.si/v1/getAllPGs/')
    //     .then((res)=> res.json())
    //     .then((jsonBody) => {
    //
    //         //   var opsList = jsonBody;

    _.each(opsList, (ps, i)=> {
        ps.nameSlug = slug(ps.name).toLowerCase();

        if ((name === ps.nameSlug) | (req.params.id == ps.id)) {
            //if(id == ps.id){
            psId = ps.id;
            psSlug = ps.nameSlug;
            req.slug = psSlug;
            req.psId = psId;
            req.ps = ps;
            selectedPs = ps;
        }
        //console.log('<a href="/poslanska-skupina/'+ps.nameSlug+'/'+ps.id+'">'+ps.name+'</a><br>');
        // console.log('<a href="/poslanska-skupina/'+ps.nameSlug+'">'+ps.name+'</a><br>');

    });

    return Promise.resolve({psId, psSlug, ps: selectedPs});
    // });
}

function getSessionIds(params, req) {
    let spsId;
    let spsSlug;
    let selectedSps;
    let type;

    //works ok
    // return fetch('https://analize.parlameter.si/v1/s/getSessionsByClassification')
    //     .then((res)=> res.json())
    //     .then((jsonBody) => {
    //          //var spsList = jsonBody;

    //console.log(spsList);

    var tmp = spsList[0];
    for (var key in tmp) {
        var sejetip = tmp[key];
        for (var seja in sejetip) {

            var s = sejetip[seja];

            s.nameSlug = slug(s.name).toLowerCase();

            if ((params.id == s.id) | (params.name == s.nameSlug)) {

                spsId = s.id;
                spsSlug = s.nameSlug;
                req.slug = spsSlug;
                req.spsId = spsId;
                req.s = s;
                s.type = type;
                selectedSps = s;
            }

        }

    }


    return Promise.resolve({spsId, spsSlug, s: selectedSps});
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

    _.each(spsList, (spsSingle, iii)=> {
        switch (params.fullName) {
            case 'seje-delovnih-teles':
                returnData = spsSingle.dt;
                type = 1;
                break;
            case 'seje-kolegija-predsednika-dz':
                returnData = spsSingle.kolegij;
                type = 2;
                break;
            case 'seje-dz':
                returnData = spsSingle.dz;
                type = 3;
                break;
            default:
                returnData = spsSingle.dz;
                type = 3;
                break;
        }
    });

    return Promise.resolve({psId, psSlug, sesData: returnData, type: type});
    // });

}