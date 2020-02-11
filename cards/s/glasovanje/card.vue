<template>
  <card-wrapper
    :id="$options.cardData.mountId"
    :card-url="generatedCardUrl"
    :header-config="headerConfig"
    :og-config="ogConfig"
    @selectedparty="(newParty) => { state.selectedParty = newParty; }"
    @selectedoption="(newOption) => { state.selectedOption = newOption; }"
    @namefilter="(newNameFilter) => { state.nameFilter = newNameFilter; }"
  >
    <div slot="info">
      <p v-t="'info.methodology'" class="info-text heading"></p>
      <p v-t="'info.text[0]'" class="info-text"></p>
      <p v-t="'info.text[1]'" class="info-text"></p>
      <div class="info-text">
        <ul>
          <li v-t="'info.text[2]'"></li>
          <li v-t="'info.text[3]'"></li>
          <li v-t="'info.text[4]'"></li>
        </ul>
      </div>
      <p v-t="'info.text[5]'" class="info-text heading"></p>
      <p v-t="'info.text[6]'" class="info-text"></p>
    </div>

    <div class="date-and-stuff">
      <a
        :href="getSessionVotesLink(data.session)"
        class="funblue-light-hover"
      >
        {{ data.session.name }}
      </a><span class="date">, {{ data.session.date }}</span>
    </div>

    <div :class="['summary', { 'fire-badge': data.result.is_outlier }]">
      <div class="result">
        <template v-if="data.result.accepted">
          <i class="accepted glyphicon glyphicon-ok"></i>
          <div v-t="'vote-passed'" class="text"></div>
        </template>
        <template v-else>
          <i class="not-accepted glyphicon glyphicon-remove"></i>
          <div v-t="'vote-not-passed'" class="text"></div>
        </template>
      </div>
      <div class="name">
        <template v-if="projects && projects.length">
          <div
            v-for="(project, i) in projects"
            v-if="i !== 0"
            :key="project"
            :style="{ top: visibleTooltipTopPos }"
            :class="[
              'tooltip',
              `tooltip-${data.id}-${i}`,
              {'tooltip--show': visibleTooltip === `${data.id}-${i}`}
            ]"
          >
            {{ project }}
          </div>
          <p class="projects">
            <component
              v-for="(project, i) in projects"
              :is="i > 0 ? 'a' : 'span'"
              :key="project"
              :class="['project', {'project--tooltip': i > 0}]"
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
        v-t="'summary'"
        v-if="content"
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
          />
        </p-tab>
      </p-tabs>
    </template>
    <template v-else>
      <data-not-published :text="$t('data-not-published.show-of-hands')" />
    </template>
  </card-wrapper>
</template>

<script>
import { pick } from 'lodash';
import common from 'mixins/common';
import links from 'mixins/links';
import { defaultHeaderConfig } from 'mixins/altHeaders';
import { defaultOgImage } from 'mixins/ogImages';
import { parseVoteTitle } from 'helpers/voteTitle';
import PTab from 'components/Tab.vue';
import PTabs from 'components/Tabs.vue';
import Excerpt from 'components/Excerpt.vue';
import DataNotPublished from 'components/DataNotPublished.vue';
import fixAbstractHtml from 'helpers/fixAbstractHtml';
import Poslanci from './Poslanci.vue';
import PoslanskeSkupine from './PoslanskeSkupine.vue';

export default {
  name: 'GlasovanjeSeje',
  components: {
    Poslanci,
    PoslanskeSkupine,
    PTab,
    PTabs,
    Excerpt,
    DataNotPublished,
  },
  mixins: [
    common,
    links,
  ],
  data() {
    const data = this.$options.cardData.data;

    // parse vote title and any associated projects from text
    const { title, projects } = parseVoteTitle(data.name);

    return {
      showMobileExcerpt: false,
      data,
      title,
      projects: (data.agenda_items || []).concat(projects),
      state: this.$options.cardData.parlaState,
      selectedTab: this.$options.cardData.parlaState.selectedTab || 0,
      headerConfig: defaultHeaderConfig(this),
      ogConfig: defaultOgImage(this),
      coalitionOpositionParties: ['coalition', 'opposition'].map(side => ({
        party: {
          id: side,
          name: this.$t(side),
        },
        votes: pick(data.gov_side[side].votes, ['abstain', 'for', 'against', 'absent']),
        max: {
          maxOptPerc: data.gov_side[side].max.maxOptPerc,
          max_opt: data.gov_side[side].max.max_opt,
        },
        outliers: data.gov_side[side].outliers,
      })),
      visibleTooltip: null,
      visibleTooltipTopPos: '20px',
    };
  },
  computed: {
    generatedCardUrl() {
      return `${this.url}${this.data.id}?state=${encodeURIComponent(JSON.stringify(this.state))}`;
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
    this.$options.cardData.template.contextUrl = this.getSessionVoteLink({
      session_id: this.data.session.id,
      vote_id: this.data.id,
    });
  },
  mounted() {
    this.$on('selectedoption', (newSelectedOption) => {
      this.state.selectedOption = newSelectedOption;
    });
    this.$on('selectedparty', (newSelectedParty) => {
      this.state.selectedParty = newSelectedParty;
    });
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
@import '~parlassets/scss/colors';
@import '~parlassets/scss/breakpoints';

/deep/ .p-tabs .p-tabs-content,
/deep/ .p-tabs .p-tabs-content .tab-content {
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

    .text {
      color: $font-default;
      font-size: 14px;
      font-weight: bold;
      text-transform: uppercase;
      margin-left: 12px;
    }
  }

  .name {
    font-family: "Roboto Slab", "Times New Roman", serif;
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
            margin-left: .25em;
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
</style>

<style lang="scss">
@import '~parlassets/scss/colors';

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
