// TODO: deduplicate with stringifyParams from parlasite
export default (params) => {
  if (Object.keys(params).length > 0) {
    const query = Object.keys(params)
      .filter((key) => params[key] != null) // maybe params[key] is undefined
      .map((key) => {
        const val =
          typeof params[key] === 'object'
            ? JSON.stringify(params[key])
            : String(params[key]);
        return `${key}=${encodeURIComponent(val)}`;
      })
      .join('&');
    return `?${query}`;
  }
  return '';
};
