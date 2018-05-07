<template>
  <prisotnost-chart
    :card-data="$options.cardData"
    type="poslanec"
    :person="$options.cardData.data.person"
    :results="$options.cardData.data.results"
    v-bind="{ generatedCardUrl }"
  >
    <div slot="info">
      <p class="info-text lead">
        Prisotnost {{vocabulary.poslanec3[gender]}} na glasovanjih DZ skozi čas.
      </p>
      <p class="info-text heading">METODOLOGIJA</p>
      <p class="info-text">
        Vsak mesec preštejemo vse oddane glasovnice {{vocabulary.poslanec3[gender]}} in število delimo s številom vseh glasovanj, na katerih bi {{vocabulary.morati[gender]}} {{vocabulary.poslanec[gender]}} ta mesec glasovati. Če {{vocabulary.poslanec[gender]}} v izbranem mesecu mandata ni {{vocabulary.imeti[gender]}}, prikažemo, na kolikšnem odstotku glasovanj ni {{vocabulary.imeti[gender]}} pravice glasovati.
      </p>
    </div>
  </prisotnost-chart>
</template>

<script>
import urlFunctionalities from 'mixins/urlFunctionalities';
import PrisotnostChart from 'components/PrisotnostChart.vue';
import vocabulary from '../../../assets/vocab.json';

export default {
  name: 'PrisotnostSkoziCas',
  components: {
    PrisotnostChart,
  },
  mixins: [
    urlFunctionalities,
  ],
  data() {
    return {
      gender: this.$options.cardData.data.person.gender,
      vocabulary,
      urlParameters: {},
    };
  },
};
</script>
