<template>
  <card-wrapper
    :card-url="generatedCardUrl"
    :header-config="headerConfig"
    :og-config="ogConfig"
  >
    <div class="date-and-stuff">
      <a :href="getSessionVotesLink(data.session)" class="funblue-light-hover">
        {{ data.session.name }} </a
      ><span class="date">, {{ data.session.date }}</span>
    </div>

    <div
      :class="[
        'summary',
        { 'fire-badge': data.result && data.result.is_outlier },
      ]"
    >
      <div class="result">
        <template v-if="data.result && data.result.accepted === true">
          <i class="accepted glyphicon glyphicon-ok"></i>
          <div v-t="'vote-passed'" class="text"></div>
        </template>
        <template v-else-if="data.result && data.result.accepted === false">
          <i class="not-accepted glyphicon glyphicon-remove"></i>
          <div v-t="'vote-not-passed'" class="text"></div>
        </template>
        <template v-else>
          <i class="not-accepted parlaicon-unknown"></i>
          <div v-t="'vote-unknown'" class="text"></div>
        </template>
      </div>
      <div class="name">
        <template v-if="projects && projects.length">
          <template v-for="(project, i) in projects">
            <div
              v-if="i !== 0"
              :key="project"
              :style="{ top: visibleTooltipTopPos }"
              :class="[
                'tooltip',
                `tooltip-${data.id}-${i}`,
                { 'tooltip--show': visibleTooltip === `${data.id}-${i}` },
              ]"
            >
              {{ project }}
            </div>
          </template>
          <p class="projects">
            <component
              :is="i > 0 ? 'a' : 'span'"
              v-for="(project, i) in projects"
              :key="project"
              :class="['project', { 'project--tooltip': i > 0 }]"
              :data-target="`${data.id}-${i}`"
              href="#"
              @click.prevent="() => {}"
              @mouseover="setVisibleTooltip(`${data.id}-${i}`)"
              @mouseout="visibleTooltip = null"
            >
              <template v-if="i === 0">{{ project }}</template>
              <span v-else>{{ i + 1 }}</span>
            </component>
          </p>
        </template>
        <p>{{ title }}</p>
      </div>
    </div>

    <template v-if="data.members && data.members.length">
      <div
        v-if="content"
        v-t="'summary'"
        class="izvlecek-switch visible-xs"
        @click="showMobileExcerpt = !showMobileExcerpt"
      />
      <excerpt
        v-if="showMobileExcerpt && content"
        :content="content"
        :main-law="excerptData"
        :documents="data.documents"
        :show-parent="true"
        class="visible-xs"
      />
      <p-tabs :start-tab="selectedTab" class="visible-xs" @switch="focusTab">
        <p-tab :label="$t('mps')">
          <poslanci
            :members="data.members"
            :member-votes="data.all"
            :result="data.result"
            :state="state"
            @namefilter="(newNameFilter) => (state.nameFilter = newNameFilter)"
          />
        </p-tab>
        <p-tab :label="$t('parties')">
          <poslanske-skupine
            ref="parties"
            :members="data.members"
            :parties="data.parties"
            :state="state"
            :selected-party="state.selectedParty || null"
            :selected-option="state.selectedOption || null"
            @selectedparty="(newParty) => (state.selectedParty = newParty)"
            @selectedoption="(newOption) => (state.selectedOption = newOption)"
          />
        </p-tab>
        <p-tab :label="$t('gov-side')">
          <poslanske-skupine
            ref="sides"
            :members="data.members"
            :parties="coalitionOpositionParties"
            :state="state"
            :selected-party="state.selectedParty || null"
            :selected-option="state.selectedOption || null"
            @selectedparty="(newParty) => (state.selectedParty = newParty)"
            @selectedoption="(newOption) => (state.selectedOption = newOption)"
          />
        </p-tab>
      </p-tabs>
      <p-tabs :start-tab="selectedTab" class="hidden-xs" @switch="focusTab">
        <p-tab v-if="content" :label="$t('summary')">
          <excerpt
            :content="content"
            :main-law="excerptData"
            :documents="data.documents"
            :show-parent="true"
          />
        </p-tab>
        <p-tab :label="$t('mps')">
          <poslanci
            :members="data.members"
            :member-votes="data.all"
            :result="data.result"
            :state="state"
            @namefilter="(newNameFilter) => (state.nameFilter = newNameFilter)"
          />
        </p-tab>
        <p-tab :label="$t('parties')">
          <poslanske-skupine
            ref="parties"
            :members="data.members"
            :parties="data.parties"
            :state="state"
            :selected-party="state.selectedParty || null"
            :selected-option="state.selectedOption || null"
            @selectedparty="(newParty) => (state.selectedParty = newParty)"
            @selectedoption="(newOption) => (state.selectedOption = newOption)"
          />
        </p-tab>
        <p-tab :label="$t('gov-side')">
          <poslanske-skupine
            ref="sides"
            :members="data.members"
            :parties="coalitionOpositionParties"
            :state="state"
            :selected-party="state.selectedParty || null"
            :selected-option="state.selectedOption || null"
            @selectedparty="(newParty) => (state.selectedParty = newParty)"
            @selectedoption="(newOption) => (state.selectedOption = newOption)"
          />
        </p-tab>
      </p-tabs>
    </template>
    <template v-else>
      <div v-if="vote" class="session_voting row">
        <div class="col-md-6 col-md-offset-3">
          <div class="session_votes">
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

      <data-not-published :text="$t('data-not-published.show-of-hands')" />
    </template>
  </card-wrapper>
</template>

<script>
import { pick } from 'lodash-es';
import common from '@/_mixins/common.js';
import links from '@/_mixins/links.js';
import { defaultHeaderConfig } from '@/_mixins/altHeaders.js';
import { defaultOgImage } from '@/_mixins/ogImages.js';
import { parseVoteTitle } from '@/_helpers/voteTitle.js';
import PTab from '@/_components/Tab.vue';
import PTabs from '@/_components/Tabs.vue';
import Excerpt from '@/_components/Excerpt.vue';
import DataNotPublished from '@/_components/DataNotPublished.vue';
import fixAbstractHtml from '@/_helpers/fixAbstractHtml.js';
import Poslanci from './Poslanci.vue';
import PoslanskeSkupine from './PoslanskeSkupine.vue';

export default {
  name: 'CardVoteSingle',
  components: {
    Poslanci,
    PoslanskeSkupine,
    PTab,
    PTabs,
    Excerpt,
    DataNotPublished,
  },
  mixins: [common, links],
  cardInfo: {
    doubleWidth: true,
  },
  data() {
    const data = this.$options.contextData.cardData;

    // parse vote title and any associated projects from text
    const { title, projects } = parseVoteTitle(data.name);

    let coalitionOpositionParties = null;
    if (data.gov_side) {
      coalitionOpositionParties = ['coalition', 'opposition'].map((side) => ({
        party: {
          id: side,
          name: this.$t(side),
        },
        votes: pick(data.gov_side[side].votes, [
          'abstain',
          'for',
          'against',
          'absent',
        ]),
        max: {
          maxOptPerc: data.gov_side[side].max.maxOptPerc,
          max_opt: data.gov_side[side].max.max_opt,
        },
        outliers: data.gov_side[side].outliers,
      }));
    }

    const vote = data.all;
    if (vote) {
      const e = vote;
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
    }

    return {
      showMobileExcerpt: false,
      data,
      title,
      projects: (data.agenda_items || []).concat(projects),
      state: this.$options.contextData.cardState,
      selectedTab: this.$options.contextData.cardState.selectedTab || 0,
      headerConfig: defaultHeaderConfig(this),
      ogConfig: defaultOgImage(this),
      coalitionOpositionParties,
      visibleTooltip: null,
      visibleTooltipTopPos: '20px',
      vote,
    };
  },
  computed: {
    generatedCardUrl() {
      return `${this.url}${this.data.id}?state=${encodeURIComponent(
        JSON.stringify(this.state)
      )}`;
    },
    excerptData() {
      return {
        epa: this.data.legislation.epa || '',
        name: this.data.legislation.text,
        link: this.getLegislationLink(this.data.legislation),
      };
    },
    content() {
      return fixAbstractHtml(this.data.abstract);
    },
    contentExtra() {
      return fixAbstractHtml(this.data.extra_abstract);
    },
  },
  // glasovanje-update je bilo prazno, created() je iz developa
  created() {
    // TODO:
    // this.$options.cardData.template.contextUrl = this.getSessionVoteLink({
    //   session_id: this.data.session.id,
    //   vote_id: this.data.id,
    // });
  },
  methods: {
    focusTab(tabNumber) {
      if (tabNumber !== 1) {
        this.$refs.parties.expandedParty = null;
        this.$refs.parties.expandedOption = null;
      }
      if (tabNumber !== 2) {
        this.$refs.sides.expandedParty = null;
        this.$refs.sides.expandedOption = null;
      }
      if (this.state.selectedTab === 1) {
        this.$refs.sides.expandedParty = this.state.selectedGroup || null;
        this.$refs.sides.expandedOption = this.state.selectedOption || null;
      }
      if (this.state.selectedTab === 2) {
        this.$refs.sides.expandedParty = this.state.selectedGroup || null;
        this.$refs.sides.expandedOption = this.state.selectedOption || null;
      }
      this.state.selectedTab = tabNumber;
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
@import 'parlassets/scss/colors';
@import 'parlassets/scss/breakpoints';

::v-deep .p-tabs .p-tabs-content,
::v-deep .p-tabs .p-tabs-content .tab-content {
  overflow-y: visible;
  overflow-x: visible;

  .scroll-shadow-top::after {
    left: -20px;
    right: -20px;
    width: auto;
  }
}

.date-and-stuff {
  margin-bottom: 20px;

  .date {
    font-family: Roboto Slab;
    font-size: 14px;
    line-height: 22px;
  }
}

.summary {
  $section-border: 1px solid $font-placeholder;
  background: $background;
  margin: 7px 0 8px 0;
  min-height: 90px;
  padding: 10px 14px;
  position: relative;

  @include respond-to(desktop) {
    display: flex;
    margin-bottom: 24px;
  }

  .result {
    align-items: center;
    border-bottom: $section-border;
    display: flex;
    justify-content: center;
    padding: 0 0 10px 0;

    @include respond-to(desktop) {
      border-bottom: none;
      border-right: $section-border;
      padding: 0 22px 0 0;
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

    .parlaicon-unknown {
      width: 24px;
      height: 24px;
      background-repeat: no-repeat;
      background-position: center;
      background-size: contain;

      @include respond-to(desktop) {
        width: 29px;
        height: 29px;
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

  .name {
    font-family: 'Roboto Slab', 'Times New Roman', serif;
    font-size: 11px;
    font-weight: 300;
    line-height: 1.45em;
    padding: 10px 0 4px 0;

    @include respond-to(desktop) {
      display: flex;
      flex: 4;
      font-size: 14px;
      padding: 5px 0 5px 12px;
      flex-direction: column;
      justify-content: center;
    }

    p {
      margin: 6px 0;

      &.projects {
        font-family: Roboto, sans-serif;
        font-size: 12px;
        line-height: 1.2;
        font-weight: 600;
        text-transform: uppercase;

        .project--tooltip {
          color: $font-default;
          text-decoration: none;
          cursor: help;

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
  }

  .documents {
    border-top: $section-border;
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin: 6px 0 0 0;

    @include respond-to(desktop) {
      border-left: $section-border;
      border-top: none;
      flex: 2;
      margin: 0 0 0 12px;
      min-width: 204px;
      padding-left: 16px;
    }

    .dropdown-label {
      @include show-for(desktop);

      font-family: Roboto Slab, Times New Roman, serif;
      font-size: 14px;
      font-weight: 300;
      line-height: 21px;
      margin-bottom: 5px;
    }

    .p- {
      margin: 10px -2px 3px -2px;

      @include respond-to(desktop) {
        margin: 0;
      }
    }
  }
}

.tabs .tab-content {
  overflow: hidden;
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

@media (max-width: 767px) {
  .tooltip {
    max-width: 100%;
    width: 90%;
  }
}

.session_voting {
  padding: 0;

  .session_votes {
    font-size: 24px;
    line-height: 30px;
    margin: 0;

    .type {
      font-size: 12px;
      line-height: 20px;
      text-transform: uppercase;

      @include respond-to(mobile) {
        font-size: 10px;
      }
    }
  }
}
</style>

<style lang="scss">
@import 'parlassets/scss/colors';

.lightning-badge::before {
  background: $font-placeholder;
  border-radius: 50%;
  content: '';
  height: 31px;
  left: -6px;
  position: absolute;
  bottom: -6px;
  width: 31px;
  background-image: url("#{getConfig('urls.cdn')}/icons/strela.svg");
  background-size: 11px 19px;
  background-position: center center;
  background-repeat: no-repeat;
}

.fire-badge::before {
  background: $font-placeholder;
  border-radius: 50%;
  content: '';
  height: 31px;
  left: -6px;
  position: absolute;
  top: -7px;
  width: 31px;
  background-image: url("#{getConfig('urls.cdn')}/icons/ogenj.svg");
  background-size: 40px 40px;
  background-position: center center;
  background-repeat: no-repeat;
}

.izvlecek-switch {
  width: 100%;
  height: 40px;
  line-height: 20px;
  padding: 10px;
  text-align: center;
  text-transform: uppercase;
  background: $font-placeholder;
  margin-bottom: 10px;
}
</style>
