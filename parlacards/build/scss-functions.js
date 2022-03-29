import sass from 'sass';

export default {
  'get-parlassets-url()': () => {
    return new sass.types.String(process.env.VITE_PARLASSETS_URL ?? '');
  },
  'fs-readFile($filePath)': () => {
    return new sass.types.String('');
  },
  'encode-svg($svg)': () => {
    return new sass.types.String('');
  },
  'str-replace($str, $find: "", $replace: "")': () => {
    return new sass.types.String('');
  },
};
