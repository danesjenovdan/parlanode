<template>
  <card-wrapper :header-config="headerConfig" :og-config="ogConfig">
    <person-list
      :people="people"
      :pagination-state="card"
      @load-more="loadMore"
    />
  </card-wrapper>
</template>

<script>
import axios from 'axios';
import common from '@/_mixins/common.js';
import { partyHeader } from '@/_mixins/altHeaders.js';
import { partyOgImage } from '@/_mixins/ogImages.js';
import { partyOverview } from '@/_mixins/contextUrls.js';
import { partyTitle } from '@/_mixins/titles.js';
import PersonList from '@/_components/PersonList.vue';

export default {
  name: 'CardGroupMembers',
  components: {
    PersonList,
  },
  mixins: [common, partyOverview, partyTitle, partyHeader, partyOgImage],
  data() {
    const { cardData } = this.$root.$options.contextData;

    return {
      card: {
        currentPage: 1,
        isLoading: false,
      },
      people: cardData?.data?.results || [],
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
      if (this.people.length >= this.cardData.data?.count) {
        return;
      }

      this.card.isLoading = true;
      this.card.currentPage += 1;

      const requestedPage = this.card.currentPage;
      axios.get(this.searchUrl).then((response) => {
        if (response?.data?.page === requestedPage) {
          const newPeople = response?.data?.results || [];
          this.people.push(...newPeople);
        }
        this.card.isLoading = false;
      });
    },
  },
};
</script>
