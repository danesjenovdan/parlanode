<template>
  <scroll-shadow ref="shadow">
    <div class="parties" @scroll="$refs.shadow.check($event.currentTarget)">
      <div v-for="party in parties" :key="party.party.id" class="party">
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
              v-for="vote in votes"
              :class="{ 'lightning-badge': party.outliers && party.outliers.indexOf(vote.id) > -1 }"
              :color="vote.id"
              :key="vote.id"
              :selected="party.party.id === expandedParty && vote.id === expandedOption"
              :small-text="vote.label"
              :text="String(party.votes[vote.id])"
              :disabled="party.votes[vote.id] === 0"
              @click.native="expandVote($event, party.party.id, vote.id)"
            />
          </div>
        </div>
        <div
          v-if="party.party.id === expandedParty"
          class="members"
        >
          <ul class="person-list">
            <li v-for="member in expandedMembers" :key="member.person.id" class="item">
              <div class="column portrait">
                <a :href="getMemberLink(member)"><img :src="getMemberPortrait(member)"></a>
              </div>
              <div class="column name">
                <a :href="getMemberLink(member)" class="funblue-light-hover">
                  {{ member.person.name }}
                </a>
                <br>
                <a :href="getMemberPartyLink(member)" class="funblue-light-hover">
                  {{ member.person.party.acronym }}
                </a>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </scroll-shadow>
</template>

<script>
import { find } from 'lodash';
import links from 'mixins/links';
import StripedButton from 'components/StripedButton.vue';
import Result from 'components/Result.vue';
import ScrollShadow from 'components/ScrollShadow.vue';
import mapVotes from 'helpers/mapVotes';

export default {
  name: 'GlasovanjeSejePoslanskeSkupine',
  components: {
    StripedButton,
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
    parties: {
      type: Array,
      default: () => [],
    },
    state: {
      type: Object,
      default: () => ({}),
    },
    selectedParty: {
      type: [String, Number],
      default: null,
    },
    selectedOption: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      votes: [
        { id: 'for', label: this.$t('vote-for') },
        { id: 'against', label: this.$t('vote-against') },
        { id: 'abstain', label: this.$t('vote-abstain-plural') },
        { id: 'absent', label: this.$t('vote-absent-plural') },
      ],
      expandedParty: null,
      expandedOption: null,
    };
  },
  computed: {
    expandedMembers() {
      return this.members.filter((member) => {
        if (['coalition', 'opposition'].indexOf(this.expandedParty) > -1) {
          return member.person.party.is_coalition === (this.expandedParty === 'coalition')
            && member.option === this.expandedOption;
        }
        return member.person.party.id === this.expandedParty
          && member.option === this.expandedOption;
      });
    },
  },
  watch: {
  },

  mounted() {
    this.expandedParty = this.selectedParty;
    this.expandedOption = this.selectedOption;
  },
  methods: {
    mapVotes,
    expandVote(event, party, option) {
      if (find(this.parties, ['party.id', party]).votes[option] === 0) {
        return;
      }

      if (this.expandedParty === party && this.expandedOption === option) {
        this.expandedParty = null;
        this.expandedOption = null;
      } else {
        this.expandedParty = party;
        this.expandedOption = option;
        const thing = event.currentTarget;
        $(thing).parents('.parties').scrollTop($(thing).parents('.parties').scrollTop() + $(thing).offset().top - $(thing).parents('.parties').offset().top - 10);
      }

      this.$parent.$parent.$parent.$emit('selectedparty', this.expandedParty);
      this.$parent.$parent.$parent.$emit('selectedoption', this.expandedOption);
    },
  },
};
</script>

<style lang="scss" scoped>
@import '~parlassets/scss/colors';
@import '~parlassets/scss/breakpoints';

.parties {
  height: 453px;
  margin-top: 13px;
  overflow-y: auto;
}

  .party {
    background: $background;
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
          font-size: 18px;
          order: 1;
          font-weight: 300;
          flex: 0.8;
        }
      }

      .votes {
        display: flex;
        width: 100%;

        @include respond-to(desktop) {
          order: 2;
          width: 400px;
        }

        .striped-button {
          flex: 1;
          &:not(:last-child) { margin-right: 6px; }
        }
      }

      .result-chart {
        flex: 1.2;

        @include respond-to(desktop) {
          max-width: 300px;
          order: 3;
          justify-content: center;
        }

        @include respond-to(mobile) {
          display: flex;
          flex: 0;

          /deep/ .donut-chart {
            display: none;
          }

          /deep/ .text-container {
            display: flex;
            margin-right: 0;
            width: auto;
            white-space: nowrap;

            .text {
              margin-left: 15px;
            }
          }
        }
      }

      .members {
        padding-top: 14px;
        @include respond-to(desktop) { padding-top: 0; }
        .person-list .item { border-color: $font-placeholder; }
      }
</style>
