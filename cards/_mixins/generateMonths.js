import { range, flatten } from 'lodash';

export default {
  methods: {
    generateMonths(MONTH_NAMES) {
      const date = new Date();
      const currentYear = date.getFullYear();
      const currentMonth = date.getMonth() + 1;

      const allMonths = range(2013, currentYear + 1).map((year) => {
        const months = year === currentYear ? range(1, currentMonth + 1) : range(1, 13);
        return months.map(month => ({
          id: `${year}-${month}`,
          label: `${MONTH_NAMES[month - 1]} ${year}`,
          month,
          year,
          selected: false,
        }));
      });
      return flatten(allMonths).reverse();
    },
  },
};
