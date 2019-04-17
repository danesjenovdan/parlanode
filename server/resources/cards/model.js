const mongoose = require('mongoose');

const CardRender = mongoose.Schema({
  dateTime: { type: Date, default: Date.now },
  dataUrl: String,
  dataUrls: Array, // THIS WAS ADDED TO ALLOW MULTIPLE URLS
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
  dateRequested: String,
  dateRendered: String,
  cardLastUpdate: Date,
  state: String,
  lastAccessed: Date,
});

mongoose.model('CardRender', CardRender);

const CardBuild = mongoose.Schema({
  group: { type: String, index: true, required: true },
  method: { type: String, index: true, required: true },
  lastBuilt: { type: Date, required: true },
  language: { type: String, required: true },
  dataUrl: String,
  dataUrls: Array, // THIS WAS ADDED TO ALLOW MULTIPLE URLS
});

mongoose.model('CardBuild', CardBuild);
