<template>
  <score-avg-max
    :card-data="$options.cardData"
    :person="$options.cardData.data.person"
    :results="this.$options.cardData.data.result"
    type="person"
  >
    <div slot="info">
      <p v-t="'info.lead'" class="info-text lead"></p>
      <p v-t="'info.methodology'" class="info-text heading"></p>
      <p v-t="'info.text[0]'" class="info-text"></p>
      <p v-t="'info.text[1]'" class="info-text"></p>
    </div>
  </score-avg-max>
</template>

<script>
import ScoreAvgMax from 'components/ScoreAvgMax.vue';

export default {
  name: 'NeujemanjeSPoslanskoSkupino',
  components: {
    ScoreAvgMax,
  },
};
</script>
