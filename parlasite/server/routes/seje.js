const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
  res.render('seje', {
    activeMenu: 'seje',
    pageTitle: 'Seznam sej',
  });
});

module.exports = router;
