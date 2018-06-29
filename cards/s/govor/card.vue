<template>
  <card-wrapper
    :id="$options.cardData.cardData._id"
    :card-url="generatedCardUrl"
    :header-config="headerConfig"
  >
    <div slot="info">
      <i18n path="info.text" tag="p" class="info-text">
        <a
          place="link"
          class="funblue-light-hover"
          target="_blank"
          :href="$t('info.link.link')"
          v-t="'info.link.text'"
        />
      </i18n>
    </div>

    <speech :speech="data" v-quotable show-session />
  </card-wrapper>
</template>

<script>
import common from 'mixins/common';
import { memberTitle } from 'mixins/titles';
import Speech from 'components/Speech.vue';

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
  components: {
    Speech,
  },
  mixins: [
    common,
    memberTitle,
  ],
  name: 'Govori',
  data() {
    const sessionName = this.$options.cardData.data.results.session.name;
    let imageName = 'seja-redna';
    if (sessionName.indexOf('izredna') !== -1) {
      imageName = 'seja-izredna';
    } else if (sessionName.indexOf('nujna') !== -1) {
      imageName = 'seja-nujna';
    }
    return {
      data: this.$options.cardData.data,
      headerConfig: {
        mediaImage: imageName,
        heading: this.$options.cardData.data.results.session.name,
        subheading: this.$options.cardData.data.results.session.date,
        alternative: this.$options.cardData.cardData.altHeader === 'true',
        title: this.$options.cardData.cardData.name,
      },
    };
  },
  computed: {
    generatedCardUrl() {
      return `${this.url}${this.$options.cardData.data.results.speech_id}?altHeader=true`;
    },
  },
  directives: {
    quotable(elem) {
      const cardElement = $(elem);
      const speechTextElement = cardElement.find('.speech-text');
      const quoteElement = cardElement.find('.everything .quote-button');
      const speechId = cardElement.attr('id');

      speechTextElement
        .on('mousedown', (event) => {
          selectElement = event.currentTarget;
        })
        .on('mouseup', (event) => {
          event.preventDefault();
          $(document).find('.everything .quote-button').hide();
          if (selectElement !== event.currentTarget) return;

          const selection = getSelected();

          if (selection && selection.toString().length > 0) {
            const parentOffsetTop = speechTextElement.get(0).getBoundingClientRect().top;
            const rectangle = selection.getRangeAt(0).getBoundingClientRect();
            const quoteIconOffset = (rectangle.top - parentOffsetTop) + (rectangle.height / 2);

            quoteElement.data({ text: selection.toString() });
            quoteElement.css({
              top: `${quoteIconOffset}px`,
              display: 'block',
            });
          } else {
            quoteElement.css({ display: 'none' });
          }
        });

      // This prevents deselection of text when clicking on quote icon
      quoteElement
        .on('mousedown', event => event.preventDefault())
        .on('click', () => {
          const selectedText = quoteElement.data().text.trim();
          const allText = cardElement.find('.mywords').val();
          const startIndex = allText.indexOf(selectedText);
          const endIndex = startIndex + selectedText.length;
          const url = `${this.slugs.urls.analize}/s/setQuote/${speechId}/${startIndex}/${endIndex}`;

          $.ajax({
            url,
            async: false,
            dataType: 'json',
            success: result => window.open(`${this.slugs.urls.glej}/s/citat/${result.id}?frame=true`),
          });
        });
    },
  },
};
</script>

<style lang="scss" scoped>
* /deep/ .card-header {
  display: none;
}
* /deep/ .card-back-content {
  margin-top: 20px;
}
</style>
