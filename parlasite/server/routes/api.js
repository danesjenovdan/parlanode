const express = require('express');
const { i18n } = require('../server');

const router = express.Router();

router.get('/sitemap', (req, res) => {
  res.json(i18n.siteMap);
});

module.exports = router;
