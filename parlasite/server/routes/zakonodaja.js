const express = require('express');
const data = require('../data');
const { asyncRender: ar } = require('../utils');
const { i18n } = require('../server');

const router = express.Router();

router.get('/', ar((render) => {
  render('zakonodaja', {
    activeMenu: 'legislation',
    pageTitle: i18n('menu.legislation'),
  });
}));

router.get('/*', ar((render, req, res, next) => {
  const epa = req.params[0];
  const lawData = data.laws.find(law => law.epa === epa);
  if (lawData) {
    render('zakonodaja/zakon', {
      activeMenu: 'legislations',
      pageTitle: i18n('titles.legislation'),
      lawData,
    });
  } else {
    next();
  }
}));

module.exports = router;
