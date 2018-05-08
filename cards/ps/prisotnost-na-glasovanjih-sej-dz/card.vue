<template>
  <score-avg-max
    :card-data="$options.cardData"
    :type="$options.cardData.cardData.type"
    :party="$options.cardData.data.organization"
    :results="$options.cardData.data.votes"
  >
    <div slot="info">
      <p class="info-text lead">
        Prisotnost poslanske skupine na glasovanjih DZ v primerjavi s povprečjem in največjo vrednostjo.
      </p>
      <p class="info-text heading">METODOLOGIJA</p>
      <p class="info-text">
        Število glasovanj, ko je poslanska skupina prisotna na glasovanjih delimo s številom vseh glasovanj in normaliziramo (min 1 - max 100).
      </p>
    </div>
  </score-avg-max>
</template>

<script>
import common from 'mixins/common';
import ScoreAvgMax from 'components/ScoreAvgMax.vue';

export default {
  name: 'PrisotnostNaGlasovanjihSejDz',
  components: {
    ScoreAvgMax,
  },
  mixins: [common],
};
</script>
