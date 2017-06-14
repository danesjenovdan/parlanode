const mongoose = require('mongoose');

const configSchema = mongoose.Schema({
  password    : String,
  email       : String,
  dateCreated : { type : Date, default : Date.now }
});

mongoose.model('Config', configSchema);