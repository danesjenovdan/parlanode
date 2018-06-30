<template>
  <div
    v-if="$options.cardData.parlaState && $options.cardData.parlaState.generator"
    :id="$options.cardData.cardData._id"
  >
    <div class="session-list-generator">
      <div class="row">
        <div class="col-md-12 filters">
          <ul class="button-filters">
            <striped-button
              v-for="(filter, index) in filters"
              :key="index"
              :selected="filter === currentFilter"
              :small-text="filter"
              color="sds"
              @click.native="selectFilter(filter)"
            />
          </ul>

          <p-search-dropdown
            :items="workingBodies"
            :placeholder="inputPlaceholder"
            class="dropdown-filter"
          />

          <div class="align-checkbox">
            <input
              id="justFive"
              v-model="justFive"
              type="checkbox"
              class="checkbox"
            >
            <label for="justFive">Samo zadnjih 5</label>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col-md-12">
          <inner-card
            :header-config="headerConfig"
            :columns="columns"
            :current-sort="currentSort"
            :current-sort-order="currentSortOrder"
            :select-sort="selectSort"
            :processed-sessions="processedSessions"
            :organisation-is-working-body="organisationIsWorkingBody"
            :info-text="infoText"
            :generated-card-url="generatedCardUrl"
          />
        </div>
      </div>
    </div>
  </div>
  <inner-card
    v-else
    :id="$options.cardData.cardData._id"
    :header-config="headerConfig"
    :columns="columns"
    :current-sort="currentSort"
    :current-sort-order="currentSortOrder"
    :select-sort="selectSort"
    :processed-sessions="processedSessions"
    :organisation-is-working-body="organisationIsWorkingBody"
    :info-text="infoText"
    :generated-card-url="generatedCardUrl"
  />
</template>

<script>
import { find, get } from 'lodash';
import axios from 'axios';
import common from 'mixins/common';
import PSearchDropdown from 'components/SearchDropdown.vue';
import StripedButton from 'components/StripedButton.vue';
import InnerCard from './innerCard.vue';

export default {
  name: 'SeznamSej',
  components: { InnerCard, PSearchDropdown, StripedButton },
  mixins: [common],
  data() {
    return {
      sessions: this.$options.cardData.data.sessions,
      workingBodies: [],
      filters: ['Seje DZ', 'Seje kolegija predsednika DZ', 'Seje delovnih teles'],
      currentSort: 'date',
      currentSortOrder: 'desc',
      currentFilter: get(this.$options.cardData, 'state.filter') || 'Seje DZ',
      justFive: get(this.$options.cardData, 'state.justFive') || false,
      headerConfig: {
        circleIcon: 'og-list',
        heading: '&nbsp;',
        subheading: '7. sklic parlamenta',
        alternative: this.$options.cardData.cardData.altHeader === 'true',
        title: this.$options.cardData.cardData.name,
      },
    };
  },
  computed: {
    columns: () => [
      { id: 'image', label: '', additionalClass: 'image' },
      { id: 'name', label: 'Ime', additionalClass: 'wider name' },
      { id: 'date', label: 'Začetek' },
      { id: 'updated', label: 'Sprememba', additionalClass: 'optional' },
      { id: 'workingBody', label: 'Organizacija', additionalClass: 'wider optional' },
    ],
    currentAnalysisData() {
      return find(this.analyses, { id: this.currentAnalysis });
    },
    currentWorkingBodies() {
      return this.workingBodies
        .filter(workingBody => workingBody.selected)
        .map(workingBody => workingBody.id);
    },
    currentWorkingBodyNames() {
      return this.workingBodies
        .filter(workingBody => workingBody.selected)
        .map(workingBody => workingBody.label);
    },
    inputPlaceholder() {
      return this.currentWorkingBodies.length ? `izbranih delovnih teles: ${this.currentWorkingBodies.length}` : 'izberi delovno telo';
    },
    processedSessions() {
      let sortedAndFiltered = this.sessions
        .filter((session) => {
          if (this.currentFilter === 'Seje DZ') {
            return session.orgs.filter(org => org.id === 95).length > 0;
          }
          if (this.currentFilter === 'Seje kolegija predsednika DZ') {
            return session.orgs.filter(org => org.id === 9).length > 0;
          }
          if (this.currentFilter === 'Seje delovnih teles') {
            let match = false;
            if (this.currentWorkingBodies.length === 0) {
              session.orgs.forEach((org) => {
                match = match || this.organisationIsWorkingBody(org.id);
              });
            } else {
              session.orgs.forEach((org) => {
                match = match || this.currentWorkingBodies.indexOf(org.id) > -1;
              });
            }
            return match;
          }
          return false;
        })
        .sort((sessionA, sessionB) => {
          let a;
          let b;
          switch (this.currentSort) {
            case 'name':
              a = sessionA.name;
              b = sessionB.name;
              return a.toLowerCase().localeCompare(b.toLowerCase());
            case 'date':
              a = sessionA.date_ts;
              b = sessionB.date_ts;
              if (a < b) {
                return -1;
              }
              if (a > b) {
                return 1;
              }
              // never return 0, chrome and firefox sort differently and that can break SSR
              return sessionA.id - sessionB.id;
            case 'updated':
              a = sessionA.updated_at_ts;
              b = sessionB.updated_at_ts;
              if (a < b) {
                return -1;
              }
              if (a > b) {
                return 1;
              }
              // never return 0, chrome and firefox sort differently and that can break SSR
              return sessionA.id - sessionB.id;
            case 'workingBody':
              a = sessionA.orgs[0].name;
              b = sessionB.orgs[0].name;
              return a.localeCompare(b, 'sl');
            default:
              // never return 0, chrome and firefox sort differently and that can break SSR
              return sessionA.id - sessionB.id;
          }
        });

      if (this.currentSortOrder === 'desc') {
        sortedAndFiltered.reverse();
      }
      if (this.justFive) {
        sortedAndFiltered = sortedAndFiltered.slice(0, 5);
      }

      return sortedAndFiltered;
    },
    generatedCardUrl() {
      const params = { filters: this.currentFilter };

      if (this.currentWorkingBodies.length > 0) {
        params.workingBodies = this.currentWorkingBodies;
      }
      if (this.justFive) {
        params.justFive = true;
      }

      return `${this.url}?customUrl=${encodeURIComponent(this.$options.cardData.cardData.dataUrl)}${Object.keys(params).length > 0 ? `&state=${encodeURIComponent(JSON.stringify(params))}` : ''}`;
    },
    infoText() {
      const filterText = `${this.currentFilter}${this.currentWorkingBodies.length > 0 ? ': ' : ''}`;
      const workingBodiesText = this.currentWorkingBodyNames.join(', ');
      const filterAndWorkingBodiesText = filterText || workingBodiesText ? ` (${filterText}${workingBodiesText})` : '';
      const sortTexts = {
        name: 'imenu seje',
        date: 'datumu začetka seje',
        updated: 'datumu zadnje spremembe podatkov o seji',
        workingBody: 'imenu organizacije',
      };
      const justFiveText = this.justFive ? ', izpis pa omejen samo na zgornjih pet sej' : '';

      return `Seznam vseh sej tega sklica DZ, ki ustrezajo uporabniškemu vnosu${filterAndWorkingBodiesText}. Seznam je sortiran po ${sortTexts[this.currentSort]}${justFiveText}.`;
    },
  },
  watch: {
    currentFilter(newValue) {
      if (newValue !== 'Seje delovnih teles') {
        this.workingBodies.forEach((workingBody) => {
          // eslint-disable-next-line
          workingBody.selected = false;
        });
      }
    },
    currentWorkingBodies(newValue) {
      if (newValue.length !== 0 && this.currentFilter !== 'Seje delovnih teles') {
        this.currentFilter = 'Seje delovnih teles';
      }
    },
  },
  created() {
    axios.get(`${this.slugs.urls.analize}/s/getWorkingBodies/`)
      .then((response) => {
        const existingWorkingBodies = get(this.$options.cardData, 'state.workingBodies') || [];
        this.workingBodies = response.data.map(workingBody => ({
          id: workingBody.id,
          label: workingBody.name,
          selected: existingWorkingBodies.indexOf(workingBody.id) > -1,
        }));
      });
  },
  methods: {
    organisationIsWorkingBody(organisationId) {
      return [9, 95].indexOf(organisationId) === -1;
    },
    selectSort(sortId) {
      if (this.currentSort === sortId) {
        this.currentSortOrder = this.currentSortOrder === 'asc' ? 'desc' : 'asc';
      } else {
        this.currentSort = sortId;
        this.currentSortOrder = 'asc';
      }

      this.measurePiwik('', sortId, this.currentSortOrder);
    },
    selectFilter(filter) {
      this.currentFilter = filter;
      this.measurePiwik(filter, '', '');
    },
    measurePiwik(filter, sort, order) {
      if (typeof measure !== 'function') {
        return;
      }

      if (sort !== '') {
        measure('s', 'session-sort', `${sort} ${order}`, '');
      } else if (filter !== '') {
        measure('s', 'session-filter', filter, '');
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.button-filters {
  .striped-button {
    flex: 1;
    background-color: #f0f0f0;
    &:not(:last-child) { margin-right: 5px; }
  }
}
</style>
