<template>
  <card-wrapper ref="card" :header-config="headerConfig" max-height>
    <template #generator>
      <div class="session-list-generator">
        <!-- only show filters if we have more than one classification to show -->
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
            v-if="currentFilter != 'root'"
            class="col-md-6 filters"
          >
            <p-search-dropdown
              v-model="workingBodies"
              :placeholder="inputPlaceholder"
              class="dropdown-filter"
              @update:modelValue="searchSessionsImmediate"
            />
          </div>
        </div>
      </div>
    </template>
    <div v-if="isLoading" class="nalagalnik"></div> <!-- show loader while fetching results -->
    <template v-else>
      <inner-card
        :columns="columns"
        :current-sort="currentSort"
        :current-sort-order="currentSortOrder"
        :select-sort="selectSort"
        :processed-sessions="currentPageSessions"
      />
      <pagination
        v-if="count > perPage"
        :page="page"
        :count="count"
        :per-page="perPage"
        @change="onPageChange"
      />
    </template>
  </card-wrapper>
</template>

<script>
import common from '@/_mixins/common.js';
import { sessionListContextUrl } from '@/_mixins/contextUrls.js';
import { defaultHeaderConfig } from '@/_mixins/altHeaders.js';
import { defaultOgImage } from '@/_mixins/ogImages.js';
import PSearchDropdown from '@/_components/SearchDropdown.vue';
import BlueButtonList from '@/_components/BlueButtonList.vue';
import InnerCard from './InnerCard.vue';
import Pagination from '@/_components/Pagination.vue';
import { SESSIONS_PER_PAGE } from '@/_helpers/constants.js';
// debounce is required for search field queries debouncing
import { debounce } from 'lodash-es';
// cancelableRequest is how we make requests to update the results
import cancelableRequest from '@/_mixins/cancelableRequest.js';

function enumerateClassification(classification) {
  switch(classification) {
    case 'root':
      return -1;
    case 'other':
      return 1;
    default:
      return 0;
  };
}

export default {
  name: 'CardMiscSessions',
  components: {
    InnerCard,
    PSearchDropdown,
    BlueButtonList,
    Pagination
  },
  mixins: [
    common,
    sessionListContextUrl,
    cancelableRequest,
  ],
  cardInfo: {
    doubleWidth: true,
  },
  data() {
    const { cardState, cardData } = this.$root.$options.contextData;

    // check if we're embedded
    const isEmbedded = (this.$root.$options.contextData.templateName === 'embed');

    let {
      results: results = [],
      'sessions:pages': pages = 1,
      'sessions:page': initialPage = 1,
      'sessions:count': count = results.length ?? 0,
      'sessions:per_page': perPage = SESSIONS_PER_PAGE,
    } = cardData?.data || {};
    let page = Number(cardState?.page) || initialPage;
    
    // if we're embedded we should override our current settings
    if (isEmbedded) {
      pages = Math.ceil(count / 5);
      perPage = 5;
      page = (page * 2) - 1;
      results = results.slice(0, 5);
    }

    // TODO explain why this is necessary
    const sessionsPerPage = Array(pages);
    sessionsPerPage[initialPage - 1] = results;

    // group organizations by classifications
    const classifications = cardData.data.organizations.filter((organization) => {
      // this is to filter out organizations without a classification
      return organization.classification !== null;
    }).sort((a, b) => {
      // this is to make sure root comes first and other comes last
      switch(a.classification) {
        case 'root':
          return -1;
        case 'other':
          return 1;
      };

      switch(b.classification) {
        case 'root':
          return 1;
        case 'other':
          return -1;
      };

      return 0;
    }).reduce((classifications, organization) => {
      if (!Object.keys(classifications).includes(organization.classification)) {
        classifications[organization.classification] = {};
      }
      classifications[organization.classification][organization.slug] = organization;
      return classifications;
    }, {});

    // create tabs
    const tabs = Object.keys(classifications).map((classificationKey) => {
      return {
        id: classificationKey,
        title: this.$t(`organization-classifications.${classificationKey}`),
        orgSlugs: Object.keys(classifications[classificationKey]),
        organizations: classifications[classificationKey],
      };
    });

    return {
      tabs,
      sessions: cardData?.data?.results,
      workingBodies: [],
      filters: tabs.map((tab) => ({ label: tab.title, id: tab.id })),
      currentSort: 'date',
      currentSortOrder: 'desc',
      currentFilter: cardState?.filters || tabs[0].id,
      headerConfig: defaultHeaderConfig(this),
      ogConfig: defaultOgImage(this),

      // pagination
      pages,
      initialPage,
      count,
      perPage,
      isLoading: false,
      page,
      sessionsPerPage,
    };
  },
  computed: {
    searchUrl() {
      // cardData.url is automagically provided by the rendering pipeline
      const url = new URL(this.cardData.url);

      // set per-page setting
      url.searchParams.set('sessions:per_page', this.perPage);

      url.searchParams.set('sessions:page', this.page);

      url.searchParams.set('classification', this.currentFilter);

      if (this.currentWorkingBodies.length > 0) {
        url.searchParams.set(
          'organizations',
          this.currentWorkingBodies.map(
            (workingBodySlug) => workingBodySlug.split('-')[0]
          ).join(',')
        );
      }

      // set sort param
      const sortPrefix = this.currentSortOrder === 'desc' ? '-' : '';
      let sort = 'start_time';
      switch (this.currentSort) {
        case 'name':
          sort = 'name';
          break;
      };
      url.searchParams.set('order_by', `${sortPrefix}${sort}`);

      return url.toString();
    },

    columns() {
      return [
        { id: 'image', label: '', additionalClass: 'image' },
        { id: 'name', label: this.$t('title'), additionalClass: 'wider name' },
        { id: 'date', label: this.$t('date') },
        // TODO this should be properly optional instead of commented out
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

    currentPageSessions() {
      return this.sessionsPerPage[this.page - 1] || [];
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

      // before updating the UI we should start a request
      // to get new sessions
      this.searchSessionsImmediate();

      // get current tab
      const tab = this.tabs.filter((tab) => {
        return tab.id === argument;
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
    },

    searchSessionsImmediate(keepPage = false) {
      this.isLoading = true;
      this.sessionsPerPage = Array(this.pages);
      this.count = 0;
      if (!keepPage) {
        this.page = 1;
      }
      this.makeRequest(this.searchUrl).then((response) => {
        this.count = response?.data?.['sessions:count'];
        this.page = response?.data?.['sessions:page'];
        this.sessionsPerPage[this.page - 1] =
          response?.data?.results || [];
        this.isLoading = false;
      });
    },

    searchSessions: debounce(function searchSessions() {
      this.searchSessionsImmediate();
    }, 750),

    onPageChange(newPage) {
      this.page = newPage;
      this.scrollToTop();
      if (!this.sessionsPerPage[newPage - 1]) {
        this.isLoading = true;
        this.makeRequest(this.searchUrl).then((response) => {
          this.sessionsPerPage[newPage - 1] =
            response?.data?.results || [];
          this.isLoading = false;
        });
      }
    },

    // TODO extract this
    scrollToTop() {
      const el = this.$refs.card?.$el || this.$refs.card;
      el.scrollIntoView();
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
