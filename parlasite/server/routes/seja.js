const express = require('express');
const fetch = require('node-fetch');
const data = require('../data');
const { asyncRender: ar } = require('../utils');
const { siteMap: sm } = require('../../config');
const { i18n } = require('../server');

const router = express.Router();

// TODO: is there a way to preload this?
async function isMotionValid(sessionId, motionId) {
  const res = await fetch(`${data.urls.urls.analize}/s/getMotionOfSession/${sessionId}`);
  const json = await res.json();
  return json.results.findIndex(m => m.results.motion_id === motionId) !== -1;
}

function getData(idParam) {
  const id = Number(idParam);
  const session = id && data.sessions.find(s => s.id === id);
  return (id && session) ? { session } : null;
}

router.get(['/:id(\\d+)', `/:id(\\d+)/${sm.session.legislation}`], ar((render, req, res, next) => {
  const sesData = getData(req.params.id);
  if (sesData) {
    render('seja/zakonodaja', {
      activeMenu: 'session',
      pageTitle: `${i18n('titles.session')} - ${i18n('titles.legislation')}`,
      activeTab: 'zakonodaja',
      ...sesData,
    });
  } else {
    next();
  }
}));

router.get(`/:id(\\d+)/${sm.session.otherVotings}`, ar((render, req, res, next) => {
  const sesData = getData(req.params.id);
  if (sesData) {
    render('seja/druga-glasovanja', {
      activeMenu: 'session',
      pageTitle: `${i18n('titles.session')} - ${i18n('titles.other-votings')}`,
      activeTab: 'druga-glasovanja',
      ...sesData,
    });
  } else {
    next();
  }
}));

router.get(`/:id(\\d+)/${sm.session.agenda}`, ar((render, req, res, next) => {
  const sesData = getData(req.params.id);
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

router.get([`/:id(\\d+)/${sm.session.transcript}`, `/:id(\\d+)/${sm.session.transcript}/:transcriptPage(\\d+)`], ar((render, req, res, next) => {
  const sesData = getData(req.params.id);
  if (sesData) {
    render('seja/transkript', {
      activeMenu: 'session',
      pageTitle: `${i18n('titles.session')} - ${i18n('titles.transcript')}`,
      activeTab: 'transkript',
      ...sesData,
      transcriptPage: req.params.transcriptPage || 1,
    });
  } else {
    next();
  }
}));

router.get(`/:id(\\d+)/${sm.session.vote}/:motionId(\\d+)`, ar((render, req, res, next) => {
  const sesData = getData(req.params.id);
  if (sesData) {
    const motionId = Number(req.params.motionId);
    isMotionValid(sesData.session.id, motionId)
      .then((isValid) => {
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
      })
      .catch((error) => {
        next(error);
      });
  } else {
    next();
  }
}));

module.exports = router;
