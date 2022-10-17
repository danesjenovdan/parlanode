function slovenianDate(isoDate) {
  if (!isoDate) {
    return 'Invalid Date';
  }
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) {
    return 'Invalid Date';
  }
  return `${date.getDate()}. ${date.getMonth() + 1}. ${date.getFullYear()}`;
}

const asyncRender = fn => (req, res, next) => {
  const render = (view, opts) => {
    const options = {
      ...opts,
      slovenianDate,
      fetchCard: fetchCard.bind({ req, res }),
      async: true,
    };
    res.render(view, options, (error, promise) => {
      if (error) {
        next(error);
      } else {
        promise
          .then(html => res.send(html))
          .catch(pError => next(pError));
      }
    });
  };
  try {
    const ret = fn(render, req, res, next);
    // if return value is a promise (also true with async functions)
    if (ret && ret.then && ret.catch) {
      // catch any async errors
      ret.catch(error => next(error));
    }
  } catch (error) {
    // catch any sync errors
    next(error);
  }
};


export {
  slovenianDate,
  asyncRender,
};
