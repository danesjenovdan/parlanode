<template>
  <div id="seznam-glasovanj">
    <scroll-shadow ref="shadow">
      <div id="votingCard" class="date-list" @scroll="$refs.shadow.check($event.currentTarget)">
        <div class="session_voting">
          <div v-for="vote in filteredVotes" :key="vote.motion_id" class="clearfix single_voting">
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
                    {{ getVoteText(vote) }}
                  </p>
                </div>
              </div>
              <div class="col-md-6">
                <div class="session_votes">
                  <div class="progress smallbar">
                    <div :style="{ width: vote.percent_votes_for + '%' }" class="progress-bar funblue">
                      <span class="sr-only">{{ vote.percent_votes_for }}% votes for</span>
                    </div>
                    <div :style="{ width: vote.percent_against + '%' }" class="progress-bar fontblue">
                      <span class="sr-only">{{ vote.percent_against }}% votes against</span>
                    </div>
                    <div :style="{ width: vote.percent_abstain + '%' }" class="progress-bar noblue">
                      <span class="sr-only">{{ vote.percent_abstain }}% votes abstained</span>
                    </div>
                    <div :style="{ width: vote.percent_not_present + '%' }" class="progress-bar ignoreblue">
                      <span class="sr-only">{{ vote.percent_not_present }}% votes not present</span>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-xs-3">
                      {{ vote.votes_for }}
                      <div v-t="'seznam-glasovanj.vote-for'" class="type"></div>
                      <div class="indicator ney">&nbsp;</div>
                    </div>
                    <div class="col-xs-3">
                      {{ vote.against }}
                      <div v-t="'seznam-glasovanj.vote-against'" class="type"></div>
                      <div class="indicator aye">&nbsp;</div>
                    </div>
                    <div class="col-xs-3">
                      {{ vote.abstain }}
                      <div v-t="'seznam-glasovanj.vote-abstained'" class="type"></div>
                      <div class="indicator not">&nbsp;</div>
                    </div>
                    <div class="col-xs-3">
                      {{ vote.not_present }}
                      <div v-t="'seznam-glasovanj.vote-not'" class="type"></div>
                      <div class="indicator abstention">&nbsp;</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </scroll-shadow>
  </div>
</template>

<script>
import StripedButton from 'components/StripedButton.vue';
import SearchDropdown from 'components/SearchDropdown.vue';
import ScrollShadow from 'components/ScrollShadow.vue';

export default {
  name: 'SeznamGlasovanj',

  components: {
    StripedButton,
    SearchDropdown,
    ScrollShadow,
  },

  props: {
    data: {
      required: true,
      type: Object,
    },
    showFilters: {
      type: Boolean,
      default: true,
    },
  },

  data() {
    const votes = this.processVotes();

    const allResults = [
      { id: true, color: 'binary-for', label: this.$t('vote-passed'), selected: false },
      { id: false, color: 'binary-against', label: this.$t('vote-not-passed'), selected: false },
    ];

    const allTags = this.processTags();

    const textFilter = '';

    return {
      textFilter,
      votes,
      allTags,
      allResults,
    };
  },

  computed: {
    filteredVotes() {
      const filterVotes = (vote) => {
        const textMatch = this.textFilter === ''
          || vote.text.toLowerCase().indexOf(this.textFilter.toLowerCase()) > -1;
        const tagMatch = this.selectedTags.length === 0
          || vote.tags.filter(tag => this.selectedTags.indexOf(tag) > -1).length > 0;
        const resultMatch = this.selectedResults.length === 0
          || this.selectedResults.indexOf(vote.result) > -1;
        return textMatch && tagMatch && resultMatch;
      };
      return this.votes.filter(filterVotes);
    },
    tagPlaceholder() {
      return this.selectedTags.length > 0
        ? this.$t('seznam-glasovanj.selected-placeholder', { num: this.selectedTags.length })
        : this.$t('seznam-glasovanj.select-placeholder');
    },
    dropdownItems() {
      const validTags = [];

      this.votes.forEach((vote) => {
        vote.tags.forEach((tag) => {
          if (validTags.indexOf(tag) === -1) validTags.push(tag);
        });
      });
      return {
        tags: this.allTags.filter(tag => validTags.indexOf(tag.id) > -1),
      };
    },
    selectedTags() {
      return this.allTags
        .filter(tag => tag.selected)
        .map(tag => tag.id);
    },
    selectedResults() {
      return this.allResults.filter(result => result.selected)
        .map(result => result.id);
    },
  },

  watch: {
    data() {
      this.votes = this.processVotes();
      this.allTags = this.processTags();
    },
  },

  methods: {
    processVotes() {
      const votes = this.data.votes.map((e) => {
        const allInVotes = e.votes_for + e.against + e.abstain + e.not_present;
        e.url = `https://parlameter.si/seja/glasovanje/${(e.session_id || this.data.session.id)}/${e.motion_id}`;
        e.accepted = `accepted ${(e.result === true) ? 'aye' : 'nay'}`;
        e.accepted_glyph = `glyphicon ${(e.result === true) ? 'glyphicon-ok' : 'glyphicon-remove'}`;
        e.percent_votes_for = Math.floor((e.votes_for / allInVotes) * 100);
        e.percent_against = Math.floor((e.against / allInVotes) * 100);
        e.percent_abstain = Math.floor((e.abstain / allInVotes) * 100);
        e.percent_not_present = Math.floor((e.not_present / allInVotes) * 100);

        if (this.data.text && e.text.indexOf(this.data.text) === 0) {
          e.short_text = e.text.slice(this.data.text.length).replace(/^[\s-]*/, '');
        }

        return e;
      });
      votes.sort((a, b) => a.start_time < b.start_time);
      return votes;
    },
    processTags() {
      const allTags = this.data.tags.map(tag => ({ id: tag, label: tag, selected: false }));
      return allTags;
    },
    toggleResult(resultId) {
      const clickedResult = this.allResults.filter(result => result.id === resultId)[0];
      clickedResult.selected = !clickedResult.selected;
    },
    getVoteText(vote) {
      const text = vote.short_text || vote.text;
      if (text.split(' ').length > 14) {
        return `${text.split(' ').splice(0, 14).join(' ')} ...`;
      }
      return text;
    },
  },
};
</script>

<style lang="scss" scoped>
@import '~parlassets/scss/breakpoints';
@import '~parlassets/scss/colors';

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
  padding: 12px 0 0 12px;

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

      @include respond-to(mobile) {
        font-size: 10px;
      }
    }
  }

}

.accepted.nay {
  color: #ff5e41;
}

.session_voting .accepted {
  line-height: normal;
  height: 95px;
}

.session_voting .accepted p {
  position: relative;
  top: 50%;
  -webkit-transform: translateY(-50%);
  -ms-transform: translateY(-50%);
  transform: translateY(-50%);

  margin: 0;
  line-height: 30px;
  margin-top: 6px;
}

.session_voting .session_title {
  height: 95px;
  margin: 0;
  @include respond-to(mobile) {
    margin-top: 15px;
    margin-bottom: 10px;
  }
}

.session_voting .session_title p {
  position: relative;
  top: 50%;
  -webkit-transform: translateY(-50%);
  -ms-transform: translateY(-50%);
  transform: translateY(-50%);
  font-family: Roboto Slab;
  margin-top: 6px;
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
  .single_voting:hover {
    .border-left {
      border-top-color: #cadde6;
    }
  }

  .single_voting {
    padding-bottom: 15px;
  }
}

.single_voting {
  position: relative;
}

.session_voting .session_title p {
  font-size: 14px;
}


.session_voting .single_voting {
  margin-bottom: 15px;
}

.single_voting:hover {
  background-color: #e1f6ff;

  .border-left {
    border-left-color: #cadde6;
  }
}

.seja_anchor:hover {
  color: #525252;
}

.card-content-front {
  overflow-y: auto;
}

// filters
.filters {
  padding-left: 12px;
  padding-bottom: 6px;
  @include respond-to(mobile) {
    flex-wrap: wrap;
    min-height: 154px;
  }
  $label-height: 26px;

  display: flex;

  .filter {
    padding-right: 10px;
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

    .striped-button {
      flex: 1;
      height: 51px;
      &:not(:last-child) { margin-right: 3px; }
    }
  }

  .text-filter {
    @include respond-to(desktop) { width: 26%; }
    @include respond-to(mobile) { width: 100%; }

    width: 26%; // 100%

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

  .search-dropdown-options { top: 50px; }
}
</style>
