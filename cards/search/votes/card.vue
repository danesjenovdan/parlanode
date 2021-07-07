<template>
  <card-wrapper :header-config="headerConfig" :og-config="ogConfig">
    <div class="votes-list">
      <scroll-shadow ref="shadow">
        <div
          v-infinite-scroll="loadMore"
          class="votes-list-shadow"
          @scroll="$refs.shadow.check($event.currentTarget)"
        >
          <vote-list-item v-for="vote in votes" :key="vote.id" :vote="vote" />
        </div>
        <div v-if="card.isLoading" class="nalagalnik__wrapper">
          <div class="nalagalnik"></div>
        </div>
      </scroll-shadow>
    </div>
  </card-wrapper>
</template>

<script>
import axios from 'axios';
import common from '@/_mixins/common.js';
import { search as searchContext } from '@/_mixins/contextUrls.js';
import { searchHeader } from '@/_mixins/altHeaders.js';
import { searchOgImage } from '@/_mixins/ogImages.js';
import { searchTitle } from '@/_mixins/titles.js';
import ScrollShadow from '@/_components/ScrollShadow.vue';
import VoteListItem from '@/_components/VoteListItem.vue';
import infiniteScroll from '@/_directives/infiniteScroll.js';

export default {
  name: 'CardSearchVotes',
  directives: {
    infiniteScroll,
  },
  components: {
    ScrollShadow,
    VoteListItem,
  },
  mixins: [common, searchTitle, searchHeader, searchOgImage, searchContext],
  cardInfo: {
    doubleWidth: true,
  },
  data() {
    return {
      card: {
        currentPage: 1,
        isLoading: false,
      },
      votes: this.cardData.data?.results,
    };
  },
  computed: {
    searchUrl() {
      const url = new URL(this.cardData.url);
      url.searchParams.set('page', this.card.currentPage);
      return url.toString();
    },
  },
  methods: {
    loadMore() {
      if (this.card.isLoading) {
        return;
      }
      if (this.votes.length >= this.cardData.data?.count) {
        return;
      }

      this.card.isLoading = true;
      this.card.currentPage += 1;

      const requestedPage = this.card.currentPage;
      axios.get(this.searchUrl).then((response) => {
        if (response?.data?.page === requestedPage) {
          const newVotes = response?.data?.results || [];
          this.votes.push(...newVotes);
        }
        this.card.isLoading = false;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import 'parlassets/scss/breakpoints';
@import 'parlassets/scss/colors';

.votes-list {
  .votes-list-shadow {
    overflow-y: auto;
    overflow-x: hidden;
    height: $full-card-height;
  }

  .nalagalnik__wrapper {
    background: $white-hover;
    height: 100%;
    left: 0;
    position: absolute;
    top: 0;
    width: 100%;

    .nalagalnik {
      position: absolute;
      top: calc(50% - 50px);
    }
  }
}
</style>
