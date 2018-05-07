<template>
  <score-avg-max
    :card-data="$options.cardData"
    :type="$options.cardData.cardData.type"
    :person="$options.cardData.data.person"
    :results="$options.cardData.data.results"
  >
    <div slot="info">
      <p class="info-text lead">
        Povprečno število govorov {{vocabulary.poslanec3[gender]}} na sejo v primerjavi s povprečno in največjo vrednostjo.
      </p>
      <p class="info-text heading">METODOLOGIJA</p>
      <p class="info-text">
        Preštejemo {{vocabulary.poslanca2[gender]}} govore, ki jih najdemo v transkriptih, pridobljenih s spletnega mesta <a href="https://www.dz-rs.si/wps/portal/Home/deloDZ/seje/sejeDrzavnegaZbora/PoDatumuSeje" target="_blank" class="funblue-light-hover">DZ RS</a> in število delimo s številom sej, na katerih je {{vocabulary.biti[gender]}} {{vocabulary.poslanec[gender]}} {{vocabulary.prisoten2[gender]}}. Število vseh govorov delimo najprej s številom poslancev, potem pa še s številom vseh sej (na katerih se je govorilo). Individualni rezultat primerjamo s povprečnim in najvišjim.
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
