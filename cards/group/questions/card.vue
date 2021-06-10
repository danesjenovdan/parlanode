<template>
  <card-wrapper :header-config="headerConfig" :og-config="ogConfig">
    <question-list :question-days="cardData.data?.results" show-author />
  </card-wrapper>
</template>

<script>
import common from '@/_mixins/common.js';
import { partyOverview } from '@/_mixins/contextUrls.js';
import { partyTitle } from '@/_mixins/titles.js';
import { partyHeader } from '@/_mixins/altHeaders.js';
import { partyOgImage } from '@/_mixins/ogImages.js';
import QuestionList from '@/_components/QuestionList.vue';

export default {
  name: 'CardGroupQuestions',
  components: {
    QuestionList,
  },
  cardInfo: {
    doubleWidth: true,
  },
  mixins: [common, partyOverview, partyTitle, partyHeader, partyOgImage],
};
</script>
