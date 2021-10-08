const SESSION_CLASSIFICATIONS = {
  unknown: {
    icon: 'seja-neznana',
  },
  regular: {
    icon: 'seja-redna',
  },
  irregular: {
    icon: 'seja-izredna',
  },
  correspondent: {
    icon: 'seja-na-daljavo',
  },
};

export default (classification) => {
  const key = classification || 'unknown';
  return SESSION_CLASSIFICATIONS[key] || SESSION_CLASSIFICATIONS.unknown;
};
