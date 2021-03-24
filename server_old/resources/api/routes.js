const controller = require('./controller');

module.exports = (app) => {
  // app.get('/api/cards/renders', controller.getCardRenders);
  // app.get('/api/cards/builds', controller.getCardBuilds);
  // app.get('/api/cards/renders/delete/old', controller.deleteOldCardRenders);
  // app.get('/api/cards/renders/delete/all', controller.deleteCardRenders);
  // app.get('/api/cards/builds/delete/all', controller.deleteCardBuilds);
  // app.get('/api/cards/renders/delete/:id', controller.deleteCardRenderId);
  // app.get('/api/cards/builds/delete/:id', controller.deleteCardBuildId);
  // app.get('/api/cards/rebuild', controller.rebuildCards(false));
  // app.get('/api/cards/rebuild/all', controller.rebuildCards(true));

  // app.get('/api/og-images/renders', controller.getOgRenders);
  // app.get('/api/og-images/builds', controller.getOgBuilds);
  // app.get('/api/og-images/renders/delete/all', controller.deleteOgRenders);
  // app.get('/api/og-images/builds/delete/all', controller.deleteOgBuilds);
  // app.get('/api/og-images/renders/delete/:id', controller.deleteOgRenderId);
  // app.get('/api/og-images/builds/delete/:id', controller.deleteOgBuildId);
  // app.get('/api/og-images/rebuild', controller.rebuildOgs(false));
  // app.get('/api/og-images/rebuild/all', controller.rebuildOgs(true));

  app.get('/api/data/refetch', controller.refetchData);

  app.get('/api/icons/legislation', controller.listLegislationIcons);
};
