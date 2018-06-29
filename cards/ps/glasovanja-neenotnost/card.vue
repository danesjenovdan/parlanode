<template>
  <card-wrapper
    :id="$options.cardData.cardData._id"
    :card-url="generatedCardUrl"
    :header-config="headerConfig"
  >
    <div slot="info">
      <i18n path="info.lead" tag="p" class="info-text lead">
        <span place="text">
          <span v-if="textFilter">"{{ textFilter }}"</span>
          <span v-t="'all-votes'" v-else></span>
        </span>
        <span place="wbs">
          <span v-if="selectedTags.length">{{ selectedTags.join(', ') }}</span>
          <span v-t="'all-working-bodies'" v-else></span>
        </span>
        <span place="sortBy">{{ sortOptions[selectedSort].toLowerCase() }}</span>
      </i18n>
      <p v-t="'info.methodology'" class="info-text heading"></p>
      <p v-t="'info.text[0]'" class="info-text"></p>
      <p v-t="'info.text[1]'" class="info-text"></p>
    </div>

    <div class="groups">
      <striped-button
        v-for="group in groups"
        :color="group.color.toLowerCase()"
        :key="group.acronym"
        :selected="group.acronym === selectedGroup"
        :small-text="group.name"
        :is-uppercase="false"
        @click.native="selectGroup(group.acronym)"
      />
    </div>

    <div class="filters">
      <div class="filter text-filter">
        <div v-t="'title-search'" class="filter-label"></div>
        <input v-model="textFilter" class="text-filter-input" type="text">
      </div>
      <div class="filter type-dropdown">
        <div v-t="'vote-types'" class="filter-label"></div>
        <p-search-dropdown :items="dropdownItems.classifications" :placeholder="classificationPlaceholder" :alphabetise="false" />
      </div>
      <div class="filter tag-dropdown">
        <div v-t="'working-body'" class="filter-label"></div>
        <p-search-dropdown :items="dropdownItems.tags" :placeholder="tagPlaceholder" />
      </div>
      <div class="filter text-filter">
        <div v-t="'sort-by'" class="filter-label"></div>
        <toggle v-model="selectedSort" :options="sortOptions" />
      </div>
    </div>

    <scroll-shadow ref="shadow">
      <div :class="['results', {'is-loading': loading }]" @scroll="$refs.shadow.check($event.currentTarget)">
        <template v-for="day in filteredVotingDays">
          <date-row v-if="selectedSort === 'date'" :date="day.date" :key="day.date" />
          <a
            v-for="ballot in day.ballots"
            :key="ballot.id_parladata"
            :href="slugs.urls.glej + '/s/glasovanje/' + ballot.id_parladata + '?frame=true'"
            target="_blank"
            class="ballot"
          >
            <div class="disunion">
              <div class="percentage">{{ Math.round(ballot.maximum) }} %</div>
              <div v-t="'inequality'" class="text"></div>
            </div>
            <div class="name">{{ ballot.text }}</div>
            <div class="result">
              <template v-if="ballot.result">
                <i class="accepted glyphicon glyphicon-ok"></i>
                <div v-t="'vote-passed'" class="text"></div>
              </template>
              <template v-else>
                <i class="not-accepted glyphicon glyphicon-remove"></i>
                <div v-t="'vote-not-passed'" class="text"></div>
              </template>
            </div>
          </a>
        </template>
      </div>
    </scroll-shadow>
  </card-wrapper>
</template>

<script>
import { parse as parseDate, format } from 'date-fns';
import { groupBy, sortBy, zipObject, find, capitalize } from 'lodash';
import DateRow from 'components/DateRow.vue';
import PSearchDropdown from 'components/SearchDropdown.vue';
import StripedButton from 'components/StripedButton.vue';
import Toggle from 'components/Toggle.vue';
import common from 'mixins/common';
import ScrollShadow from 'components/ScrollShadow.vue';

export default {
  name: 'GlasovanjaNeenotnost',
  components: {
    DateRow,
    PSearchDropdown,
    StripedButton,
    Toggle,
    ScrollShadow,
  },
  mixins: [common],
  data() {
    let groups = [{
      id: 95,
      color: 'dz',
      acronym: 'DZ',
      name: this.$t('everybody'),
    }, {
      id: 144,
      color: 'koal',
      acronym: 'koal',
      name: capitalize(this.$t('coalition')),
    }];

    let namedGroups = [];
    Object.keys(this.$options.cardData.data).forEach((groupName) => {
      const groupValue = this.$options.cardData.data[groupName];
      if (!groupValue.disbanded) {
        namedGroups.push({
          id: groupName,
          acronym: groupValue.acronym,
          color: groupValue.acronym.toLowerCase().replace(/ /g, '_'),
          name: groupValue.acronym,
        });
      }
    });

    const allClassifications = [];

    namedGroups = sortBy(namedGroups, 'name');
    groups = groups.concat(namedGroups);

    return {
      voteData: [],
      loading: true,
      selectedSort: 'maximum',
      sortOptions: { maximum: this.$t('sort-by--inequality'), date: this.$t('sort-by--date') },
      textFilter: '',
      allTags: [],
      selectedGroup: 'DZ',
      groups,
      allClassifications,
      cardData: this.$options.cardData,
    };
  },
  computed: {
    classificationPlaceholder() {
      return this.selectedClassifications.length > 0
        ? this.$t('selected-placeholder', { num: this.selectedClassifications.length })
        : this.$t('select-placeholder');
    },
    tagPlaceholder() {
      return this.selectedTags.length > 0
        ? this.$t('selected-placeholder', { num: this.selectedTags.length })
        : this.$t('select-placeholder');
    },
    dropdownItems() {
      return {
        tags: this.allTags,
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
    filteredVotingDays() {
      return this.getFilteredVotingDays();
    },
    headerConfig() {
      return {
        circleIcon: 'seznam-glasovanj',
        heading: '&nbsp;',
        subheading: '7. sklic parlamenta',
        alternative: this.$options.cardData.cardData.altHeader === 'true',
        title: this.dynamicTitle,
      };
    },
    dynamicTitle() {
      return this.$options.cardData.cardData.name + (
        this.selectedSort === 'date'
          ? this.$t('sort-by--date').toLowerCase()
          : this.$t('sort-by--inequality').toLowerCase()
      );
    },
    generatedCardUrl() {
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
      if (this.selectedSort.length > 0) {
        state.sort = this.selectedSort;
      }
      if (this.selectedGroup.length > 0) {
        state.selectedGroup = this.selectedGroup;
      }

      return `${this.url}?state=${encodeURIComponent(JSON.stringify(state))}&altHeader=true`;
    },
  },
  watch: {
    selectedGroup(newValue) {
      this.fetchVotesForGroup(newValue);
    },
  },
  beforeMount() {
    this.fetchVotesForGroup();
  },
  created() {
    const context = this.$options.cardData;
    context.template.pageTitle = this.dynamicTitle;
  },
  methods: {
    getFilteredVotingDays(onlyFilterByText = false) {
      if (!this.voteData || this.voteData.length === 0) return [];

      const filterBallots = (ballot) => {
        const tagMatch = onlyFilterByText
          || this.selectedTags.length === 0
          || ballot.tag.filter(tag => this.selectedTags.indexOf(tag) > -1).length > 0;
        const textMatch = this.textFilter === ''
          || ballot.text.toLowerCase().indexOf(this.textFilter.toLowerCase()) > -1;
        const classificationMatch = onlyFilterByText
          || this.selectedClassifications.length === 0
          || this.selectedClassifications.indexOf(ballot.classification) > -1;
        return tagMatch && textMatch && classificationMatch;
      };

      const votes = sortBy(this.voteData, this.selectedSort).reverse();
      const getDateFromVote = vote => (vote.date ? format(parseDate(vote.date), 'D. M. YYYY') : null);

      let currentVotingDays;

      if (this.selectedSort === 'date') {
        currentVotingDays = groupBy(votes, getDateFromVote);
      } else {
        currentVotingDays = zipObject(votes.map((vote, index) => `${getDateFromVote(vote)}-${index}`), votes.map(vote => [vote]));
      }

      const mappedVotingDays = [];
      Object.keys(currentVotingDays).forEach((key) => {
        mappedVotingDays.push({
          date: key,
          ballots: currentVotingDays[key].filter(filterBallots),
        });
      });

      return mappedVotingDays
        .filter(votingDay => (votingDay.ballots.length > 0));
    },
    selectGroup(acronym) {
      this.selectedGroup = this.selectedGroup !== acronym ? acronym : 'DZ';
    },
    fetchVotesForGroup(acronym = 'DZ') {
      this.loading = true;
      const groupId = find(this.groups, { acronym }).id;
      $.getJSON(`${this.slugs.urls.analize}/pg/getIntraDisunionOrg/${groupId}`, (response) => {
        if (this.allTags.length === 0) {
          this.allTags = response.all_tags.map(tag => ({ id: tag, label: tag, selected: false }));
        }

        this.voteData = response[acronym];

        this.allClassifications = [];
        // eslint-disable-next-line no-restricted-syntax, guard-for-in
        for (const classificationKey in response.classifications) {
          this.allClassifications.push({
            id: classificationKey,
            label: response.classifications[classificationKey],
            selected: false,
          });
        }

        const selectFromState = (items, stateItemIds) => items
          .map(item => Object.assign({}, item, { selected: stateItemIds.indexOf(item.id) > -1 }));

        if (this.cardData.parlaState) {
          const state = this.cardData.parlaState;
          if (state.text) {
            this.textFilter = state.text;
          }
          if (state.classifications) {
            this.allClassifications = selectFromState(
              this.allClassifications,
              state.classifications,
            );
          }
          if (state.sort) {
            this.selectedSort = state.sort;
          }
          if (state.tags) {
            this.allTags = selectFromState(this.allTags, state.tags);
          }
          if (state.selectedGroup) {
            this.selectedGroup = state.selectedGroup;
          }
        }

        this.loading = false;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import '~parlassets/scss/breakpoints';
@import '~parlassets/scss/colors';

.groups {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-bottom: 16px;

  .striped-button {
    width: calc(33.33% - 3.33px);
    margin-bottom: 5px;
    @include respond-to(desktop) {
      flex: 1;
      margin-bottom: 0;
      &:not(:first-child) { margin-left: 5px; }
    }
  }
}

.filters {
  @include respond-to(mobile) {
    flex-wrap: wrap;
    min-height: 154px;
  }
  $label-height: 26px;

  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;

  .filter-label {
    font-size: 14px;
    font-weight: 300;
    line-height: $label-height;
  }

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
      height: 53px;
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

  .type-dropdown {
    @include show-for(desktop);

    width: 17.5%;
  }

  .search-dropdown-input {
    padding-top: 11px;
    padding-bottom: 11px;
  }

  .search-dropdown-options { top: 50px; }
}

.results {
  height: 350px;
  overflow-y: auto;

  &.is-loading {
    overflow-y: hidden;
    position: relative;
    &::before {
      background: $white url(https://cdn.parlameter.si/v1/parlassets/img/loader.gif) no-repeat center center;
      content: '';
      height: 100%;
      position: absolute;
      width: 100%;
      z-index: 1;
    }
  }
}

  .date-row {
    &:not(:first-child) { margin-top: 20px; }
  }

  .ballot {
    $section-border: 1px solid $black;
    background: $grey;
    color: $black;
    display: block;
    margin: 7px 0 8px 0;
    min-height: 90px;
    padding: 10px 14px;
    position: relative;

    &:hover, &:active, &:focus { text-decoration: none; }

    @include respond-to(desktop) {
      display: flex;
      margin: 10px 0;
      &:first-child {
        margin-top: 0;
      }
    }

    .disunion {
      display: flex;
      justify-content: center;
      text-align: center;

      @include respond-to(desktop) {
        flex-direction: column;
        padding-right: 16px;
      }
      .percentage {
        font-size: 24px;
        @include respond-to(desktop) {
          font-size: 30px;
        }
      }

      .text {
        font-size: 13px;
        line-height: 34px;
        margin-left: 10px;
        text-transform: uppercase;
        @include respond-to(desktop) {
          font-size: 16px;
          line-height: 23px;
          margin-left: 0;
        }
      }
    }

    .name {
      border-bottom: $section-border;
      border-top: $section-border;
      font-family: Roboto Slab, Times New Roman, serif;
      font-size: 11px;
      font-weight: 300;
      line-height: 1.45em;
      padding: 10px 0;

      @include respond-to(desktop) {
        border-bottom: none;
        border-top: none;
        border-left: $section-border;
        align-items: center;
        display: flex;
        flex: 4;
        font-size: 14px;
        padding: 5px 20px;
      }
    }

    .result {
      align-items: center;
      display: flex;
      justify-content: center;
      padding: 10px 0 0 0;

      @include respond-to(desktop) {
        border-left: $section-border;
        justify-content: left;
        padding: 0 0 0 16px;
        width: 136px;
      }

      .glyphicon {
        font-size: 24px;
        margin-bottom: 4px;
        &.accepted { color: $funblue; }
        &.not-accepted { color: $red; }

        @include respond-to(desktop) { font-size: 29px; }
      }

      .text {
        color: #333;
        font-size: 14px;
        font-weight: bold;
        text-transform: uppercase;
        margin-left: 12px;
      }
    }
  }
</style>
