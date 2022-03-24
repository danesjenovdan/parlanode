<template>
  <card-wrapper :header-config="headerConfig">
    <question-list
      :question-days="eventDays"
      :is-loading="card.isLoading"
      @load-more="loadMore"
    />
  </card-wrapper>
</template>

<script>
import axios from 'axios';
import { groupBy } from 'lodash-es';
import common from '@/_mixins/common.js';
import { personOverviewContextUrl } from '@/_mixins/contextUrls.js';
import { personTitle } from '@/_mixins/titles.js';
import { personHeader } from '@/_mixins/altHeaders.js';
import { personOgImage } from '@/_mixins/ogImages.js';
import QuestionList from '@/_components/QuestionList.vue';

export default {
  name: 'CardPersonRecentActivity',
  components: {
    QuestionList,
  },
  mixins: [
    common,
    personOverviewContextUrl,
    personTitle,
    personHeader,
    personOgImage,
  ],
  data() {
    const { cardData } = this.$root.$options.contextData;

    return {
      card: {
        currentPage: 1,
        isLoading: false,
      },
      events: cardData?.data?.results || [],
    };
  },
  computed: {
    eventDays() {
      const grouped = groupBy(this.events, (event) => {
        const dateTime =
          event?.start_time || event?.vote?.timestamp || event?.timestamp || '';
        const date = dateTime.split('T')[0];
        return `${date}`;
      });
      return Object.keys(grouped).map((date) => ({
        date,
        events: grouped[date],
      }));
    },
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
      if (this.events.length >= this.cardData.data?.count) {
        return;
      }

      this.card.isLoading = true;
      this.card.currentPage += 1;

      const requestedPage = this.card.currentPage;
      axios.get(this.searchUrl).then((response) => {
        if (response?.data?.page === requestedPage) {
          const newEvents = response?.data?.results || [];
          this.events.push(...newEvents);
        }
        this.card.isLoading = false;
      });
    },
  },
};
</script>
