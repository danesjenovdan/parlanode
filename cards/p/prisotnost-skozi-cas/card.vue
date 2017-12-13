<template>
  <prisotnost-chart
    :card-data="$options.cardData"
    type="poslanec"
    :person="$options.cardData.data.person"
    :results="$options.cardData.data.results"
    :info-text="infoText"
    v-bind="{ generatedCardUrl }"
  />
</template>

<script>
import urlFunctionalities from 'mixins/urlFunctionalities';
import PrisotnostChart from 'components/PrisotnostChart.vue';

import vocabulary from '../../../assets/vocab.json';

export default {
  name: 'PrisotnostNaSejahDz',
  components: {
    PrisotnostChart,
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
};
</script>
