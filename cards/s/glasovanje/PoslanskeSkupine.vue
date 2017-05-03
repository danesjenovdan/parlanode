<template>
  <div class="parties">
    <div class="party" v-for="party in parties">
      <div class="description">
        <div class="name">
          <template v-if="party.party.acronym">
            <a
              :href="getPartyLink(party.party)"
              class="funblue-light-hover"
            >
              {{ party.party.acronym }}
            </a>
          </template>
          <template v-else>
            {{ party.party.name }}
          </template>
        </div>
        <div class="votes">
          <striped-button
            v-for="vote, index in votes"
            :class="{ 'lightning-badge': party.outliers && party.outliers.indexOf(vote.id) > -1 }"
            :color="vote.id"
            :key="vote.id"
            :selected="party.party.id === expandedParty && vote.id === expandedOption"
            :small-text="vote.label"
            :text="String(party.votes[vote.id])"
            :click-handler="() => expandVote(party.party.id, vote.id)"
          />
        </div>
        <result
          :score="party.max.score"
          :option="party.max.option"
        />
      </div>
      <div
        v-if="party.party.id === expandedParty"
        class="members"
      >
        <ul class="person-list">
          <li v-for="member in expandedMembers" class="item">
            <div class="column portrait">
              <a :href="getPersonLink(member)"><img :src="getPersonPortrait(member)"></a>
            </div>
            <div class="column name">
              <a :href="getPersonLink(member)">{{ member.person.name }}</a>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { getPartyLink, getPersonLink, getPersonPortrait } from 'components/links';
import StripedButton from 'components/StripedButton.vue';
import Result from './Result.vue';

export default {
  name: 'GlasovanjeSeje_PoslanskeSkupine',
  components: { StripedButton, Result },
  data() {
    return {
      votes: [
        { id: 'for', label: 'za' },
        { id: 'against', label: 'proti' },
        { id: 'abstain', label: 'vzdržani' },
        { id: 'not_present', label: 'niso' },
      ],
      expandedParty: null,
      expandedOption: null,
    };
  },
  computed: {
    expandedMembers() {
      return this.members.filter(member =>
        member.person.party.id === this.expandedParty && member.option === this.expandedOption,
      );
    },
  },
  props: {
    members: Array,
    parties: Array,
  },
  methods: {
    getPartyLink,
    getPersonLink,
    getPersonPortrait,
    expandVote(party, option) {
      if (this.expandedParty === party && this.expandedOption === option) {
        this.expandedParty = null;
        this.expandedOption = null;
      } else {
        this.expandedParty = party;
        this.expandedOption = option;
      }
    },
  },
};
</script>

<style lang="sass" scoped>
@import 'parlassets/scss/colors';

.parties {
  margin-top: 13px;
  overflow: auto;
  max-height: 352px;
}

  .party {
    background: $grey;
    margin-bottom: 12px;
    padding: 0 18px;
  }

    .description {
      align-items: center;
      display: flex;
      height: 79px;

    }

      .name {
        flex: 1;
        font-size: 16px;
      }

      .votes {
        display: flex;
        width: 400px;
        .striped-button {
          flex: 1;
          &:not(:last-child) { margin-right: 6px; }
        }
      }

      .result { flex: 2; }
</style>
