<template>
  <card-wrapper
    :id="cardData.cardData._id"
    :data-id="`${cardData.cardData.group}/${cardData.cardData.method}`"
    :card-url="generatedCardUrl"
    :header-config="headerConfig"
    class="card-halfling"
  >
    <slot slot="info" name="info"></slot>

    <div v-cloak class="card-content-front">
      <div class="progress_flex">
        <div class="column-title progress_title">
          <div class="me_poslanec">
            <div v-t="'style-scores.elevated-vocabulary'" class="poslanec_title"></div>
          </div>
          <div class="me_poslanec">
            <div v-t="'style-scores.simple-vocabulary'" class="poslanec_title"></div>
          </div>
          <div class="me_poslanec">
            <div v-t="'style-scores.excessive-vocabulary'" class="poslanec_title"></div>
          </div>
        </div>
        <div class="column-bar progress_bar">
          <div class="me_poslanec">
            <div class="progress smallbar">
              <div
                :aria-valuenow="results.privzdignjeno"
                :style="getBarStyle('privzdignjeno')"
                class="progress-bar funblue"
                role="progressbar"
                aria-valuemin="0"
                aria-valuemax="100"
              >
                <span class="sr-only">{{ results.privzdignjeno.toFixed(2) }}%</span>
                <div class="progress_number">
                  {{ results.privzdignjeno.toFixed(2).replace('.', ',') }}
                </div>
              </div>
            </div>
          </div>
          <div class="me_poslanec">
            <div class="progress smallbar">
              <div
                :aria-valuenow="results.preprosto"
                :style="getBarStyle('preprosto')"
                class="progress-bar funblue"
                role="progressbar"
                aria-valuemin="0"
                aria-valuemax="100"
              >
                <span class="sr-only">{{ results.preprosto.toFixed(2) }}%</span>
                <div class="progress_number">
                  {{ results.preprosto.toFixed(2).replace('.', ',') }}
                </div>
              </div>
            </div>
          </div>
          <div class="me_poslanec">
            <div class="progress smallbar">
              <div
                :aria-valuenow="results.problematicno"
                :style="getBarStyle('problematicno')"
                class="progress-bar funblue"
                role="progressbar"
                aria-valuemin="0"
                aria-valuemax="100"
              >
                <span class="sr-only">{{ results.problematicno.toFixed(2) }}%</span>
                <div class="progress_number">
                  {{ results.problematicno.toFixed(2).replace('.', ',') }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </card-wrapper>
</template>

<script>
import common from 'mixins/common';
import { memberHeader, partyHeader } from 'mixins/altHeaders';
import PersonPin from 'components/PersonPin.vue';
import PartyPin from 'components/PartyPin.vue';

export default {
  name: 'ScoreAvgMax',
  components: {
    PersonPin,
    PartyPin,
  },
  mixins: [common],
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
    person: {
      type: Object,
      default: () => ({}),
    },
    party: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    headerConfig() {
      if (this.type === 'poslanec') {
        return memberHeader.computed.headerConfig.call(this);
      }
      return partyHeader.computed.headerConfig.call(this);
    },
    cardGroup: () => this.cardData.cardData.group,
    cardMethod: () => this.cardData.cardData.method,
    generatedCardUrl() {
      if (this.type === 'poslanec') {
        return `${this.url}${this.person.id}?altHeader=true`;
      }
      return `${this.url}${this.party.id}?altHeader=true`;
    },
    maxValue() {
      return Math.max(
        this.results.privzdignjeno,
        this.results.preprosto,
        this.results.problematicno,
      );
    },
  },
  methods: {
    getBarStyle(key) {
      return { width: `${(this.results[key] / this.maxValue) * 70}%` };
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
.me_poslanec {
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
