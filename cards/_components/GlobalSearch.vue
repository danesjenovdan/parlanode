<template>
  <transparent-wrapper>
    <p-search-dropdown
      :model-value="allItems"
      :groups="dropdownGroups"
      :placeholder="$t('search_placeholder')"
      :filter="textFilter"
      :is-loading="isLoading"
      dont-filter-locally
      @update:filter="onFilterChanged"
      @select="selectCallback"
      @search="searchCallback"
    />
  </transparent-wrapper>
</template>

<script>
import { debounce, uniqBy } from 'lodash-es';
import axios, { CancelToken } from 'axios';
import common from '@/_mixins/common.js';
import TransparentWrapper from '@/_components/TransparentWrapper.vue';
import PSearchDropdown from '@/_components/SearchDropdown.vue';
import links from '@/_mixins/links.js';

export default {
  components: {
    TransparentWrapper,
    PSearchDropdown,
  },
  mixins: [common, links],
  data() {
    const people = this.cardData.data?.results?.people || [];
    const groups = this.cardData.data?.results?.groups || [];

    const initialTextFilter = this.cardState.query || '';

    return {
      people,
      groups,
      textFilter: initialTextFilter,
      isLoading: false,
      cancelRequest: null,
    };
  },
  computed: {
    allItems() {
      const peopleItems = this.people.map((person) => ({
        id: person.slug,
        label: person.name,
        image: this.getPersonPortrait(person),
        selected: false,
      }));

      const groupItems = this.groups.map((group) => ({
        id: group.slug,
        label: group.name,
        color: group.color,
        selected: false,
      }));

      return [...groupItems, ...peopleItems];
    },
    dropdownGroups() {
      const allGroups = uniqBy(
        this.people.filter((p) => p.group).map((p) => p.group),
        (g) => g.slug
      );
      return [
        {
          id: 'groups',
          label: this.$t('parties'),
          items: this.groups.map((group) => group.slug),
        },
        ...allGroups.map((group) => ({
          id: group.slug,
          label: group.name,
          items: this.people
            .filter((person) => person?.group?.slug === group.slug)
            .map((person) => person.slug),
        })),
      ];
    },
    searchUrl() {
      const url = new URL(this.cardData.url);
      url.searchParams.set('text', this.textFilter);
      return url.toString();
    },
  },
  methods: {
    makeRequest(url) {
      if (this.cancelRequest) {
        this.cancelRequest();
        this.cancelRequest = null;
      }

      return axios
        .get(url, {
          cancelToken: new CancelToken((c) => {
            this.cancelRequest = c;
          }),
        })
        .then(
          (response) => {
            this.cancelRequest = null;
            return response;
          },
          (error) => {
            this.cancelRequest = null;
            throw error;
          }
        );
    },
    search: debounce(function searchVotes() {
      this.isLoading = true;
      // this.people = [];
      // this.groups = [];
      this.makeRequest(this.searchUrl).then((response) => {
        this.people = response?.data?.results?.people || [];
        this.groups = response?.data?.results?.groups || [];
        this.isLoading = false;
      });
    }, 750),
    onFilterChanged(newFilter) {
      this.textFilter = newFilter;
      this.isLoading = true;
      // this.people = [];
      // this.groups = [];
      this.search();
    },
    selectCallback(itemId) {
      // eslint-disable-next-line no-restricted-properties
      const { urls, siteMap: sm } = this.$root.$options.contextData;
      const person = this.people.find((p) => p.slug === itemId);
      if (person) {
        window.location.href = `${urls.site}/${sm.member.base}/${person.slug}`;
        return;
      }
      const group = this.groups.find((g) => g.slug === itemId);
      if (group) {
        window.location.href = `${urls.site}/${sm.party.base}/${group.slug}`;
      }
    },
    searchCallback(term) {
      window.location.href = `${this.getSearchTermLink(term)}`;
    },
  },
};
</script>

<style lang="scss" scoped>
@import 'parlassets/scss/colors';

:deep(.card-container.transparent) {
  z-index: 1;
}

:deep(.search-dropdown) {
  .search-dropdown-input {
    background-color: $white;
  }

  &::after {
    content: '\e003';
    font-family: 'Glyphicons Halflings';
    border: none;
    font-size: 22px;
    top: 0;
    right: 0;
    display: flex;
    height: 100%;
    width: 40px;
    align-items: center;
    color: $first;
  }
}
</style>
