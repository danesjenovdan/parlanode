<template>
  <div class="members">
    <div class="filters">
      <search-field
        v-model="nameFilter"
        placeholder="Vsi poslanci"
      />
      <div class="vote-filters">
        <striped-button
          v-for="vote in votes"
          :color="vote.id"
          :key="vote.id"
          :selected="vote.selected"
          :small-text="vote.label"
          :text="String(memberVotes[vote.id])"
          :disabled="memberVotes[vote.id] === 0"
          @click.native="toggleVote(vote.id)"
        />
      </div>
      <result
        :score="result.value"
        :option="result.max_opt"
        :chart-data="mapVotes(memberVotes)"
      />
    </div>
    <scroll-shadow ref="shadow">
      <ul class="person-list" @scroll="$refs.shadow.check($event.currentTarget)">
        <li v-for="member in filteredMembers" :key="member.person.id" class="item">
          <div class="column portrait">
            <a :href="getMemberLink(member)">
              <img :src="getMemberPortrait(member)">
            </a>
          </div>
          <div class="column wider name">
            <a :href="getMemberLink(member)" class="funblue-light-hover">
              {{ member.person.name }}
            </a>
            <br>
            <a :href="getMemberPartyLink(member)" class="funblue-light-hover">
              {{ member.person.party.acronym }}
            </a>
          </div>
          <div class="column vote">
            <div :class="`option option-${member.option}`">
              {{ translateOption(member.option, member.person.gender) }}
            </div>
          </div>
        </li>
      </ul>
    </scroll-shadow>
  </div>
</template>

<script>
import { find } from 'lodash';
import StripedButton from 'components/StripedButton.vue';
import links from 'mixins/links';
import SearchField from 'components/SearchField.vue';
import Result from 'components/Result.vue';
import ScrollShadow from 'components/ScrollShadow.vue';
import mapVotes from './mapVotes';

export default {
  name: 'GlasovanjeSejePoslanci',
  components: {
    StripedButton,
    SearchField,
    Result,
    ScrollShadow,
  },
  mixins: [
    links,
  ],
  props: {
    members: {
      type: Array,
      default: () => [],
    },
    memberVotes: {
      type: Object,
      default: () => ({}),
    },
    result: {
      type: Object,
      default: () => ({}),
    },
    state: {
      type: Object,
      default: () => ({}),
    },
  },
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
        { id: 'for', label: this.$t('vote-for'), selected: this.getSelectedOption('for') },
        { id: 'against', label: this.$t('vote-against'), selected: this.getSelectedOption('against') },
        { id: 'abstain', label: this.$t('vote-abstain-plural'), selected: this.getSelectedOption('abstain') },
        { id: 'absent', label: this.$t('vote-absent-plural'), selected: this.getSelectedOption('absent') },
      ],
    };
  },
  computed: {
    selectedVotes() {
      return this.votes
        .filter(vote => vote.selected)
        .map(vote => vote.id);
    },
    filteredMembers() {
      return this.members.filter((member) => {
        let nameMatch = true;
        let optionMatch = true;

        if (this.nameFilter.length > 0) {
          const namesToMatch = this.nameFilter.split('|');
          nameMatch = namesToMatch.reduce((result, nameToMatch) => {
            if (!result) {
              return member.person.name.toLowerCase().indexOf(nameToMatch.toLowerCase()) > -1;
            }
            return result;
          }, false);
        }

        if (this.selectedVotes.length > 0) {
          optionMatch = this.selectedVotes.indexOf(member.option) > -1;
        }

        return nameMatch && optionMatch;
      });
    },
  },
  mounted() {
    if (this.state.nameFilter) {
      this.nameFilter = this.state.nameFilter;
    }
  },
  methods: {
    getSelectedOption(option) {
      if (this.state.selectedOption) {
        return this.state.selectedOption === option;
      }
      return false;
    },
    mapVotes,
    translateOption(option, gender) {
      return {
        for: {
          m: this.$t('vote-for'),
          f: this.$t('vote-for'),
        },
        against: {
          m: this.$t('vote-against'),
          f: this.$t('vote-against'),
        },
        absent: {
          m: this.$t('absent--m'),
          f: this.$t('absent--f'),
        },
        abstain: {
          m: this.$t('vote-abstain--m'),
          f: this.$t('vote-abstain--f'),
        },
      }[option][gender];
    },
    toggleVote(id) {
      const clickedVote = find(this.votes, { id });
      if (this.memberVotes[id] !== 0) {
        this.votes.forEach((vote) => {
          if (vote === clickedVote) {
            vote.selected = !vote.selected;
          } else {
            vote.selected = false;
          }
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import '~parlassets/scss/colors';
@import '~parlassets/scss/breakpoints';

.filters {
  margin-top: 13px;

  @include respond-to(desktop) {
    align-items: center;
    display: flex;
  }

  .search-field {
    width: 100%;
    @include respond-to(desktop) {
      flex: 1;
      width: auto;
      // max-width: 200px;
    }
  }

  .vote-filters {
    display: flex;
    margin: 8px 0;
    @include respond-to(desktop) { margin: 0 0 0 30px; }
    .striped-button {
      flex: 1;
      @include respond-to(desktop) { width: 97px; }
      &:not(:last-child) { margin-right: 6px; }
    }
  }

  .result {
    @include show-for('above-limbo', flex);
  }
}

.person-list {
  height: 231px;
  overflow: auto;
  @include respond-to(desktop) { height: 394.5px; }
}

.vote {
  display: flex;
  justify-content: flex-end;
  .option {
    background-size: 40px 40px;
    background-repeat: no-repeat;
    background-position: top center;
    font-size: 11px;
    font-weight: 500;
    padding-top: 40px;
    text-transform: uppercase;
    width: 58px;
    @include respond-to(desktop) { width: 125px; }

    $icon-path: "#{getConfig('urls.cdn')}/icons";
    &.option-for { background-image: url(#{$icon-path}/za_v2.svg) }
    &.option-against { background-image: url(#{$icon-path}/proti_v2.svg) }
    &.option-absent { background-image: url(#{$icon-path}/ni_v2.svg) }
    &.option-abstain { background-image: url(#{$icon-path}/vzdrzan_v2.svg) }
  }
}
</style>
