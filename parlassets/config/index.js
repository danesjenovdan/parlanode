const isProd = process.env.NODE_ENV === 'production';

const PARLASSETS_URL = process.env.VITE_PARLASSETS_URL || 'https://parlassets-ljubljana.lb.djnd.si/'; // TODO
const PARLADATA_URL = process.env.VITE_PARLADATA_URL || 'https://parladata.lb.djnd.si/v3'; // TODO
const PARLACARDS_URL = process.env.VITE_PARLACARDS_URL || 'https://parlacards.lb.djnd.si'; // TODO
const PARLASITE_URL = process.env.VITE_PARLASITE_URL || 'https://parlasite.lb.djnd.si'; // TODO

const config = {
  urls: {
    cdn: isProd ? PARLASSETS_URL : 'http://localhost:8080',
    analize: PARLADATA_URL,
    data: PARLADATA_URL,
    isci: 'https://isci.parlameter.si', // TODO
    glej: PARLACARDS_URL,
    base: PARLASITE_URL,
  },
};

module.exports = config;
