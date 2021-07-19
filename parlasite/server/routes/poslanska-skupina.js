const express = require('express');
const { asyncRender: ar } = require('../utils');
const { siteMap: sm, urls } = require('../../config');
const { i18n } = require('../server');
const fetch = require('node-fetch');

const router = express.Router();

async function getNewData(slug) {
  const id = parseInt(slug.split('-')[0]);
  // TODO this shouldn't be hard-coded
  const response = await fetch(`${urls.parladata}/cards/group/basic-information?id=${id}`);
  if (response.ok && response.status >= 200 && response.status < 400) {
    let data = await response.json();
    return {
      group: {
        ...data.group,
        ...data.results,
        id, // TODO this might be simpler if parladata would return the ID
      }
    };
  }
  return false;
}

router.get(['/:id(\\d+)', `/:id(\\d+)/${sm.party.overview}`, '/:slug([a-z0-9-]+)', `/:slug([a-z0-9-]+)/${sm.party.overview}`], ar((render, req, res, next) => {
  const pgData = getNewData(req.params.slug).then((pgData) => {
    console.log(pgData);
    if (pgData) {
      render('poslanska-skupina/pregled', {
        activeMenu: 'pg',
        pageTitle: `${i18n('general.overview')} - ${pgData.group.name}`,
        activeTab: 'pregled',
        ...pgData,
      });
    } else {
      next();
    }
  });
}));

router.get([`/:id(\\d+)/${sm.party.votings}`, `/:slug([a-z0-9-]+)/${sm.party.votings}`], ar((render, req, res, next) => {
  const pgData = getNewData(req.params.slug).then((pgData) => {
    console.log(pgData);
    if (pgData) {
      render('poslanska-skupina/glasovanja', {
        activeMenu: 'pg',
        pageTitle: `${i18n('general.overview')} - ${pgData.group.name}`,
        activeTab: 'glasovanja',
        ...pgData,
      });
    } else {
      next();
    }
  });
}));

router.get([`/:id(\\d+)/${sm.party.speeches}`, `/:slug([a-z0-9-]+)/${sm.party.speeches}`], ar((render, req, res, next) => {
  const pgData = getNewData(req.params.slug).then((pgData) => {
    console.log(pgData);
    if (pgData) {
      render('poslanska-skupina/govori', {
        activeMenu: 'pg',
        pageTitle: `${i18n('general.overview')} - ${pgData.group.name}`,
        activeTab: 'govori',
        ...pgData,
      });
    } else {
      next();
    }
  });
}));

module.exports = router;
