const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
  res.render('seje', {
    activeMenu: 'seje',
    pageTitle: 'Seznam sej',
  });
});

router.get('/isci', (req, res) => {
  res.render('seje/isci', {
    activeMenu: 'seje',
    pageTitle: 'Išči seje',
    query: req.query.q,
  });
});

router.get('/isci/filter', (req, res) => {
  res.render('seje/isci/filter', {
    activeMenu: 'seje',
    pageTitle: 'Išči seje',
    query: req.query.q,
    queryObj: req.query, // TODO: remove this when fixing seje/isci/filter.ejs
  });
});

module.exports = router;
