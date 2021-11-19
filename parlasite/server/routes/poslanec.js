const express = require('express');
const fetch = require('node-fetch');
const { asyncRender: ar } = require('../utils');
const { siteMap: sm, urls, leaderId } = require('../../config');
const { i18n } = require('../server');

const router = express.Router();

function redirectIfLeader(req, res, next) {
  const slug = req.params.slug || '';
  const id = parseInt(slug.split('-')[0], 10);
  if (id === Number(leaderId)) {
    res.redirect(`/${sm.member.leaderBase}`);
  } else {
    next();
  }
}

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

router.get(['/:slug([a-z0-9-]+)', `/:slug([a-z0-9-]+)/${sm.member.overview}`], redirectIfLeader, ar(async (render, req, res, next) => {
  const mpData = await getNewData(req.params.slug);
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
}));

router.get([`/:slug([a-z0-9-]+)/${sm.member.votings}`], redirectIfLeader, ar(async (render, req, res, next) => {
  const mpData = await getNewData(req.params.slug);
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
}));

router.get([`/:slug([a-z0-9-]+)/${sm.member.speeches}`], redirectIfLeader, ar(async (render, req, res, next) => {
  const mpData = await getNewData(req.params.slug);
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
}));

const leaderRouter = express.Router();

leaderRouter.get('/', ar(async (render, req, res, next) => {
  const mpData = await getNewData(leaderId);
  if (mpData) {
    render('poslanec/zupan', {
      activeMenu: 'leader',
      pageTitle: `${i18n('titles.leader')} - ${mpData.mp.name}`,
      ...mpData,
    });
  } else {
    next();
  }
}));

module.exports = {
  poslanec: router,
  leader: leaderRouter,
};
