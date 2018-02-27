const express = require('express');
const app     = express();
const config  = require('./config');
const bodyParser = require('body-parser');

app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.use(express.static('public'));


var ops = require('./services/data-service').ops;
app.locals.ops = ops;

var mpsops = require('./services/data-service').mpsops;
app.locals.mpsops = mpsops;

var mpsopsurls = require('./services/data-service').mpsopsurls;
app.locals.mpsopsurls = mpsopsurls;


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