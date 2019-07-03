export default (html) => {
  if (html) {
    return html
      .replace(/<font.*?>/gi, '<font>')
      .replace(/\s?id="[^"]*?"/gi, '')
      .replace(/\s?style="[^"]*?"/gi, '')
      .replace(/<p[^>]*?><\/p>/gi, '')
      .replace(/<p[^>]*?>\s*<br>\s*<\/p>/gi, '')
      .replace(/<p[^>]*?>\s*&nbsp;\s*<\/p>/gi, '');
  }
  return '';
};
