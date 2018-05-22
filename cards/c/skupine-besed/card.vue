<template>
  <card-wrapper
    :id="$options.cardData.cardData._id"
    :content-class="{'is-loading': loading}"
    :card-url="url"
    :header-config="headerConfig">

    <div slot="info">
      <p class="info-text lead"></p>
      <p class="info-text heading">METODOLOGIJA</p>
      <p class="info-text"></p>
    </div>

    <text-frame>
      Pokaži mi, kdo največ omenja naslednjo skupino besed:
      <tag
        v-for="(word, index) in words"
        :key="index + word"
        :text="word"
        @click="removeWord(word)"
      />
      <plus @click="toggleModal(true)" />
      <load-link
        text="Naloži"
        @click="loadResults"
      />
    </text-frame>

    <p-tabs :start-tab="selectedTab">
      <p-tab label="Poslanci">
        <div class="results">
          <bar-chart
            v-if="results.people.length"
            :data="results.people"
            show-numbers
            flexible-labels
          />
          <empty-circle
            v-else
            :text="emptyText"
          />
        </div>
      </p-tab>
      <p-tab label="Poslanske skupine">
        <div class="results">
          <bar-chart
            v-if="results.parties.length"
            :data="results.parties"
            show-numbers
            flexible-labels
          />
          <empty-circle
            v-else
            :text="emptyText"
          />
        </div>
      </p-tab>
    </p-tabs>

    <modal
      v-if="modalShown"
      header="Vnesi posamezno besedo ali več besed, ločenih z vejico."
      button="Potrdi"
      @close="toggleModal(false)"
      @ok="toggleModal(false, true)"
    >
      <search-field v-model="modalInputText" />
    </modal>
  </card-wrapper>
</template>

<script>
import axios from 'axios';
import { getPersonPortrait, getPartyLink, getPersonLink } from 'components/links';

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
  },
  mixins: [common],
  name: 'SkupineBesed',
  data() {
    return {
      data: this.$options.cardData.data,
      emptyText: 'Za prikaz rezultatov dodaj vsaj dve besedi.',
      headerConfig: {
        circleIcon: 'og-list',
        heading: '&nbsp;',
        subheading: '7. sklic parlamenta',
        alternative: this.$options.cardData.cardData.altHeader === 'true',
        title: this.$options.cardData.cardData.name,
      },
      modalShown: false,
      modalInputText: '',
      results: {
        people: [],
        parties: [],
      },
      selectedTab: this.$options.cardData.parlaState.selectedTab || 0,
      words: ['druga svetovna vojna', 'partizan'],
      loading: false,
    };
  },
  methods: {
    measurePiwik(filter, sort, order) {
      if (typeof measure === 'function') {
        if (sort !== '') {
          measure('s', 'session-sort', `${sort} ${order}`, '');
        } else if (filter !== '') {
          measure('s', 'session-filter', filter, '');
        }
      }
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
      if (position === -1) this.words.push(word);
    },
    removeWord(word) {
      const position = this.words.indexOf(word);
      if (position > -1) this.words.splice(position, 1);
    },
    loadResults() {
      if (this.words.length < 2 || this.loading) return;
      this.loading = true;

      const query = this.words
        .map(word => (word.indexOf(' ') > -1 ? `"${word}"` : word))
        .map(encodeURIComponent)
        .join('+');

      axios.get(`https://isci.parlameter.si/q/${query}`).then((response) => {
        const scoreHigherThanZero = i => i.score > 0;

        const parties = response.data.facet_counts.facet_fields.party_e
          .filter(scoreHigherThanZero)
          .map(party => ({
            label: party.party.acronym === 'unknown' ? 'Zunanji govorci' : party.party.acronym,
            value: party.score,
            link: this.getPartyLink(party.party),
          }));

        const people = response.data.facet_counts.facet_fields.speaker_i
          .filter(scoreHigherThanZero)
          .map(person => ({
            label: person.person.name,
            value: person.score,
            link: this.getPersonLink(person.person),
            portrait: this.getPersonPortrait(person.person),
          }));

        this.results = { parties, people };
        this.loading = false;
      });
    },
    getPartyLink(party) {
      return party.id === -1 ? '' : getPartyLink(party);
    },
    getPersonLink,
    getPersonPortrait,
  },
};
</script>

<style lang="scss" scoped>
.results {
  height: 400px;
  padding-top: 12px;
  overflow-y: auto;
}
</style>
