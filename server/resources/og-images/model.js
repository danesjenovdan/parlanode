const mongoose = require('mongoose');

const OgRender = mongoose.Schema({
  name: { type: String, index: true, required: true },
  updated: { type: Date, required: true },
  rendered: { type: Date, index: true, default: Date.now },
  accessed: { type: Date, index: true, default: Date.now },
  title: { type: String, index: true, default: '' },
  image: { type: String, index: true, default: '' },
  icon: { type: String, index: true, default: '' },
  acronym: { type: String, index: true, default: '' },
  h1: { type: String, index: true, default: '' },
  h2: { type: String, index: true, default: '' },
});

mongoose.model('OgRender', OgRender);

const OgBuild = mongoose.Schema({
  name: { type: String, index: true, required: true },
  updated: { type: Date, required: true },
  built: { type: Date, required: true },
});

mongoose.model('OgBuild', OgBuild);
