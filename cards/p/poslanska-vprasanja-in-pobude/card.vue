<template>
  <card-wrapper
    :card-url="generatedCardUrl"
    :header-config="headerConfig"
    :og-config="ogConfig"
  >
    <question-list :question-days="$options.contextData.cardData.results" />
  </card-wrapper>
</template>

<script>
import common from '@/_mixins/common.js';
import { memberOverview } from '@/_mixins/contextUrls.js';
import { memberTitle } from '@/_mixins/titles.js';
import { memberHeader } from '@/_mixins/altHeaders.js';
import { memberOgImage } from '@/_mixins/ogImages.js';
import QuestionList from '@/_components/QuestionList.vue';

export default {
  name: 'PoslanskaVprasanjaInPobudePoslanca',
  components: {
    QuestionList,
  },
  mixins: [common, memberOverview, memberTitle, memberHeader, memberOgImage],
  computed: {
    generatedCardUrl() {
      return `${this.url}${this.$options.contextData.cardData.person.id}?altHeader=true`;
    },
  },
};
</script>
