const path = require('path');
const fs = require('fs-extra');
const controller = require('./controller');

module.exports = (app) => {
  app.get('/og-image/:name/', controller.render);

  app.get(['/og/page/', '/og/page/:file'], (req, res) => {
    const filePath = path.resolve('./views/og/page/' + req.params.file);
    if (fs.existsSync(filePath)) {
      res.send(fs.readFileSync(filePath, 'utf-8'));
    } else {
      res.send(fs.readdirSync('./views/og/page/').map(e=>{
        return `<a href="/og/page/${e}">${e}</a>`;
      }).join('<br>'));
    }
  });
  app.get('/og/:file', (req, res) => {
    const filePath = path.resolve('./views/og/' + req.params.file);
    if (fs.existsSync(filePath)) {
      res.send(fs.readFileSync(filePath, 'utf-8'));
    } else {
      res.send(fs.readdirSync('./views/og/').map(e=>{
        return `<a href="/og/${e}">${e}</a>`;
      }).join('<br>'));
    }
  });
};
