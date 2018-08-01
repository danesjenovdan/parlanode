const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
  res.render('orodja', {
    activeMenu: 'orodja',
    pageTitle: 'Orodja',
  });
});

// router.get('/*', (req, res, next) => {
//   const epa = req.params[0];
//   const lawData = data.laws.find(law => law.epa === epa);
//   if (lawData) {
//     res.render('zakonodaja/zakon', {
//       activeMenu: 'zakonodaja',
//       pageTitle: 'Zakonodaja',
//       lawData,
//     });
//   } else {
//     next();
//   }
// });

module.exports = router;
