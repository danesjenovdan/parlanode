const express = require('express');
const fetch = require('node-fetch');
const data = require('../data');
const { asyncRender: ar } = require('../utils');
const { siteMap: sm } = require('../../config');

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
      activeMenu: 'sessions',
      pageTitle: 'Seja - Zakonodaja',
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
      activeMenu: 'sessions',
      pageTitle: 'Seja - Druga glasovanja',
      activeTab: 'druga-glasovanja',
      ...sesData,
    });
  } else {
    next();
  }
}));

router.get(`/:id(\\d+)/${sm.session.transcript}`, ar((render, req, res, next) => {
  const sesData = getData(req.params.id);
  if (sesData) {
    render('seja/transkript', {
      activeMenu: 'sessions',
      pageTitle: 'Seja - Transkript',
      activeTab: 'transkript',
      ...sesData,
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
            activeMenu: 'sessions',
            pageTitle: 'Seja - Glasovanje',
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
