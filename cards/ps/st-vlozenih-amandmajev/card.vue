<template>
  <score-avg-max
    :card-data="$options.cardData"
    :party="$options.cardData.data.organization"
    :results="$options.cardData.data.result"
    type="party"
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
  </score-avg-max>
</template>

<script>
import common from '@/_mixins/common';
import ScoreAvgMax from '@/_components/ScoreAvgMax.vue';

export default {
  name: 'StVlozenihAmandmajev',
  components: {
    ScoreAvgMax,
  },
  mixins: [common],
};
</script>
