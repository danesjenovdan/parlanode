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
  const mps = req.query.mps ? req.query.mps.split(',').map(Number).filter(Boolean) : undefined;
  const pgs = req.query.pgs ? req.query.pgs.split(',').map(Number).filter(Boolean) : undefined;
  render('seje/isci', {
    activeMenu: 'sessions',
    pageTitle: 'Išči seje',
    query: req.query.q,
    mps,
    pgs,
  });
}));

module.exports = router;
