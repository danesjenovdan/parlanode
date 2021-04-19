<template>
  <card-wrapper
    :card-url="generatedCardUrl"
    :header-config="headerConfig"
    :og-config="ogConfig"
  >
    <seznam-glasovanj
      :data="votes"
      :filters="filters"
      :virtualize-remain="5"
      virtualize
      @filters-changed="onFiltersChanged"
    />
  </card-wrapper>
</template>

<script>
import common from '@/_mixins/common.js';
import links from '@/_mixins/links.js';
import { sessionHeader } from '@/_mixins/altHeaders.js';
import { sessionOgImage } from '@/_mixins/ogImages.js';
import { otherVotingsTitle } from '@/_mixins/titles.js';
import SeznamGlasovanj from '@/_components/SeznamGlasovanj.vue';

export default {
  name: 'GlasovanjaSeja',
  components: {
    SeznamGlasovanj,
  },
  mixins: [common, sessionHeader, sessionOgImage, otherVotingsTitle, links],
  cardInfo: {
    doubleWidth: true,
  },
  data() {
    const state = this.$options.contextData.cardState;
    const text = state && state.text ? state.text : '';
    const tags = state && state.tags ? state.tags : [];
    const classifications =
      state && state.classifications ? state.classifications : [];
    const results = state && state.results ? state.results : [];

    return {
      data: this.$options.contextData.cardData,
      filters: {
        text,
        tags,
        classifications,
        results,
      },
    };
  },
  computed: {
    generatedCardUrl() {
      const state = {};

      if (this.filters.text) {
        state.text = this.filters.text;
      }
      if (this.filters.tags.length) {
        state.tags = this.filters.tags;
      }
      if (this.filters.classifications.length) {
        state.classifications = this.filters.classifications;
      }
      if (this.filters.results.length) {
        state.results = this.filters.results;
      }
      if (
        this.$options.contextData.cardState &&
        this.$options.contextData.cardState.onlyOther
      ) {
        state.onlyOther = true;
      }

      return `${this.url}${this.data.session.id}?state=${encodeURIComponent(
        JSON.stringify(state)
      )}&altHeader=true`;
    },
    votes() {
      let votes = this.data.results.map((v) => v.results);
      if (
        this.$options.contextData.cardState &&
        this.$options.contextData.cardState.onlyOther
      ) {
        votes = votes.filter((vote) => !vote.epa);
      }
      return {
        votes,
        session: this.data.session,
        tags: this.data.tags,
        classifications: this.data.classifications,
      };
    },
  },
  created() {
    // TODO:
    // this.$options.cardData.template.contextUrl = this.getSessionVotesLink(
    //   this.data.session
    // );
  },
  methods: {
    onFiltersChanged(newFilters) {
      this.filters = newFilters;
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep #votingCard {
  height: auto;
  min-height: 500px;
}

::v-deep .filter.tag-dropdown {
  display: none;
}
</style>
