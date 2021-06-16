<template>
  <transparent-wrapper class="global-search">
    <p-search-dropdown
      :model-value="allItems"
      :placeholder="$t('search_placeholder')"
      :single="false"
      :groups="dropdownGroups"
      :filter="filter"
      @select="selectCallback"
      @search="searchCallback"
    />
  </transparent-wrapper>
</template>

<script>
import { uniqBy } from 'lodash-es';
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
    const people = this.cardData.data?.results || [];

    const parties = uniqBy(
      people.map((person) => person?.group).filter((party) => party?.slug),
      (party) => party.slug
    );

    const peopleItems = people.map((person) => ({
      id: person.slug,
      label: person.name,
      image: this.getPersonPortrait(person),
      selected: false,
    }));

    const partyItems = parties.map((party) => ({
      id: party.slug,
      label: party.name,
      colorClass: 'xxx',
      //   colorClass: `${group[0].person.party.acronym
      //     .toLowerCase()
      //     .replace(/[ +,]/g, '_')}-background`,
      selected: false,
    }));

    const allItems = [...partyItems, ...peopleItems];

    const dropdownGroups = [
      {
        id: 'parties',
        label: this.$t('parties'),
        items: parties.map((party) => party.slug),
      },
      ...parties.map((party) => ({
        id: party.slug,
        label: party.name,
        items: people
          .filter((person) => person?.group?.slug === party.slug)
          .map((person) => person.slug),
      })),
    ];

    const initialFilter = this.cardState.query || '';

    return {
      people,
      parties,
      allItems,
      dropdownGroups,
      filter: initialFilter,
    };
  },
  methods: {
    selectCallback(itemId) {
      // eslint-disable-next-line no-restricted-properties
      const { urls, siteMap: sm } = this.$root.$options.contextData;
      const person = this.people.find((p) => p.slug === itemId);
      if (person) {
        window.location.href = `${urls.site}/${sm.member.base}/${person.slug}`;
        return;
      }
      const party = this.parties.find((p) => p.slug === itemId);
      if (party) {
        window.location.href = `${urls.site}/${sm.party.base}/${party.slug}`;
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

.global-search :deep(.search-dropdown) {
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
