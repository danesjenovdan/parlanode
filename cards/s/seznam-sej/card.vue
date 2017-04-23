<template>
  <div v-if="$options.cardData.state.generator" :id="$options.cardData.cardData._id">
    <div class="session-list-generator">
      <div class="row">
        <div class="col-md-12 filters">
          <ul class="button-filters">
            <li v-for="filter in filters" class="party-button sds sds-hover"
                :class="[{ selected: currentFilters.indexOf(filter) > -1 }]"
                @click="selectFilter(filter)">
              {{ filter }}
            </li>
          </ul>

          <search-dropdown class="dropdown-filter" :items="workingBodies" :placeholder="inputPlaceholder"></search-dropdown>

          <div class="align-checkbox">
            <input id="justFive" type="checkbox" v-model="justFive" class="checkbox" />
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
            :slugs="slugs"
            :processed-sessions="processedSessions"
            :organisation-is-working-body="organisationIsWorkingBody"
            :info-text="infoText"
            :generated-card-url="generatedCardUrl"
            :shortened-card-url="shortenedCardUrl"
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
    :slugs="slugs"
    :processed-sessions="processedSessions"
    :organisation-is-working-body="organisationIsWorkingBody"
    :info-text="infoText"
    :generated-card-url="generatedCardUrl"
    :shortened-card-url="shortenedCardUrl"
  />
</template>

<script>
/* globals window $ measure */

import { find } from 'lodash';
import InnerCard from './innerCard.vue';

export default {
  components: { InnerCard },
  name: 'SeznamSej',
  data() {
    return {
      sessions: this.$options.cardData.data.sessions,
      workingBodies: [],
      slugs: this.$options.cardData.urlsData,
      filters: ['Seje DZ', 'Seje kolegija predsednika DZ', 'Seje delovnih teles'],
      currentSort: 'date',
      currentSortOrder: 'desc',
      currentFilters: this.$options.cardData.state.filters || [],
      justFive: this.$options.cardData.state.justFive || false,
      shortenedCardUrl: '',
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
          if (this.currentFilters.length === 0) return true;

          let match = false;
          if (this.currentFilters.indexOf('Seje DZ') > -1) {
            match = match || session.orgs.filter(org => org.id === 95).length > 0;
          }
          if (this.currentFilters.indexOf('Seje kolegija predsednika DZ') > -1) {
            match = match || session.orgs.filter(org => org.id === 9).length > 0;
          }
          if (this.currentFilters.indexOf('Seje delovnih teles') > -1) {
            if (this.currentWorkingBodies.length === 0) {
              session.orgs.forEach((org) => {
                match = match || this.organisationIsWorkingBody(org.id);
              });
            } else {
              session.orgs.forEach((org) => {
                match = match || this.currentWorkingBodies.indexOf(org.id) > -1;
              });
            }
          }

          return match;
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
              } else if (a > b) {
                return 1;
              }
              return 0;
            case 'updated':
              a = sessionA.updated_at_ts;
              b = sessionB.updated_at_ts;
              if (a < b) {
                return -1;
              } else if (a > b) {
                return 1;
              }
              return 0;
            case 'workingBody':
              a = sessionA.orgs[0].name;
              b = sessionB.orgs[0].name;
              return a.localeCompare(b, 'sl');
            default:
              return 0;
          }
        });

      if (this.currentSortOrder === 'desc') sortedAndFiltered.reverse();
      if (this.justFive) sortedAndFiltered = sortedAndFiltered.slice(0, 5);

      return sortedAndFiltered;
    },
    generatedCardUrl() {
      const params = {};

      if (this.currentFilters.length > 0) params.filters = this.currentFilters;
      if (this.currentWorkingBodies.length > 0) params.workingBodies = this.currentWorkingBodies;
      if (this.justFive) params.justFive = true;

      return `https://glej.parlameter.si/s/seznam-sej/?customUrl=${encodeURIComponent(this.$options.cardData.cardData.dataUrl)}${Object.keys(params).length > 0 ? `&state=${encodeURIComponent(JSON.stringify(params))}` : ''}`;
    },
    infoText() {
      const filterText = `${this.currentFilters.join(', ')}${this.currentWorkingBodies.length > 0 ? ': ' : ''}`;
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
  created() {
    $.getJSON('https://analize.parlameter.si/v1/s/getWorkingBodies/', (response) => {
      const existingWorkingBodies = this.$options.cardData.state.workingBodies || [];
      this.workingBodies = response.map(workingBody => ({
        id: workingBody.id,
        label: workingBody.name,
        selected: existingWorkingBodies.indexOf(workingBody.id) > -1,
      }));
    });
  },
  mounted() {
    this.shortenUrl(this.generatedCardUrl);
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
      if (this.currentFilters.indexOf(filter) > -1) {
        this.currentFilters.splice(this.currentFilters.indexOf(filter), 1);
      } else {
        this.currentFilters.push(filter);
      }

      this.measurePiwik(filter, '', '');
    },
    getWorkingBodyUrl(workingBodyId) {
      return `https://glej.parlameter.si/wb/getWorkingBodies/${workingBodyId}?frame=true&altHeader=true`;
    },
    shortenUrl(url) {
      $.get(`https://parla.me/shortner/generate?url=${window.encodeURIComponent(`${url}&frame=true`)}`, (response) => {
        this.shortenedCardUrl = response;
        this.$el.querySelector('.card-content-share button').textContent = 'KOPIRAJ';
      });
    },
    measurePiwik(filter, sort, order) {
      if (typeof measure !== 'function') return;

      if (sort !== '') {
        measure('s', 'session-sort', `${sort} ${order}`, '');
      } else if (filter !== '') {
        measure('s', 'session-filter', filter, '');
      }
    },
  },
  watch: {
    generatedCardUrl(newValue) {
      this.shortenUrl(newValue);
    },
    currentFilters(newValue) {
      if (newValue.indexOf('Seje delovnih teles') === -1) {
        this.workingBodies.forEach((workingBody) => {
          // eslint-disable-next-line
          workingBody.selected = false;
        });
      }
    },
    currentWorkingBodies(newValue) {
      if (newValue.length !== 0 && this.currentFilters.indexOf('Seje delovnih teles') === -1) {
        this.currentFilters.push('Seje delovnih teles');
      }
    },
  },
};
</script>
