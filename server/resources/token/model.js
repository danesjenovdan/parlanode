const mongoose = require('mongoose');

const schema = mongoose.Schema({

  dateCreated : { type : Date, default : Date.now },
  value       : { type : String },
  dateExpires : {
    type : Date, default : () => {
      return +Date.now() + 1000 * 60 * 60 * 24 * 14
    }
  },
  email       : String

});

mongoose.model('Token', schema);