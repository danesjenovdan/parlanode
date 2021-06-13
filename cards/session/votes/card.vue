<template>
  <card-wrapper :header-config="headerConfig" :og-config="ogConfig" max-height>
    <vote-list
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
import VoteList from '@/_components/VoteList.vue';

export default {
  name: 'CardSessionVotes',
  components: {
    VoteList,
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
    votes() {
      let votes = this.data.results;
      if (
        this.$options.contextData.cardState &&
        this.$options.contextData.cardState.onlyOther
      ) {
        votes = votes.filter((vote) => !vote.epa);
      }
      return {
        votes,
        session: this.data.session,
        tags: [], //this.data.tags,
        classifications: [], //this.data.classifications,
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
