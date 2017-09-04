<template>
  <score-avg-max
    :card-data="$options.cardData"
    :type="$options.cardData.cardData.type"
    :person="$options.cardData.data.person"
    :results="$options.cardData.data.results"
    :info-text="infoText"
    v-bind="{ generatedCardUrl }"></score-avg-max>
</template>

<script>
import urlFunctionalities from 'mixins/urlFunctionalities';
import ScoreAvgMax from 'components/ScoreAvgMax.vue';

export default {
  name: 'PrisotnostNaSejahDz',

  components: {
    ScoreAvgMax,
  },

  mixins: [
    urlFunctionalities,
  ],

  data() {
    const vocabulary = this.$options.cardData.vocab;
    const infoText = `<p class="info-text lead">Prisotnost ${vocabulary['poslanec3'][this.$options.cardData.data.person.gender]} na sejah DZ v primerjavi s povprečno in največjo vrednostjo.</p>
                      <p class="info-text heading">METODOLOGIJA</p>
                      <p class="info-text">Preštejemo vse seje in preverimo, če je ${vocabulary['poslanec'][this.$options.cardData.data.person.gender]} ${vocabulary['glasovati'][this.$options.cardData.data.person.gender]} na vsaj enem glasovanju na posamezni seji. Če je ${vocabulary['glasovati'][this.$options.cardData.data.person.gender]} vsaj enkrat, ${vocabulary['on'][this.$options.cardData.data.person.gender]} štejemo kot ${vocabulary['prisoten'][this.$options.cardData.data.person.gender]} na posamezni seji. Delimo število sej, ko je ${vocabulary['biti'][this.$options.cardData.data.person.gender]} ${vocabulary['prisoten'][this.$options.cardData.data.person.gender]}, s številom vseh sej in normaliziramo (min 1 - max 100).</p>`;
    return {
      infoText,
      urlParameters: {},
    }
  },

  mounted() {
    console.log(this.$options.cardData);
  },
}
</script>
