<template>
  <card-wrapper
    :id="$options.cardData.cardData._id"
    :card-url="generatedCardUrl"
    :header-config="headerConfig"
  >
    <div slot="info">
      <p class="info-text lead" v-t="'info.lead'"></p>
      <p class="info-text heading" v-t="'info.methodology'"></p>
      <i18n path="info.text" tag="p" class="info-text">
        <a
          place="link"
          class="funblue-light-hover"
          target="_blank"
          :href="$t('info.link.link')"
          v-t="'info.link.text'"
        />
      </i18n>
    </div>
    <question-list :questionDays="data.results" />
  </card-wrapper>
</template>

<script>
import common from 'mixins/common';
import { memberOverview } from 'mixins/contextUrls';
import { memberTitle } from 'mixins/titles';
import { memberHeader } from 'mixins/altHeaders';
import QuestionList from 'components/QuestionList.vue';

export default {
  name: 'PoslanskaVprasanjaInPobudePoslanca',
  mixins: [
    common,
    memberOverview,
    memberTitle,
    memberHeader,
  ],
  components: {
    QuestionList,
  },
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
