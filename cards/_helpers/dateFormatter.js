export default (isoDate) => {
  if (!isoDate) {
    return 'Invalid Date';
  }
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) {
    return 'Invalid Date';
  }
  return `${date.getDate()}. ${date.getMonth() + 1}. ${date.getFullYear()}`;
};
