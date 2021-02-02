const mongoose = require('mongoose');

const CardRender = mongoose.Schema({
  dateTime: { type: Date, index: true, default: Date.now },
  dataUrl: String,
  dataUrls: Array, // THIS WAS ADDED TO ALLOW MULTIPLE URLS
  html: String,
  card: String,
  cardUrl: String,
  group: { type: String, index: true, required: true },
  method: { type: String, index: true, required: true },
  embed: { type: Boolean, index: true },
  frame: { type: Boolean, index: true },
  altHeader: { type: Boolean, index: true },
  customUrl: { type: String, index: true },
  id: { type: String, index: true },
  dateRequested: { type: String, index: true },
  dateRendered: { type: String, index: true },
  cardLastUpdate: Date,
  state: { type: String, index: true },
  language: { type: String, index: true },
  lastAccessed: { type: Date, index: true, default: Date.now },
}, {
  capped: 200000 * 500, // average size of render times 500 items
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
