var dev = {

  PORT:3060,
  CARD_RENDERER_API_ROOT:'',
  CARD_RENDERER_SEARCH_API_ROOT:'',
  CARD_RENDERER_ANALYSIS_API_ROOT:'',
  OG_ROOT_URL:'', // where OG images are accessible online
  OG_CAPTURE_PATH:'' // where OG images are sotred

};

var production = {

  PORT:3060,
  CARD_RENDERER_API_ROOT:'',
  CARD_RENDERER_SEARCH_API_ROOT:'',
  CARD_RENDERER_ANALYSIS_API_ROOT:'',
  OG_ROOT_URL:'', // where OG images are accessible online
  OG_CAPTURE_PATH:'' // where OG images are sotred

};

var stage = {

  PORT:3060,
  CARD_RENDERER_API_ROOT:'',
  CARD_RENDERER_SEARCH_API_ROOT:'',
  CARD_RENDERER_ANALYSIS_API_ROOT:'',
  OG_ROOT_URL:'', // where OG images are accessible online
  OG_CAPTURE_PATH:'' // where OG images are sotred

};

module.exports = process.env.NODE_ENV === 'production' ? production : process.env.NODE_ENV === 'stage' ? stage  : dev;