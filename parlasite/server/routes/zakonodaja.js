const express = require('express');
const data = require('../data');
const { asyncRender: ar } = require('../utils');

const router = express.Router();

router.get('/', ar((render) => {
  render('zakonodaja', {
    activeMenu: 'legislation',
    pageTitle: 'Zakonodaja',
  });
}));

router.get('/*', ar((render, req, res, next) => {
  const epa = req.params[0];
  const lawData = data.laws.find(law => law.epa === epa);
  if (lawData) {
    render('zakonodaja/zakon', {
      activeMenu: 'legislations',
      pageTitle: 'Zakonodaja',
      lawData,
    });
  } else {
    next();
  }
}));

module.exports = router;
