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
import common from '@/_mixins/common.js';
import cancelableRequest from '@/_mixins/cancelableRequest.js';
import TransparentWrapper from '@/_components/TransparentWrapper.vue';
import PSearchDropdown from '@/_components/SearchDropdown.vue';
import links from '@/_mixins/links.js';

export default {
  components: {
    TransparentWrapper,
    PSearchDropdown,
  },
  mixins: [common, links, cancelableRequest],
  data() {
    const people = this.cardData.data?.results?.people || [];
    const groups = this.cardData.data?.results?.groups || [];

    const initialTextFilter = this.cardState.text || '';

    return {
      people,
      groups,
      textFilter: initialTextFilter,
      isLoading: false,
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
      const personGroups = uniqBy(
        this.people.map((person) => person?.group),
        (g) => g?.slug
      );
      return [
        {
          id: 'groups',
          label: this.$t('parties'),
          items: this.groups.map((group) => group?.slug),
        },
        ...personGroups.map((group) => ({
          id: group?.slug || 'null',
          label: group?.name || ' ',
          items: this.people
            .filter((person) => person?.group?.slug === group?.slug)
            .map((person) => person?.slug),
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
    search: debounce(function searchVotes() {
      this.isLoading = true;
      this.makeRequest(this.searchUrl).then((response) => {
        this.people = response?.data?.results?.people || [];
        this.groups = response?.data?.results?.groups || [];
        this.isLoading = false;
      });
    }, 750),
    onFilterChanged(newFilter) {
      this.textFilter = newFilter;
      this.isLoading = true;
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
