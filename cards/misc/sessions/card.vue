<template>
  <card-wrapper :header-config="headerConfig" max-height>
    <template #generator>
      <div class="session-list-generator">
        <div v-if="filters.length > 1" class="row">
          <div class="col-md-6">
            <blue-button-list
              v-model="currentFilter"
              :items="filters"
              @update:modelValue="updateWorkingBodies"
            />
          </div>
          <!--
            only show working bodies dropdown if
            a non-root tab is selected
          -->
          <div
            v-if="
              currentFilter != $t('organization-classifications.root')
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
    />
  </card-wrapper>
</template>

<script>
import { find } from 'lodash-es';
import common from '@/_mixins/common.js';
import { sessionListContextUrl } from '@/_mixins/contextUrls.js';
import { defaultHeaderConfig } from '@/_mixins/altHeaders.js';
import { defaultOgImage } from '@/_mixins/ogImages.js';
import PSearchDropdown from '@/_components/SearchDropdown.vue';
import BlueButtonList from '@/_components/BlueButtonList.vue';
import InnerCard from './InnerCard.vue';


export default {
  name: 'CardMiscSessions',
  components: {
    InnerCard,
    PSearchDropdown,
    BlueButtonList,
  },
  mixins: [common, sessionListContextUrl],
  cardInfo: {
    doubleWidth: true,
  },
  data() {
    const { cardState, cardData } = this.$root.$options.contextData;

    // group organizations by classifications
    const classifications = cardData.data.results.reduce((classifications, session) => {
      session.organizations.forEach((organization) => {
        if (!Object.keys(classifications).includes(organization.classification)) {
          classifications[organization.classification] = {};
        }
        classifications[organization.classification][organization.slug] = organization;
        // } else if (!Object.keys(classifications[organization.classification]).includes(organization.slug)) {
        //   classifications[organization.classification].push(organization.slug)
        // }
      });
      return classifications;
    }, {});

    // create tabs
    const tabs = Object.keys(classifications).map((classificationKey) => {
      return {
        title: this.$t(`organization-classifications.${classificationKey}`),
        orgSlugs: Object.keys(classifications[classificationKey]),
        organizations: classifications[classificationKey],
      };
    });

    return {
      tabs,
      sessions: cardData?.data?.results,
      workingBodies: [],
      filters: tabs.map((e) => ({ label: e.title, id: e.title })),
      currentSort: 'date',
      currentSortOrder: 'desc',
      currentFilter: cardState?.filters || tabs[0].title,
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
    currentWorkingBodies() {
      return this.workingBodies
        .filter((workingBody) => workingBody.selected)
        .map((workingBody) => workingBody.id);
    },
    inputPlaceholder() {
      return this.currentWorkingBodies.length > 0
        ? this.$t('selected-placeholder', {
            num: this.currentWorkingBodies.length,
          })
        : this.$t('select-working-body-placeholder');
    },
    processedSessions() {
      // filter sessions
      const sortedAndFiltered = this.sessions
        .filter((session) => {
          // find the selected tab
          const selectedTab = this.tabs.find(
            (t) => t.title === this.currentFilter
          );
          if (selectedTab) {
            const filteredByOrgSlugs = session.organizations.filter(
                (org) => selectedTab.orgSlugs.includes(org.slug)
              ).length;

            // if there are organizations in the dropdown
            // we should filter by dropdown as well
            if (selectedTab.orgSlugs.length !== 1) {
              // there are more organizations under this tab
              if (this.currentWorkingBodies.length !== 0) {
                // something is selected in the dropdown
                // we should filter more
                let match = false;
                session.organizations.forEach((org) => {
                  match = match || this.currentWorkingBodies.includes(org.slug);
                });
                return match;
              }
            }

            // if we did not return yet we should
            // return the sessions filtered by slugs
            return filteredByOrgSlugs;
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

      return sortedAndFiltered;
    },
  },
  methods: {
    selectSort(sortId) {
      if (this.currentSort === sortId) {
        this.currentSortOrder =
          this.currentSortOrder === 'asc' ? 'desc' : 'asc';
      } else {
        this.currentSort = sortId;
        this.currentSortOrder = 'asc';
      }
    },
    updateWorkingBodies(argument) {
      // when the tab is switched we should update
      // the workingBodies array to show them in the
      // dropdown

      // get current tab
      const tab = this.tabs.filter((tab) => {
        return tab.title === argument;
      })[0];

      // map all organization slugs in the tab to
      // proper objects that PSearchDropdown can consume
      this.workingBodies = tab.orgSlugs.map((slug) => {
        return {
          id: slug,
          selected: false,
          label: tab.organizations[slug].name,
        };
      });
    }
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
