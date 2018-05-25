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
        @click="loadResults(true)"
      />
    </text-frame>

    <p-tabs :start-tab="selectedTab">
      <p-tab label="Poslanci">
        <div class="results">
          <sortable-table
            v-if="results.people.length"
            class="person-list"
            :columns="columns"
            :items="mappedMembers"
            :sort="currentSort"
            :sort-order="currentSortOrder"
            :sort-callback="selectSort"
          />
          <!-- <bar-chart
            v-if="results.people.length"
            :data="results.people"
            show-numbers
            flexible-labels
          /> -->
          <empty-circle
            v-else
            :text="emptyText"
          />
        </div>
      </p-tab>
      <p-tab label="Poslanske skupine">
        <div class="results">
          <sortable-table
            v-if="results.people.length"
            class="person-list"
            :columns="columns"
            :items="mappedParties"
            :sort="currentSort"
            :sort-order="currentSortOrder"
            :sort-callback="selectSort"
          />
          <!-- <bar-chart
            v-if="results.parties.length"
            :data="results.parties"
            show-numbers
            flexible-labels
          /> -->
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
      <search-field v-model="modalInputText" @enter="toggleModal(false, true)"/>
    </modal>
  </card-wrapper>
</template>

<script>
import axios from 'axios';
import { getPersonPortrait, getPartyLink, getPersonLink } from 'components/links';

import stateLoader from 'helpers/stateLoader';
import common from 'mixins/common';
import BarChart from 'components/BarChart.vue';
import SortableTable from 'components/SortableTable.vue';
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
    SortableTable,
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
    const loadFromState = stateLoader(this.$options.cardData.parlaState);

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
      selectedTab: loadFromState('selectedTab') || 0,
      words: loadFromState('words') || [],
      loading: false,
      sums: {},
      normalize: true,

      currentSort: 'metric',
      currentSortOrder: 'desc',
      columns: [
        {
          id: 'image',
          label: '',
          additionalClass: 'portrait'
        }, {
          id: 'name',
          label: 'Ime',
          additionalClass: 'wider name',
        }, {
          id: 'absolute',
          label: 'Št. vseh govorov',
          additionalClass: '',
        }, {
          id: 'metric',
          label: 'Relativno št. govorov',
          additionalClass:  '',
        },
      ],
    };
  },
  computed: {
    mappedMembers() {
      return this.results.people.sort((a, b) => {
        switch (this.currentSort) {
          case 'absolute':
            if (this.currentSortOrder === 'asc') {
              return a[2] - b[2];
            }
            return b[2] - a[2];
          case 'metric':
            if (this.currentSortOrder === 'asc') {
              return a[3] - b[3];
            }
            return b[3] - a[3];
        }
      });
    },
    mappedParties() {
      return this.results.parties.sort((a, b) => {
        console.log(this.currentSort, this.currentSortOrder);
        switch (this.currentSort) {
          case 'absolute':
            if (this.currentSortOrder === 'asc') {
              return a[2] - b[2];
            }
            return b[2] - a[2];
          case 'metric':
            if (this.currentSortOrder === 'asc') {
              return a[3] - b[3];
            }
            return b[3] - a[3];
        }
      });
    },
    urlParameters() {
      const parameters = {};

      if (this.words.length > 0) {
        parameters.words = this.words;
      }
      if (this.selectedTab !== 0) {
        parameters.selectedTab = this.selectedTab;
      }

      return parameters;
    },
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
    selectSort(sort) {
      if (this.currentSort === sort) {
        if  (this.currentSortOrder === 'asc') {
          this.currentSortOrder = 'desc';
        } else {
          this.currentSortOrder = 'asc';
        }
      } else {
        this.currentSort = sort;
      }
    },
    addWord(word) {
      const position = this.words.indexOf(word);
      if (position === -1) this.words.push(word);
    },
    removeWord(word) {
      const position = this.words.indexOf(word);
      if (position > -1) this.words.splice(position, 1);
    },
    loadResults(user) {
      if (this.words.length < 2 || this.loading) {
        if (user) alert('Dodaj vsaj dve besedi.');
        return
      };
      this.loading = true;

      const query = this.words
        .map(word => (word.indexOf(' ') > -1 ? `"${word}"` : word))
        .map(encodeURIComponent)
        .join('+');

      axios.get(`https://isci.parlameter.si/q/${query}`).then((response) => {
        const scoreHigherThanZero = i => i.score > 0;

        const parties = response.data.facet_counts.facet_fields.party_e
          .filter(scoreHigherThanZero)
          .filter(party => party.party.acronym !== 'unknown')
          .map(party => ([
            { text: '' },
            { link: this.getPartyLink(party.party), text: party.party.acronym === 'unknown' ? 'Zunanji govorci' : party.party.acronym,},
            party.score,
            (party.score / (this.sums.all_speeches / this.sums.orgs[party.party.id])).toFixed(4) || 0,
            // label: party.party.acronym === 'unknown' ? 'Zunanji govorci' : party.party.acronym,
            // value: party.score,
            // link: this.getPartyLink(party.party),
          ]));

        const people = response.data.facet_counts.facet_fields.speaker_i
          .filter(scoreHigherThanZero)
          .map(person => [
            { link: this.getPersonLink(person), image: this.getPersonPortrait(person.person) },
            { link: this.getPersonLink(person), text: person.person.name},
            person.score,
            (person.score / (this.sums.all_speeches / this.sums.people[person.person.id])).toFixed(4),

            // label: person.person.name,
            // value: (person.score / (this.sums.all_speeches / this.sums.people[person.person.id])).toFixed(4),
            // link: this.getPersonLink(person.person),
            // portrait: this.getPersonPortrait(person.person),
          ]);

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
  created() {
    if (this.words) {
      this.loadResults();
    }
    $.get('https://data.parlameter.si/v1/getNumberOfSpeeches', (data) => {
      this.sums = JSON.parse(JSON.stringify(data));
    });
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
