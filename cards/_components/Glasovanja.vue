<template>
  <card-wrapper
    :id="$root.$options.cardData.cardData._id"
    content-class="full"
    :card-url="cardUrl"
    :header-config="headerConfig"
  >
    <div slot="info">
      <p class="info-text lead" v-t="'info.lead'"></p>
      <p class="info-text heading" v-t="'info.methodology'"></p>
      <p class="info-text" v-t="'info.text[0]'"></p>
      <i18n path="info.text[1]" tag="p" class="info-text">
        <a
          place="link"
          class="funblue-light-hover"
          target="_blank"
          :href="$t('info.link.link')"
          v-t="'info.link.text'"
        />
      </i18n>
    </div>

    <div v-show="false" class="card-content__empty"> <!-- TODO this is hardcoded -->
      <div class="card-content__empty-inner">
        <img src="//cdn.parlameter.si/v1/parlassets/img/icons/no-data.svg" />
        <p v-t="'data-currently-unavailable'"></p>
      </div>
    </div>
    <div class="filters">
      <div class="filter text-filter">
        <div class="filter-label" v-t="'title-search'"></div>
        <p-search-field v-model="textFilter" />
      </div>
      <div class="filter type-dropdown">
        <div class="filter-label" v-t="'vote-types'"></div>
        <p-search-dropdown :items="dropdownItems.classifications" :placeholder="classificationPlaceholder" :alphabetise="false" />
      </div>
      <div class="filter tag-dropdown">
        <div class="filter-label" v-t="'working-body'"></div>
        <p-search-dropdown :items="dropdownItems.tags" :placeholder="tagPlaceholder" />
      </div>
      <div v-if="this.type === 'person'" class="filter option-party-buttons">
        <div
          v-for="option in allOptions"
          :key="option.id"
          :class="['party-button', option.class, { selected: selectedOptions.indexOf(option.id) > -1 }]"
          @click="toggleOption(option.id)"
        >
          {{ option.label }}
        </div>
      </div>
      <div v-if="this.type === 'party'" class="filter text-filter">
        <div class="filter-label" v-t="'sort-by'"></div>
        <toggle v-model="selectedSort" :options="sortOptions" />
      </div>
    </div>

    <scroll-shadow ref="shadow">
      <div id="card-votes" class="votes stickinme date-list" @scroll="$refs.shadow.check($event.currentTarget)">
        <template v-for="votingDay in filteredVotingDays">
          <div v-if="type === 'person' || selectedSort === 'date'" class="date" :key="`${votingDay.date}-1`">
            {{ votingDay.date }}
          </div>
          <div :key="`${votingDay.date}-2`">
            <div v-for="ballot in votingDay.ballots" :key="ballot.vote_id">
              <ballot :ballot="ballot" type="person"></ballot>
            </div>
          </div>
        </template>
      </div>
    </scroll-shadow>
  </card-wrapper>
</template>

<script>
import { capitalize } from 'lodash';
import PSearchField from 'components/SearchField.vue';
import PSearchDropdown from 'components/SearchDropdown.vue';
import Toggle from 'components/Toggle.vue';
import Ballot from 'components/Ballot.vue';
import ScrollShadow from 'components/ScrollShadow.vue';

import common from 'mixins/common';
import { memberHeader, partyHeader } from 'mixins/altHeaders';

import { memberVotes, partyVotes } from 'mixins/contextUrls';
import { memberTitle, partyTitle } from 'mixins/titles';

export default {
  components: {
    PSearchDropdown,
    PSearchField,
    Toggle,
    Ballot,
    ScrollShadow,
  },
  mixins: [common],
  computed: {
    tagPlaceholder() {
      return this.selectedTags.length > 0
        ? this.$t('selected-placeholder', { num: this.selectedTags.length })
        : this.$t('select-placeholder');
    },
    classificationPlaceholder() {
      return this.selectedClassifications.length > 0
        ? this.$t('selected-placeholder', { num: this.selectedClassifications.length })
        : this.$t('select-placeholder');
    },
    dropdownItems() {
      const validTags = [];

      this.getFilteredVotingDays(true).forEach((votingDay) => {
        votingDay.ballots
          .forEach((ballot) => {
            ballot.tags.forEach((tag) => {
              if (validTags.indexOf(tag) === -1) validTags.push(tag);
            });
          });
      });

      return {
        tags: this.allTags.filter(tag => validTags.indexOf(tag.id) > -1),
        classifications: this.allClassifications,
      };
    },
    selectedTags() {
      return this.allTags
        .filter(tag => tag.selected)
        .map(tag => tag.id);
    },
    selectedClassifications() {
      return this.allClassifications
        .filter(classification => classification.selected)
        .map(classification => classification.id);
    },
    selectedOptions() {
      return this.allOptions.filter(option => option.selected).map(option => option.id);
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

      return `${this.url}${this[this.type].id}/?state=${encodeURIComponent(JSON.stringify(state))}&altHeader=true`;
    },
    headerConfig() {
      if (this.type === 'person') {
        return memberHeader.computed.headerConfig.call(this);
      }
      return partyHeader.computed.headerConfig.call(this);
    },
  },
  data() {
    const selectFromState = (items, stateItemIds) =>
      items.map(item => Object.assign({}, item, { selected: stateItemIds.indexOf(item.id) > -1 }));

    let allOptions = [{
      id: 'za',
      class: 'for',
      label: this.$t('vote-for'),
      selected: false,
    }, {
      id: 'proti',
      class: 'against',
      label: this.$t('vote-against'),
      selected: false,
    }, {
      id: 'kvorum',
      class: 'kvorum',
      label: (this.type === 'person' ? this.$t('vote-abstained') : this.$t('vote-abstained-plural')),
      selected: false,
    }, {
      id: 'ni',
      class: 'ni',
      label: (this.type === 'person' ? this.$t('vote-not') : this.$t('vote-not-plural')),
      selected: false,
    }];

    let allTags = this.cardData.data.all_tags
      .map(tag => ({ id: tag, label: tag, selected: false }));

    let allClassifications = [];
    Object.keys(this.cardData.data.classifications).forEach((classificationKey) => {
      allClassifications.push({
        id: classificationKey,
        label: this.cardData.data.classifications[classificationKey],
        selected: false,
      });
    });

    let textFilter = '';

    if (this.cardData.parlaState) {
      const state = this.cardData.parlaState;
      if (state.text) textFilter = state.text;

      if (state.classifications) {
        allClassifications = selectFromState(allClassifications, state.classifications);
      }
      if (state.options) {
        allOptions = selectFromState(allOptions, state.options);
      }
      if (state.tags) {
        allTags = selectFromState(allTags, state.tags);
      }
    }

    return {
      cardMethod: this.cardData.cardData.method,
      cardGroup: this.cardData.cardData.group,
      votingDays: this.cardData.data.results,
      selectedSort: 'date',
      sortOptions: { maximum: this.$t('sort-by--inequality'), date: this.$t('sort-by--date') },
      allClassifications,
      allOptions,
      allTags,
      textFilter,
    };
  },
  methods: {
    toggleOption(optionId) {
      const clickedOption = this.allOptions.filter(option => option.id === optionId)[0];
      clickedOption.selected = !clickedOption.selected;
    },
    getFilteredVotingDays(onlyFilterByText = false) {
      const filterBallots = (ballot) => {
        const tagMatch = onlyFilterByText || this.selectedTags.length === 0 ||
          ballot.tags.filter(tag => this.selectedTags.indexOf(tag) > -1).length > 0;
        const textMatch = this.textFilter === '' ||
          ballot.motion.toLowerCase().indexOf(this.textFilter.toLowerCase()) > -1;
        const optionMatch = onlyFilterByText || this.selectedOptions.length === 0 ||
          this.selectedOptions.indexOf(ballot.option) > -1;
        const classificationMatch = onlyFilterByText || this.selectedClassifications.length === 0 ||
          this.selectedClassifications.indexOf(ballot.classification) > -1;

        return tagMatch && textMatch && optionMatch && classificationMatch;
      };

      const votingDays = this.votingDays
        .map(votingDay => ({
          date: votingDay.date,
          ballots: votingDay.ballots
            .filter(filterBallots)
            .map((ballot) => {
              const ballotClone = JSON.parse(JSON.stringify(ballot));
              const form = this.type === 'person' ? this.person.gender : 'plural';
              if (ballot.option === 'za') {
                ballotClone.label = this.$t(`voted-for--${form}`);
              } else if (ballot.option === 'proti') {
                ballotClone.label = this.$t(`voted-against--${form}`);
              } else if (ballot.option === 'ni') {
                ballotClone.label = this.$t(`voted-not--${form}`);
              } else if (ballot.option === 'kvorum') {
                ballotClone.label = this.$t(`voted-quorum--${form}`);
              } else {
                ballotClone.label = this.$t(`voted-${ballot.option}--${form}`);
              }

              if (ballot.result !== 'none' && ballot.result != null) {
                ballotClone.outcome = ballot.result === true ? this.$t('vote-passed') : this.$t('vote-not-passed');
              }

              return ballotClone;
            }),
        }))
        .filter(votingDay => votingDay.ballots.length > 0);

      if (this.type === 'party' && this.selectedSort === 'maximum') {
        const sortyByDisunion = (arr) => {
          let bag = [];
          let i = 0;
          while (i < arr.length) {
            bag = bag.concat(arr[i].ballots);
            i += 1;
          }
          return bag.sort((a, b) => parseInt(b.disunion, 10) - parseInt(a.disunion, 10));
        };

        return [{
          ballots: sortyByDisunion(votingDays),
        }];
      }

      return votingDays;
    },
  },
  filters: {
    toPercent(val) {
      return `${parseInt(val, 10)} %`;
    },
  },
  props: {
    cardData: {
      type: Object,
      required: true,
    },
    type: {
      type: String,
      required: true,
      validator: value => ['person', 'party'].indexOf(value) > -1,
    },
    person: Object,
    party: Object,
  },
  created() {
    (this.type === 'person' ? memberVotes : partyVotes).created.call(this);
    (this.type === 'person' ? memberTitle : partyTitle).created.call(this);
  },
};
</script>

<style lang="scss" scoped>
@import '~parlassets/scss/breakpoints';
@import '~parlassets/scss/colors';

#card-votes {
  height: 429px;
  overflow-y: auto;
}

.toggle {
  height: 51px !important;
  line-height: 51px !important;
}

.card-content-front {
  display: flex;
  flex-direction: column;
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
    @include respond-to(desktop) { width: 26%; }

    width: 100%;

    .text-filter-input {
      background-image: url('https://cdn.parlameter.si/v1/parlassets/icons/search.svg');
      background-size: 24px 24px;
      background-repeat: no-repeat;
      background-position: right 9px center;
      border: 1px solid #c8c8c8;
      font-size: 16px;
      height: 51px;
      line-height: 27px;
      outline: none;
      padding: 12px 42px 12px 14px;
      width: 100%;
    }
  }

  .tag-dropdown {
    @include respond-to(desktop) { width: 26%; }

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

  &:empty::after {
    color: #c8c8c8;
    content: "Ni rezultatov.";
    left: calc(50% - 41px);
    position: absolute;
    top: calc(50% - 10px);
  }

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
    height: 26px;
  }
}
</style>
