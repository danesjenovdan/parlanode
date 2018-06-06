<template>
  <score-avg-max
    :card-data="$options.cardData"
    :type="$options.cardData.cardData.type"
    :person="$options.cardData.data.person"
    :results="this.$options.cardData.data.result"
  >
    <div slot="info">
      <p class="info-text lead" v-t="'info.lead'"></p>
      <p class="info-text heading" v-t="'info.methodology'"></p>
      <p class="info-text" v-t="'info.text[0]'"></p>
      <p class="info-text" v-t="'info.text[1]'"></p>
    </div>
  </score-avg-max>
</template>

<script>
import ScoreAvgMax from 'components/ScoreAvgMax.vue';

export default {
  components: {
    ScoreAvgMax,
  },
  name: 'NeujemanjeSPoslanskoSkupino',
};
</script>
