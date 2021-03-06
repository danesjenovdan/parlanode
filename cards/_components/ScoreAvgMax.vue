<template>
  <card-wrapper
    :id="cardData.mountId"
    :card-url="generatedCardUrl"
    :header-config="headerConfig"
    :og-config="ogConfig"
    content-class="half"
  >
    <slot slot="info" name="info"></slot>

    <div v-if="getMaxValue <= 0">
      <div v-t="'no-results'" class="no-results" />
    </div>
    <div v-else v-cloak class="card-content-front">
      <div class="progress_flex">
        <div class="column-title progress_title">
          <div class="me_poslanec">
            <div class="poslanec_title">
              {{ getName }}
            </div>
          </div>
          <div class="other_poslanec">
            <div v-t="'average'" class="poslanec_title"></div>
          </div>
          <div class="other_poslanec">
            <div v-t="'maximum'" class="poslanec_title"></div>
          </div>
        </div>
        <div class="column-bar progress_bar">
          <div class="me_poslanec">
            <div class="progress smallbar">
              <div
                :aria-valuenow="getScore"
                :style="getBarStyle('score')"
                class="progress-bar this"
                role="progressbar"
                aria-valuemin="0"
                aria-valuemax="100"
              >
                <span class="sr-only">{{ getScore }}%</span>
                <div class="progress_number">
                  {{ getScore.toFixed(precision) }}
                </div>
              </div>
            </div>
          </div>
          <div class="other_poslanec">
            <div class="progress smallbar">
              <div
                :aria-valuenow="results.average"
                :style="getBarStyle('average')"
                class="progress-bar other"
                role="progressbar"
                aria-valuemin="0"
                aria-valuemax="100"
              >
                <span class="sr-only">{{ results.average }}%</span>
                <div class="progress_number">
                  {{ results.average.toFixed(precision) }}
                </div>
              </div>
            </div>
          </div>
          <div class="other_poslanec">
            <div class="progress smallbar">
              <div
                :aria-valuenow="getMaxValue"
                :style="getBarStyle('max')"
                class="progress-bar other"
                role="progressbar"
                aria-valuemin="0"
                aria-valuemax="100"
              >
                <span class="sr-only">{{ getMaxValue }}%</span>
                <template v-if="type === 'person'">
                  <person-pin v-for="mp in results.max.mps" :person="mp" :key="mp.gov_id" />
                </template>
                <template v-else>
                  <party-pin v-for="pg in getMaxPGs" :party="pg" :key="pg.id" />
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
              {{ getMaxValue.toFixed(precision) }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </card-wrapper>
</template>

<script>
import common from 'mixins/common';
import {
  memberOverview,
  partyOverview,
  memberVotes,
  partyVotes,
  memberSpeeches,
  partySpeeches,
} from 'mixins/contextUrls';
import { memberTitle, partyTitle } from 'mixins/titles';
import { memberHeader, partyHeader } from 'mixins/altHeaders';
import { memberOgImage, partyOgImage } from 'mixins/ogImages';
import PersonPin from 'components/PersonPin.vue';
import PartyPin from 'components/PartyPin.vue';

export default {
  name: 'ScoreAvgMax',
  components: {
    PersonPin,
    PartyPin,
  },
  mixins: [
    common,
  ],
  props: {
    cardData: {
      type: Object,
      required: true,
    },
    type: {
      type: String,
      required: true,
      validator: value => ['person', 'party'].indexOf(value) > -1,
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
    context: {
      type: String,
      default: 'overview',
      validator: value => ['overview', 'votings', 'speeches'].indexOf(value) > -1,
    },
    precision: {
      type: Number,
      default: 0,
    },
  },
  computed: {
    getName() {
      return this.type === 'person'
        ? this.person.name
        : this.party.acronym;
    },
    headerConfig() {
      if (this.type === 'person') {
        return memberHeader.computed.headerConfig.call(this);
      }
      return partyHeader.computed.headerConfig.call(this);
    },
    ogConfig() {
      if (this.type === 'person') {
        return memberOgImage.computed.ogConfig.call(this);
      }
      return partyOgImage.computed.ogConfig.call(this);
    },
    generatedCardUrl() {
      if (this.type === 'person') {
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
    getMaxPGs() {
      if (this.results.max) {
        return this.results.max.pgs ? this.results.max.pgs : this.results.max.parties;
      }
      return this.results.maxPG;
    },
  },
  created() {
    (this.type === 'person' ? memberTitle : partyTitle).created.call(this);
    if (this.context === 'overview') {
      (this.type === 'person' ? memberOverview : partyOverview).created.call(this);
    } else if (this.context === 'votings') {
      (this.type === 'person' ? memberVotes : partyVotes).created.call(this);
    } else if (this.context === 'speeches') {
      (this.type === 'person' ? memberSpeeches : partySpeeches).created.call(this);
    }
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
};
</script>

<style lang="scss" scoped>
@import '~parlassets/scss/colors';

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
  color: $font-default;
  line-height: 30px;
}
</style>
