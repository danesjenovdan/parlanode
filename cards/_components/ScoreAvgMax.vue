<template>
  <div
    :id="cardData.cardData._id"
    :class="['card-container', 'card-halfling', 'card-seznam-poslancev', transitionClass]"
    :data-id="`${cardData.cardData.group}/${cardData.cardData.method}`"
  >
    <card-header :config="headerConfig" :current-back="currentBack" />

    <div class="card-content">
      <div class="card-content-front" v-cloak>
        bla
      </div>

      <card-info v-if="currentBack === 'info'">
        <div v-html="infoText"></div>
      </card-info>

      <card-embed
        v-else-if="currentBack === 'embed'"
        :url="generatedCardUrl"
      ></card-embed>

      <card-share
        v-else-if="currentBack === 'share'"
        :url="generatedCardUrl"
      ></card-share>
    </div>
    
    <card-footer @toggleBack="toggleBack"></card-footer>
  </div>
</template>

<script>
import common from 'mixins/common';

export default {
  name: 'ScoreAvgMax',
  
  mixins: [common],
  
  props: {
    cardData: {
      type: Object,
      required: true,
    },
    type: {
      type: String,
      required: true,
      validator: value => ['poslanec', 'party'].indexOf(value) > -1,
    },
    infoText: {
      type: String,
      default: '',
    },
    person: Object,
    party: Object,
    generatedCardUrl: String,
  },

  data() {

    return {
      vocabulary: this.cardData.vocab,
    };
  },

  computed: {
    headerConfig() {
      let specifics;
      if (this.type === 'poslanec') {
        specifics = {
          heading: this.person.name,
          subheading: `${this.person.party.acronym} | ${this.person.party.is_coalition ? 'koalicija' : 'opozicija'}`,
          circleImage: this.person.gov_id,
        };
      } else {
        specifics = {
          heading: this.party.name,
          subheading: `${this.party.acronym} | ${this.party.is_coalition ? 'koalicija' : 'opozicija'}`,
          circleText: this.party.acronym,
          circleClass: `${this.party.acronym.replace(/ /g, '_').toLowerCase()}-background`,
        };
      }

      return Object.assign({}, specifics, {
        alternative: JSON.parse(this.cardData.cardData.altHeader || 'false'),
        title: this.cardData.cardData.name,
      });
    },

    cardGroup: () => this.cardData.cardData.group,
    cardMethod: () => this.cardData.cardData.method,
  },

  mounted() {
    console.log(this.cardData);
  }
}
</script>

<style lang="scss" scoped>

</style>
