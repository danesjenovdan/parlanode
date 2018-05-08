<template>
  <score-avg-max
    :card-data="$options.cardData"
    :type="$options.cardData.cardData.type"
    :party="$options.cardData.data.organization"
    :results="$options.cardData.data.sessions"
  >
    <div slot="info">
      <p class="info-text lead">
        Prisotnost poslanske skupine na sejah DZ v primerjavi s povprečno in največjo vrednostjo.
      </p>
      <p class="info-text heading">METODOLOGIJA</p>
      <p class="info-text">
        Za vsako sejo in vsako poslansko skupino preverimo, koliko članic in članov je na seji govorilo in/ali glasovalo vsaj enkrat. Ko vse seje seštejemo, seštevek delimo s številom sej pomnoženim s številom poslank in poslancev v poslanski skupini. Na koncu normaliziramo (min 1 - max 100).
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
};
</script>
