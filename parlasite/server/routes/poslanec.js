const express = require('express');
const data = require('../data');

const router = express.Router();

function getData(idParam, slugParam) {
  const people = data.urls.person;
  const id = Number(idParam || Object.keys(people).find(k => people[k].slug === slugParam));
  const mp = id && data.mps.find(m => m.id === id);
  const party = mp && data.pgs.find(p => p.id === mp.party_id);
  const slug = mp && (slugParam || people[id].slug);
  return (id && mp && party) ? { mp, party, slug } : null;
}

router.get(['/:id(\\d+)', '/:id(\\d+)/pregled', '/:slug([a-z-]+)', '/:slug([a-z-]+)/pregled'], (req, res, next) => {
  const mpData = getData(req.params.id, req.params.slug);
  if (mpData) {
    res.render('poslanec/pregled', {
      activeMenu: 'poslanci',
      pageTitle: `Pregled - ${mpData.mp.name}`,
      activeTab: 'pregled',
      ...mpData,
    });
  } else {
    next();
  }
});

router.get(['/:id(\\d+)/glasovanja', '/:slug([a-z-]+)/glasovanja'], (req, res, next) => {
  const mpData = getData(req.params.id, req.params.slug);
  if (mpData) {
    res.render('poslanec/glasovanja', {
      activeMenu: 'poslanci',
      pageTitle: `Glasovanja - ${mpData.mp.name}`,
      activeTab: 'glasovanja',
      ...mpData,
    });
  } else {
    next();
  }
});

router.get(['/:id(\\d+)/govori', '/:slug([a-z-]+)/govori'], (req, res, next) => {
  const mpData = getData(req.params.id, req.params.slug);
  if (mpData) {
    res.render('poslanec/govori', {
      activeMenu: 'poslanci',
      pageTitle: `Govori - ${mpData.mp.name}`,
      activeTab: 'govori',
      ...mpData,
    });
  } else {
    next();
  }
});

module.exports = router;
