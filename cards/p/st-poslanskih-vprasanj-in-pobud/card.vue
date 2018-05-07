<template>
  <score-avg-max
    :card-data="$options.cardData"
    :type="$options.cardData.cardData.type"
    :person="$options.cardData.data.person"
    :results="$options.cardData.data.results"
  >
    <div slot="info">
      <p class="info-text lead">
        Število poslanskih vprašanj in pobud, ki jih je {{vocabulary.poslanec[gender]}} {{vocabulary.postaviti[gender]}} v tem sklicu DZ v primerjavi s povprečno in največjo vrednostjo.
      </p>
      <p class="info-text heading">METODOLOGIJA</p>
      <p class="info-text">
        Podatke pridobivamo s spletnega mesta <a target="_blank" href="https://www.dz-rs.si/wps/portal/Home/deloDZ/poslanskaVprasanjaInPobude/">DZ RS</a>.
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
