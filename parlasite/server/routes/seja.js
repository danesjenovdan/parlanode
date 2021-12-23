const express = require('express');
const fetch = require('node-fetch');
const { asyncRender: ar } = require('../utils');
const { siteMap: sm, urls } = require('../../config');
const { i18n } = require('../server');

const router = express.Router();

// TODO: is there a way to preload this?
async function isMotionValid(sessionId, motionId) {
  return true;
  // TODO: figure out how to know when to return 404
  // THIS IS OLD AND INCOMPATIBLE CODE
  // const res = await fetch(`${data.urls.urls.analize}/s/getMotionOfSession/${sessionId}`);
  // const json = await res.json();
  // return json.results.findIndex(m => m.results.motion_id === motionId) !== -1;
}

// TODO the ones for poslanec and poslanska skupina accept a slug
async function getNewData(id) {
  const response = await fetch(`${urls.parladata}/cards/session/single/?id=${id}`);
  // response.ok means status is 2xx
  if (response.ok) {
    const data = await response.json();
    return {
      session: {
        ...data.results,
        id,
      },
    };
  }
  return false;
}

// router.get(['/:id(\\d+)', `/:id(\\d+)/${sm.session.legislation}`], ar(async (render, req, res, next) => {
//   const sesData = await getNewData(req.params.id);
//   if (sesData) {
//     render('seja/dnevni-red', { // TODO this used to take you to zakonodaja
//       activeMenu: 'session',
//       pageTitle: `${i18n('titles.session')} - ${i18n('titles.agenda')}`, // TODO this used to take you to zakonodaja (title.legislation)
//       activeTab: 'dnevni-red', // TODO this used to take you to zakonodaja
//       ...sesData,
//     });
//   } else {
//     next();
//   }
// }));

router.get(['/:id(\\d+)', `/:id(\\d+)/${sm.session.otherVotings}`], ar(async (render, req, res, next) => {
  const sesData = await getNewData(req.params.id);
  if (sesData) {
    render('seja/glasovanja', {
      activeMenu: 'session',
      pageTitle: `${i18n('titles.session')} - ${i18n('titles.other-votings')}`,
      activeTab: 'glasovanja',
      ...sesData,
    });
  } else {
    next();
  }
}));

router.get(`/:id(\\d+)/${sm.session.agenda}`, ar(async (render, req, res, next) => {
  const sesData = await getNewData(req.params.id);
  if (sesData) {
    render('seja/dnevni-red', {
      activeMenu: 'session',
      pageTitle: `${i18n('titles.session')} - ${i18n('titles.agenda')}`,
      activeTab: 'dnevni-red',
      ...sesData,
    });
  } else {
    next();
  }
}));

router.get(['/:id(\\d+)', `/:id(\\d+)/${sm.session.transcript}`], ar(async (render, req, res, next) => {
  const sesData = await getNewData(req.params.id);
  if (sesData) {
    render('seja/transkript', {
      activeMenu: 'session',
      pageTitle: `${i18n('titles.session')} - ${i18n('titles.transcript')}`,
      activeTab: 'transkript',
      ...sesData,
      page: req.query.page || 1,
    });
  } else {
    next();
  }
}));

router.get(`/:id(\\d+)/${sm.session.vote}/:motionId(\\d+)`, ar(async (render, req, res, next) => {
  const sesData = await getNewData(req.params.id);
  if (sesData) {
    const motionId = Number(req.params.motionId);
    const isValid = await isMotionValid(sesData.session.id, motionId);
    if (isValid) {
      render('seja/glasovanje', {
        activeMenu: 'session',
        pageTitle: `${i18n('titles.session')} - ${i18n('titles.voting')}`,
        activeTab: 'glasovanje',
        ...sesData,
        motionId,
      });
    } else {
      next();
    }
  } else {
    next();
  }
}));

module.exports = router;
