<template>
  <card-wrapper :header-config="headerConfig" :og-config="ogConfig">
    <vote-list
      :show-filters="false"
      :votes-and-stuff="votes"
      :virtualize-remain="5"
      virtualize
    />
  </card-wrapper>
</template>

<script>
import VoteList from '@/_components/VoteList.vue';
import common from '@/_mixins/common.js';
import { search as searchContext } from '@/_mixins/contextUrls.js';
import { searchHeader } from '@/_mixins/altHeaders.js';
import { searchOgImage } from '@/_mixins/ogImages.js';
import { searchTitle } from '@/_mixins/titles.js';

export default {
  name: 'CardSearchVotes',
  components: {
    VoteList,
  },
  mixins: [common, searchTitle, searchHeader, searchOgImage, searchContext],
  cardInfo: {
    doubleWidth: true,
  },
  computed: {
    votes() {
      return {
        votes: this.cardData.data?.results,
        session: this.cardData.data?.session,
        tags: [], // this.data.tags,
        classifications: [], // this.data.classifications,
      };
    },
  },
};
</script>
