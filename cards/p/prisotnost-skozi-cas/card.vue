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
import ScoreAvgMax from 'components/PrisotnostChart.vue';

import vocabulary from '../../../assets/vocab.json';

export default {
  name: 'PrisotnostNaSejahDz',
  components: {
    ScoreAvgMax,
  },
  mixins: [
    urlFunctionalities,
  ],
  data() {
    const infoText = `<p class="info-text lead">Prisotnost ${vocabulary.poslanec3[this.$options.cardData.data.person.gender]} na glasovanjih DZ skozi čas.</p>
                      <p class="info-text heading">METODOLOGIJA</p>
                      <p class="info-text">Vsak mesec preštejemo vse oddane glasovnice ${vocabulary.poslanec3[this.$options.cardData.data.person.gender]} in število delimo s številom vseh glasovanj, na katerih bi ${vocabulary['morati'][this.$options.cardData.data.person.gender]} ${vocabulary['poslanec'][this.$options.cardData.data.person.gender]} ta mesec glasovati. Če ${vocabulary['poslanec'][this.$options.cardData.data.person.gender]} v izbranem mesecu mandata ni ${vocabulary['imeti'][this.$options.cardData.data.person.gender]}, prikažemo, na kolikšnem odstotku glasovanj ni ${vocabulary['imeti'][this.$options.cardData.data.person.gender]} pravice glasovati.</p>`;
    return {
      infoText,
      urlParameters: {},
    };
  },
  mounted() {
    console.log(this.$options.cardData);
  },
};
</script>
