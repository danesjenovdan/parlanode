const SI = {
  decimal: ',',
  thousands: ' ',
  grouping: [3],
  currency: ['EUR', ''],
  dateTime: '%d. %m. %Y %H:%M',
  date: '%d. %B %Y',
  time: '%H:%M:%S',
  periods: ['AM', 'PM'],
  days: ['nedelja', 'ponedeljek', 'torek', 'sreda', 'četrtek', 'petek', 'sobota'],
  shortDays: ['ned', 'pon', 'tor', 'sre', 'čet', 'pet', 'sob'],
  months: ['januar', 'februar', 'marec', 'april', 'maj', 'junij', 'julij', 'avgust', 'september', 'oktober', 'november', 'december'],
  shortMonths: ['jan', 'feb', 'mar', 'apr', 'maj', 'jun', 'jul', 'avg', 'sep', 'okt', 'nov', 'dec'],
};

const US = {
  decimal: '.',
  thousands: ',',
  grouping: [3],
  currency: ['$', ''],
  dateTime: '%a %b %e %X %Y',
  date: '%m/%d/%Y',
  time: '%H:%M:%S',
  periods: ['AM', 'PM'],
  days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  shortDays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  shortMonths: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
};

export default function getD3Locale(lang) {
  if (lang === 'sl') {
    return SI;
  }
  return US;
}
