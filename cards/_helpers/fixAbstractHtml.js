export default (html) => {
  if (html) {
    return html
      .replace(/<font.*?>/gi, '<font>')
      .replace(/style=.*?>/gi, '>')
      .replace(/<p>&nbsp;<\/p>/gi, '');
  }
  return '';
};
