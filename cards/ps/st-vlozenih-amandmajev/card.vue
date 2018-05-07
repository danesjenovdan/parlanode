<template>
  <score-avg-max
    :card-data="$options.cardData"
    :type="$options.cardData.cardData.type"
    :party="$options.cardData.data.organization"
    :results="$options.cardData.data.result"
  >
    <div slot="info">
      <p class="info-text lead">
        Št. amandmajev, ki jih je vložila ta poslanska skupina v primerjavi s povprečno in najvišjo vrednostjo med vsemi poslanskimi skupinami.
      </p>
      <p class="info-text heading">METODOLOGIJA</p>
      <p class="info-text">
        Število sedežev posamezne poslanske skupine dobimo tako, da preštejemo vse njihove trenutno aktivne člane. Podatke pridobivamo s spletnega mesta <a href="http://www.dz-rs.si/wps/portal/Home/ODrzavnemZboru/KdoJeKdo/PoslanskeSkupine" target="_blank" class="funblue-light-hover">DZ RS</a>.
      </p>
    </div>
  </score-avg-max>
</template>

<script>
import common from 'mixins/common';
import ScoreAvgMax from 'components/ScoreAvgMax.vue';

export default {
  name: 'StVlozenihAmandmajev',
  components: {
    ScoreAvgMax,
  },
  mixins: [common],
};
</script>
