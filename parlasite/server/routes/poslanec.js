const express = require('express');
const { asyncRender: ar } = require('../utils');
const { siteMap: sm, urls } = require('../../config');
const { i18n } = require('../server');
const fetch = require('node-fetch');

const router = express.Router();

async function getNewData(slug) {
  const id = parseInt(slug.split('-')[0]);
  // TODO this shouldn't be hard-coded
  const response = await fetch(`${urls.parladata}/cards/person/basic-information?id=${id}`);
  if (response.ok && response.status >= 200 && response.status < 400) {
    let data = await response.json();
    return {
      mp: {
        ...data.person,
        ...data.results,
        id, // TODO this might be simpler if parladata would return the ID
      }
    };
  }
  return false;
}

router.get(['/:id(\\d+)', `/:id(\\d+)/${sm.member.overview}`, '/:slug([a-z0-9-]+)', `/:slug([a-z0-9-]+)/${sm.member.overview}`], ar((render, req, res, next) => {
  const mpData = getNewData(req.params.slug).then((mpData) => {
    console.log(mpData);
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

router.get([`/:id(\\d+)/${sm.member.votings}`, `/:slug([a-z0-9-]+)/${sm.member.votings}`], ar((render, req, res, next) => {
  const mpData = getNewData(req.params.slug).then((mpData) => {
    console.log(mpData);
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

router.get([`/:id(\\d+)/${sm.member.speeches}`, `/:slug([a-z0-9-]+)/${sm.member.speeches}`], ar((render, req, res, next) => {
  const mpData = getNewData(req.params.slug).then((mpData) => {
    console.log(mpData);
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
