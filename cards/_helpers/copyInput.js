export default (inputElement) => {
  inputElement.select();
  let succeeded = false;
  try {
    succeeded = document.execCommand('copy');
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log('copy to clipboard failed', e);
    return false;
  }
  inputElement.blur();
  return succeeded;
};
