<template>
  <score-avg-max
    :card-data="$options.cardData"
    :type="$options.cardData.cardData.type"
    :person="$options.cardData.data.person"
    :results="$options.cardData.data.results"
  >
    <div slot="info">
      <p class="info-text lead" v-t="'info.lead'"></p>
      <p class="info-text heading" v-t="'info.methodology'"></p>
      <p class="info-text" v-t="'info.text[0]'"></p>
      <p class="info-text" v-t="'info.text[1]'"></p>
      <p class="info-text" v-t="'info.text[2]'"></p>
    </div>
  </score-avg-max>
</template>

<script>
import common from 'mixins/common';
import ScoreAvgMax from 'components/ScoreAvgMax.vue';

export default {
  name: 'RaznolikostBesedisca',
  components: {
    ScoreAvgMax,
  },
  mixins: [common],
};
</script>
