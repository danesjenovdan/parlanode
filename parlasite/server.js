const express = require('express');
const app     = express();
const config  = require('./config');
const bodyParser = require('body-parser');

app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

exports.start = ()=> {

  return new Promise((resolve, reject)=>{

    app.listen(config.PORT, () => {

      resolve(app);

    });

  });

};

exports.app = app;