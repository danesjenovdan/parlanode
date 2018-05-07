<template>
  <score-avg-max
    :card-data="$options.cardData"
    :type="$options.cardData.cardData.type"
    :person="$options.cardData.data.person"
    :results="$options.cardData.data.results.sessions"
  >
    <div slot="info">
      <p class="info-text lead">
        Prisotnost {{vocabulary.poslanec3[gender]}} na sejah DZ v primerjavi s povprečno in največjo vrednostjo.
      </p>
      <p class="info-text heading">METODOLOGIJA</p>
      <p class="info-text">
        Preštejemo vse seje in preverimo, če je {{vocabulary.poslanec[gender]}} {{vocabulary.glasovati[gender]}} na vsaj enem glasovanju na posamezni seji. Če je {{vocabulary.glasovati[gender]}} vsaj enkrat, {{vocabulary.on[gender]}} štejemo kot {{vocabulary.prisoten[gender]}} na posamezni seji. Delimo število sej, ko je {{vocabulary.biti[gender]}} {{vocabulary.prisoten[gender]}}, s številom vseh sej in normaliziramo (min 1 - max 100).
      </p>
    </div>
  </score-avg-max>
</template>

<script>
import common from 'mixins/common';
import ScoreAvgMax from 'components/ScoreAvgMax.vue';

export default {
  name: 'PrisotnostNaSejahDz',
  components: {
    ScoreAvgMax,
  },
  mixins: [common],
  data() {
    return {
      gender: this.$options.cardData.data.person.gender,
    };
  },
};
</script>
