<template>
  <card-wrapper
    :id="$options.cardData.cardData._id"
    :card-url="generatedCardUrl"
    :header-config="headerConfig"
  >
    <div slot="info">
      <p v-t="'info.lead'" class="info-text lead"></p>
      <p v-t="'info.methodology'" class="info-text heading"></p>
      <i18n path="info.text" tag="p" class="info-text">
        <a
          v-t="'info.link.text'"
          :href="$t('info.link.link')"
          place="link"
          class="funblue-light-hover"
          target="_blank"
        />
      </i18n>
    </div>

    <!-- Card content goes here -->
    <div class="result-container">
      <div class="result">
        <template v-if="data.result === 'sprejet'">
          <i class="accepted glyphicon glyphicon-ok"></i>
          <div class="text">sprejet</div>
        </template>
        <template v-else-if="data.result === 'zavrnjen'">
          <i class="not-accepted glyphicon glyphicon-remove"></i>
          <div class="text">zavrnjen</div>
        </template>
        <template v-else>
          <i class="glyphicon v-obravnavi"></i>
          <div class="text">v obravnavi</div>
        </template>
      </div>
      <div class="law-title">{{ $options.cardData.data.text }}</div>
      <result
        v-if="finalVoteExists"
        :score="finalVoteResult.value / numberOfVotes * 100"
        :option="finalVoteResult.key"
        :chart-data="finalVoteData"
      />
    </div>
    <p-tabs :start-tab="startTab" @switch="(tabIndex) => { startTab = tabIndex }">
      <p-tab label="Povzetek" variant="dark">
        <excerpt
          :content="content"
          :main-law="{ epa: data.epa || '', name: data.text || '', link: `https://parlameter.si/zakonodaja/${data.epa}` }"
          :documents="documents"
          :show-parent="false"
          :icon="data.icon"
        />
      </p-tab>
      <p-tab label="Glasovanja">
        <seznam-glasovanj
          :data="data"
        />
      </p-tab>
      <p-tab v-if="data.extra_abstract" label="Drugi postopki" variant="dark">
        <excerpt
          :content="data.extra_abstract || ''"
          :main-law="{}"
          :documents="[]"
          :show-parent="false"
          :icon="''"
        />
      </p-tab>
    </p-tabs>
  </card-wrapper>
</template>

<script>
import common from 'mixins/common';
import PTab from 'components/Tab.vue';
import PTabs from 'components/Tabs.vue';
import Excerpt from 'components/Excerpt.vue';
import SeznamGlasovanj from 'components/SeznamGlasovanj.vue';
import Result from 'components/Result.vue';
import mapVotes from 'helpers/mapVotes';

export default {
  name: 'Zakon',
  components: { PTab, PTabs, Excerpt, SeznamGlasovanj, Result },
  mixins: [common],
  data() {
    const documents = this.$options.cardData.data.votes.reduce((prev, cur) => {
      cur.documents.forEach((document) => { // TODO fix after data is fixed
        prev.push(document);
      });
      return prev;
    }, []);
    const title = this.$options.cardData.parlaState.fullName
      ? `${this.$options.cardData.data.text.slice(0, 100)}...`
      : 'Zakon';

    // did we have "glasovanje o zakonu v celoti"
    const finalVoteExists = this.$options.cardData.data.votes.filter(vote => vote.text.indexOf('v celoti') > -1).length > 0;

    let finalVoteData;
    let finalVoteResult;
    let numberOfVotes;
    if (finalVoteExists) {
      const filteredVote = this.$options.cardData.data.votes.filter(vote => vote.text.indexOf('v celoti') > -1)[0];
      const vote = {
        for: filteredVote.votes_for,
        against: filteredVote.against,
        abstain: filteredVote.abstain,
        not_present: filteredVote.not_present,
      };
      finalVoteData = mapVotes(vote);

      finalVoteResult = Object.keys(vote).reduce((max, current) => {
        if (max.value < vote[current]) {
          return {
            key: current,
            value: vote[current],
          };
        }
        return max;
      }, {
        key: '',
        value: 0,
      });

      numberOfVotes = Object.keys(vote).reduce((total, current) => total + vote[current], 0);
    }

    let startTab = 0;
    if (this.$options.cardData.parlaState.selectedTab) {
      startTab = this.$options.cardData.parlaState.selectedTab;
    }

    return {
      data: this.$options.cardData.data,
      documents,
      headerConfig: {
        circleIcon: 'og-list',
        heading: '&nbsp;',
        subheading: '7. sklic parlamenta',
        alternative: this.$options.cardData.cardData.altHeader === 'true',
        title,
      },
      finalVoteExists,
      finalVoteData,
      finalVoteResult,
      numberOfVotes,
      startTab,
    };
  },
  computed: {
    content() {
      if (this.data.abstract) {
        return this.data.abstract.replace(/style=.*?>/g, '>').replace(/<p>&nbsp;<\/p>/g, '');
      }
      return '';
    },
    generatedCardUrl() {
      return `${this.url}?customUrl=${encodeURIComponent(`${this.slugs.urls.analize}/s/getLegislation/${this.data.epa}`)}&state=${encodeURIComponent(JSON.stringify({ startTab: this.startTab }))}`;
    },
  },
};
</script>

<style lang="scss">
@import '~parlassets/scss/colors';
@import '~parlassets/scss/breakpoints';

#seznam-glasovanj {
  .filters {
    margin-left: -10px;
    margin-right: -10px;
  }
}

#s-zakon {
  .card-content {
    height: 518px;
  }
  .filters {
    margin-top: 10px;
  }
  #votingCard {
    max-height: 372px;
  }
  .p-tabs .p-tabs-content,
  .p-tabs .p-tabs-content .tab-content {
    overflow-y: visible;
    overflow-x: visible;

    .scroll-shadow-top::after {
      left: -20px;
      right: -20px;
      width: auto;
    }
  }

  .result-container {
    $section-border: 1px solid $black;
    background: $grey;
    margin: 7px 0 8px 0;
    min-height: 90px;
    padding: 10px 14px;
    position: relative;

    justify-content: space-between;

    @include respond-to(desktop) {
      display: flex;
      margin-bottom: 24px;
    }

    .v-obravnavi {
      width: 38px !important;
      height: 38px;
      background: url('https://cdn.parlameter.si/v1/parlassets/icons/v-obravnavi.svg');
      background-size: contain !important;
      background-repeat: no-repeat;
    }

    .result {
      align-items: center;
      // border-bottom: $section-border;
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

    .law-title {
      padding-left: 14px;
      padding-right: 14px;

      display: flex;
      align-items: center;
      justify-content: flex-start;

      font-family: 'Roboto Slab';

      width: 100%;

      @include respond-to(mobile) {
        padding: 14px 0px 14px 0px;
        border-top: $section-border;
        border-bottom: $section-border;
        width: auto;
        text-align: center;
        justify-content: center;
      }
    }

    .result-chart {
      margin-top: 10px;
      justify-content: center;
      @include respond-to(desktop) {
        margin-top: 0;
        border-left: $section-border;
      }
      svg {
        margin-left: 14px;
      }
    }
  }
}
</style>
