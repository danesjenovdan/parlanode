const express = require('express');
const data = require('../data');

const router = express.Router();

router.get('/', (req, res) => {
  res.render('zakonodaja', {
    activeMenu: 'zakonodaja',
    pageTitle: 'Zakonodaja',
  });
});

router.get('/*', (req, res, next) => {
  const epa = req.params[0];
  const lawData = data.laws.find(law => law.epa === epa);
  if (lawData) {
    res.render('zakonodaja/zakon', {
      activeMenu: 'zakonodaja',
      pageTitle: 'Zakonodaja',
      lawData,
    });
  } else {
    next();
  }
});

module.exports = router;
