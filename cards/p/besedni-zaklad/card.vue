<template>
  <score-avg-max
    :card-data="$options.cardData"
    :type="$options.cardData.cardData.type"
    :person="$options.cardData.data.person"
    :results="$options.cardData.data.results"
  >
    <div slot="info">
      <p class="info-text lead">
        Raznolikost besedišča, ki ga uporablja {{vocabulary.poslanec[gender]}} v svojih govorih v primerjavi s povprečno in največjo vrednostjo.
      </p>
      <p class="info-text heading">METODOLOGIJA</p>
      <p class="info-text">
        Iz vseh {{vocabulary.poslanca[gender]}} govorov preštejemo unikatne besede ter število vseh izgovorjenih besed. Potem preštejemo, kolikokrat se vsaka unikatna beseda pojavi. Razdelimo jih v kategorije, tako da združimo vse besede, ki se ponovijo enkrat, dvakrat, trikrat itn.
      </p>
      <p class="info-text">
        Na koncu izračunamo koeficient, kjer nad ulomkovo črto postavimo število vseh unikatnih izgovorjenih besed, pod ulomkovo črto pa število besed, ki se ponovijo z neko frekvenco (enkrat, dvakrat, trikrat ...) in množimo s frekvenco na kvadrat (ena na kvadrat, dva na kvadrat, tri na kvadrat ...).
      </p>
      <p class="info-text">
        Za poved "Danes je nov dan in danes je dan za Parlameter" je rezultat: 7 / ((3*2^2) + (4*1^2)) = 0,4375
      </p>
    </div>
  </score-avg-max>
</template>

<script>
import common from 'mixins/common';
import ScoreAvgMax from 'components/ScoreAvgMax.vue';

export default {
  name: 'RaznolikostBesedisca',
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
