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

// TODO the ones for poslanec and
// poslanska skupina accept a slug
async function getNewData(id) {
  const response = await fetch(`${urls.parladata}/cards/session/single/?id=${id}`);
  // const response = await fetch('http://localhost:8000/v3/cards/session/single/?id=2');
  if (response.ok && response.status >= 200 && response.status < 400) {
    let data = await response.json();
    return {
      session: {
        ...data.results,
        id,
      }
    };
  }
  return false;
}

router.get(['/:id(\\d+)', `/:id(\\d+)/${sm.session.legislation}`], ar((render, req, res, next) => {
  const sesData = getNewData(req.params.id).then((sesData) => {
    console.log(sesData);
    if (sesData) {
      render('seja/druga-glasovanja', { // TODO this used to take you to zakonodaja
        activeMenu: 'session',
        pageTitle: `${i18n('titles.session')} - ${i18n('titles.other-votings')}`, // TODO this used to take you to zakonodaja (title.legislation)
        activeTab: 'druga-glasovanja', // TODO this used to take you to zakonodaja
        ...sesData,
      });
    } else {
      next();
    }
  });
}));

router.get(['/:id(\\d+)', `/:id(\\d+)/${sm.session.otherVotings}`], ar((render, req, res, next) => {
  const sesData = getNewData(req.params.id).then((sesData) => {
    console.log(sesData);
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
  });
}));

router.get(`/:id(\\d+)/${sm.session.agenda}`, ar((render, req, res, next) => {
  const sesData = getNewData(req.params.id).then((sesData) => {
    console.log(sesData);
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
  });
}));

router.get(['/:id(\\d+)', `/:id(\\d+)/${sm.session.transcript}`], ar((render, req, res, next) => {
  const sesData = getNewData(req.params.id).then((sesData) => {
    console.log(sesData);
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
  });
}));

router.get(`/:id(\\d+)/${sm.session.vote}/:motionId(\\d+)`, ar((render, req, res, next) => {
  console.log('hello');
  const sesData = getNewData(req.params.id).then((sesData) => {
    console.log(sesData);
    const motionId = Number(req.params.motionId);
    isMotionValid(sesData.session.id, motionId).then((isValid) => {
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
    }).catch((error) => {
      next(error);
    });
  });
}));

module.exports = router;
