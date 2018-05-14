<template>
  <card-wrapper
    :id="$options.cardData.cardData._id"
    :card-url="generatedCardUrl"
    :header-config="headerConfig"
  >
    <div slot="info">
      <p class="info-text">
        Transkript seje, ki je v obliki HTML dokumenta objavljen na spletnem mestu <a href="http://www.dz-rs.si" target="_blank" class="funblue-light-hover">DZ RS</a>, strojno razbijemo na posamezne govorne nastope in jih v izvornem vrstnem redu združimo v kartico transkript.
      </p>
    </div>

    <div v-if="speeches.length" class="multiple-speeches">
      <speech v-for="speech in speeches" :key="speech.results.speech_id" :speech="speech" v-quotable />
    </div>
    <div v-else class="empty-dataset">Seja v obdelavi.</div>
  </card-wrapper>
</template>

<script>
import common from 'mixins/common';
import Speech from 'components/Speech.vue';

function getSelected() {
  if (window.getSelection) {
    return window.getSelection();
  } else if (document.getSelection) {
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
  mixins: [common],
  name: 'Govori',
  data() {
    const sessionName = this.$options.cardData.data.session.name;
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
        heading: this.$options.cardData.data.session.name,
        subheading: this.$options.cardData.data.session.date,
        alternative: this.$options.cardData.cardData.altHeader === 'true',
        title: this.$options.cardData.cardData.name,
      },
    };
  },
  computed: {
    speeches() {
      if (this.data.results && this.data.results.length) {
        return this.data.results;
      }
      return [];
    },
    generatedCardUrl() {
      return `${this.url}${this.$options.cardData.data.session.id}?altHeader=true`;
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
          const url = `https://analize.parlameter.si/v1/s/setQuote/${speechId}/${startIndex}/${endIndex}`;

          $.ajax({
            url,
            async: false,
            dataType: 'json',
            success: result => window.open(`https://glej.parlameter.si/s/citat/${result.id}?frame=true`),
          });
        });
    },
  },
};
</script>

<style lang="scss" scoped>
@import '~parlassets/scss/breakpoints';
@import '~parlassets/scss/colors';

.empty-dataset {
  font-size: 16px;
  line-height: 20px;
  margin: 70px 0;
  text-align: center;
  color: $grey-medium;
}

$lightest-blue: #e9eff2;

.multiple-speeches /deep/ .speech-holder {
  border-top: 1px solid #f0f0f0;

  @include respond-to(desktop) {
    padding-bottom: 20px;
    padding-top: 20px;
  }

  .person-session {
    height: 64px;

    @include respond-to(desktop) {
      height: auto;
    }
  }

  &:target {
    background: $lightest-blue;
  }
}
</style>
