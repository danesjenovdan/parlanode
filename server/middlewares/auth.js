const mongoose = require('mongoose');


module.exports = (req, res, next)=>{

  const TokenModel = mongoose.model('Token');
  const token = req.headers.authorization;

  TokenModel.findOne({'value':token})
    .then((doc)=>{

      if(!doc){
        next('Failed');
      }else{
        req.account = doc;
        next();
      }

    })
    .catch((err)=>{
      next('Not allowed');
    });

};