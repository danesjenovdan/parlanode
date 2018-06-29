<template>
  <card-wrapper
    :id="$options.cardData.cardData._id"
    :card-url="generatedCardUrl"
    :header-config="headerConfig"
  >
    <div slot="info">
      <p class="info-text lead" v-t="'info.lead'"></p>
      <p class="info-text heading" v-t="'info.methodology'"></p>
      <p class="info-text" v-t="'info.text[0]'"></p>
      <i18n path="info.text[1]" tag="p" class="info-text">
        <a
          place="link1"
          class="funblue-light-hover"
          target="_blank"
          :href="$t('info.links[0].link')"
          v-t="'info.links[0].text'"
        />
      </i18n>
      <i18n path="info.text[2]" tag="p" class="info-text">
        <a
          place="link2"
          class="funblue-light-hover"
          target="_blank"
          :href="$t('info.links[1].link')"
          v-t="'info.links[1].text'"
        />
        <a
          place="link3"
          class="funblue-light-hover"
          target="_blank"
          :href="$t('info.links[2].link')"
          v-t="'info.links[2].text'"
        />
      </i18n>
      <i18n path="info.text[3]" tag="p" class="info-text">
        <a
          place="link4"
          class="funblue-light-hover"
          target="_blank"
          :href="$t('info.links[3].link')"
          v-t="'info.links[3].text'"
        />
      </i18n>
    </div>

    <div class="filters">
      <div class="filter text-filter">
        <div class="filter-label" v-t="'title-search'"></div>
        <search-field v-model="textFilter"/>
      </div>
      <div class="filter tag-dropdown">
        <div class="filter-label" v-t="'working-body'"></div>
        <p-search-dropdown :items="dropdownItems.tags" :placeholder="tagPlaceholder"></p-search-dropdown>
      </div>
      <div class="filter month-dropdown">
        <div class="filter-label" v-t="'time-period'"></div>
        <p-search-dropdown :items="dropdownItems.months" :placeholder="monthPlaceholder" :alphabetise="false"></p-search-dropdown>
      </div>
      <div class="filter button-filter">
        <div class="filter-label" v-t="'show'"></div>
        <div class="filter-content">
          <striped-button
            v-for="voteType in voteTypes"
            @click.native="toggleVoteType(voteType.id)"
            :color="voteType.color"
            :key="voteType.id"
            :selected="selectedVoteTypes.indexOf(voteType.id) > -1"
            :small-text="voteType.label"
          />
        </div>
      </div>
    </div>
    <div id="votingCard" class="date-list">
      <div class="session_voting"
            v-for="votingDay in filteredVotingDays"
            :key="votingDay.date">
        <div class="date">{{ votingDay.date }}</div>
        <div class="clearfix single_voting"
              v-for="(vote, index) in votingDay.results"
              :key="index">
          <a :href="vote.url">
            <div v-if="vote.is_outlier" class="fire-badge"></div>
            <div v-if="vote.has_outliers && vote.is_outlier" class="lightning-badge"></div>
            <div v-if="vote.has_outliers && !vote.is_outlier" class="lightning-badge" style="left: -37px; position: absolute;"></div>
            <div class="col-md-1">
              <div :class="vote.accepted">
                <p>
                  <i :class="vote.accepted_glyph"></i>
                </p>
              </div>
            </div>
            <div class="col-md-11 border-left">
              <div class="col-md-6">
                <div class="session_title">
                  <p>
                    {{ vote.text.split(' ').length > 19 ? vote.text.split(' ').splice(0, 19).join(' ') + ' ...' : vote.text }}
                  </p>
                </div>
              </div>
              <div class="col-md-6">
                <div class="session_votes">
                  <div class="progress smallbar">
                    <div class="progress-bar fontblue" :style="{ width: `${vote.percent_votes_for}%` }">
                      <span class="sr-only">{{ vote.percent_votes_for }}% votes for</span>
                    </div>
                    <div class="progress-bar funblue" :style="{ width: `${vote.percent_against}%` }">
                      <span class="sr-only">{{ vote.percent_against }}% votes against</span>
                    </div>
                    <div class="progress-bar ignoreblue" :style="{ width: `${vote.percent_abstain}%` }">
                      <span class="sr-only">{{ vote.percent_abstain }}% votes abstained</span>
                    </div>
                    <div class="progress-bar noblue" :style="{ width: `${vote.percent_not_present}%` }">
                      <span class="sr-only">{{ vote.percent_not_present }}% not present</span>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-xs-3">
                      {{ vote.votes_for }}
                      <div class="type" v-t="'vote-for'"></div>
                      <div class="indicator aye">&nbsp;</div>
                    </div>
                    <div class="col-xs-3">
                      {{ vote.against }}
                      <div class="type" v-t="'vote-against'"></div>
                      <div class="indicator ney">&nbsp;</div>
                    </div>
                    <div class="col-xs-3">
                      {{ vote.abstain }}
                      <div class="type" v-t="'vote-abstained'"></div>
                      <div class="indicator abstention">&nbsp;</div>
                    </div>
                    <div class="col-xs-3">
                      {{ vote.not_present }}
                      <div class="type" v-t="'vote-not'"></div>
                      <div class="indicator not">&nbsp;</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </a>
        </div>
      </div>
    </div>
  </card-wrapper>
</template>

<script>
import { format as formatDate } from 'date-fns';
import { find } from 'lodash';

import voteMapper from 'helpers/voteMapper';
import stateLoader from 'helpers/stateLoader';
import generateMonths from 'helpers/generateMonths';
import common from 'mixins/common';
import { partyTitle } from 'mixins/titles';
import { partyHeader } from 'mixins/altHeaders';
import PSearchDropdown from 'components/SearchDropdown.vue';
import SearchField from 'components/SearchField.vue';
import StripedButton from 'components/StripedButton.vue';

const formattedDateToMonthId = (date) => {
  const [day, month, year] = date.split('. ');
  return formatDate(new Date(year, month - 1, day), 'YYYY-M');
};

export default {
  components: { PSearchDropdown, SearchField, StripedButton },
  mixins: [common, partyTitle, partyHeader],
  name: 'VlozeniAmandmaji',
  data() {
    const loadFromState = stateLoader(this.$options.cardData.parlaState);

    const voteTypes = [
      { id: true, color: 'binary-for', label: this.$t('accepted'), selected: false },
      { id: false, color: 'binary-against', label: this.$t('rejected'), selected: false },
    ];

    const votingDays = this.$options.cardData.data.results.map(votingDay => ({
      date: votingDay.date,
      results: votingDay.votes.map(voteMapper),
    }));

    const allTags = this.$options.cardData.data.all_tags
      .map(tag => ({ id: tag, label: tag, selected: false }));

    const allMonths = generateMonths();

    return {
      data: this.$options.cardData.data,
      textFilter: loadFromState('text') || '',
      votingDays,
      allTags: loadFromState('tags', allTags) || allTags,
      allMonths: loadFromState('months', allMonths) || allMonths,
      voteTypes: loadFromState('voteTypes', voteTypes) || voteTypes,
    };
  },
  computed: {
    generatedCardUrl() {
      const state = {};

      if (this.selectedTags.length > 0) state.tags = this.selectedTags;
      if (this.selectedMonths.length > 0) state.months = this.selectedMonths;
      if (this.selectedVoteTypes.length > 0) state.voteTypes = this.selectedVoteTypes;
      if (this.textFilter.length > 0) state.text = this.textFilter;

      return `${this.url}${this.data.party.id}?state=${encodeURIComponent(JSON.stringify(state))}&altHeader=true`;
    },
    filteredVotingDays() {
      return this.getFilteredVotingDays();
    },
    tagPlaceholder() {
      return this.selectedTags.length > 0
        ? this.$t('selected-placeholder', { num: this.selectedTags.length })
        : this.$t('select-placeholder');
    },
    monthPlaceholder() {
      return this.selectedMonths.length > 0
        ? this.$t('selected-placeholder', { num: this.selectedMonths.length })
        : this.$t('select-placeholder');
    },
    dropdownItems() {
      const validTags = [];
      const validMonths = [];

      this.getFilteredVotingDays(true).forEach((votingDay) => {
        const monthId = formattedDateToMonthId(votingDay.date);
        if (validMonths.indexOf(monthId) === -1) validMonths.push(monthId);
        votingDay.results.forEach((vote) => {
          vote.tags.forEach((tag) => {
            if (validTags.indexOf(tag) === -1) validTags.push(tag);
          });
        });
      });

      return {
        tags: this.allTags
          .filter(tag => validTags.indexOf(tag.id) > -1 || tag.selected),
        months: this.allMonths
          .filter(month => validMonths.indexOf(month.id) > -1 || month.selected),
      };
    },
    selectedTags() {
      return this.allTags
        .filter(tag => tag.selected)
        .map(tag => tag.id);
    },
    selectedMonths() {
      return this.allMonths
        .filter(month => month.selected)
        .map(month => month.id);
    },
    selectedVoteTypes() {
      return this.voteTypes
        .filter(voteType => voteType.selected)
        .map(voteType => voteType.id);
    },
  },
  methods: {
    getFilteredVotingDays(onlyFilterByText = false) {
      const filterVotes = (vote) => {
        const textMatch = this.textFilter === '' || vote.text.toLowerCase().indexOf(this.textFilter.toLowerCase()) > -1;
        const tagMatch = onlyFilterByText
            || this.selectedTags.length === 0
            || vote.tags.filter(tag => this.selectedTags.indexOf(tag) > -1).length > 0;
        const voteTypeMatch = onlyFilterByText
            || this.selectedVoteTypes.length === 0
            || this.selectedVoteTypes.indexOf(vote.result) > -1;
        return textMatch && tagMatch && voteTypeMatch;
      };

      return this.votingDays
        .map(votingDay => ({
          date: votingDay.date,
          results: votingDay.results.filter(filterVotes),
        }))
        .filter((votingDay) => {
          if (votingDay.results.length === 0) return false;
          const monthId = formattedDateToMonthId(votingDay.date);
          return onlyFilterByText
              || this.selectedMonths.length === 0
              || this.selectedMonths.indexOf(monthId) > -1;
        });
    },
    toggleVoteType(voteTypeId) {
      const clickedResult = find(this.voteTypes, { id: voteTypeId });
      clickedResult.selected = !clickedResult.selected;
    },
  },
};
</script>

<style lang="scss" scoped>
  @import '~parlassets/scss/breakpoints';
  @import '~parlassets/scss/colors';

  .card-header h1,
  .card-footer h1 {
    color: #525252;
  }

  #votingCard {
    height: 500px;
    overflow-y: auto;
  }

  #votingCard div.member span {
    color: #525252;
    font-weight: 500;
  }

  #votingCard .member:last-child {
    border: none;
  }

  #votingCard .member.lastel {
    border: none;
    padding-bottom: 10px;
  }

  .session_voting {
    font-weight: 400;
    padding: 0;

    &:empty::after {
      color: #c8c8c8;
      content: "Ni rezultatov.";
      left: calc(50% - 41px);
      position: absolute;
      top: calc(50% - 10px);
    }

    .session_votes .progress.smallbar {
      height: 15px;
    }

    .session_votes {
      font-size: 30px;
      line-height: 40px;
      margin: 15px 0 10px 0;

      .type {
        font-size: 14px;
        line-height: 20px;
        text-transform: uppercase;
      }
    }

  }

  .session_voting {
    padding-left: 10px;
    .accepted {
      line-height: normal;
      height: 95px;
      p {
        position: relative;
        top: 50%;
        -webkit-transform: translateY(-50%);
        -ms-transform: translateY(-50%);
        transform: translateY(-50%);

        margin: 0;
        line-height: 30px;
        margin-top: 6px;
      }
    }
    .session_title {
      height: 95px;
      margin: 0;
      @include respond-to(mobile) {
        margin-top: 15px;
        margin-bottom: 10px;
      }
      p {
        position: relative;
        top: 50%;
        -webkit-transform: translateY(-50%);
        -ms-transform: translateY(-50%);
        transform: translateY(-50%);
        font-family: Roboto Slab;
        margin-top: 6px;
      }
    }
  }


  @media (max-width: 991px) {
    .session_voting .session_title {
      height: 93px;
    }
    .session_voting .accepted {
      height: 60px;
    }

    .border-left {
      border-left: none;
      border-top: 2px solid #dbdbdb;
    }

    .single_voting {
      padding-bottom: 15px;
      &:hover {
        .border-left {
          border-top-color: #cadde6;
        }
      }
    }
  }

  .single_voting {
    position: relative;
    &:hover {
      background-color: #e1f6ff;
      .border-left { border-left-color: #cadde6; }
    }
  }

  .session_voting .session_title p {
    font-size: 14px;
  }

  .session_voting .single_voting {
    margin-top: 15px;
  }

  .seja_anchor:hover {
    color: #525252;
  }

  .card-content-front {
    overflow-y: auto;
  }

  // filters
  .filters {
    padding-bottom: 12px;
    @include respond-to(mobile) {
      flex-wrap: wrap;
      min-height: 154px;
    }
    $label-height: 26px;

    display: flex;

    .filter {
      @include respond-to(desktop) {
        flex: 1;
        &:not(:last-child) { padding-right: 10px; }
      }
      width: 100%;
    }

    .filter-label {
      font-size: 14px;
      font-weight: 300;
      line-height: $label-height;
    }

    .option-party-buttons {
      @include show-for(desktop, flex);
      @include show-for(mobile, flex);
      @include respond-to(mobile) { width: 100%; padding-top: 0; }

      width: 27.5%;
      padding-top: $label-height;

      .party-button:not(:last-child) {
        margin-right: 3px;
      }
    }

    .button-filter {
      @include show-for(desktop);

      .filter-content {
        display: flex;
        .striped-button {
          flex: 1;
          height: 51px;
          &:not(:last-child) { margin-right: 5px; }
        }
      }
    }

    .search-dropdown-options { top: 50px; }
  }

  .option-party-buttons {
    .sprejet {
      border-bottom-color: $funblue;

      &.selected, &:hover {
        background-color: $funblue;
      }
    }

    .zavrnjen {
      border-bottom-color: $red;

      &.selected, &:hover {
        background-color: $red;
      }
    }
  }
</style>
<style lang="scss">
  .card-glasovanja-seja {
    .search-dropdown-input {
      padding-top: 11px;
      padding-bottom: 11px;
      background-color: #ffffff;
    }

    .search-dropdown-options { top: 50px; }
  }
</style>
