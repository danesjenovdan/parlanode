import axios from 'axios';

function getSelected() {
  if (window.getSelection) {
    return window.getSelection();
  }
  if (document.getSelection) {
    return document.getSelection();
  }
  const selection = document.selection && document.selection.createRange();
  if (selection.text) {
    return selection;
  }
  return false;
}

let selectElement;

export default {
  beforeMount(el, binding) {
    const cardElement = el;
    const speechTextElement = cardElement.querySelector('.speech-text');
    const quoteElement = cardElement.querySelector('.everything .quote-button');
    const speechId = cardElement.getAttribute('id');

    speechTextElement.addEventListener('mousedown', (event) => {
      selectElement = event.currentTarget;
    });
    speechTextElement.addEventListener('mouseup', (event) => {
      event.preventDefault();
      const quoteButton = document.querySelector('.everything .quote-button');
      quoteButton.style.display = 'none';
      if (selectElement !== event.currentTarget) {
        return;
      }

      const selection = getSelected();

      if (selection && selection.toString().length > 0) {
        const parentOffsetTop = speechTextElement.getBoundingClientRect().top;
        const rectangle = selection.getRangeAt(0).getBoundingClientRect();
        const quoteIconOffset =
          rectangle.top - parentOffsetTop + rectangle.height / 2;

        quoteElement.dataset.text = selection.toString();
        quoteElement.style.top = `${quoteIconOffset}px`;
        quoteElement.style.display = 'block';
      } else {
        quoteElement.style.display = 'none';
      }
    });

    // This prevents deselection of text when clicking on quote icon
    quoteElement.addEventListener('mousedown', (event) => {
      event.preventDefault();
    });
    quoteElement.addEventListener('click', () => {
      const selectedText = quoteElement.dataset.text.trim();
      const allText = cardElement.querySelector('.mywords').value;
      const startIndex = allText.indexOf(selectedText);
      const endIndex = startIndex + selectedText.length;
      const { slugs } = binding.instance.$root;
      const url = `${slugs.urls.analize}/s/setQuote/${speechId}/${startIndex}/${endIndex}`;

      axios.get(url).then((response) => {
        window.open(
          `${slugs.urls.glej}/s/citat/${response.data.id}?frame=true`
        );
      });
    });
  },
};
