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
import common from 'mixins/common';
import TransparentWrapper from 'components/TransparentWrapper.vue';
import PSearchDropdown from 'components/SearchDropdown.vue';
import links from 'mixins/links';
import generators from 'mixins/generatePeopleAndParties';

export default {
  name: 'MenuSearch',
  components: {
    TransparentWrapper,
    PSearchDropdown,
  },
  mixins: [
    common,
    links,
    generators,
  ],
  data() {
    const groupedPredstavnicki = this.generateGrouped(this.$options.cardData.data.predstavnicki);
    const groupsPredstavnicki = this.generateGroups(this.$options.cardData.data.predstavnicki);
    const peoplePredstavnicki = this.generatePeople(this.$options.cardData.data.predstavnicki);
    const partiesPredstavnicki = this.generateParties(this.$options.cardData.data.predstavnicki);
    const groupedNaroda = this.generateGrouped(this.$options.cardData.data.naroda);
    const groupsNaroda = this.generateGroups(this.$options.cardData.data.naroda);
    const peopleNaroda = this.generatePeople(this.$options.cardData.data.naroda);
    const partiesNaroda = this.generateParties(this.$options.cardData.data.naroda);

    const interimGroups = groupsPredstavnicki;
    groupsNaroda.forEach((group) => {
      if (group.label !== this.$t('parties')) {
        interimGroups.push(group);
      } else  {
        interimGroups[0].items = interimGroups[0].items.concat(group.items);
      }
    });

    return {
      grouped: groupedPredstavnicki.concat(groupedNaroda),
      groups: interimGroups,
      people: peoplePredstavnicki.concat(peopleNaroda),
      parties: partiesPredstavnicki.concat(partiesNaroda),
      data: this.$options.cardData.data,
      filter: this.$options.cardData.parlaState ? (this.$options.cardData.parlaState.query || '') : '',
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
      return Object.keys(groups).map(group => groups[group]);
    },
    selectCallback(id) {
      if (parseInt(id, 10)) {
        // it's a person
        document.location.href = `${this.slugs.urls.base}/${this.$options.cardData.siteMap.member.base}/${this.slugs.person[id].slug}`;
      } else {
        // it's a party
        const partyId = this.groups.filter(group => group.acronym === id)[0].id;
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
@import "~parlassets/scss/colors";

.card-container /deep/ .card-content {
  min-height: auto;
}

.search-dropdown /deep/ .search-dropdown-input {
  background-color: transparent;
}

.search-dropdown {
  border: none;
  padding-left: 20px;
}

.search-dropdown /deep/ .search-dropdown-options.empty {
  border-bottom: none;
}

.search-dropdown::after {
  content: "\e003";
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
