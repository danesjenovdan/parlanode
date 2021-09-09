<template>
  <card-wrapper :header-config="headerConfig" :og-config="ogConfig" max-height>
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
        v-for="speech in speeches"
        :key="speech.id"
        v-quotable
        :speech="speech"
        :session="session"
      />
      <pagination
        v-if="!fetching && count > perPage"
        :page="page"
        :count="count"
        :per-page="perPage"
        @change="onPageChange"
      />
    </div>
  </card-wrapper>
</template>

<script>
import axios from 'axios';
import links from '@/_mixins/links.js';
import common from '@/_mixins/common.js';
import { sessionHeader } from '@/_mixins/altHeaders.js';
import { sessionOgImage } from '@/_mixins/ogImages.js';
import { SPEECHES_PER_PAGE } from '@/_helpers/constants.js';
import Speech from '@/_components/Speech.vue';
import Pagination from '@/_components/Pagination.vue';
import quotable from '@/_directives/quotable.js';

export default {
  name: 'CardSessionSpeeches',
  components: {
    Speech,
    Pagination,
  },
  directives: {
    quotable,
  },
  mixins: [links, common, sessionHeader, sessionOgImage],
  cardInfo: {
    doubleWidth: true,
  },
  data() {
    const {
      results = [],
      pages = 1,
      page: initialPage = 1,
      count = results?.length ?? 0,
      per_page = SPEECHES_PER_PAGE,
    } = this.cardData.data || {};

    const speechesPerPage = Array(pages);
    speechesPerPage[initialPage - 1] = results;

    const page = Number(this.cardState.page) || initialPage;

    return {
      speechesPerPage,
      count,
      perPage: per_page,
      page,
      initialPage,
      fetching: false,
      session: this.cardData.data?.session,
    };
  },
  computed: {
    speeches() {
      return this.speechesPerPage[this.page - 1] || [];
    },
  },
  mounted() {
    document.body.style.overflowAnchor = 'none';
    if (this.page !== this.initialPage) {
      this.onPageChange(this.page);
    }
  },
  created() {
    // TODO:
    // this.$options.cardData.template.contextUrl = this.getSessionTranscriptLink(
    //   this.data.session
    // );
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
        axios
          .get(
            `${this.urls.data}/cards/${this.cardName}/?id=${this.cardData.id}&page=${newPage}`
          )
          .then((response) => {
            const responsePage = response?.data?.page || 1;
            this.page = responsePage;
            this.speechesPerPage[responsePage - 1] = response?.data?.results;
            this.fetching = false;

            // needed if dynamically loaded to reset the css :target and scroll to selected element
            this.$nextTick(() => {
              const target = document.getElementById(
                window.location.hash.slice(1)
              );
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
      // eslint-disable-next-line no-restricted-properties
      const id = this.$root.$options.contextData.mountId;
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import 'parlassets/scss/breakpoints';
@import 'parlassets/scss/colors';
@import 'parlassets/scss/color_classes';

.multiple-speeches :deep(.speech-holder) {
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
