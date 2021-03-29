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
      <p v-t="'info.text[0]'" class="info-text"></p>
      <p v-t="'info.text[1]'" class="info-text"></p>
      <p v-t="'info.text[2]'" class="info-text"></p>
    </template>
  </score-avg-max>
</template>

<script>
import common from '@/_mixins/common';
import ScoreAvgMax from '@/_components/ScoreAvgMax.vue';

export default {
  name: 'RaznolikostBesedisca',
  components: {
    ScoreAvgMax,
  },
  mixins: [common],
};
</script>
