const express = require('express');
const data = require('../data');
const { asyncRender: ar } = require('../utils');
const { siteMap: sm } = require('../../config');
const { i18n } = require('../server');

const router = express.Router();

function getData(idParam, slugParam) {
  const people = data.urls.person;
  const id = Number(idParam || Object.keys(people).find(k => people[k].slug === slugParam));
  const mp = id && data.mps.find(m => m.id === id);
  const party = mp && data.pgs.find(p => p.id === mp.party_id);
  const slug = mp && (slugParam || people[id].slug);
  return (id && mp && slug) ? { mp, party, slug } : null;
}

router.get(['/:id(\\d+)', `/:id(\\d+)/${sm.member.overview}`, '/:slug([a-z0-9-]+)', `/:slug([a-z0-9-]+)/${sm.member.overview}`], ar((render, req, res, next) => {
  const mpData = getData(req.params.id, req.params.slug);
  if (mpData) {
    render('poslanec/pregled', {
      activeMenu: 'mps',
      pageTitle: `${i18n('general.overview')} - ${mpData.mp.name}`,
      activeTab: 'pregled',
      ...mpData,
    });
  } else {
    next();
  }
}));

router.get([`/:id(\\d+)/${sm.member.votings}`, `/:slug([a-z0-9-]+)/${sm.member.votings}`], ar((render, req, res, next) => {
  const mpData = getData(req.params.id, req.params.slug);
  if (mpData) {
    render('poslanec/glasovanja', {
      activeMenu: 'mps',
      pageTitle: `${i18n('general.voting')} - ${mpData.mp.name}`,
      activeTab: 'glasovanja',
      ...mpData,
    });
  } else {
    next();
  }
}));

router.get([`/:id(\\d+)/${sm.member.speeches}`, `/:slug([a-z0-9-]+)/${sm.member.speeches}`], ar((render, req, res, next) => {
  const mpData = getData(req.params.id, req.params.slug);
  if (mpData) {
    render('poslanec/govori', {
      activeMenu: 'mps',
      pageTitle: `${i18n('general.speeches')} - ${mpData.mp.name}`,
      activeTab: 'govori',
      ...mpData,
    });
  } else {
    next();
  }
}));

module.exports = router;
