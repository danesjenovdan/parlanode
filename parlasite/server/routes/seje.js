const express = require('express');
const { asyncRender: ar } = require('../utils');
const { siteMap: sm } = require('../../config');

const router = express.Router();

router.get('/', ar((render) => {
  render('seje', {
    activeMenu: 'sessions',
    pageTitle: 'Seznam sej',
  });
}));

router.get(`/${sm.sessions.search.base}`, ar((render, req) => {
  render('seje/isci', {
    activeMenu: 'sessions',
    pageTitle: 'Išči seje',
    query: req.query.q,
  });
}));

router.get(`/${sm.sessions.search.base}/${sm.sessions.search.filter}`, ar((render, req) => {
  render('seje/isci/filter', {
    activeMenu: 'sessions',
    pageTitle: 'Išči seje',
    query: req.query.q,
    queryObj: req.query, // TODO: remove this when fixing seje/isci/filter.ejs
  });
}));

module.exports = router;
