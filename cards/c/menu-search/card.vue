<template>
  <transparent-wrapper
    :id="`${$options.cardData.mountId}`"
    :card-url="url"
    :header-config="headerConfig"
    :og-config="ogConfig"
  >
    <p-search-dropdown
      :value="allItems"
      :placeholder="$t('search_placeholder')"
      :single="false"
      :groups="groups"
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
  name: 'CardCMenuSearch',
  components: {
    TransparentWrapper,
    PSearchDropdown,
  },
  mixins: [common, links],
  data() {
    const grouped = this.groupBy(this.$options.cardData.data.data, (item) => [
      item.person.party.acronym,
    ]);

    const groups = [
      {
        label: this.$t('parties'),
        items: grouped
          .filter((group) => group[0].person.party.classification === 'pg')
          .map((group) => group[0].person.party.acronym),
      },
    ].concat(
      grouped.map((group) => ({
        label: group[0].person.party.name,
        acronym: group[0].person.party.acronym,
        items: group.map((p) => p.person.id),
        id: group[0].person.party.id,
      }))
    );

    const parties = grouped.map((group) => ({
      id: group[0].person.party.acronym,
      label: group[0].person.party.acronym,
      selected: false,
      colorClass: `${group[0].person.party.acronym
        .toLowerCase()
        .replace(/[ +,]/g, '_')}-background`,
    }));

    const people = this.$options.cardData.data.data.map((p) => ({
      id: p.person.id,
      label: p.person.name,
      selected: false,
      image: this.getPersonPortrait(p.person),
      acronym: p.person.party.acronym,
    }));

    return {
      grouped,
      groups,
      people,
      parties,
      data: this.$options.cardData.data,
      filter: this.$options.cardData.parlaState
        ? this.$options.cardData.parlaState.query || ''
        : '',
    };
  },
  computed: {
    allItems() {
      return this.people.concat(this.parties);
    },
  },
  methods: {
    groupBy(array, f) {
      const groups = {};
      array.forEach((o) => {
        const group = JSON.stringify(f(o));
        groups[group] = groups[group] || [];
        groups[group].push(o);
      });
      return Object.keys(groups).map((group) => groups[group]);
    },
    selectCallback(id) {
      if (parseInt(id, 10)) {
        // it's a person
        document.location.href = `${this.slugs.urls.base}/${this.$options.cardData.siteMap.member.base}/${this.slugs.person[id].slug}`;
      } else {
        // it's a party
        const partyId = this.groups.filter((group) => group.acronym === id)[0]
          .id;
        document.location.href = `${this.slugs.urls.base}/${this.$options.cardData.siteMap.party.base}/${this.slugs.party[partyId].acronym}`;
      }
    },
    searchCallback(term) {
      document.location.href = `${this.getSearchTermLink(term)}`;
    },
  },
};
</script>

<style lang="scss" scoped>
@import 'parlassets/scss/colors';

.card-container ::v-deep .card-content {
  min-height: auto;
}

.search-dropdown ::v-deep .search-dropdown-input {
  background-color: transparent;
}

.search-dropdown {
  border: none;
  padding-left: 20px;
}

.search-dropdown ::v-deep .search-dropdown-options.empty {
  border-bottom: none;
}

.search-dropdown::after {
  content: '\e003';
  font-family: 'Glyphicons Halflings';
  border: none;
  font-size: 22px;
  top: 0;
  left: 0;
  display: flex;
  height: 100%;
  width: 40px;
  align-items: center;
  color: $first;
}
</style>
