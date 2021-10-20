<template>
  <card-wrapper :header-config="headerConfig" :og-config="ogConfig">
    <question-list
      :question-days="$options.contextData.cardData?.data?.results"
    />
  </card-wrapper>
</template>

<script>
import common from '@/_mixins/common.js';
import { personOverview } from '@/_mixins/contextUrls.js';
import { personTitle } from '@/_mixins/titles.js';
import { personHeader } from '@/_mixins/altHeaders.js';
import { personOgImage } from '@/_mixins/ogImages.js';
import QuestionList from '@/_components/QuestionList.vue';

export default {
  name: 'CardPersonQuestions',
  components: {
    QuestionList,
  },
  mixins: [common, personOverview, personTitle, personHeader, personOgImage],
};
</script>
