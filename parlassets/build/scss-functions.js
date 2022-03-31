const sass = require('sass');
const path = require('path');
const fs = require('fs');

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
    return sass.SassString('');
  },
  'fs-readFile($filePath)': (args) => {
    const filePath = args[0].assertString('filePath').text;
    const resolvedPath = path.resolve(path.join('public', filePath));
    try {
      return sass.SassString(fs.readFileSync(resolvedPath, 'utf-8'));
    } catch (error) {
      return sass.SassString(String(error));
    }
  },
  'encode-svg($svg)': (args) => {
    const svg = args[0].assertString('svg').text;
    return sass.SassString(`data:image/svg+xml,${encodeSVGforCSS(svg)}`);
  },
  'str-replace($str, $find: "", $replace: "")': (args) => {
    const str = args[0].assertString('str').text;
    const find = args[1].assertString('find').text;
    const replace = args[2].assertString('replace').text;
    return sass.SassString(str.replaceAll(find, replace));
  },
};
