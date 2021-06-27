const express = require('express');
const data = require('../data');
const config = require('../../config');

const router = express.Router();

router.get('/sitemap', (req, res) => {
  res.json(config.siteMap);
});

// router.get('/data/refetch', (req, res) => {
//   Promise.resolve()
//     .then(() => data.refetch())
//     .then((error) => {
//       if (!error) {
//         res.json({
//           ok: true,
//           message: 'Finished refetch',
//         });
//       } else {
//         res.json({
//           ok: false,
//           message: 'Failed refetch',
//           error,
//         });
//       }
//     });
// });

module.exports = router;
