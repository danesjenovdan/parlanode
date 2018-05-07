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
      <div class="progress_flex">
        <div class="column-title progress_title">
          <div class="me_poslanec">
            <div class="poslanec_title">
              {{ getName }}
            </div>
          </div>
          <div class="other_poslanec">
            <div class="poslanec_title">
              Povprečje
            </div>
          </div>
          <div class="other_poslanec">
            <div class="poslanec_title">
              Največ
            </div>
          </div>
        </div>
        <div class="column-bar progress_bar">
          <div class="me_poslanec">
            <div class="progress smallbar">
              <div class="progress-bar red" role="progressbar" :aria-valuenow="getScore" aria-valuemin="0" aria-valuemax="100" :style="getBarStyle('score')">
                <span class="sr-only">{{ getScore }}%</span>
                <div class="progress_number">
                  {{ Math.round(getScore) }}
                </div>
              </div>
            </div>
          </div>
          <div class="other_poslanec">
            <div class="progress smallbar">
              <div class="progress-bar funblue" role="progressbar" :aria-valuenow="results.average" aria-valuemin="0" aria-valuemax="100" :style="getBarStyle('average')">
                <span class="sr-only">{{ results.average }}%</span>
                <div class="progress_number">
                  {{ Math.round(results.average) }}
                </div>
              </div>
            </div>
          </div>
          <div class="other_poslanec">
            <div class="progress smallbar">
              <div class="progress-bar funblue" role="progressbar" :aria-valuenow="getMaxValue" aria-valuemin="0" aria-valuemax="100" :style="getBarStyle('max')">
                <span class="sr-only">{{ getMaxValue }}%</span>
                <template v-if="type === 'poslanec'">
                  <person-pin v-for="mp in results.max.mps" :person="mp" :key="mp.gov_id" />
                </template>
                <template v-else>
                  <party-pin v-for="pg in results.maxPG" :party="pg" :key="pg.id" />
                </template>
              </div>
            </div>
          </div>
        </div>
        <div class="column-number">
          <div class="me_poslanec">
            <div class="progress_number invisible">&nbsp;</div>
          </div>
          <div class="other_poslanec">
            <div class="progress_number invisible">&nbsp;</div>
          </div>
          <div class="other_poslanec">
            <div class="progress_number">
              {{ Math.round(getMaxValue) }}
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
      if (key === 'max') {
        return { width: '100%' };
      }
      if (key === 'score') {
        return { width: `${(this.getScore / this.getMaxValue) * 100}%` };
      }
      return { width: `${(this.results[key] / this.getMaxValue) * 100}%` };
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
    getScore() {
      return this.results.score != null ? this.results.score : this.results.organization_value;
    },
    getMaxValue() {
      return this.results.max ? this.results.max.score : this.results.maximum;
    },
  },
};
</script>

<style lang="scss" scoped>
.progress {
  overflow: visible; /* this overrides bootstrap which we should get rid of anyway */
}
.column-title .poslanec_title {
  line-height: 20px;
  margin-top: 5px;
  margin-bottom: 5px;
  margin-right: 10px;
}
.column-title .me_poslanec {
  display: flex;
  align-items: center;
  height: 54px;
}
.column-number .progress_number {
  padding-left: 20px;
  line-height: 30px;
}
.me_poslanec,
.other_poslanec {
  padding-top: 12px;
  padding-bottom: 12px;
}
.column-bar .progress-bar {
  position: relative;
}
.column-bar .progress_number {
  position: absolute;
  right: 0;
  transform: translateX(100%);
  color: #333;
  line-height: 30px;
}
</style>
