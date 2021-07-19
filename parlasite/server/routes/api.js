const express = require('express');
const config = require('../../config');

const router = express.Router();

router.get('/sitemap', (req, res) => {
  res.json(config.siteMap);
});

module.exports = router;
