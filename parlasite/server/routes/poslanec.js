const express = require('express');
const fetch = require('node-fetch');
const { asyncRender: ar, getOgImageUrl } = require('../utils');
const { urls, leaderId } = require('../../config');
const { i18n } = require('../server');

const sm = i18n.siteMap;

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
      ogImageUrl: getOgImageUrl('circle', {
        title: i18n('general.overview'),
        h1: mpData.mp.name,
        h2: mpData.mp.group ? mpData.mp.group.name || mpData.mp.group.acronym : '',
        image: mpData.mp.image,
      }),
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
      ogImageUrl: getOgImageUrl('circle', {
        title: i18n('general.voting'),
        h1: mpData.mp.name,
        h2: mpData.mp.group ? mpData.mp.group.name || mpData.mp.group.acronym : '',
        image: mpData.mp.image,
      }),
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
      ogImageUrl: getOgImageUrl('circle', {
        title: i18n('general.speeches'),
        h1: mpData.mp.name,
        h2: mpData.mp.group ? mpData.mp.group.name || mpData.mp.group.acronym : '',
        image: mpData.mp.image,
      }),
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
      ogImageUrl: getOgImageUrl('circle', {
        title: i18n('titles.leader'),
        h1: mpData.mp.name,
        image: mpData.mp.image,
      }),
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
