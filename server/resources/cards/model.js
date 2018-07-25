const mongoose = require('mongoose');

const CardRender = mongoose.Schema({
  dateTime: { type: Date, default: Date.now },
  dataUrl: { type: String, required: true },
  html: String,
  card: String,
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
  lastAccessed: Date,
});

mongoose.model('CardRender', CardRender);

const CardBuild = mongoose.Schema({
  group: { type: String, index: true, required: true },
  method: { type: String, index: true, required: true },
  lastBuilt: { type: Date, required: true },
  language: { type: String, required: true },
  dataUrl: { type: String, required: true },
});

mongoose.model('CardBuild', CardBuild);
