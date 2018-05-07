<template>
  <card-wrapper
    :id="cardData.cardData._id"
    class="card-halfling"
    :data-id="`${cardData.cardData.group}/${cardData.cardData.method}`"
    :card-url="generatedCardUrl"
    :header-config="headerConfig"
  >
    <slot name="info" slot="info"></slot>

    <div class="card-content-front" v-cloak>
      <div class="me_poslanec clearfix progress_flex">
        <div class="column progress_title">
          <span class="poslanec_title">
            {{ getName }}
          </span>
        </div>
        <div class="column progress_bar">
          <div class="progress smallbar ">
            <div class="progress-bar red" role="progressbar" :aria-valuenow="results.score" aria-valuemin="0" aria-valuemax="100" :style="getBarStyle('score')">
              <span class="sr-only">{{ results.score }}%</span>
            </div>
            <div class="progress_number">
              {{ Math.round(results.score) }}
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
            <div class="progress-bar funblue" role="progressbar" :aria-valuenow="results.average" aria-valuemin="0" aria-valuemax="100" :style="getBarStyle('average')">
              <span class="sr-only">{{ results.average }}%</span>
            </div>
            <div class="progress_number">
              {{ Math.round(results.average) }}
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
            <div class="progress-bar funblue" role="progressbar" :aria-valuenow="results.max.score" aria-valuemin="0" aria-valuemax="100" :style="getBarStyle('max')">
              <span class="sr-only">{{ results.max.score }}%</span>

              <person-pin
                v-if="type==='poslanec'"
                v-for="mp in results.max.mps"
                :person="mp"
                :key="mp.gov_id"></person-pin>

              <party-pin
                v-if="type==='poslanska_skupina'"
                v-for="pg in results.max.pgs"
                :party="pg"
                :key="pg.id"></party-pin>
            </div>
            <div class="progress_number">
              {{ Math.round(results.max.score) }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </card-wrapper>
</template>

<script>
import common from 'mixins/common';
import PersonPin from 'components/PersonPin.vue';
import PartyPin from 'components/PartyPin.vue';

export default {
  name: 'ScoreAvgMax',
  mixins: [common],
  components: {
    PersonPin,
    PartyPin,
  },
  props: {
    cardData: {
      type: Object,
      required: true,
    },
    type: {
      type: String,
      required: true,
      validator: value => ['poslanec', 'poslanska_skupina'].indexOf(value) > -1,
    },
    results: {
      type: Object,
      required: true,
    },
    person: Object,
    party: Object,
  },
  methods: {
    getBarStyle(key) {
      const mult = 83; // make room for numbers
      if (key === 'max') {
        return { width: `${1 * mult}%` };
      }
      return { width: `${(this.results[key] / this.results.max.score) * mult}%` };
    },
  },
  computed: {
    getName() {
      return this.type === 'poslanec'
        ? this.person.name
        : this.party.acronym;
    },
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
      specifics.alternative = JSON.parse(this.cardData.cardData.altHeader || 'false');
      specifics.title = this.cardData.cardData.name;
      return specifics;
    },
    cardGroup: () => this.cardData.cardData.group,
    cardMethod: () => this.cardData.cardData.method,
    generatedCardUrl() {
      if (this.type === 'poslanec') {
        return `${this.url}${this.person.id}?altHeader=true`;
      }
      return `${this.url}${this.party.id}?altHeader=true`;
    },
  },
};
</script>

<style lang="scss" scoped>
.progress {
  overflow: visible; /* this overrides bootstrap which we should get rid of anyway */
}
</style>
