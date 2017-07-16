export default (state) => {
  if (!state) {
    return () => false;
  }

  return (key, fullOptions) => {
    if (!Object.prototype.hasOwnProperty.call(state, key)) return false;

    if (Array.isArray(state[key])) {
      // The property in state is an array, so it must be an array of IDs
      if (!fullOptions) {
        throw Error('You must specify an array of full options in order to match IDs');
      }

      return fullOptions.map(option =>
        Object.assign({}, option, { selected: state[key].indexOf(option.id) > -1 }),
      );
    } else {
      // The property in state is not an array, so it's probably a primitive
      return state[key];
    }
  };
};
