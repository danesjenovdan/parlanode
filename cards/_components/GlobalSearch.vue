<template>
  <transparent-wrapper>
    <p-search-dropdown
      :model-value="allItems"
      :placeholder="$t('search_placeholder')"
      :groups="dropdownGroups"
      :filter="filter"
      @select="selectCallback"
      @search="searchCallback"
    />
  </transparent-wrapper>
</template>

<script>
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

    const peopleItems = people.map((person) => ({
      id: person.slug,
      label: person.name,
      image: this.getPersonPortrait(person),
      selected: false,
    }));

    const groupItems = groups.map((group) => ({
      id: group.slug,
      label: group.name,
      colorClass: 'xxx',
      //   colorClass: `${group[0].person.group.acronym
      //     .toLowerCase()
      //     .replace(/[ +,]/g, '_')}-background`,
      selected: false,
    }));

    const allItems = [...groupItems, ...peopleItems];

    const dropdownGroups = [
      {
        id: 'groups',
        label: this.$t('parties'),
        items: groups.map((group) => group.slug),
      },
      ...groups.map((group) => ({
        id: group.slug,
        label: group.name,
        items: people
          .filter((person) => person?.group?.slug === group.slug)
          .map((person) => person.slug),
      })),
    ];

    const initialFilter = this.cardState.query || '';

    return {
      people,
      groups,
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
