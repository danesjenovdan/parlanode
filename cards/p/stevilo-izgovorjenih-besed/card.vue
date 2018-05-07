<template>
  <score-avg-max
    :card-data="$options.cardData"
    :type="$options.cardData.cardData.type"
    :person="$options.cardData.data.person"
    :results="$options.cardData.data.results"
  >
    <div slot="info">
      <p class="info-text lead">
        Število besed, ki jih je {{vocabulary.poslanec[gender]}} {{vocabulary.izgovoriti[gender]}} v vseh svojih dosedanjih govorih v DZ v primerjavi s povprečno in največjo vrednostjo.
      </p>
      <p class="info-text heading">METODOLOGIJA</p>
      <p class="info-text">
        Seštejemo besede v govorih {{vocabulary.poslanca[gender]}}, ki jih najdemo v transkriptih, pridobljenih s spletnega mesta <a href="https://www.dz-rs.si/wps/portal/Home/deloDZ/seje/sejeDrzavnegaZbora/PoDatumuSeje" target="_blank" class="funblue-light-hover">DZ RS</a>.
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
