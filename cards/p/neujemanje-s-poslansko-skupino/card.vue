<template>
  <score-avg-max
      :card-data="$options.cardData"
      :type="$options.cardData.cardData.type"
      :person="$options.cardData.data.person"
      :results="getResults"
      :info-text="infoText"
      v-bind="{ generatedCardUrl }"></score-avg-max>
</template>

<script>
  import urlFunctionalities from 'mixins/urlFunctionalities';
  import ScoreAvgMax from 'components/ScoreAvgMax.vue';

export default {
  components: { ScoreAvgMax },
  mixins: [ urlFunctionalities ],
  name: 'NeujemanjeSPoslanskoSkupino',
  data() {

    let infoText = `<p class="info-text lead">Odstopanje poslanca od večinskega glasu lastne poslanske skupine v primerjavi s povprečno in največjo vrednostjo.</p>`;
    infoText += `<p class="info-text heading">METODOLOGIJA</p>`;
    infoText += `<p class="info-text text">Za vsa glasovanja preračunamo večinski glas za vsako poslansko skupino. Večinski glas je opcija, za katero se je odločilo največ poslancev.
Za vsakega poslanca najdemo trenutno poslansko skupino in izračunamo odstotek ujemanja glasov v obdobju članstva. Pri vseh izračunih ignoriramo glasovnice "ni prisoten".</p>`;

    return {
      infoText,
      urlParameters: {},
    };
  },
  computed: {
    getResults() {
      return { sessions: this.$options.cardData.data.result };
    }
  },
  methods: {
    measurePiwik(filter, sort, order) {
      if (typeof measure === 'function') {
        if (sort !== '') {
          measure('s', 'session-sort', `${sort} ${order}`, '');
        } else if (filter !== '') {
          measure('s', 'session-filter', filter, '');
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
