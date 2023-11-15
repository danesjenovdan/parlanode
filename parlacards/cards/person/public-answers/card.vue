<template>
  <card-wrapper :header-config="headerConfig">
    <question-list
      :question-days="questionDays"
      :is-loading="card.isLoading"
      @load-more="loadMore"
      list-type="questions"
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
  name: 'CardPersonPublicAnswers',
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
      questions: cardData?.data?.results || [],
    };
  },
  computed: {
    questionDays() {
      const grouped = groupBy(this.questions, (question) => {
        const dateTime = question?.created_at || '';
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
      if (this.questions.length >= this.cardData.data?.count) {
        return;
      }

      this.card.isLoading = true;
      this.card.currentPage += 1;

      const requestedPage = this.card.currentPage;
      axios.get(this.searchUrl).then((response) => {
        if (response?.data?.page === requestedPage) {
          const newQuestions = response?.data?.results || [];
          this.questions.push(...newQuestions);
        }
        this.card.isLoading = false;
      });
    },
  },
};
</script>
