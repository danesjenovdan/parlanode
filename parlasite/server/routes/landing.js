const express = require('express');
const { asyncRender: ar } = require('../utils');
const { siteMap: sm } = require('../../config');

const router = express.Router();

/**
 * TOP NAVIGATION
 */

router.get('/', ar((render, req) => {
  render('landing', {
    activeMenu: 'landing',
    pageTitle: 'Parlameter',
    query: req.query.q,
  });
}));

// get /zakonodaja -> routes/zakonodaja.js

// get /seje -> routes/seje.js

router.get(`/${sm.landing.members}`, ar((render) => {
  render('landing/poslanci', {
    activeMenu: 'mps',
    pageTitle: 'Seznam poslancev',
  });
}));

router.get(`/${sm.landing.parties}`, ar((render) => {
  render('landing/poslanske-skupine', {
    activeMenu: 'pgs',
    pageTitle: 'Seznam poslanskih skupin',
  });
}));

// get /orodja -> routes/orodja.js

/**
 * ABOUT PAGES
 */

router.get(`/${sm.landing.about}`, ar((render) => {
  render('landing/o-projektu', {
    activeMenu: 'landing',
    pageTitle: 'O projektu',
  });
}));

router.get(`/${sm.landing.media}`, ar((render) => {
  render('landing/za-medije', {
    activeMenu: 'landing',
    pageTitle: 'Za medije',
  });
}));

router.get(`/${sm.landing.legal}`, ar((render) => {
  render('landing/pravno-obvestilo', {
    activeMenu: 'landing',
    pageTitle: 'Pravno obvestilo',
  });
}));

module.exports = router;
