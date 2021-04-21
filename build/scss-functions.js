import sass from 'sass';

export default {
  'get-parlassets-url()': () => {
    return new sass.types.String(process.env.VITE_PARLASSETS_URL ?? '');
  },
};
