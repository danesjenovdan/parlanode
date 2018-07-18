<template>
  <card-wrapper
    :id="$options.cardData.cardData._id"
    :card-url="generatedCardUrl"
    :header-config="headerConfig"
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

    <div v-if="speeches.length" class="multiple-speeches">
      <speech
        v-quotable
        v-for="speech in speeches"
        :key="speech.results.speech_id"
        :speech="speech"
      />
      <div v-if="!allLoaded" class="load-more-container">
        <load-link v-if="!fetching" :text="$t('load-more-speeches')" @click="fetchNextPage" />
        <div v-if="fetching" class="nalagalnik"></div>
      </div>
    </div>
    <div v-t="'session-processing'" v-else class="empty-dataset"></div>
  </card-wrapper>
</template>

<script>
import common from 'mixins/common';
import { sessionHeader } from 'mixins/altHeaders';
import Speech from 'components/Speech.vue';
import LoadLink from 'components/LoadLink.vue';

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
    LoadLink,
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
          if (selectElement !== event.currentTarget) {
            return;
          }

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
  mixins: [
    common,
    sessionHeader,
  ],
  data() {
    const data = this.$options.cardData.data;
    return {
      data,
      speeches: data.results || [],
      numFound: data.count || 0,
      page: 1,
      fetching: false,
    };
  },
  computed: {
    allLoaded() {
      return this.numFound <= this.speeches.length;
    },
    generatedCardUrl() {
      return `${this.url}${this.data.session.id}?altHeader=true`;
    },
  },
  mounted() {
    document.body.style.overflowAnchor = 'none';
  },
  methods: {
    fetchNextPage() {
      if (this.fetching) {
        return;
      }
      this.fetching = true;
      this.page += 1;
      $.get(`${this.slugs.urls.analize}/s/getSpeechesOfSession/${this.data.session.id}?page=${this.page}`, (response) => {
        this.speeches = this.speeches.concat(response.results);
        this.fetching = false;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import '~parlassets/scss/breakpoints';
@import '~parlassets/scss/colors';
@import '~parlassets/scss/color_classes';

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

.load-more-container {
  text-align: center;
  font-size: 18px;
  padding: 20px 0;

  .load {
    margin: 12px 0;
    @include link-hover;
  }

  .nalagalnik {
    height: 51px;
  }
}
</style>
