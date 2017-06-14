const mongoose = require('mongoose');

const schema = mongoose.Schema({

  dateTime       : { type : Date, default : Date.now },
  dataUrl        : { type : String, required : true },
  html           : String,
  card           : { type : String, ref : 'Card' },
  cardUrl        : String,
  group          : { type : String, index : true, required : true },
  method         : { type : String, index : true, required : true },
  embed          : Boolean,
  frame          : Boolean,
  altHeader      : Boolean,
  customUrl      : String,
  id             : String,
  date           : String,
  cardLastUpdate : Date,
  state          : String,
  ogImageUrl     : String,
  imageLocalPath : String,
  imageUrl       : String

});

mongoose.model('CardRender', schema);