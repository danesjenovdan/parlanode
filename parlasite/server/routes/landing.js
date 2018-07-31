const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
  res.render('landing', {
    activeMenu: 'landing',
    pageTitle: 'Parlameter',
    query: req.query.q,
  });
});

router.get('/o-projektu', (req, res) => {
  res.render('about/o-projektu', {
    activeMenu: 'landing',
    pageTitle: 'O projektu',
  });
});

router.get('/za-medije', (req, res) => {
  res.render('about/za-medije', {
    activeMenu: 'landing',
    pageTitle: 'Za medije',
  });
});

router.get('/pravno-obvestilo', (req, res) => {
  res.render('about/pravno-obvestilo', {
    activeMenu: 'landing',
    pageTitle: 'Pravno obvestilo',
  });
});

module.exports = router;
