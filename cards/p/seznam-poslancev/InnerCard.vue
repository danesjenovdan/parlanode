<template>
  <div class="card-container card-halfling card-seznam-poslancev">
    <card-header :config="headerConfig" />

    <div class="card-content">
      <div class="card-content-front">
        <sortable-table
          class="person-list"
          :columns="columns"
          :items="mappedMembers"
          :sort="currentSort"
          :sort-order="currentSortOrder"
          :sort-callback="selectSort"
        />
      </div>

      <card-info>
        <p class="info-text lead"></p>
        <p class="info-text heading">METODOLOGIJA</p>
        <p class="info-text"></p>
      </card-info>

      <card-embed :url="generatedCardUrl" />

      <card-share :url="generatedCardUrl" />
    </div>
    <card-footer />
  </div>
</template>

<script>
import common from 'mixins/common';
import SortableTable from 'components/SortableTable.vue';
import { getPersonLink, getPersonPortrait, getPersonPartyLink } from 'components/links';

export default {
  components: { SortableTable },
  mixins: [common],
  name: 'SeznamPoslancevInnerCard',
  computed: {
    mappedMembers() {
      return this.processedMembers.map(member => [
        { link: getPersonLink(member), image: getPersonPortrait(member) },
        { link: getPersonLink(member), text: member.person.name },
        member.age,
        member.education,
        member.terms,
        { link: member.partylink ? getPersonPartyLink(member) : '', text: member.person.party.acronym },
        member.formattedDistrict,
        // { barchart: true, value: 122, width: 23 }
      ]);
    },
  },
  props: {
    headerConfig: Object,
    generatedCardUrl: String,
    columns: Array,
    currentSort: String,
    currentSortOrder: String,
    processedMembers: Array,
  },
  methods: {
    selectSort(sort) {
      console.log(sort);
    },
  },
};
</script>
