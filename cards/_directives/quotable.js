import axios from 'axios';

const getSelectionRange = (containerElement) => {
  const selection = window.getSelection();
  if (selection && !selection.isCollapsed) {
    if (
      selection.anchorNode === selection.focusNode &&
      containerElement.contains(selection.anchorNode)
    ) {
      return selection.getRangeAt(0);
    }
  }
  return null;
};

export default {
  beforeMount(el, binding) {
    const speechTextElement = el.querySelector('.speech-text');
    const quoteButton = el.querySelector('.everything .quote-button');
    const speechId = Number(el.getAttribute('id'));

    // Click outside hides quote button
    let mouseDownWasOutside = false;
    const isOutside = (targetElement) => {
      return !el.contains(targetElement) && el !== targetElement;
    };
    const onMouseDown = (e) => {
      mouseDownWasOutside = isOutside(e.target);
    };
    const onClick = (e) => {
      if (mouseDownWasOutside && isOutside(e.target)) {
        quoteButton.style.display = 'none';
      }
    };
    el.vcoq_onMouseDown = onMouseDown;
    el.vcoq_onClick = onClick;
    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('click', onClick);
    // End click outside

    el.addEventListener('mouseup', (event) => {
      // Prevent deselection when clicking on selected text
      event.preventDefault();

      const selectionRange = getSelectionRange(speechTextElement);
      if (selectionRange) {
        const textRect = speechTextElement.getBoundingClientRect();
        const selectionRect = selectionRange.getBoundingClientRect();
        const selectionOffset = selectionRect.top - textRect.top;
        const quoteIconOffset = selectionOffset + selectionRect.height / 2;
        quoteButton.style.top = `${quoteIconOffset}px`;
        quoteButton.style.display = 'block';
      } else {
        quoteButton.style.display = 'none';
      }
    });

    quoteButton.addEventListener('mousedown', (event) => {
      // Prevent deselection when clicking on quote button
      event.preventDefault();
    });

    quoteButton.addEventListener('click', () => {
      const selectionRange = getSelectionRange(speechTextElement);
      if (selectionRange) {
        const allText = el.querySelector('.mywords').value;
        const selectedText = allText.slice(
          selectionRange.startOffset,
          selectionRange.endOffset
        );
        const { urls } = binding.instance.$root;
        const { locale } = binding.instance.$i18n;
        const url = `${urls.data}/cards/speech/quote/`;
        axios
          .post(url, {
            speech: speechId,
            start_index: selectionRange.startOffset,
            end_index: selectionRange.endOffset,
            quote_content: selectedText,
          })
          .then((response) => {
            window.open(
              `${urls.cards}/speech/quote/?id=${response.data.id}&locale=${locale}&template=share`
            );
          });
      }
    });
  },
  unmounted(el) {
    document.removeEventListener('mousedown', el.vcoq_onMouseDown);
    document.removeEventListener('click', el.vcoq_onClick);
    el.vcoq_onMouseDown = undefined;
    el.vcoq_onClick = undefined;
  },
};
