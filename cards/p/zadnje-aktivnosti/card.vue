<template>
  <card-wrapper
    :id="$options.cardData.mountId"
    :card-url="generatedCardUrl"
    :header-config="headerConfig"
    :og-config="ogConfig"
    content-class="full"
  >
    <div slot="info">
      <p v-t="'info.lead'" class="info-text lead"></p>
      <p v-t="'info.methodology'" class="info-text heading"></p>
      <p v-t="'info.text'" class="info-text"></p>
    </div>
    <question-list :question-days="data.results" />
  </card-wrapper>
</template>

<script>
import common from 'mixins/common';
import { memberOverview } from 'mixins/contextUrls';
import { memberHeader } from 'mixins/altHeaders';
import { memberOgImage } from 'mixins/ogImages';
import { memberTitle } from 'mixins/titles';
import QuestionList from 'components/QuestionList.vue';

export default {
  name: 'ZadnjeAktivnosti',
  components: {
    QuestionList,
  },
  mixins: [
    common,
    memberOverview,
    memberTitle,
    memberHeader,
    memberOgImage,
  ],
  data() {
    return {
      data: this.$options.cardData.data,
    };
  },
  computed: {
    generatedCardUrl() {
      return `${this.url}${this.data.person.id}?altHeader=true`;
    },
  },
};
</script>
