<template>
  <card-wrapper
    :id="$options.cardData.cardData._id"
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

    <div v-if="count > 0" class="multiple-speeches">
      <pagination
        v-if="count > perPage"
        :page="page"
        :count="count"
        :per-page="perPage"
        @change="onPageChange"
      />
      <div v-if="fetching" class="nalagalnik"></div>
      <speech
        v-quotable
        v-for="speech in speeches"
        :key="speech.results.speech_id"
        :speech="speech"
        :per-page="perPage"
      />
      <pagination
        v-if="!fetching && count > perPage"
        :page="page"
        :count="count"
        :per-page="perPage"
        @change="onPageChange"
      />
    </div>
    <div v-t="'session-processing'" v-else class="empty-dataset"></div>
  </card-wrapper>
</template>

<script>
import links from 'mixins/links';
import common from 'mixins/common';
import { sessionHeader } from 'mixins/altHeaders';
import { sessionOgImage } from 'mixins/ogImages';
import { SPEECHES_PER_PAGE } from 'components/constants';
import Speech from 'components/Speech.vue';
import LoadLink from 'components/LoadLink.vue';
import Pagination from 'components/Pagination.vue';

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
    Pagination,
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
          const slugs = vnode.componentInstance.$root.slugs;
          const url = `${slugs.urls.analize}/s/setQuote/${speechId}/${startIndex}/${endIndex}`;

          $.ajax({
            url,
            async: false,
            dataType: 'json',
            success: result => window.open(`${slugs.urls.glej}/s/citat/${result.id}?frame=true`),
          });
        });
    },
  },
  mixins: [
    links,
    common,
    sessionHeader,
    sessionOgImage,
  ],
  data() {
    const data = this.$options.cardData.data;

    const state = this.$options.cardData.parlaState;
    let page = (state && state.page) || Number(data.page);
    page = Math.min(Math.max(page, 0), data.pages);

    const speechesPerPage = Array(data.pages);
    speechesPerPage[data.page - 1] = data.results;

    return {
      data,
      speechesPerPage,
      count: data.count,
      perPage: data.per_page || SPEECHES_PER_PAGE,
      page,
      fetching: false,
    };
  },
  computed: {
    speeches() {
      return this.speechesPerPage[this.page - 1] || [];
    },
    generatedCardUrl() {
      return `${this.url}${this.data.session.id}?altHeader=true`;
    },
  },
  mounted() {
    document.body.style.overflowAnchor = 'none';

    if (this.page !== Number(this.data.page)) {
      this.onPageChange(this.page);
    }
  },
  created() {
    this.$options.cardData.template.contextUrl = this.getSessionTranscriptLink(this.data.session);
  },
  methods: {
    onPageChange(newPage) {
      if (this.fetching) {
        return;
      }
      this.page = newPage;
      this.scrollToTop();
      if (!this.speechesPerPage[newPage - 1]) {
        this.fetching = true;
        $.get(`${this.slugs.urls.analize}/s/getSpeechesOfSession/${this.data.session.id}?page=${newPage}`, (response) => {
          this.$set(this.speechesPerPage, newPage - 1, response.results);
          this.fetching = false;

          // needed if dynamically loaded to reset the css :target and scroll to selected element
          this.$nextTick(() => {
            const target = document.getElementById(window.location.hash.slice(1));
            if (target) {
              const tmp = window.location.hash;
              window.location.hash = '';
              window.location.hash = tmp;
            }
          });
        });
      }
    },
    scrollToTop() {
      const { _id: id } = this.$options.cardData.cardData;
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView();
      }
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
  color: $font-placeholder;
}

.multiple-speeches /deep/ .speech-holder {
  border-top: 1px solid $background;

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
    background: $background;
  }
}

.nalagalnik {
  height: 51px;
  background-size: 38px;
}
</style>
