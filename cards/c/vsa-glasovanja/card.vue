<template>
  <card-wrapper
    :id="$options.cardData.cardData._id"
    :card-url="generatedCardUrl"
    :header-config="headerConfig"
    :og-config="ogConfig"
  >
    <seznam-glasovanj :data="votes" :filters="filters" @filters-changed="onFiltersChanged" />
  </card-wrapper>
</template>

<script>
import common from 'mixins/common';
import links from 'mixins/links';
import { defaultHeaderConfig } from 'mixins/altHeaders';
import { defaultOgImage } from 'mixins/ogImages';
// import { otherVotingsTitle } from 'mixins/titles';
import SeznamGlasovanj from 'components/SeznamGlasovanj.vue';

export default {
  name: 'VsaGlasovanja',
  components: {
    SeznamGlasovanj,
  },
  mixins: [
    common,
    // otherVotingsTitle,
    links,
  ],
  data() {
    const state = this.$options.cardData.parlaState;
    const text = state && state.text ? state.text : '';
    const tags = state && state.tags ? state.tags : [];
    const results = state && state.results ? state.results : [];

    return {
      data: this.$options.cardData.data,
      filters: {
        text,
        tags,
        results,
      },
      headerConfig: defaultHeaderConfig(this, {}),
      ogConfig: defaultOgImage(this, {}),
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
      if (this.filters.results.length) {
        state.results = this.filters.results;
      }
      if (this.$options.cardData.parlaState && this.$options.cardData.parlaState.onlyOther) {
        state.onlyOther = true;
      }

      return `${this.url}?state=${encodeURIComponent(JSON.stringify(state))}&altHeader=true`;
    },
    votes() {
      let votes = this.data.results.map(v => v.results);
      if (this.$options.cardData.parlaState && this.$options.cardData.parlaState.onlyOther) {
        votes = votes.filter(vote => !vote.epa);
      }
      return {
        votes,
        session: this.data.session,
        tags: this.data.tags,
      };
    },
  },
  methods: {
    onFiltersChanged(newFilters) {
      this.filters = newFilters;
    },
  },
};
</script>

<style lang="scss" scoped>
#c_vsa-glasovanja /deep/ #votingCard {
  height: auto;
  min-height: 500px;
}
</style>
