<template>
  <card-wrapper :header-config="headerConfig" max-height>
    <template #generator>
      <div class="session-list-generator">
        <div v-if="filters.length > 1" class="row">
          <div class="col-md-6">
            <blue-button-list v-model="currentFilter" :items="filters" />
          </div>
          <div
            v-if="
              currentFilter ==
              tabs.find((t) => !t.org_ids || !t.org_ids.length).title
            "
            class="col-md-6 filters"
          >
            <p-search-dropdown
              v-model="workingBodies"
              :placeholder="inputPlaceholder"
              class="dropdown-filter"
            />
          </div>
        </div>
      </div>
    </template>
    <inner-card
      :columns="columns"
      :current-sort="currentSort"
      :current-sort-order="currentSortOrder"
      :select-sort="selectSort"
      :processed-sessions="processedSessions"
      :organisation-is-working-body="organisationIsWorkingBody"
    />
  </card-wrapper>
</template>

<script>
import { find } from 'lodash-es';
import common from '@/_mixins/common.js';
import { sessions as sessionsContextUrl } from '@/_mixins/contextUrls.js';
import { defaultHeaderConfig } from '@/_mixins/altHeaders.js';
import { defaultOgImage } from '@/_mixins/ogImages.js';
import PSearchDropdown from '@/_components/SearchDropdown.vue';
import BlueButtonList from '@/_components/BlueButtonList.vue';
import InnerCard from './InnerCard.vue';

const sessionListTabs = [
  {
    title: '',
  },
];

export default {
  name: 'CardMiscSessions',
  components: {
    InnerCard,
    PSearchDropdown,
    BlueButtonList,
  },
  mixins: [common, sessionsContextUrl],
  cardInfo: {
    doubleWidth: true,
  },
  data() {
    const { cardState, cardData } = this.$root.$options.contextData;

    const tabs = sessionListTabs;
    return {
      tabs,
      sessions: cardData?.data?.results,
      workingBodies: [],
      filters: tabs.map((e) => ({ label: e.title, id: e.title })),
      currentSort: 'date',
      currentSortOrder: 'desc',
      currentFilter: cardState?.filters || tabs[0].title,
      justFive: cardState?.justFive || false,
      headerConfig: defaultHeaderConfig(this),
      ogConfig: defaultOgImage(this),
    };
  },
  computed: {
    columns() {
      return [
        { id: 'image', label: '', additionalClass: 'image' },
        { id: 'name', label: this.$t('title'), additionalClass: 'wider name' },
        { id: 'date', label: this.$t('date') },
        // {
        //   id: 'updated',
        //   label: this.$t('change'),
        //   additionalClass: 'optional',
        // },
        // {
        //   id: 'workingBody',
        //   label: this.$t('organization'),
        //   additionalClass: 'wider optional',
        // },
      ];
    },
    currentAnalysisData() {
      return find(this.analyses, { id: this.currentAnalysis });
    },
    currentWorkingBodies() {
      return this.workingBodies
        .filter((workingBody) => workingBody.selected)
        .map((workingBody) => workingBody.id);
    },
    currentWorkingBodyNames() {
      return this.workingBodies
        .filter((workingBody) => workingBody.selected)
        .map((workingBody) => workingBody.label);
    },
    inputPlaceholder() {
      return this.currentWorkingBodies.length > 0
        ? this.$t('selected-placeholder', {
            num: this.currentWorkingBodies.length,
          })
        : this.$t('select-working-body-placeholder');
    },
    processedSessions() {
      let sortedAndFiltered = this.sessions
        .filter((session) => {
          const selectedTab = this.tabs.find(
            (t) => t.title === this.currentFilter
          );
          if (selectedTab) {
            if (selectedTab.org_ids && selectedTab.org_ids.length) {
              return session.organizations.filter(
                (org) => selectedTab.org_ids.indexOf(org.id) !== -1
              ).length;
            }
            // if no selectedTab.org_ids
            let match = false;
            if (this.currentWorkingBodies.length === 0) {
              session.organizations.forEach((org) => {
                match = match || this.organisationIsWorkingBody(org.id);
              });
            } else {
              session.organizations.forEach((org) => {
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
              a = sessionA.start_time || 'N/A';
              b = sessionB.start_time || 'N/A';
              return a.localeCompare(b, 'en');
            // case 'updated':
            //   a = sessionA.updated_at_ts;
            //   b = sessionB.updated_at_ts;
            //   if (a < b) {
            //     return -1;
            //   }
            //   if (a > b) {
            //     return 1;
            //   }
            //   return 0;
            case 'workingBody':
              a = sessionA.organizations[0].name;
              b = sessionB.organizations[0].name;
              return a.localeCompare(b, 'sl');
            default:
              return 0;
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
  },
  watch: {
    currentFilter(newValue) {
      const otherTab = this.tabs.find((t) => !t.org_ids || !t.org_ids.length);
      if (newValue !== otherTab.title) {
        this.workingBodies.forEach((workingBody) => {
          workingBody.selected = false;
        });
      }
    },
    currentWorkingBodies(newValue) {
      const otherTab = this.tabs.find((t) => !t.org_ids || !t.org_ids.length);
      if (newValue.length !== 0 && this.currentFilter !== otherTab.title) {
        this.currentFilter = otherTab.title;
      }
    },
  },
  methods: {
    organisationIsWorkingBody(organisationId) {
      const orgIds = this.tabs.reduce((acc, cur) => {
        if (cur.org_ids) {
          return acc.concat(cur.org_ids);
        }
        return acc;
      }, []);
      return orgIds.indexOf(organisationId) === -1;
    },
    selectSort(sortId) {
      if (this.currentSort === sortId) {
        this.currentSortOrder =
          this.currentSortOrder === 'asc' ? 'desc' : 'asc';
      } else {
        this.currentSort = sortId;
        this.currentSortOrder = 'asc';
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.filters {
  margin-top: 14px;

  .dropdown-filter {
    margin: 0;
    flex: 1.5;
  }
}
</style>
