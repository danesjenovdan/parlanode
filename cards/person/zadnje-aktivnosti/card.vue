<template>
  <card-wrapper
    :card-url="generatedCardUrl"
    :header-config="headerConfig"
    :og-config="ogConfig"
  >
    <question-list :question-days="data.results" />
  </card-wrapper>
</template>

<script>
import common from '@/_mixins/common.js';
import { memberOverview } from '@/_mixins/contextUrls.js';
import { memberHeader } from '@/_mixins/altHeaders.js';
import { memberOgImage } from '@/_mixins/ogImages.js';
import { memberTitle } from '@/_mixins/titles.js';
import QuestionList from '@/_components/QuestionList.vue';

export default {
  name: 'ZadnjeAktivnosti',
  components: {
    QuestionList,
  },
  mixins: [common, memberOverview, memberTitle, memberHeader, memberOgImage],
  data() {
    return {
      data: this.$options.contextData.cardData,
    };
  },
  computed: {
    generatedCardUrl() {
      return `${this.url}${this.data.person.id}?altHeader=true`;
    },
  },
};
</script>
