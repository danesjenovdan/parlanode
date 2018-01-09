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
// import urlFunctionalities from 'mixins/urlFunctionalities';
import ScoreAvgMax from 'components/ScoreAvgMax.vue';

export default {
  components: { ScoreAvgMax },
  // mixins: [ urlFunctionalities ],
  name: 'NeenotnostGlasovanj',
  data() {
    let infoText = `<p class="info-text lead">
Neenotnost izbrane poslanske skupine na glasovanjih sej Državnega zbora v primerjavi s povprečno in najvišjo stopnjo neenotnosti med vsemi poslanskimi skupinami.</p>`;
    infoText += `<p class="info-text heading">METODOLOGIJA</p>`;
    infoText += `<p class="info-text text">Za vsako glasovanje za poslansko skupino preštejemo, koliko poslancev je oddalo katero glasovnico (ZA, PROTI, NI, VZDRŽAN). Izračunamo odstotek tistih, ki so glasovali za najbolj popularno opcijo. Ta odstotek odštejemo do 100 in dobimo stopnjo neenotnosti oz. odstotek poslank in poslancev, ki se z večinskim glasom niso strinjali.</p>`;

    return {
      infoText,
      urlParameters: {},
    }
  },
  computed: {
    getResults() {
      return { sessions: this.$options.cardData.data.result }
    },
    generatedCardUrl() {
      return `https://glej.parlameter.si/ps/neenotnost-glasovanj/${this.$options.cardData.data.organization.id}?state={}`
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
