import { differenceInCalendarYears, parseISO } from 'date-fns';

export default (date) => {
  if (!date) {
    return '';
  }
  return differenceInCalendarYears(new Date(), parseISO(date));
};
