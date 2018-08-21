const express = require('express');
const data = require('../data');
const { asyncRender: ar } = require('../utils');
const { siteMap: sm } = require('../../config');

const router = express.Router();

function getID(slugParam) {
  const slugs = data.urls.party;
  const parties = data.pgs;
  // get all ids as numbers
  let ids = Object.keys(slugs).map(Number);
  // only ids that have the correct slug
  ids = ids.filter(id => slugs[id].acronym === slugParam);
  // only ids that have a party object
  ids = ids.filter(id => parties.find(p => p.id === id));
  // if there are more than one at this point prefer ones that are not disbanded
  if (ids.length > 1) {
    const active = ids.filter(() => parties.find(p => !p.disbanded));
    if (active.length) {
      ids = active;
    }
  }
  // return the largest id since that is probably the latest
  return ids.length ? Math.max(...ids) : null;
}

function getData(idParam, slugParam) {
  const parties = data.urls.party;
  const id = Number(idParam) || getID(slugParam);
  const party = id && data.pgs.find(p => p.id === id);
  const slug = party && (slugParam || parties[id].acronym);
  return (id && party) ? { party, slug } : null;
}

router.get(['/:id(\\d+)', `/:id(\\d+)/${sm.party.overview}`, '/:slug([a-z0-9-]+)', `/:slug([a-z0-9-]+)/${sm.party.overview}`], ar((render, req, res, next) => {
  const pgData = getData(req.params.id, req.params.slug);
  if (pgData) {
    render('poslanska-skupina/pregled', {
      activeMenu: 'pgs',
      pageTitle: `Pregled - ${pgData.party.name}`,
      activeTab: 'pregled',
      ...pgData,
    });
  } else {
    next();
  }
}));

router.get([`/:id(\\d+)/${sm.party.votings}`, `/:slug([a-z0-9-]+)/${sm.party.votings}`], ar((render, req, res, next) => {
  const pgData = getData(req.params.id, req.params.slug);
  if (pgData) {
    render('poslanska-skupina/glasovanja', {
      activeMenu: 'pgs',
      pageTitle: `Glasovanja - ${pgData.party.name}`,
      activeTab: 'glasovanja',
      ...pgData,
    });
  } else {
    next();
  }
}));

router.get([`/:id(\\d+)/${sm.party.speeches}`, `/:slug([a-z0-9-]+)/${sm.party.speeches}`], ar((render, req, res, next) => {
  const pgData = getData(req.params.id, req.params.slug);
  if (pgData) {
    render('poslanska-skupina/govori', {
      activeMenu: 'pgs',
      pageTitle: `Govori - ${pgData.party.name}`,
      activeTab: 'govori',
      ...pgData,
    });
  } else {
    next();
  }
}));

module.exports = router;
