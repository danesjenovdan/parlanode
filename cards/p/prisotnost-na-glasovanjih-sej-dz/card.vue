<template>
  <score-avg-max
    :card-data="$options.cardData"
    :type="$options.cardData.cardData.type"
    :person="$options.cardData.data.person"
    :results="$options.cardData.data.results.votes"
  >
    <div slot="info">
      <p class="info-text lead">
        Prisotnosti {{vocabulary.poslanec3[gender]}} na glasovanjih DZ v primerjavi s povprečjem in največjo vrednostjo.
      </p>
      <p class="info-text heading">METODOLOGIJA</p>
      <p class="info-text">
        Preštejemo vse oddane glasovnice {{vocabulary.poslanec3[gender]}} in število delimo s številom vseh glasovanj, na katerih bi {{vocabulary.moral[gender]}} {{vocabulary.poslanec[gender]}} glasovati. Rezultat izpišemo skupaj s povprečno in največjo vrednostjo.
      </p>
    </div>
  </score-avg-max>
</template>

<script>
import common from 'mixins/common';
import ScoreAvgMax from 'components/ScoreAvgMax.vue';

export default {
  name: 'PrisotnostNaGlasovanjihSejDz',
  components: {
    ScoreAvgMax,
  },
  mixins: [common],
  data() {
    return {
      gender: this.$options.cardData.gender,
    };
  },
};
</script>
