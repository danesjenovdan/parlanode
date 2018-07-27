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
              :small-text="$te(filter) ? $t(filter) : filter"
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
            <label v-t="'just-last-five'" for="justFive"></label>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col-md-12">
          <inner-card
            :header-config="headerConfig"
            :og-config="ogConfig"
            :columns="columns"
            :current-sort="currentSort"
            :current-sort-order="currentSortOrder"
            :select-sort="selectSort"
            :processed-sessions="processedSessions"
            :organisation-is-working-body="organisationIsWorkingBody"
            :generated-card-url="generatedCardUrl"
            :current-filter="currentFilter"
            :just-five="justFive"
          />
        </div>
      </div>
    </div>
  </div>
  <inner-card
    v-else
    :id="$options.cardData.cardData._id"
    :header-config="headerConfig"
    :og-config="ogConfig"
    :columns="columns"
    :current-sort="currentSort"
    :current-sort-order="currentSortOrder"
    :select-sort="selectSort"
    :processed-sessions="processedSessions"
    :organisation-is-working-body="organisationIsWorkingBody"
    :generated-card-url="generatedCardUrl"
    :current-filter="currentFilter"
    :just-five="justFive"
  />
</template>

<script>
import { find, get } from 'lodash';
import axios from 'axios';
import common from 'mixins/common';
import { defaultHeaderConfig } from 'mixins/altHeaders';
import { defaultOgImage } from 'mixins/ogImages';
import PSearchDropdown from 'components/SearchDropdown.vue';
import StripedButton from 'components/StripedButton.vue';
import InnerCard from './innerCard.vue';
import cardConfigJson from './config.json';

export default {
  name: 'SeznamSej',
  components: {
    InnerCard,
    PSearchDropdown,
    StripedButton,
  },
  mixins: [
    common,
  ],
  data() {
    const cardConfig = cardConfigJson[this.$i18n.locale];
    return {
      cardConfig,
      sessions: this.$options.cardData.data.sessions,
      workingBodies: [],
      filters: cardConfig.tabs.map(e => e.title),
      currentSort: 'date',
      currentSortOrder: 'desc',
      currentFilter: get(this.$options.cardData, 'state.filter') || cardConfig.tabs[0].title,
      justFive: get(this.$options.cardData, 'state.justFive') || false,
      headerConfig: defaultHeaderConfig(this),
    };
  },
  computed: {
    columns() {
      return [
        { id: 'image', label: '', additionalClass: 'image' },
        { id: 'name', label: this.$t('name'), additionalClass: 'wider name' },
        { id: 'date', label: this.$t('start') },
        { id: 'updated', label: this.$t('change'), additionalClass: 'optional' },
        { id: 'workingBody', label: this.$t('organization'), additionalClass: 'wider optional' },
      ];
    },
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
      return this.currentWorkingBodies.length > 0
        ? this.$t('selected-placeholder', { num: this.currentWorkingBodies.length })
        : this.$t('select-working-body-placeholder');
    },
    processedSessions() {
      let sortedAndFiltered = this.sessions
        .filter((session) => {
          const selectedTab = this.cardConfig.tabs.find(t => t.title === this.currentFilter);
          if (selectedTab) {
            if (selectedTab.org_ids && selectedTab.org_ids.length) {
              return session.orgs.filter(org => selectedTab.org_ids.indexOf(org.id) !== -1).length;
            }
            // if no selectedTab.org_ids
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
              return a.toLowerCase().localeCompare(b.toLowerCase(), 'sl');
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
      const params = {
        filters: this.currentFilter,
      };

      if (this.currentWorkingBodies.length > 0) {
        params.workingBodies = this.currentWorkingBodies;
      }

      if (this.justFive) {
        params.justFive = true;
      }

      return `${this.url}${Object.keys(params).length > 0 ? `?state=${encodeURIComponent(JSON.stringify(params))}` : ''}`;
    },
  },
  watch: {
    currentFilter(newValue) {
      const otherTab = this.cardConfig.tabs.find(t => !t.org_ids || !t.org_ids.length);
      if (newValue !== otherTab.title) {
        this.workingBodies.forEach((workingBody) => {
          workingBody.selected = false;
        });
      }
    },
    currentWorkingBodies(newValue) {
      const otherTab = this.cardConfig.tabs.find(t => !t.org_ids || !t.org_ids.length);
      if (newValue.length !== 0 && this.currentFilter !== otherTab.title) {
        this.currentFilter = otherTab.title;
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
      const orgIds = this.cardConfig.tabs.reduce((acc, cur) => {
        if (cur.org_ids) {
          return acc.concat(cur.org_ids);
        }
        return acc;
      }, []);
      return orgIds.indexOf(organisationId) === -1;
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
