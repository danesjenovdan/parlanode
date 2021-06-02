<template>
  <card-wrapper
    :card-url="generatedCardUrl"
    :header-config="headerConfig"
    :og-config="ogConfig"
    max-height
  >
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
        :key="speech.speech_id"
        v-quotable
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
    <!-- TODO: this should be empty state -->
    <div v-else v-t="'session-processing'" class="empty-dataset"></div>
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
  name: 'CardSessionGovori',
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
      page = 1,
      count,
      per_page = SPEECHES_PER_PAGE,
    } = this.cardData.data || {};

    const speechesPerPage = Array(pages);
    speechesPerPage[page - 1] = results;

    // const state = this.$options.contextData.cardState;
    // let page = (state && state.page) || Number(data.page);
    // page = Math.min(Math.max(page, 0), data.pages);
    const initialPage = 1;

    return {
      speechesPerPage,
      count: count ?? results?.length ?? 0,
      perPage: per_page,
      page: initialPage,
      fetching: false,
    };
  },
  computed: {
    speeches() {
      return this.speechesPerPage[this.page - 1] || [];
    },
    generatedCardUrl() {
      return `${this.url}${this.cardData.id}?altHeader=true`;
    },
  },
  mounted() {
    document.body.style.overflowAnchor = 'none';

    // if (this.page !== Number(this.data.page)) {
    //   this.onPageChange(this.page);
    // }
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
      // TODO: pagination
      // if (!this.speechesPerPage[newPage - 1]) {
      //   this.fetching = true;
      //   axios
      //     .get(
      //       `${this.slugs.urls.analize}/s/getSpeechesOfSession/${this.data.session.id}?page=${newPage}`
      //     )
      //     .then((response) => {
      //       this.speechesPerPage[newPage - 1] = response.data.results;
      //       this.fetching = false;

      //       // needed if dynamically loaded to reset the css :target and scroll to selected element
      //       this.$nextTick(() => {
      //         const target = document.getElementById(
      //           window.location.hash.slice(1)
      //         );
      //         if (target) {
      //           const tmp = window.location.hash;
      //           window.location.hash = '';
      //           window.location.hash = tmp;
      //         }
      //       });
      //     });
      // }
    },
    scrollToTop() {
      // TODO: use ref?
      // const id = this.$root.$options.contextData.mountId;
      // const el = document.getElementById(id);
      // if (el) {
      //   el.scrollIntoView();
      // }
    },
  },
};
</script>

<style lang="scss" scoped>
@import 'parlassets/scss/breakpoints';
@import 'parlassets/scss/colors';
@import 'parlassets/scss/color_classes';

.empty-dataset {
  font-size: 16px;
  line-height: 20px;
  margin: 70px 0;
  text-align: center;
  color: $font-placeholder;
}

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
