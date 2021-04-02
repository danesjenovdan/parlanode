<template>
  <div id="seznam-glasovanj">
    <div v-if="showFilters" class="filters">
      <div class="filter option-party-buttons">
        <striped-button
          v-for="result in allResults"
          :key="result.id"
          :color="result.color"
          :selected="selectedResults.indexOf(result.id) > -1"
          :small-text="result.label"
          @click.native="toggleResult(result.id)"
        />
      </div>
      <div class="filter text-filter">
        <div v-t="'title-search'" class="filter-label"></div>
        <input v-model="textFilter" class="text-filter-input" type="text" />
      </div>
      <div class="filter tag-dropdown">
        <div v-t="'working-body'" class="filter-label"></div>
        <p-search-dropdown v-model="allTags" />
      </div>
      <div v-if="allClassifications.length > 1" class="filter tag-dropdown">
        <div v-t="'vote-types'" class="filter-label"></div>
        <p-search-dropdown v-model="allClassifications" />
      </div>
    </div>
    <scroll-shadow ref="shadow">
      <div
        id="votingCard"
        class="date-list"
        @scroll="$refs.shadow.check($event.currentTarget)"
      >
        <div class="session_voting">
          <div
            v-if="filteredVotes.length === 0"
            v-t="'no-results'"
            class="no-results"
          />
          <div v-else>
            <component
              :is="virtualize ? 'virtual-list' : 'div'"
              :size="105"
              :remain="virtualizeRemain"
              :onscroll="checkScrollShadow"
              :variable="getVirtualItemHeight"
              class="virtual-list"
            >
              <div
                v-for="vote in filteredVotes"
                :key="vote.motion_id"
                class="clearfix single_voting"
              >
                <div v-if="vote.is_outlier" class="fire-badge"></div>
                <div
                  v-if="vote.has_outliers && vote.is_outlier"
                  class="lightning-badge"
                ></div>
                <div
                  v-if="vote.has_outliers && !vote.is_outlier"
                  class="lightning-badge"
                  style="position: absolute; left: -37px"
                ></div>
                <div v-if="!vote.has_votes" class="hand-badge"></div>
                <a :href="vote.url" class="show clearfix">
                  <div class="col-md-1 icon-col">
                    <div :class="vote.accepted">
                      <p>
                        <i :class="vote.accepted_glyph"></i>
                      </p>
                    </div>
                  </div>
                  <div class="col-md-11 border-left">
                    <div class="col-md-6">
                      <div class="session_title">
                        <template
                          v-if="
                            vote.shortened_projects &&
                            vote.shortened_projects.length
                          "
                        >
                          <div
                            v-for="(project, i) in vote.projects"
                            v-if="
                              i !== 0 || project !== vote.shortened_projects[0]
                            "
                            :key="project"
                            :style="{ top: visibleTooltipTopPos }"
                            :class="[
                              'tooltip',
                              `tooltip-${vote.motion_id}-${i}`,
                              {
                                'tooltip--show':
                                  visibleTooltip === `${vote.motion_id}-${i}`,
                              },
                            ]"
                          >
                            {{ project }}
                          </div>
                          <p class="projects">
                            <component
                              :is="i > 0 ? 'a' : 'span'"
                              v-for="(project, i) in vote.shortened_projects"
                              :key="project"
                              :class="[
                                'project',
                                {
                                  'project--tooltip': i !== 0,
                                  'project--has-tooltip':
                                    i !== 0 || project !== vote.projects[0],
                                },
                              ]"
                              :data-target="`${vote.motion_id}-${i}`"
                              href="#"
                              @click.prevent="() => {}"
                              @mouseover="
                                setVisibleTooltip(`${vote.motion_id}-${i}`)
                              "
                              @mouseout="visibleTooltip = null"
                            >
                              <template v-if="i === 0">{{ project }}</template>
                              <span v-else>{{ i + 1 }}</span>
                            </component>
                          </p>
                        </template>
                        <p>
                          {{ vote.shortened_title }}
                        </p>
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="session_votes">
                        <div
                          v-if="vote.percent_for != null"
                          class="progress smallbar"
                        >
                          <div
                            :style="{ width: vote.percent_for + '%' }"
                            class="progress-bar aye"
                          >
                            <span class="sr-only"
                              >{{ vote.percent_for }}% votes for</span
                            >
                          </div>
                          <div
                            :style="{ width: vote.percent_against + '%' }"
                            class="progress-bar ney"
                          >
                            <span class="sr-only"
                              >{{ vote.percent_against }}% votes against</span
                            >
                          </div>
                          <div
                            :style="{ width: vote.percent_abstain + '%' }"
                            class="progress-bar abstention"
                          >
                            <span class="sr-only"
                              >{{ vote.percent_abstain }}% votes abstained</span
                            >
                          </div>
                          <div
                            :style="{ width: vote.percent_absent + '%' }"
                            class="progress-bar not"
                          >
                            <span class="sr-only"
                              >{{ vote.percent_absent }}% not present</span
                            >
                          </div>
                        </div>
                        <div class="row">
                          <div class="col-xs-3">
                            {{ vote.for }}
                            <div v-t="'vote-for'" class="type"></div>
                            <div class="indicator aye">&nbsp;</div>
                          </div>
                          <div class="col-xs-3">
                            {{ vote.against }}
                            <div v-t="'vote-against'" class="type"></div>
                            <div class="indicator ney">&nbsp;</div>
                          </div>
                          <div class="col-xs-3">
                            {{ vote.abstain }}
                            <div v-t="'vote-abstain'" class="type"></div>
                            <div class="indicator abstention">&nbsp;</div>
                          </div>
                          <div class="col-xs-3">
                            {{ vote.absent }}
                            <div v-t="'vote-absent'" class="type"></div>
                            <div class="indicator not">&nbsp;</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </a>
              </div>
            </component>
          </div>
        </div>
      </div>
    </scroll-shadow>
  </div>
</template>

<script>
import { map, sortBy } from 'lodash';
import VirtualList from '@/_components/vue-virtual-scroll-list/VirtualList.vue';
import StripedButton from '@/_components/StripedButton.vue';
import PSearchDropdown from '@/_components/SearchDropdown.vue';
import ScrollShadow from '@/_components/ScrollShadow.vue';
import links from '@/_mixins/links.js';
import { parseVoteTitle, shortenVoteTitle } from '@/_helpers/voteTitle.js';

export default {
  name: 'SeznamGlasovanj',
  components: {
    VirtualList,
    StripedButton,
    PSearchDropdown,
    ScrollShadow,
  },
  mixins: [links],
  props: {
    data: {
      required: true,
      type: Object,
    },
    filters: {
      type: Object,
      default: () => ({}),
    },
    showFilters: {
      type: Boolean,
      default: true,
    },
    virtualize: {
      type: Boolean,
      default: false,
    },
    virtualizeRemain: {
      type: Number,
      default: 10,
    },
  },
  data() {
    const votes = this.processVotes();

    const allResults = [
      {
        id: true,
        color: 'binary-for',
        label: this.$t('vote-passed'),
        selected: false,
      },
      {
        id: false,
        color: 'binary-against',
        label: this.$t('vote-not-passed'),
        selected: false,
      },
    ];
    if (this.filters.results) {
      allResults.forEach((r) => {
        r.selected = this.filters.results.indexOf(r.id) !== -1;
      });
    }

    const allTags = this.processTags();
    const allClassifications = this.processClassifications();

    const textFilter =
      this.filters && this.filters.text ? this.filters.text : '';

    return {
      textFilter,
      votes,
      allTags,
      allClassifications,
      allResults,
      visibleTooltip: null,
      visibleTooltipTopPos: '20px',
    };
  },
  computed: {
    filteredVotes() {
      const filterVotes = (vote) => {
        const textMatch =
          this.textFilter === '' ||
          vote.text.toLowerCase().indexOf(this.textFilter.toLowerCase()) > -1;
        const tagMatch =
          this.selectedTags.length === 0 ||
          vote.tags.filter((tag) => this.selectedTags.indexOf(tag) > -1)
            .length > 0;
        const classificationMatch =
          this.selectedClassifications.length === 0 ||
          // eslint-disable-next-line eqeqeq
          this.selectedClassifications.find((c) => c == vote.classification);
        const resultMatch =
          this.selectedResults.length === 0 ||
          this.selectedResults.indexOf(vote.result) > -1;
        return textMatch && tagMatch && classificationMatch && resultMatch;
      };
      return this.votes.filter(filterVotes);
    },
    selectedTags() {
      return this.allTags.filter((tag) => tag.selected).map((tag) => tag.id);
    },
    selectedClassifications() {
      return this.allClassifications.filter((c) => c.selected).map((c) => c.id);
    },
    selectedResults() {
      return this.allResults
        .filter((result) => result.selected)
        .map((result) => result.id);
    },
  },
  watch: {
    data() {
      this.votes = this.processVotes();
      this.allTags = this.processTags();
      this.allClassifications = this.processClassifications();
    },
    textFilter() {
      this.emitFiltersChanged();
    },
    selectedTags() {
      this.emitFiltersChanged();
    },
    selectedClassifications() {
      this.emitFiltersChanged();
    },
    selectedResults() {
      this.emitFiltersChanged();
    },
  },
  methods: {
    processVotes() {
      const votes = this.data.votes.map((e) => {
        if (!e) {
          e = {};
        }

        if (
          typeof e.for === 'number' &&
          typeof e.against === 'number' &&
          typeof e.abstain === 'number' &&
          typeof e.absent === 'number'
        ) {
          const allInVotes = e.for + e.against + e.abstain + e.absent;
          e.percent_for = Math.floor((e.for / allInVotes) * 100);
          e.percent_against = Math.floor((e.against / allInVotes) * 100);
          e.percent_abstain = Math.floor((e.abstain / allInVotes) * 100);
          e.percent_absent = Math.floor((e.absent / allInVotes) * 100);
        } else {
          if (typeof e.for !== 'number') {
            e.for = '?';
          }
          if (typeof e.against !== 'number') {
            e.against = '?';
          }
          if (typeof e.abstain !== 'number') {
            e.abstain = '?';
          }
          if (typeof e.absent !== 'number') {
            e.absent = '?';
          }
        }

        e.url = this.getSessionVoteLink({
          session_id:
            e.session_id || (e.session && e.session.id) || this.data.session.id,
          vote_id: e.motion_id,
        });
        e.accepted = 'accepted ';
        if (e.result === true) {
          e.accepted += 'aye';
        } else if (e.result === false) {
          e.accepted += 'nay';
        } else {
          e.accepted += 'unknown';
        }
        e.accepted_glyph = 'glyphicon ';
        if (e.result === true) {
          e.accepted_glyph += 'glyphicon-ok';
        } else if (e.result === false) {
          e.accepted_glyph += 'glyphicon-remove';
        } else {
          e.accepted_glyph += 'parlaicon-unknown';
        }

        // parse vote title and any associated projects from text
        const { title, projects } = parseVoteTitle(e.text);
        e.title = title;
        e.projects = (e.agenda_items || []).concat(projects);

        // if legislation name is defined trim the legislation name from the start of vote name
        if (this.data.text && e.title.indexOf(this.data.text) === 0) {
          e.shortened_title = e.title
            .slice(this.data.text.length)
            .replace(/^[\s-,]*/, '');
        }

        // shorten the title for display
        e.shortened_projects = e.projects.map((p) => shortenVoteTitle(p, 85));
        e.shortened_title = shortenVoteTitle(
          e.shortened_title || e.title || ''
        );

        // if has_votes is undefined assume we always have votes
        e.has_votes = typeof e.has_votes === 'boolean' ? e.has_votes : true;

        return e;
      });
      return sortBy(votes, 'start_time');
    },
    processTags() {
      const allTags = (this.data.tags || []).map((tag) => ({
        id: tag,
        label: tag,
        selected: false,
      }));
      if (this.filters.tags) {
        allTags.forEach((t) => {
          t.selected = this.filters.tags.indexOf(t.id) !== -1;
        });
      }
      return allTags;
    },
    processClassifications() {
      const allClassifications = map(
        this.data.classifications || {},
        (val, key) => ({
          id: key,
          label: this.$t(`vote_types.${val}`),
          selected: false,
        })
      );
      if (this.filters.classifications) {
        allClassifications.forEach((c) => {
          c.selected = this.filters.classifications.indexOf(c.id) !== -1;
        });
      }
      return allClassifications;
    },
    toggleResult(resultId) {
      const clickedResult = this.allResults.find(
        (result) => result.id === resultId
      );
      if (clickedResult && clickedResult.selected) {
        clickedResult.selected = false;
      } else {
        this.allResults.forEach((result) => {
          result.selected = result.id === resultId;
        });
      }
    },
    emitFiltersChanged() {
      this.$emit('filters-changed', {
        text: this.textFilter,
        tags: this.selectedTags,
        classifications: this.selectedClassifications,
        results: this.selectedResults,
      });
    },
    getVirtualItemHeight() {
      if (typeof window !== 'undefined') {
        if (window.innerWidth > 991) {
          return 105 + 15;
        }
        if (window.innerWidth > 767) {
          return 219 + 15;
        }
      }
      return 240 + 15;
    },
    checkScrollShadow(event) {
      this.$refs.shadow.check(event.currentTarget);
    },
    setVisibleTooltip(target) {
      const elem = document.querySelector(`[data-target="${target}"]`);
      if (elem) {
        const elemRect = elem.getBoundingClientRect();
        this.visibleTooltipTopPos = `${elemRect.bottom + 10}px`;
        this.visibleTooltip = target;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import 'parlassets/scss/breakpoints';
@import 'parlassets/scss/colors';

#votingCard {
  height: $full-card-height;
  overflow-y: auto;
  color: $font-default;
}

#votingCard div.member span {
  color: $font-placeholder;
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
  padding: 0 0 0 12px;

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

  .parlaicon-unknown {
    width: 24px;
    height: 28px;
    background-repeat: no-repeat;
    background-size: contain;
    background-position: center;
  }
}

.session_voting .session_title {
  height: 95px;
  margin: 0;
  display: flex;
  flex-direction: column;
  margin-top: 6px;
  justify-content: center;

  @include respond-to(mobile) {
    margin-top: 15px;
    margin-bottom: 10px;
  }
}

.session_voting .session_title p {
  font-family: Roboto Slab;
  font-size: 14px;
  line-height: 1.4;
  margin: 6px 0;

  &.projects {
    font-family: Roboto, sans-serif;
    font-size: 12px;
    line-height: 1.2;
    font-weight: 600;
    text-transform: uppercase;

    .project--has-tooltip {
      cursor: help;
    }

    .project--tooltip {
      &::after {
        content: ', ';
      }

      &:first-of-type::before {
        content: '(';
        margin-left: 0.25em;
      }

      &:last-of-type::after {
        content: ')';
      }

      span {
        text-decoration: underline;

        &:hover {
          text-decoration: none;
        }
      }
    }
  }
}

.tooltip {
  position: fixed;
  background-color: $font-default;
  color: #fff;
  top: 45%;
  font-family: Roboto;
  padding: 3px 10px;
  border-radius: 3px;
  text-transform: uppercase;
  max-width: 90%;
  left: 50%;
  transform: translateX(-50%);
  pointer-events: none;
  visibility: hidden;

  &.tooltip--show {
    opacity: 1;
    visibility: visible;
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
  }

  .single_voting {
    padding-bottom: 15px;

    .icon-col {
      float: left;
      margin-left: 15px;
      margin-right: 15px;
      margin-top: 18px;
    }
  }
}

@media (max-width: 767px) {
  .session_voting .session_title {
    height: 105px;
    margin-left: 54px;

    p {
      max-height: 80px;
      overflow: hidden;
    }
  }
  .single_voting {
    .icon-col {
      margin-top: 32px;
    }
  }

  .tooltip {
    max-width: 100%;
    width: 90%;
  }
}

.single_voting {
  position: relative;
}

.session_voting .single_voting {
  margin-bottom: 15px;
}

.single_voting {
  a:hover {
    background-color: $link-hover-background;
    text-decoration: none;
    color: $link;
  }
}

.seja_anchor:hover {
  color: $font-placeholder;
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
    @include respond-to(mobile) {
      width: 100%;
      padding-top: 0;
    }

    width: 27.5%;
    padding-top: $label-height;

    .striped-button {
      flex: 1;
      height: 51px;
      &:not(:last-child) {
        margin-right: 3px;
      }
    }
  }

  .text-filter {
    @include respond-to(desktop) {
      width: 26%;
    }
    @include respond-to(mobile) {
      width: 100%;
    }

    width: 26%; // 100%

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
}

.virtual-list {
  margin-left: -15px;
  padding-left: 15px;
  padding-top: 12px;
}
</style>
