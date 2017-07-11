import { MONTH_NAMES } from 'components/constants';

export default () => {
  const allMonths = [];
  [2017, 2016, 2015, 2014, 2013].forEach((year) => {
    [12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1].forEach((month) => {
      allMonths.push({ id: `${year}-${month}`, label: `${MONTH_NAMES[month - 1]} ${year}`, month, year, selected: false });
    });
  });
  return allMonths;
};
