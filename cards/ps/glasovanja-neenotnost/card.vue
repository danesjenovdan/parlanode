<template>
  <div :id="$options.cardData.cardData._id">
    <generator>
      <div slot="generator">
        <tools-tabs current-tool="discord" />
      </div>
      <card-wrapper
        :card-url="generatedCardUrl"
        :header-config="headerConfig"
        :og-config="ogConfig"
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

        <!-- <div class="groups">
          <striped-button
            v-for="group in groups"
            :color="group.color.toLowerCase()"
            :key="group.acronym"
            :selected="group.acronym === selectedGroup"
            :small-text="group.name"
            :is-uppercase="false"
            @click.native="selectGroup(group.acronym)"
          />
        </div> -->

        <div class="filters">
          <div class="filter text-filter">
            <div v-t="'title-search'" class="filter-label"></div>
            <input v-model="textFilter" class="text-filter-input" type="text">
          </div>
          <div class="filter type-dropdown">
            <div v-t="'parties'" class="filter-label"></div>
            <p-search-dropdown
              :value="allItems"
              :single="true"
              @select="selectCallback"
            />
          </div>
          <div class="filter tag-dropdown">
            <div v-t="'working-body'" class="filter-label"></div>
            <p-search-dropdown v-model="allTags" />
          </div>
          <div class="filter text-filter">
            <div v-t="'sort-by'" class="filter-label"></div>
            <toggle v-model="selectedSort" :options="sortOptions" />
          </div>
        </div>

        <scroll-shadow ref="shadow">
          <div
            :class="['results', {'is-loading': loading }]"
            @scroll="$refs.shadow.check($event.currentTarget)"
          >
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
    </generator>
  </div>
</template>

<script>
import { parse as parseDate, format } from 'date-fns';
import { groupBy, sortBy, zipObject, find, assign } from 'lodash';
import Generator from 'components/Generator.vue';
import ToolsTabs from 'components/ToolsTabs.vue';
import DateRow from 'components/DateRow.vue';
import PSearchDropdown from 'components/SearchDropdown.vue';
import StripedButton from 'components/StripedButton.vue';
import Toggle from 'components/Toggle.vue';
import common from 'mixins/common';
import { defaultHeaderConfig } from 'mixins/altHeaders';
import { defaultOgImage } from 'mixins/ogImages';
import ScrollShadow from 'components/ScrollShadow.vue';

export default {
  name: 'GlasovanjaNeenotnost',
  components: {
    Generator,
    ToolsTabs,
    DateRow,
    PSearchDropdown,
    StripedButton,
    Toggle,
    ScrollShadow,
  },
  mixins: [common],
  data() {
    const data = Object.keys(this.$options.cardData.data).map((key) => {
      const obj = this.$options.cardData.data[key];
      return {
        id: Number(key),
        ...obj,
      };
    });

    const all = data.find(o => o.type === 'parliament');
    const coalition = data.find(o => o.type === 'coalition');

    let groups = [];
    groups.push({
      id: all.id,
      color: 'dz',
      acronym: all.acronym,
      name: this.$t('everybody'),
    });
    groups.push({
      id: coalition.id,
      color: 'koal',
      acronym: coalition.acronym,
      name: coalition.name,
    });

    let namedGroups = [];
    data.forEach((group) => {
      if (!group.disbanded && group.type === 'party') {
        namedGroups.push({
          id: group.id,
          acronym: group.acronym,
          color: group.acronym.toLowerCase().replace(/[ +,]/g, '_'),
          name: group.acronym,
        });
      }
    });

    namedGroups = sortBy(namedGroups, ['name']);
    groups = groups.concat(namedGroups);

    // SEARCH DROPDOWN FOR PEOPLE AND PARTIES
    const parties = Object.keys(this.$options.cardData.data)
      .filter(key => this.$options.cardData.data[key].acronym !== this.$t('opposition'))
      .map((key) => {
        return {
          id: key,
          label: this.$options.cardData.data[key].acronym === this.$t('parliament') ? this.$t('parliament') : this.$options.cardData.data[key].acronym,
          selected: this.$options.cardData.data[key].acronym === this.$t('parliament'),
          colorClass: `${this.$options.cardData.data[key].acronym.toLowerCase().replace(/[ +,]/g, '_')}-background`,
        };
      });
    // SEARCH DROPDOWN END

    return {
      parties,
      voteData: [],
      loading: true,
      selectedSort: 'maximum',
      sortOptions: { maximum: this.$t('sort-by--inequality'), date: this.$t('sort-by--date') },
      textFilter: '',
      allTags: [],
      selectedGroup: groups[0].acronym,
      groups,
      allClassifications: [],
      cardData: this.$options.cardData,
    };
  },
  computed: {
    allItems() {
      return this.groups.map((group) => {
        return {
          id: group.acronym,
          label: group.acronym,
          selected: group.acronym === this.selectedGroup,
          colorClass: `${group.acronym.toLowerCase().replace(/[ +,]/g, '_')}-background`,
        };
      });
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
      return defaultHeaderConfig(this, {
        circleIcon: 'seznam-glasovanj',
        title: this.dynamicTitle,
      });
    },
    ogConfig() {
      return defaultOgImage(this, {
        icon: 'seznam-glasovanj',
        title: this.dynamicTitle,
      });
    },
    dynamicTitle() {
      return this.$t('card.title') + (
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
    this.fetchVotesForGroup(this.groups[0].acronym);
  },
  created() {
    const { template, siteMap: sm } = this.$options.cardData;
    template.pageTitle = this.dynamicTitle;
    template.contextUrl = `${this.slugs.urls.base}/${sm.landing.tools}/${sm.tools.discord}`;
  },
  methods: {
    groupBy(array, f) {
      const groups = {};
      array.forEach((o) => {
        const group = JSON.stringify(f(o));
        groups[group] = groups[group] || [];
        groups[group].push(o);
      });
      return Object.keys(groups).map(group => groups[group]);
    },
    selectCallback(acronym) {
      this.selectGroup(acronym);
    },
    clearCallback() {
      this.selectGroup(this.groups[0].acronym);
    },
    getFilteredVotingDays(onlyFilterByText = false) {
      if (!this.voteData || this.voteData.length === 0) {
        return [];
      }

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
      this.cardData.parlaState.selectedGroup = acronym;
      this.selectedGroup = this.selectedGroup !== acronym ? acronym : this.groups[0].acronym;
    },
    fetchVotesForGroup(acronym) {
      this.loading = true;
      const groupId = find(this.groups, { acronym }).id;
      $.getJSON(`${this.slugs.urls.analize}/pg/getIntraDisunionOrg/${groupId}`, (response) => {
        if (this.allTags.length === 0) {
          this.allTags = response.all_tags.map(tag => ({ id: tag, label: tag, selected: false }));
        }

        // TODO: this.voteData = response.results;
        this.voteData = response.results || response[acronym];

        this.allClassifications = [];
        // eslint-disable-next-line no-restricted-syntax, guard-for-in
        for (const classificationKey in response.classifications) {
          this.allClassifications.push({
            id: classificationKey,
            label: this.$t(`vote_types.${response.classifications[classificationKey]}`),
            selected: false,
          });
        }

        const selectFromState = (items, stateItemIds) => items
          .map(item => assign({}, item, { selected: stateItemIds.indexOf(item.id) > -1 }));

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
    width: 100%;

    @include respond-to(desktop) {
      width: 26%;
    }

    .text-filter-input {
      background-image: url("#{getConfig('urls.cdn')}/icons/search.svg");
      background-size: 24px 24px;
      background-repeat: no-repeat;
      background-position: right 9px center;
      border: 1px solid $font-placeholder;
      font-size: 16px;
      height: 51px;
      line-height: 25px;
      outline: none;
      padding: 12px 42px 12px 14px;
      width: 100%;
    }
  }

  .tag-dropdown {
    width: 100%;

    @include respond-to(desktop) {
      width: 26%;
    }
  }

  .type-dropdown {
    @include show-for(desktop);

    width: 17.5%;
  }
}

.results {
  height: 350px;
  overflow-y: auto;

  &.is-loading {
    overflow-y: hidden;
    position: relative;
    &::before {
      background: $white url("#{getConfig('urls.cdn')}/img/loader.gif") no-repeat center center;
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
  $section-border: 1px solid $font-placeholder;
  background: $background;
  color: $font-default;
  display: block;
  margin: 7px 0 8px 0;
  min-height: 90px;
  padding: 10px 14px;
  position: relative;

  &:hover, &:active, &:focus {
    text-decoration: none;
    background: $link-hover-background;
    color: $link;
  }

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

      &.accepted {
        color: $icon-accepted;
      }

      &.not-accepted {
        color: $icon-rejected;
      }

      @include respond-to(desktop) {
        font-size: 29px;
      }
    }

    .text {
      color: $font-default;
      font-size: 14px;
      font-weight: bold;
      text-transform: uppercase;
      margin-left: 12px;
    }
  }
}
</style>
