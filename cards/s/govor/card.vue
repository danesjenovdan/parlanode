<template>
  <card-wrapper
    :id="$options.cardData.mountId"
    :card-url="generatedCardUrl"
    :header-config="headerConfig"
    :og-config="ogConfig"
  >
    <div slot="info">
      <i18n path="info.text" tag="p" class="info-text">
        <a
          v-t="'info.link.text'"
          :href="$t('info.link.link')"
          place="link"
          class="funblue-light-hover"
          target="_blank"
        />
      </i18n>
    </div>

    <speech v-quotable :speech="data" show-session />
  </card-wrapper>
</template>

<script>
import links from '@/_mixins/links';
import common from '@/_mixins/common';
import { memberTitle } from '@/_mixins/titles';
import { sessionHeader } from '@/_mixins/altHeaders';
import { sessionOgImage } from '@/_mixins/ogImages';
import Speech from '@/_components/Speech.vue';

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
  name: 'Govori',
  components: {
    Speech,
  },
  directives: {
    quotable(elem, binding, vnode) {
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
          if (selectElement !== event.currentTarget) {
            return;
          }

          const selection = getSelected();

          if (selection && selection.toString().length > 0) {
            const parentOffsetTop = speechTextElement
              .get(0)
              .getBoundingClientRect().top;
            const rectangle = selection.getRangeAt(0).getBoundingClientRect();
            const quoteIconOffset =
              rectangle.top - parentOffsetTop + rectangle.height / 2;

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
        .on('mousedown', (event) => event.preventDefault())
        .on('click', () => {
          const selectedText = quoteElement.data().text.trim();
          const allText = cardElement.find('.mywords').val();
          const startIndex = allText.indexOf(selectedText);
          const endIndex = startIndex + selectedText.length;
          const { slugs } = vnode.componentInstance.$root;
          const url = `${slugs.urls.analize}/s/setQuote/${speechId}/${startIndex}/${endIndex}`;

          $.ajax({
            url,
            async: false,
            dataType: 'json',
            success: (result) =>
              window.open(`${slugs.urls.glej}/s/citat/${result.id}?frame=true`),
          });
        });
    },
  },
  mixins: [common, links, memberTitle, sessionHeader, sessionOgImage],
  data() {
    return {
      data: this.$options.cardData.data,
    };
  },
  computed: {
    generatedCardUrl() {
      return `${this.url}${this.$options.cardData.data.results.speech_id}?altHeader=true`;
    },
  },
  created() {
    this.$options.cardData.template.contextUrl = this.getSessionSpeechLink(
      this.data.results
    );
  },
};
</script>

<style lang="scss" scoped>
* ::v-deep .card-header {
  display: none;
}
* ::v-deep .card-back-content {
  margin-top: 20px;
}
</style>
