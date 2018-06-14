const mongoose = require('mongoose');

const Card = mongoose.Schema({
  dateTimeCreated: { type: Date, default: Date.now },
  name: String,
  dataUrl: { type: String, required: true },
  sourceType: String,
  ejs: String,
  group: { type: String, index: true, required: true },
  method: { type: String, index: true, required: true },
  uniquePath: { type: String, required: true, unique: true },
  lastUpdate: { type: Date, default: Date.now },
  type: String,
  headerType: { type: String, default: 'poslanec' },
});

mongoose.model('Card', Card);

const CardRender = mongoose.Schema({
  dateTime: { type: Date, default: Date.now },
  dataUrl: { type: String, required: true },
  html: String,
  card: { type: String, ref: 'Card' },
  cardUrl: String,
  group: { type: String, index: true, required: true },
  method: { type: String, index: true, required: true },
  embed: Boolean,
  frame: Boolean,
  altHeader: Boolean,
  customUrl: String,
  id: String,
  date: String,
  cardLastUpdate: Date,
  state: String,
  ogImageUrl: String,
  imageLocalPath: String,
  imageUrl: String,
});

mongoose.model('CardRender', CardRender);
