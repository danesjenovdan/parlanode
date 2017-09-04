<template>
  <score-avg-max
    :card-data="$options.cardData"
    :type="$options.cardData.cardData.type"
    :person="$options.cardData.data.person"
    v-bind="{ generatedCardUrl }"></score-avg-max>
</template>

<script>
import urlFunctionalities from 'mixins/urlFunctionalities';
import ScoreAvgMax from 'components/ScoreAvgMax.vue';

export default {
  name: 'PrisotnostNaSejahDz',

  components: {
    ScoreAvgMax,
  },

  mixins: [
    urlFunctionalities,
  ],

  data() {
    return {
      urlParameters: {},
    }
  },

  mounted() {
    console.log(this.$options.cardData);
  },
}
</script>
