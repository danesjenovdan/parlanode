export default (state) => {
  if (!state) {
    return () => false;
  }

  return (key, fullOptions) => {
    if (!Object.prototype.hasOwnProperty.call(state, key)) return false;

    if (fullOptions) {
      // Full options have been passed, so the value in the state should be
      // an array of IDs, which must be mapped, not returned directly.
      return fullOptions
        .map(option => ({
          ...option,
          selected: state[key].indexOf(option.id) > -1,
        }));
    }

    return state[key];
  };
};
