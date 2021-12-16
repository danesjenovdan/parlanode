<template>
  <scroll-shadow ref="shadow">
    <div class="parties" @scroll="$refs.shadow.check($event.currentTarget)">
      <div
        v-for="(party, key) in sortedParties"
        :key="party.group?.slug || key"
        class="party"
      >
        <div class="description">
          <div class="name">
            <template v-if="getPartyLink(party.group)">
              <a :href="getPartyLink(party.group)" class="funblue-light-hover">
                {{ party.group?.acronym || party.group?.name || 'N/A' }}
              </a>
            </template>
            <template v-else>
              {{ party.group?.acronym || party.group?.name || 'N/A' }}
            </template>
          </div>
          <result
            :score="party.max.max_option_percentage"
            :option="party.max.max_option"
            :chart-data="mapVotes(party.votes)"
          />
          <div class="votes">
            <striped-button
              v-for="vote in votes"
              :key="vote.id"
              :class="{
                'lightning-badge':
                  party.outliers && party.outliers.indexOf(vote.id) > -1,
              }"
              :color="vote.id"
              :selected="
                party.group?.slug === expandedParty &&
                vote.id === expandedOption
              "
              :small-text="vote.label"
              :text="String(party.votes[vote.id])"
              :disabled="party.votes[vote.id] === 0"
              @click="expandVote($event, party.group?.slug, vote.id)"
            />
          </div>
        </div>
        <div v-if="party.group?.slug === expandedParty" class="members">
          <ul class="person-list">
            <li
              v-for="member in expandedMembers"
              :key="member.person.id"
              class="item"
            >
              <div class="column portrait">
                <a :href="getPersonLink(member.person)">
                  <img :src="getPersonPortrait(member.person)" />
                </a>
              </div>
              <div class="column wider name">
                <div class="person-name">
                  <a
                    :href="getPersonLink(member.person)"
                    class="funblue-light-hover"
                  >
                    {{ getPersonName(member.person) }}
                  </a>
                </div>
                <div class="person-party">
                  <a
                    v-if="getPartyLink(member.person?.group)"
                    :href="getPartyLink(member.person?.group)"
                    class="funblue-light-hover"
                  >
                    {{
                      member.person?.group?.acronym ||
                      member.person?.group?.name ||
                      'N/A'
                    }}
                  </a>
                  <span v-else>
                    {{
                      member.person?.group?.acronym ||
                      member.person?.group?.name ||
                      'N/A'
                    }}
                  </span>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </scroll-shadow>
</template>

<script>
import { find } from 'lodash-es';
import links from '@/_mixins/links.js';
import StripedButton from '@/_components/StripedButton.vue';
import Result from '@/_components/Result.vue';
import ScrollShadow from '@/_components/ScrollShadow.vue';
import mapVotes from '@/_helpers/mapVotes.js';

export default {
  name: 'GlasovanjeSejePoslanskeSkupine',
  components: {
    StripedButton,
    Result,
    ScrollShadow,
  },
  mixins: [links],
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
  emits: ['selectedparty', 'selectedoption'],
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
    sortedParties() {
      const sorted = this.parties.slice(); // copy array to avoid side effects in computed property
      return sorted.sort((a, b) => {
        return this.votesSum(b.votes) - this.votesSum(a.votes);
      });
    },
    expandedMembers() {
      return this.members.filter((member) => {
        if (['coalition', 'opposition'].indexOf(this.expandedParty) > -1) {
          return (
            member.person.group?.is_coalition ===
              (this.expandedParty === 'coalition') &&
            member.option === this.expandedOption
          );
        }
        return (
          member.person.group?.slug === this.expandedParty &&
          member.option === this.expandedOption
        );
      });
    },
  },
  mounted() {
    this.expandedParty = this.selectedParty;
    this.expandedOption = this.selectedOption;
  },
  methods: {
    mapVotes,
    votesSum(votes) {
      const voteKeys = Object.keys(votes);
      return voteKeys.reduce((sum, vote) => sum + votes[vote], 0);
    },
    expandVote(event, party, option) {
      if (find(this.sortedParties, ['group.slug', party]).votes[option] === 0) {
        return;
      }

      if (this.expandedParty === party && this.expandedOption === option) {
        this.expandedParty = null;
        this.expandedOption = null;
      } else {
        this.expandedParty = party;
        this.expandedOption = option;
        // const thing = event.currentTarget;
        // $(thing)
        //   .parents('.parties')
        //   .scrollTop(
        //     $(thing).parents('.parties').scrollTop() +
        //       $(thing).offset().top -
        //       $(thing).parents('.parties').offset().top -
        //       10
        //   );
      }

      this.$emit('selectedparty', this.expandedParty);
      this.$emit('selectedoption', this.expandedOption);
    },
  },
};
</script>

<style lang="scss" scoped>
@import 'parlassets/scss/colors';
@import 'parlassets/scss/breakpoints';

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

    &:not(:last-child) {
      margin-right: 6px;
    }
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

    :deep(.donut-chart) {
      display: none;
    }

    :deep(.text-container) {
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

  @include respond-to(desktop) {
    padding-top: 0;
  }

  .person-list {
    .item {
      border-color: $font-placeholder;
    }

    .person-name,
    .person-party {
      line-height: 1.1;
    }

    .person-name {
      font-weight: 300;
    }

    .person-party {
      font-size: 14px;
      margin-top: 5px;
    }
  }
}
</style>
