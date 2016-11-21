const express = require('express');
const app     = express();
const config  = require('./config');
const bodyParser = require('body-parser');

app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.use(express.static('public'));


var mpsops = require('./static/data/mpsops');

app.locals.mpsops = mpsops;


app.use(function(error, req, res, next) {
  res.status(500);
  res.render('error/500', {title:'500: Internal Server Error', error: error, activeMenu: ""});
});

exports.start = ()=> {

  return new Promise((resolve, reject)=>{

    app.listen(config.PORT, () => {

      resolve(app);

    });

  });

};

exports.app = app;