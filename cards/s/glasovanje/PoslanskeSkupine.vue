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
        <result
          :score="party.max.maxOptPerc"
          :option="party.max.max_opt"
          :chart-data="mapVotes(party.votes)"
        />
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
            :disabled="party.votes[vote.id] === 0"
          />
        </div>
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
              <a class="funblue-light-hover" :href="getPersonLink(member)">{{ member.person.name }}</a><br>
              <a class="funblue-light-hover" :href="getPersonPartyLink(member)">{{ member.person.party.acronym }}</a>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { getPartyLink, getPersonLink, getPersonPartyLink, getPersonPortrait } from 'components/links';
import StripedButton from 'components/StripedButton.vue';
import mapVotes from './mapVotes';
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
      return this.members.filter((member) => {
        if (['coalition', 'opposition'].indexOf(this.expandedParty) > -1) {
          return member.person.party.is_coalition === (this.expandedParty === 'coalition') &&
                 member.option === this.expandedOption;
        }
        return member.person.party.id === this.expandedParty &&
               member.option === this.expandedOption;
      });
    },
  },
  props: {
    members: Array,
    parties: Array,
  },
  methods: {
    getPartyLink,
    getPersonLink,
    getPersonPartyLink,
    getPersonPortrait,
    mapVotes,
    expandVote(party, option) {
      if (this.expandedParty === party && this.expandedOption === option) {
        this.expandedParty = null;
        this.expandedOption = null;
      } else {
        this.expandedParty = party;
        this.expandedOption = option;
        const thing = event.currentTarget;
        $(thing).parents('.parties').scrollTop($(thing).parents('.parties').scrollTop() + $(thing).offset().top - 296);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import '~parlassets/scss/colors';
@import '~parlassets/scss/breakpoints';

.parties {
  height: 352px;
  margin-top: 13px;
  overflow: auto;
}

  .party {
    background: $grey;
    margin-bottom: 12px;
    padding: 10px 18px 14px;
    @include respond-to(desktop) {
      padding-bottom: 0;
      padding-top: 0;
    }
  }

    .description {
      align-items: center;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      @include respond-to(desktop) {
        flex-wrap: nowrap;
        height: 79px;
      }
    }

      .name {
        font-size: 14px;
        min-width: 94px;
        @include respond-to(desktop) {
          font-size: 16px;
          order: 1;
        }
      }

      .votes {
        display: flex;
        width: 100%;

        @include respond-to(desktop) {
          order: 2;
          width: 400px;
        }
        @include respond-to(limbo) { width: 300px; }

        .striped-button {
          flex: 1;
          &:not(:last-child) { margin-right: 6px; }
        }
      }

      .result {
        flex: 1;
        @include respond-to(desktop) {
          max-width: 300px;
          order: 3;
        }
      }

      .members {
        padding-top: 14px;
        @include respond-to(desktop) { padding-top: 0; }
        .person-list .item { border-color: #dddddd; }
      }
</style>
