<template>
  <score-avg-max
    :card-data="$options.cardData"
    :person="$options.cardData.data.person"
    :results="$options.cardData.data.results"
    type="person"
    context="speeches"
  >
    <template #info>
      <p v-t="'info.lead'" class="info-text lead"></p>
      <p v-t="'info.methodology'" class="info-text heading"></p>
      <i18n-t keypath="info.text" tag="p" class="info-text">
        <a
          v-t="'info.link.text'"
          :href="$t('info.link.link')"
          place="link"
          class="funblue-light-hover"
          target="_blank"
        />
      </i18n-t>
    </template>
  </score-avg-max>
</template>

<script>
import common from '@/_mixins/common';
import ScoreAvgMax from '@/_components/ScoreAvgMax.vue';

export default {
  name: 'PrisotnostNaSejahDz',
  components: {
    ScoreAvgMax,
  },
  mixins: [common],
};
</script>
