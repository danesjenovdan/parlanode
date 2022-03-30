import { differenceInCalendarYears, parseISO } from 'date-fns';

export default (date) => {
  if (!date) {
    return 0;
  }
  return differenceInCalendarYears(new Date(), parseISO(date));
};
