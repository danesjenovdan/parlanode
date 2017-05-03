<template>
  <div class="members">
    <div class="filters">
      <search-field
        v-model="nameFilter"
        placeholder="Vsi poslanci"
      />
      <div class="vote-filters">
        <striped-button
          v-for="vote, index in votes"
          :color="vote.id"
          :key="vote.id"
          :selected="vote.selected"
          :small-text="vote.label"
          :text="String(memberVotes[vote.id])"
          :click-handler="() => toggleVote(index)"
        />
      </div>
      <result
        :score="result.value"
        :option="result.max_opt"
      />
    </div>
    <sortable-table
      class="person-list"
      :columns="columns"
      :items="mappedMembers"
    />
  </div>
</template>

<script>
import StripedButton from 'components/StripedButton.vue';
import { PORTRAIT_ROOT_URL } from 'components/constants';
import { getPersonLink, getPersonPortrait, getMemberPartyLink } from 'components/links';
import SortableTable from 'components/SortableTable.vue';
import SearchField from 'components/SearchField.vue';
import Result from './Result.vue';

export default {
  name: 'GlasovanjeSeje_Poslanci',
  components: { StripedButton, SortableTable, SearchField, Result },
  data() {
    return {
      nameFilter: '',
      columns: [
        { id: 'portrait', label: '', additionalClass: 'portrait' },
        { id: 'name', label: 'Ime', additionalClass: 'wider name' },
        { id: 'party', label: 'PS' },
        { id: 'votes', label: 'Glasovi', additionalClass: 'optional' },
      ],
      votes: [
        { id: 'for', label: 'za', selected: false },
        { id: 'against', label: 'proti', selected: false },
        { id: 'abstain', label: 'vzdržani', selected: false },
        { id: 'not_present', label: 'niso', selected: false },
      ],
    };
  },
  computed: {
    mappedMembers() {
      let members = this.members;

      if (this.nameFilter.length > 0) {
        members = members.filter(member =>
          member.person.name.toLowerCase().indexOf(this.nameFilter.toLowerCase()) > -1,
        );
      }

      if (this.selectedVotes.length > 0) {
        members = members.filter(member => this.selectedVotes.indexOf(member.option) > -1);
      }

      return members.map(member => [
        { image: getPersonPortrait(member), link: getPersonLink(member) },
        { text: member.person.name, link: getPersonLink(member) },
        { text: member.person.party.acronym, link: getMemberPartyLink(member) },
        { text: member.option },
      ]);
    },
    selectedVotes() {
      return this.votes
        .filter(vote => vote.selected)
        .map(vote => vote.id);
    },
  },
  props: {
    members: Array,
    memberVotes: Object,
    result: Object,
  },
  methods: {
    toggleVote(index) {
      // const vote = find(this.votes, { id });
      const newVotes = JSON.parse(JSON.stringify(this.votes));
      newVotes[index].selected = !newVotes[index].selected;
      this.votes = newVotes;
    },
  },
};
</script>

<style lang="sass" scoped>
@import 'parlassets/scss/colors';

.filters {
  align-items: center;
  display: flex;
  margin-top: 13px;

  .search-field {
    flex: 1;
    width: auto;
  }

  .vote-filters {
    display: flex;
    margin: 0 0 0 35px;
    .striped-button {
      width: 97px;
      &:not(:last-child) { margin-right: 6px; }
    }
  }
}

.person-list {
  max-height: 388px;
  overflow: auto;
}
</style>
