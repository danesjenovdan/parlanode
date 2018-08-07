const express = require('express');
const { asyncRender: ar } = require('../utils');
const { siteMap: sm } = require('../../config');

const router = express.Router();

/**
 * TOP NAVIGATION
 */

router.get('/', ar((render) => {
  render('landing', {
    activeMenu: 'landing',
    pageTitle: 'Parlameter',
  });
}));

// get /zakonodaja -> routes/zakonodaja.js

// get /seje -> routes/seje.js

router.get(`/${sm.landing.members}`, ar((render) => {
  render('landing/poslanci', {
    activeMenu: 'poslanci',
    pageTitle: 'Seznam poslancev',
  });
}));

router.get(`/${sm.landing.parties}`, ar((render) => {
  render('landing/poslanske-skupine', {
    activeMenu: 'poslanske-skupine',
    pageTitle: 'Seznam poslanskih skupin',
  });
}));

// get /orodja -> routes/orodja.js

/**
 * ABOUT PAGES
 */

router.get(`/${sm.landing.about}`, (req, res) => {
  res.render('landing/o-projektu', {
    activeMenu: 'landing',
    pageTitle: 'O projektu',
  });
});

router.get(`/${sm.landing.media}`, (req, res) => {
  res.render('landing/za-medije', {
    activeMenu: 'landing',
    pageTitle: 'Za medije',
  });
});

router.get(`/${sm.landing.legal}`, (req, res) => {
  res.render('landing/pravno-obvestilo', {
    activeMenu: 'landing',
    pageTitle: 'Pravno obvestilo',
  });
});

module.exports = router;
