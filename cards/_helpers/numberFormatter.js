// TODO: replace all manual formats with this function
export default (number, precision = 0, percent = false) => {
  let formatted;
  const min = 10 ** -precision;
  if (number > 0 && number < min) {
    formatted = `< ${min.toFixed(precision).replace('.', ',')}`;
  } else {
    formatted = number.toFixed(precision).replace('.', ',');
  }
  if (percent) {
    formatted += ' %';
  }
  return formatted;
};
