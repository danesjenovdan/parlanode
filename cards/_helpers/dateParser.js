export default (stringDate) => {
  const dateParts = stringDate
    .split('.')
    .map((p) => Number(p.trim()))
    .reverse();
  return new Date(Date.UTC(dateParts[0], dateParts[1] - 1, dateParts[2]));
};
