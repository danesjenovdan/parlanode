<template>
  <card-wrapper
    :id="cardData.cardData._id"
    class="card-halfling"
    :data-id="`${cardData.cardData.group}/${cardData.cardData.method}`"
    :card-url="generatedCardUrl"
    :header-config="headerConfig"
  >
    <div slot="info" v-html="infoText"></div>

    <div
      class="card-content-front"
      v-cloak
    >
      <div class="me_poslanec clearfix progress_flex">
        <div class="column progress_title">
          <span class="poslanec_title">
            {{ person.name }}
          </span>
        </div>
        <div class="column progress_bar">
          <div class="progress smallbar ">
            <div class="progress-bar red" role="progressbar" :aria-valuenow="results.sessions.score" aria-valuemin="0" aria-valuemax="100" :style="{ width: `${(results.sessions.score / 100) * 73}%`}">
              <span class="sr-only">{{ results.sessions.score }}%</span>
            </div>
            <div class="progress_number">
              {{ Math.round(results.sessions.score) }}
            </div>
          </div>
        </div>
      </div>

      <div class="other_poslanec clearfix progress_flex">
        <div class="column progress_title">
          <span class="poslanec_title">
            Povprečje
          </span>
        </div>
        <div class="column progress_bar">
          <div class="progress smallbar avgmin">
            <div class="progress-bar funblue" role="progressbar" :aria-valuenow="results.sessions.average" aria-valuemin="0" aria-valuemax="100" :style="{width: `${(results.sessions.average / 100) * 73}%`}">
              <span class="sr-only">{{ results.sessions.average }}%</span>
            </div>
            <div class="progress_number">
              {{ Math.round(results.sessions.average) }}
            </div>
          </div>
        </div>
      </div>

      <div class="other_poslanec clearfix progress_flex">
        <div class="column progress_title">
          <span class="poslanec_title">
            Največ
          </span>
        </div>
        <div class="column progress_bar">
          <div class="progress smallbar avgmin">
            <div class="progress-bar funblue" role="progressbar" :aria-valuenow="results.sessions.max.score" aria-valuemin="0" aria-valuemax="100" :style="{ width: `${(results.sessions.max.score / 100) * 73}%` }">
              <span class="sr-only">{{ results.sessions.max.score }}%</span>
              <person-pin
                v-for="mp in results.sessions.max.mps"
                :person="mp"
                :key="mp.gov_id"></person-pin>
            </div>
            <div class="progress_number">
              {{ Math.round(results.sessions.max.score) }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </card-wrapper>
</template>

<script>
import common from 'mixins/common';
import slugs from '../../assets/urls.json';
import PersonPin from 'components/PersonPin.vue';

export default {
  name: 'ScoreAvgMax',
  
  mixins: [common],

  components: {
    PersonPin,
  },
  
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
      default: '<p class="info-text">Info tekst manjka. Če to vidiš, prosim sporoči programerjem, naj ga dodajo.</p>',
    },
    results: {
      type: Object,
      required: true,
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
.progress {
  overflow: visible; /* this overrides bootstrap which we should get rid of anyway */
}
</style>
