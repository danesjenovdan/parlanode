<template>
  <score-avg-max
    :card-data="$options.cardData"
    :type="$options.cardData.cardData.type"
    :party="$options.cardData.data.party"
    :results="$options.cardData.data.results"
  >
    <div slot="info">
      <p class="info-text lead">
        Preštejemo vsa poslanska vprašanja in pobude, ki so jih postavili poslanci izbrane poslanske skupine v tem sklicu DZ.
      </p>
      <p class="info-text heading">METODOLOGIJA</p>
      <p class="info-text">
        Podatke pridobivamo s spletnega mesta <a href="https://www.dz-rs.si/wps/portal/Home/deloDZ/poslanskaVprasanjaInPobude/" target="_blank" class="funblue-light-hover">DZ RS</a>.
      </p>
    </div>
  </score-avg-max>
</template>

<script>
import common from 'mixins/common';
import ScoreAvgMax from 'components/ScoreAvgMax.vue';

export default {
  name: 'StPoslanskihVprasanjInPobud',
  components: {
    ScoreAvgMax,
  },
  mixins: [common],
};
</script>
