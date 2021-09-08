export default (
  number,
  { precision = 0, percent = false, locale = 'sl' } = {}
) => {
  // shows "< 0.01" if number is very small like "0.0001245"
  let prefix = '';
  const minValueAboveZero = 10 ** -precision;
  if (number > 0 && number < minValueAboveZero) {
    number = minValueAboveZero;
    prefix = '< ';
  }

  // formatter needs 0-1 for percentages, but we always supply whole number
  if (percent) {
    number /= 100;
  }

  const lang = (locale || '').split('-')[0];
  const formatter = new Intl.NumberFormat(lang, {
    style: percent ? 'percent' : 'decimal',
    minimumFractionDigits: precision,
    maximumFractionDigits: precision,
    useGrouping: false, // don't use thounsands separator
  });

  return `${prefix}${formatter.format(number)}`;
};
