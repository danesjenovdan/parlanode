<template>
  <card-wrapper
    :id="$options.cardData.cardData._id"
    :card-url="generatedCardUrl"
    :header-config="headerConfig"
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
      <div class="name">{{ data.name }}</div>
    </div>
    <div class="izvlecek-switch visible-xs" @click="showMobileExcerpt = !showMobileExcerpt">
      Izvleček
    </div>
    <excerpt
      v-if="showMobileExcerpt"
      :content="data.abstract || ''"
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
      <p-tab :label="$t('summary')">
        <excerpt
          :content="data.abstract || ''"
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
  </card-wrapper>
</template>

<script>
import { pick } from 'lodash';
import common from 'mixins/common';
import PSearchDropdown from 'components/SearchDropdown.vue';
import PTab from 'components/Tab.vue';
import PTabs from 'components/Tabs.vue';
import Excerpt from 'components/Excerpt.vue';
import Poslanci from './Poslanci.vue';
import PoslanskeSkupine from './PoslanskeSkupine.vue';

export default {
  name: 'GlasovanjeSeje',
  components: {
    Poslanci,
    PoslanskeSkupine,
    PSearchDropdown,
    PTab,
    PTabs,
    Excerpt,
  },
  mixins: [common],
  data() {
    return {
      showMobileExcerpt: false,
      data: this.$options.cardData.data,
      state: this.$options.cardData.parlaState,
      selectedTab: this.$options.cardData.parlaState.selectedTab || 0,
      headerConfig: {
        circleIcon: 'og-list',
        heading: '&nbsp;',
        subheading: '7. sklic parlamenta',
        alternative: this.$options.cardData.cardData.altHeader === 'true',
        title: this.$options.cardData.cardData.name,
      },
      coalitionOpositionParties: ['coalition', 'opposition'].map(side => ({
        party: {
          id: side,
          name: this.$t(side),
        },
        votes: pick(this.$options.cardData.data.gov_side[side].votes, ['abstain', 'for', 'against', 'not_present']),
        max: {
          maxOptPerc: this.$options.cardData.data.gov_side[side].max.maxOptPerc,
          max_opt: this.$options.cardData.data.gov_side[side].max.max_opt,
        },
        outliers: this.$options.cardData.data.gov_side[side].outliers,
      })),
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
        link: `${this.slugs.urls.base}/zakonodaja/${this.data.legislation.epa}`,
      };
    },
  },
  // glasovanje-update je bilo prazno, created() je iz developa
  created() {
    this.$options.cardData.template.contextUrl = `${this.slugs.urls.base}/seja/glasovanje/${this.data.session.id}/${this.data.id}`;
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
  },
};
</script>

<style lang="scss" scoped>
@import '~parlassets/scss/colors';
@import '~parlassets/scss/breakpoints';

.summary {
  $section-border: 1px solid $black;
  background: $grey;
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

  .name {
    font-family: Roboto Slab, Times New Roman, serif;
    font-size: 11px;
    font-weight: 300;
    line-height: 1.45em;
    padding: 10px 0 4px 0;

    @include respond-to(desktop) {
      align-items: center;
      display: flex;
      flex: 4;
      font-size: 14px;
      padding: 5px 0 5px 12px;
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
      @include respond-to(desktop) { margin: 0; }
    }
  }
}

.tabs .tab-content { overflow: hidden; }
</style>

<style lang="scss">
@import '~parlassets/scss/colors';

.lightning-badge::before {
  background: $darkgrey;
  border-radius: 50%;
  content: '';
  height: 31px;
  left: -6px;
  position: absolute;
  bottom: -6px;
  width: 31px;
  background-image: url("https://cdn.parlameter.si/v1/parlassets/icons/strela.svg");
  background-size: 11px 19px;
  background-position: center center;
  background-repeat: no-repeat;
}
.fire-badge::before {
  background: $darkgrey;
  border-radius: 50%;
  content: '';
  height: 31px;
  left: -6px;
  position: absolute;
  top: -7px;
  width: 31px;
  background-image: url("https://cdn.parlameter.si/v1/parlassets/icons/ogenj.svg");
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
  background: $grey-medium;
  margin-bottom: 10px;
}
</style>
