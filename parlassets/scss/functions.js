const _ = require('lodash');
const sass = require('node-sass');
const path = require('path');
const fs = require('fs');
const config = require('../config');

function encodeSVGforCSS(svgString) {
  return encodeURIComponent(String(svgString).replace(/"/g, "'"))
    .replace(/%[\dA-F]{2}/g, (match) => {
      switch (match) {
        case '%20': return ' ';
        case '%3D': return '=';
        case '%3A': return ':';
        case '%2F': return '/';
        default: return match.toLowerCase();
      }
    });
}

module.exports = {
  'get-parlassets-url()': () => {
    const value = _.get(config, ['urls', 'cdn']);
    if (typeof value === 'string') {
      return sass.types.String(value);
    }
    return sass.types.String(key.getValue());
    // TODO: return new sass.types.String(process.env.VITE_PARLASSETS_URL ?? '');
  },
  'fs-readFile($filePath)': (filePath) => {
    const resolvedPath = path.resolve(path.join('.', filePath.getValue()));
    try {
      return sass.types.String(fs.readFileSync(resolvedPath, 'utf-8'));
    } catch (error) {
      sass.types.String(String(error));
    }
  },
  'encode-svg($svg)': (svg) => {
    return sass.types.String(`"data:image/svg+xml,${encodeSVGforCSS(svg.getValue())}"`);
  },
  'str-replace($str, $find: "", $replace: "")': ($str, $find, $replace) => {
    return sass.types.String($str.getValue().split($find.getValue()).join($replace.getValue()));
  },
};
