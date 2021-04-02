<template>
  <card-wrapper
    :id="$root.$options.contextData.mountId"
    :card-url="cardUrl"
    :header-config="headerConfig"
    :og-config="ogConfig"
  >
    <div v-show="false" class="card-content__empty">
      <!-- TODO this is hardcoded -->
      <div class="card-content__empty-inner">
        <img :src="`${slugs.urls.cdn}/img/icons/no-data.svg`" />
        <p v-t="'data-currently-unavailable'"></p>
      </div>
    </div>
    <div class="filters">
      <div class="filter text-filter">
        <div v-t="'title-search'" class="filter-label"></div>
        <p-search-field v-model="textFilter" />
      </div>
      <div class="filter type-dropdown">
        <div v-t="'vote-types'" class="filter-label"></div>
        <p-search-dropdown v-model="allClassifications" :alphabetise="false" />
      </div>
      <div class="filter tag-dropdown">
        <div v-t="'working-body'" class="filter-label"></div>
        <p-search-dropdown v-model="dropdownTags" />
      </div>
      <div v-if="type === 'person'" class="filter option-party-buttons">
        <div
          v-for="opt in allOptions"
          :key="opt.id"
          :class="[
            'party-button',
            opt.class,
            { selected: selectedOptions.indexOf(opt.id) > -1 },
          ]"
          @click="toggleOption(opt.id)"
        >
          {{ opt.label }}
        </div>
      </div>
      <div v-if="type === 'party'" class="filter text-filter">
        <div v-t="'sort-by'" class="filter-label"></div>
        <toggle v-model="selectedSort" :options="sortOptions" />
      </div>
    </div>

    <scroll-shadow ref="shadow">
      <div
        id="card-votes"
        class="votes stickinme date-list"
        @scroll="$refs.shadow.check($event.currentTarget)"
      >
        <div
          v-if="filteredVotingDays.length === 0"
          v-t="'no-results'"
          class="no-results"
        />
        <div v-else>
          <template
            v-for="votingDay in filteredVotingDays"
            :key="`${votingDay.date}`"
          >
            <div
              v-if="type === 'person' || selectedSort === 'date'"
              class="date"
            >
              {{ votingDay.date }}
            </div>
            <div>
              <div v-for="ballot in votingDay.ballots" :key="ballot.vote_id">
                <ballot :ballot="ballot" type="person" />
              </div>
            </div>
          </template>
        </div>
      </div>
    </scroll-shadow>
  </card-wrapper>
</template>

<script>
import { find, filter, assign } from 'lodash';
import PSearchField from '@/_components/SearchField.vue';
import PSearchDropdown from '@/_components/SearchDropdown.vue';
import Toggle from '@/_components/Toggle.vue';
import Ballot from '@/_components/Ballot.vue';
import ScrollShadow from '@/_components/ScrollShadow.vue';
import common from '@/_mixins/common.js';
import { memberHeader, partyHeader } from '@/_mixins/altHeaders.js';
import { memberOgImage, partyOgImage } from '@/_mixins/ogImages.js';
import { memberVotes, partyVotes } from '@/_mixins/contextUrls.js';
import { memberTitle, partyTitle } from '@/_mixins/titles.js';

export default {
  components: {
    PSearchDropdown,
    PSearchField,
    Toggle,
    Ballot,
    ScrollShadow,
  },
  mixins: [common],
  props: {
    contextData: {
      type: Object,
      required: true,
    },
    type: {
      type: String,
      required: true,
      validator: (value) => ['person', 'party'].indexOf(value) > -1,
    },
  },
  data() {
    const selectFromState = (items, stateItemIds) =>
      items.map((item) =>
        assign({}, item, { selected: stateItemIds.indexOf(item.id) > -1 })
      );

    let allOptions = [
      {
        id: 'for',
        class: 'for',
        label: this.$t('vote-for'),
        selected: false,
      },
      {
        id: 'against',
        class: 'against',
        label: this.$t('vote-against'),
        selected: false,
      },
      {
        id: 'abstain',
        class: 'abstain',
        label:
          this.type === 'person'
            ? this.$t('vote-abstain')
            : this.$t('vote-abstain-plural'),
        selected: false,
      },
      {
        id: 'absent',
        class: 'absent',
        label:
          this.type === 'person'
            ? this.$t('vote-absent')
            : this.$t('vote-absent-plural'),
        selected: false,
      },
    ];

    let allTags = this.contextData.cardData.all_tags.map((tag) => ({
      id: tag,
      label: tag,
      selected: false,
    }));

    let allClassifications = [];
    Object.keys(this.contextData.cardData.classifications).forEach(
      (classificationKey) => {
        allClassifications.push({
          id: classificationKey,
          label: this.$t(
            `vote_types.${this.contextData.cardData.classifications[classificationKey]}`
          ),
          selected: false,
        });
      }
    );

    let textFilter = '';

    if (this.contextData.cardState) {
      const state = this.contextData.cardState;
      if (state.text) {
        textFilter = state.text;
      }

      if (state.classifications) {
        allClassifications = selectFromState(
          allClassifications,
          state.classifications
        );
      }
      if (state.options) {
        allOptions = selectFromState(allOptions, state.options);
      }
      if (state.tags) {
        allTags = selectFromState(allTags, state.tags);
      }
    }

    return {
      votingDays: this.contextData.cardData.results,
      selectedSort: 'date',
      sortOptions: {
        maximum: this.$t('sort-by--inequality'),
        date: this.$t('sort-by--date'),
      },
      allClassifications,
      allOptions,
      allTags,
      textFilter,
    };
  },
  computed: {
    dropdownTags: {
      get() {
        const validTags = [];

        this.getFilteredVotingDays(true).forEach((votingDay) => {
          votingDay.ballots.forEach((ballot) => {
            ballot.tags.forEach((tag) => {
              if (validTags.indexOf(tag) === -1) {
                validTags.push(tag);
              }
            });
          });
        });

        return filter(this.allTags, (tag) => validTags.indexOf(tag.id) > -1);
      },
      set(newTags) {
        this.allTags = this.allTags.map(
          (tag) => find(newTags, { id: tag.id }) || tag
        );
      },
    },
    selectedTags() {
      return filter(this.allTags, (tag) => tag.selected).map((tag) => tag.id);
    },
    selectedClassifications() {
      return filter(
        this.allClassifications,
        (classification) => classification.selected
      ).map((classification) => classification.id);
    },
    selectedOptions() {
      return filter(this.allOptions, (option) => option.selected).map(
        (option) => option.id
      );
    },
    filteredVotingDays() {
      return this.getFilteredVotingDays();
    },
    cardUrl() {
      const state = {};

      if (this.selectedTags.length > 0) {
        state.tags = this.selectedTags;
      }
      if (this.selectedClassifications.length > 0) {
        state.classifications = this.selectedClassifications;
      }
      if (this.textFilter.length > 0) {
        state.text = this.textFilter;
      }
      if (this.selectedOptions.length > 0) {
        state.options = this.selectedOptions;
      }

      const personOrParty =
        this.type === 'person'
          ? this.contextData.cardData.person
          : this.contextData.cardData.party;
      return `${this.url}${personOrParty.id}/?state=${encodeURIComponent(
        JSON.stringify(state)
      )}&altHeader=true`;
    },
    headerConfig() {
      if (this.type === 'person') {
        return memberHeader.computed.headerConfig.call(this);
      }
      return partyHeader.computed.headerConfig.call(this);
    },
    ogConfig() {
      if (this.type === 'person') {
        return memberOgImage.computed.ogConfig.call(this);
      }
      return partyOgImage.computed.ogConfig.call(this);
    },
  },
  created() {
    (this.type === 'person' ? memberVotes : partyVotes).created.call(this);
    (this.type === 'person' ? memberTitle : partyTitle).created.call(this);
  },
  methods: {
    toggleOption(optionId) {
      const clickedOption = filter(
        this.allOptions,
        (option) => option.id === optionId
      )[0];
      clickedOption.selected = !clickedOption.selected;
    },
    getFilteredVotingDays(onlyFilterByText = false) {
      const filterBallots = (ballot) => {
        const tagMatch =
          onlyFilterByText ||
          this.selectedTags.length === 0 ||
          filter(ballot.tags, (tag) => this.selectedTags.indexOf(tag) > -1)
            .length > 0;
        const textMatch =
          this.textFilter === '' ||
          ballot.motion.toLowerCase().indexOf(this.textFilter.toLowerCase()) >
            -1;
        const optionMatch =
          onlyFilterByText ||
          this.selectedOptions.length === 0 ||
          this.selectedOptions.indexOf(ballot.option) > -1;
        const classificationMatch =
          onlyFilterByText ||
          this.selectedClassifications.length === 0 ||
          this.selectedClassifications.indexOf(ballot.classification) > -1;
        return tagMatch && textMatch && optionMatch && classificationMatch;
      };

      const votingDays = filter(
        this.votingDays.map((votingDay) => ({
          date: votingDay.date,
          ballots: filter(votingDay.ballots, filterBallots).map((ballot) => {
            const ballotClone = JSON.parse(JSON.stringify(ballot));
            const form =
              this.type === 'person'
                ? this.contextData.cardData.person.gender
                : 'plural';
            ballotClone.label = this.$t(`voted-${ballot.option}--${form}`);

            if (ballot.result !== 'none' && ballot.result != null) {
              ballotClone.outcome =
                ballot.result === true
                  ? this.$t('vote-passed')
                  : this.$t('vote-not-passed');
            }

            return ballotClone;
          }),
        })),
        (votingDay) => votingDay.ballots.length > 0
      );

      if (this.type === 'party' && this.selectedSort === 'maximum') {
        const sortyByDisunion = (arr) => {
          let bag = [];
          let i = 0;
          while (i < arr.length) {
            bag = bag.concat(arr[i].ballots);
            i += 1;
          }
          return bag.sort(
            (a, b) => parseInt(b.disunion, 10) - parseInt(a.disunion, 10)
          );
        };

        return [
          {
            ballots: sortyByDisunion(votingDays),
          },
        ];
      }

      return votingDays;
    },
  },
};
</script>

<style lang="scss" scoped>
@import 'parlassets/scss/breakpoints';
@import 'parlassets/scss/colors';

:deep(.card-content),
:deep(.card-content-front) {
  @include respond-to(mobile) {
    max-height: none;
  }
}

#card-votes {
  height: $full-card-height - 89px;
  overflow-y: auto;

  @include respond-to(mobile) {
    height: 352px;
  }
}

.filters {
  padding-bottom: 12px;
  @include respond-to(mobile) {
    flex-wrap: wrap;
    min-height: 154px;
  }
  $label-height: 26px;

  display: flex;

  .option-party-buttons {
    @include show-for(desktop, flex);

    width: 27.5%;
    padding-top: $label-height;

    .party-button:not(:last-child) {
      margin-right: 3px;
    }
  }

  .text-filter {
    @include respond-to(desktop) {
      width: 26%;
    }

    width: 100%;

    .text-filter-input {
      background-image: url("#{get-config-value('urls.cdn')}/icons/search.svg");
      background-size: 24px 24px;
      background-repeat: no-repeat;
      background-position: right 9px center;
      border: 1px solid $font-placeholder;
      font-size: 16px;
      height: 51px;
      line-height: 27px;
      outline: none;
      padding: 12px 42px 12px 14px;
      width: 100%;
    }
  }

  .tag-dropdown {
    @include respond-to(desktop) {
      width: 26%;
    }

    width: 100%;
  }

  .month-dropdown {
    @include show-for(desktop);

    width: 17.5%;
  }
}

.votes {
  flex: 1;
  // list-style: none;
  overflow-y: auto;
  position: relative;

  ul {
    list-style: none;
    margin: 0 0 7px;
    padding: 0;
  }

  li {
    display: flex;
    font-weight: 500;
    font-size: 16px;
    line-height: 18px;

    .date {
      height: auto;
      margin: 0 0 -18px 16px;
      padding: 16px 0;
      width: 54px;
    }
  }
}

.filters {
  .filter {
    @include respond-to(desktop) {
      margin-right: 10px;
    }

    @include respond-to(mobile) {
      width: 100%;
    }

    &:last-child {
      margin-right: 0;
    }
  }

  .filter-label {
    overflow: hidden;
    height: 20px;
    margin-top: 6px;
  }
}
</style>
