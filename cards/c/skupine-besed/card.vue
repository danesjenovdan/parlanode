<template>
  <card-wrapper
    :id="$options.cardData.cardData._id"
    :content-class="{'is-loading': loading}"
    :card-url="generatedCardUrl"
    :header-config="headerConfig"
  >
    <div slot="info">
      <p class="info-text lead" v-t="'info.lead'"></p>
      <p class="info-text heading" v-t="'info.methodology'"></p>
      <p class="info-text" v-t="'info.text'"></p>
    </div>

    <div id="skupine-besed">
      <text-frame>
        <i18n path="wordgroups-text" tag="p">
          <span place="words">
            <tag
              v-for="(word, index) in words"
              :key="index + word"
              :text="word"
              @click="removeWord(word)"
            />
            <plus @click="toggleModal(true)" />
          </span>
          <span place="load">
            <load-link
              :text="$t('load')"
              @click="loadResults(true)"
            />
          </span>
        </i18n>
        <div class="row extras">
          <div class="col-xs-12">
            <div class="searchfilter-checkbox">
              <input
                id="rev"
                type="checkbox"
                class="checkbox"
                @click="changeShowRelative"
                :checked="showRelative">
              <label for="rev" v-t="'show-relative'"></label>
            </div>
          </div>
        </div>
      </text-frame>

      <p-tabs @switch="focusTab" :start-tab="selectedTab">
        <p-tab :label="$t('speakers')">
          <scroll-shadow ref="shadow">
            <div class="results" @scroll="$refs.shadow.check($event.currentTarget)">
              <bar-chart
                v-if="results.people.length"
                :data="showRelative ? resultsRelative.people : results.people"
                show-numbers
                :show-percentage="!showRelative"
                flexible-labels
              />
              <empty-circle
                v-else
                :text="emptyText"
              />
            </div>
          </scroll-shadow>
        </p-tab>
        <p-tab :label="$t('parties')">
          <scroll-shadow ref="shadowPS">
            <div class="results" @scroll="$refs.shadowPS.check($event.currentTarget)">
              <bar-chart
                v-if="results.parties.length"
                :data="showRelative ? resultsRelative.parties: results.parties"
                show-numbers
                :show-percentage="!showRelative"
                flexible-labels
              />
              <empty-circle
                v-else
                :text="emptyText"
              />
            </div>
          </scroll-shadow>
        </p-tab>
      </p-tabs>

      <modal
        v-if="modalShown"
        :header="$t('input-words')"
        :button="$t('confirm')"
        @close="toggleModal(false)"
        @ok="toggleModal(false, true)"
      >
        <search-field v-model="modalInputText" @enter="toggleModal(false, true)"/>
      </modal>
    </div>
  </card-wrapper>
</template>

<script>
import axios from 'axios';
import { getPersonPortrait, getPartyLink, getPersonLink } from 'components/links';

import stateLoader from 'helpers/stateLoader';
import common from 'mixins/common';
import BarChart from 'components/BarChart.vue';
import EmptyCircle from 'components/EmptyCircle.vue';
import LoadLink from 'components/LoadLink.vue';
import Modal from 'components/Modal.vue';
import Plus from 'components/Plus.vue';
import PTab from 'components/Tab.vue';
import PTabs from 'components/Tabs.vue';
import SearchField from 'components/SearchField.vue';
import Tag from 'components/Tag.vue';
import TextFrame from 'components/TextFrame.vue';
import ScrollShadow from 'components/ScrollShadow.vue';

export default {
  components: {
    BarChart,
    EmptyCircle,
    LoadLink,
    Modal,
    Plus,
    PTab,
    PTabs,
    SearchField,
    Tag,
    TextFrame,
    ScrollShadow,
  },
  mixins: [common],
  name: 'SkupineBesed',
  data() {
    const loadFromState = stateLoader(this.$options.cardData.parlaState);

    return {
      data: this.$options.cardData.data,
      emptyText: this.$t('empty-text'),
      headerConfig: {
        circleIcon: 'og-list',
        heading: '&nbsp;',
        subheading: '7. sklic parlamenta',
        alternative: this.$options.cardData.cardData.altHeader === 'true',
        title: this.$options.cardData.cardData.name,
      },
      showRelative: loadFromState('showRelative') || false,
      modalShown: false,
      modalInputText: '',
      results: {
        people: [],
        parties: [],
      },
      resultsRelative: {
        people: [],
        parties: [],
      },
      selectedTab: loadFromState('selectedTab') || 0,
      words: loadFromState('words') || [],
      loading: false,
    };
  },
  computed: {
    urlParameters() {
      const state = {};
      if (this.words.length > 0) {
        state.words = this.words;
      }
      if (this.selectedTab !== 0) {
        state.selectedTab = this.selectedTab;
      }
      if (this.showRelative) {
        state.showRelative = this.showRelative;
      }
      return state;
    },
    generatedCardUrl() {
      return `${this.url}?${Object.keys(this.urlParameters).length > 0 ? `state=${encodeURIComponent(JSON.stringify(this.urlParameters))}` : ''}`;
    },
  },
  methods: {
    focusTab(tab) {
      this.selectedTab = tab;
    },
    changeShowRelative() {
      this.showRelative = !this.showRelative;
    },
    toggleModal(newState, addWords = false) {
      if (addWords) {
        this.modalInputText
          .split(',')
          .map(word => word.trim())
          .forEach(this.addWord);
      }
      this.modalInputText = '';
      this.modalShown = newState;
    },
    addWord(word) {
      const position = this.words.indexOf(word);
      if (position === -1) {
        this.words.push(word);
      }
    },
    removeWord(word) {
      const position = this.words.indexOf(word);
      if (position > -1) {
        this.words.splice(position, 1);
      }
    },
    loadResults(user) {
      if (this.words.length < 2 || this.loading) {
        if (user) {
          // eslint-disable-next-line no-alert
          alert(this.$t('empty-text'));
        }
        return;
      }

      this.loading = true;

      const query = this.words
        .map(word => (word.indexOf(' ') > -1 ? `"${word}"` : word))
        .map(encodeURIComponent)
        .join('+');

      axios.get(`https://isci.parlameter.si/q/${query}`)
        .then((response) => {
          const scoreHigherThanZero = i => i.score > 0;

          const parties = response.data.facet_counts.facet_fields.party_e
            .filter(scoreHigherThanZero)
            .filter(party => party.party.acronym !== 'unknown')
            .map(party => ({
              label: party.party.acronym,
              // eslint-disable-next-line max-len
              value: Number((party.score / (this.data.orgs[party.party.id] / this.data.all_speeches)).toFixed(4) || 0),
              link: this.getPartyLink(party.party),
            }));

          const people = response.data.facet_counts.facet_fields.speaker_i
            .filter(scoreHigherThanZero)
            .map(person => ({
              label: person.person.name,
              // eslint-disable-next-line max-len
              value: Number((person.score / (this.data.people[person.person.id] / this.data.all_speeches)).toFixed(4)),
              link: this.getPersonLink(person.person),
              portrait: this.getPersonPortrait(person.person),
            }));

          this.resultsRelative = { parties, people };

          const parties2 = response.data.facet_counts.facet_fields.party_e
            .filter(scoreHigherThanZero)
            .filter(party => party.party.acronym !== 'unknown')
            .map(party => ({
              label: party.party.acronym,
              // eslint-disable-next-line max-len
              value: party.score,
              link: this.getPartyLink(party.party),
            }));

          const people2 = response.data.facet_counts.facet_fields.speaker_i
            .filter(scoreHigherThanZero)
            .map(person => ({
              label: person.person.name,
              // eslint-disable-next-line max-len
              value: person.score,
              link: this.getPersonLink(person.person),
              portrait: this.getPersonPortrait(person.person),
            }));

          this.results = { parties: parties2, people: people2 };

          this.loading = false;
        });
    },
    getPartyLink(party) {
      return party.id === -1 ? '' : getPartyLink(party);
    },
    getPersonLink,
    getPersonPortrait,
  },
  mounted() {
    if (this.words.length) {
      this.loadResults();
    }
  },
};
</script>

<style lang="scss" scoped>
@import '~parlassets/scss/breakpoints';

.results {
  height: 400px;
  padding-top: 12px;
  overflow-y: auto;
}

.extras {
  margin: 40px 0 -20px;
}

.searchfilter-checkbox {
  height: 40px;
  text-align: center;

  @include respond-to(mobile) {
    height: auto;
    margin-left: -70px;
    margin-right: -70px;
  }

  label {
    text-align: left;
    margin-bottom: 0;
    width: auto;
  }

  .checkbox + label:before {
    background-color: #f0f5f8;
  }

  .checkbox + label {
    font-size: 11px;
    color: #555555;
    white-space: nowrap;
  }
}

#skupine-besed {
  /deep/ .p-tabs .p-tabs-content,
  /deep/ .p-tabs .p-tabs-content .tab-content {
    overflow-y: visible;
    overflow-x: visible;
  }

  .results {
    margin-top: 6px;
  }
}
</style>
