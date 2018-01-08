<template>
  <score-avg-max
    :card-data="$options.cardData"
    :type="$options.cardData.cardData.type"
    :party="$options.cardData.data.organization"
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
    name: 'StVlozenihAmandmajev',
    data() {
      let infoText = '<p class="info-text lead">Št. amandmajev, ki jih je vložila ta poslanska skupina v primerjavi s povprečno in najvišjo vrednostjo med vsemi poslanskimi skupinami.</p>';
      infoText += '<p class="info-text heading">METODOLOGIJA</p>';
      infoText += '<p class="info-text text"><p class="info-text">Število sedežev posamezne poslanske skupine dobimo tako, da preštejemo vse njihove trenutno aktivne člane. Podatke pridobivamo s <a href="http://www.dz-rs.si/wps/portal/Home/ODrzavnemZboru/KdoJeKdo/PoslanskeSkupine" class="funblue-light-hover">spletnega mesta DZ</a>.</p></p>';

      return {
        infoText,
        urlParameters: {},
      }
    },
    computed: {
      getResults() {
        return { sessions: this.$options.cardData.data.result }
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
