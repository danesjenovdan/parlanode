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
      <i18n path="info.text" tag="p" class="info-text">
        <a
          v-t="'info.link.text'"
          :href="$t('info.link.link')"
          place="link"
          class="funblue-light-hover"
          target="_blank"
        />
      </i18n>
    </div>
    <data-not-published
      v-if="showEmptyState"
      :text="$t('data-not-published.parlamentary-questions')"
    />
    <question-list v-else :question-days="data.results" />
  </card-wrapper>
</template>

<script>
import common from '@/_mixins/common';
import { memberOverview } from '@/_mixins/contextUrls';
import { memberTitle } from '@/_mixins/titles';
import { memberHeader } from '@/_mixins/altHeaders';
import { memberOgImage } from '@/_mixins/ogImages';
import QuestionList from '@/_components/QuestionList.vue';
import DataNotPublished from '@/_components/DataNotPublished.vue';

export default {
  name: 'PoslanskaVprasanjaInPobudePoslanca',
  components: {
    QuestionList,
    DataNotPublished,
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

<style lang="scss" scoped>
.data-not-published {
  height: 100%;
}
</style>
