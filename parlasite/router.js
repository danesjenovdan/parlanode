"use strict";
const _ = require('lodash');
const fetch = require('node-fetch');
const UrlPattern = require('url-pattern');
const Promise = require('bluebird');
const config = require('./config');
const slug = require('slug');
const mpsList = require('./static/data/mps');
const opsList = require('./static/data/ops');

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
            }
        ]
    },
    {
        path: '/poslanci',
        viewPath: 'poslanci'
    },
    {
        path: '/p/:fullName',
        extraPaths: ['/poslanci/pregled/:fullName/:date'],
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
                name: 'izracunanaPrisotnost',
                sourceUrl: '/p/izracunana-prisotnost/:id',
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
    },
    {
        path: '/p/:fullName/glasovanja',
        extraPaths: ['/poslanci/glasovanja/:fullName/:date'],
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
    },
    {
        path: '/p/:fullName/govori',
        extraPaths: ['/poslanci/govori/:fullName/:date'],
        viewPath: 'poslanec/govori',
        cards: [
            /*{
             name:'povezaveDoGovorov',
             sourceUrl:'/p/povezave-do-govorov/:id',
             resolve: (req, res, route, card)=>{

             return getMPIdByName(req.params.fullName, 0)
             .then((mpData)=>{

             let mpId = mpData.mpId;
             let mpSlug = mpData.mpSlug;

             var pattern = new UrlPattern(card.sourceUrl);
             const renderedPath = pattern.stringify({id:mpId});
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
             },*/
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
    },
    {
        path: '/poslanske-skupine',
        viewPath: 'poslanske-skupine',
        cards: []
    },
    {
        path: '/poslanske-skupine/:imeAnalize',
        viewPath: 'poslanske-skupine/analiza',
        cards: {
            poslanec: {
                url: ''
            }
        }
    }

    ,
    {
        path: '/poslanska-skupina/pregled/:fullName',
        extraPaths: ['/poslanska-skupina/pregled/:fullName/:date'],
        viewPath: 'poslanske-skupine/pregled',
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
        extraPaths: ['/poslanska-skupina/glasovanja/:fullName/:date'],
        viewPath: 'poslanske-skupine/glasovanja',
        cards: [{
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
        }, {
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
        }, {
            name: 'najtezjeBiSeJimPridruziji',
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
        extraPaths: ['/poslanska-skupina/govori/:fullName/:date'],
        viewPath: 'poslanske-skupine/govori',
        cards: [{
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
    }

    , {
        path: '/seje',
        viewPath: 'seje'
    },

    {
        path: '/seje/tip/:fullName',
        extraPaths: ['/seje/tip/:fullName/:date'],
        viewPath: 'seje/tip',
        cards: []
    },

    {
        path: '/seja/glasovanja/:id',
        extraPaths: ['/seja/glasovanja/:id/:date'],
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
        extraPaths: ['/seja/prisotnost/:id/:date'],
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
        extraPaths: ['/seja/transkript/:id/:date'],
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
    app.get(route.path, (req, res)=> {
        if (route.cards) {
            resolveCards(req, res, route)
                .then((views)=> {
                    if (route.viewPath.indexOf("poslansk") > -1) {
                        getPSIdByName(req.params.fullName, req)
                            .then((psData)=> {
                                res.render(route.viewPath, {
                                    query: req.query,
                                    params: req.params,
                                    ps: psData.ps,
                                    slug: req.slug,
                                    views
                                });
                            });

                    } else {
                        getMPIdByName(req.params.fullName, req)
                            .then((mpData)=> {
                                res.render(route.viewPath, {
                                    query: req.query,
                                    params: req.params,
                                    mp: mpData.mp,
                                    slug: req.slug,
                                    views
                                });
                            });
                    }

                });
        } else {
            res.render(route.viewPath, {query: req.query, params: req.params, slug: req.slug});
        }
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

    /*return fetch('https://data.parlameter.si/v1/getMPs')
     .then((res)=> res.json())
     .then((jsonBody) => {

     let mpId;*/

    _.each(mpsList, (mp, i)=> {
        mp.nameSlug = slug(mp.name).toLowerCase();

        if (name === mp.nameSlug) {
            mpId = mp.id;
            mpSlug = mp.nameSlug;
            req.slug = mpSlug;
            req.mpId = mpId;
            req.mp = mp;
            selectedMp = mp;
        }
    });
    return Promise.resolve({mpId, mpSlug, mp: selectedMp});
//    });
}


function getPSIdByName(id, req) {
    let psId;
    let psSlug;
    let selectedPs;

    /*return fetch('https://data.parlameter.si/v1/getPSs')
     .then((res)=> res.json())
     .then((jsonBody) => {

     let psId;*/

    _.each(opsList, (ps, i)=> {
        ps.nameSlug = slug(ps.name).toLowerCase();

        if (id === ps.nameSlug) {
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
//    });
    return Promise.resolve({psId, psSlug, ps: selectedPs});
}