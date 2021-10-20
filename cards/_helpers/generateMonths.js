import { range, flatten } from 'lodash-es';

export default (MONTH_NAMES, start) => {
  const startDate = new Date(start || '2010-01-01T00:00:00Z');
  const startYear = startDate.getFullYear();
  const startMonth = startDate.getMonth() + 1;

  const date = new Date();
  const currentYear = date.getFullYear();
  const currentMonth = date.getMonth() + 1;

  const allMonths = range(startYear, currentYear + 1).map((year) => {
    const startRange = year === startYear ? startMonth : 1;
    const endRange = year === currentYear ? currentMonth : 12;
    const months = range(startRange, endRange + 1);
    return months.map((month) => ({
      id: `${year}-${month}`,
      label: `${MONTH_NAMES[month - 1]} ${year}`,
      month,
      year,
      selected: false,
    }));
  });
  return flatten(allMonths).reverse();
};
