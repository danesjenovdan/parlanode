const express = require('express');
const fetch = require('node-fetch');
const { asyncRender: ar } = require('../utils');
const { siteMap: sm, urls } = require('../../config');
const { i18n } = require('../server');

const router = express.Router();

async function getNewData(slug) {
  const id = parseInt(slug.split('-')[0], 10);
  // TODO this shouldn't be hard-coded
  const response = await fetch(`${urls.parladata}/cards/person/basic-information/?id=${id}`);
  // response.ok means status is 2xx
  if (response.ok) {
    const data = await response.json();
    return {
      mp: {
        ...data.person,
        ...data.results,
        id, // TODO this might be simpler if parladata would return the ID
      },
    };
  }
  return false;
}

router.get(['/:slug([a-z0-9-]+)', `/:slug([a-z0-9-]+)/${sm.member.overview}`], ar((render, req, res, next) => {
  getNewData(req.params.slug).then((mpData) => {
    if (mpData) {
      render('poslanec/pregled', {
        activeMenu: 'mp',
        pageTitle: `${i18n('general.overview')} - ${mpData.mp.name}`,
        activeTab: 'pregled',
        ...mpData,
      });
    } else {
      next();
    }
  });
}));

router.get([`/:slug([a-z0-9-]+)/${sm.member.votings}`], ar((render, req, res, next) => {
  getNewData(req.params.slug).then((mpData) => {
    if (mpData) {
      render('poslanec/glasovanja', {
        activeMenu: 'mp',
        pageTitle: `${i18n('general.voting')} - ${mpData.mp.name}`,
        activeTab: 'glasovanja',
        ...mpData,
      });
    } else {
      next();
    }
  });
}));

router.get([`/:slug([a-z0-9-]+)/${sm.member.speeches}`], ar((render, req, res, next) => {
  getNewData(req.params.slug).then((mpData) => {
    if (mpData) {
      render('poslanec/govori', {
        activeMenu: 'mp',
        pageTitle: `${i18n('general.speeches')} - ${mpData.mp.name}`,
        activeTab: 'govori',
        ...mpData,
      });
    } else {
      next();
    }
  });
}));

module.exports = router;
