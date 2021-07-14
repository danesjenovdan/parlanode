<template>
  <card-wrapper :header-config="headerConfig" :og-config="ogConfig">
    <div class="votes-list">
      <div class="filters">
        <div class="filter text-filter">
          <div v-t="'title-search'" class="filter-label"></div>
          <input v-model="textFilter" class="text-filter-input" type="text" />
        </div>
        <div class="filter" style="flex: 1"></div>
        <div class="filter buttons-filter">
          <striped-button
            v-for="passedOption in passedOptions"
            :key="passedOption.id"
            :color="passedOption.color"
            :selected="selectedPassedOption === passedOption"
            :small-text="passedOption.label"
            @click="selectPassedOption(passedOption)"
          />
        </div>
      </div>
      <scroll-shadow ref="shadow">
        <div
          class="votes-list-shadow has-filters"
          @scroll="$refs.shadow.check($event.currentTarget)"
        >
          <vote-list-item
            v-for="vote in filteredVotes"
            :key="vote.id"
            :vote="vote"
          />
        </div>
      </scroll-shadow>
    </div>
  </card-wrapper>
</template>

<script>
import common from '@/_mixins/common.js';
import links from '@/_mixins/links.js';
import { sessionHeader } from '@/_mixins/altHeaders.js';
import { sessionOgImage } from '@/_mixins/ogImages.js';
// import { otherVotingsTitle } from '@/_mixins/titles.js';
import StripedButton from '@/_components/StripedButton.vue';
import ScrollShadow from '@/_components/ScrollShadow.vue';
import VoteListItem from '@/_components/VoteListItem.vue';

export default {
  name: 'CardSessionVotes',
  components: {
    StripedButton,
    ScrollShadow,
    VoteListItem,
  },
  mixins: [common, sessionHeader, sessionOgImage, links],
  cardInfo: {
    doubleWidth: true,
  },
  data() {
    const textFilter = this.cardState.text || '';

    const passedOptions = [
      {
        id: 'true',
        color: 'binary-for',
        label: this.$t('vote-passed'),
        selected: this.cardState.passed === 'true',
      },
      {
        id: 'false',
        color: 'binary-against',
        label: this.$t('vote-not-passed'),
        selected: this.cardState.passed === 'false',
      },
    ];

    return {
      votes: this.cardData.data?.results || [],
      passedOptions,
      textFilter,
    };
  },
  computed: {
    filteredVotes() {
      const lowerTextFilter = String(this.textFilter || '').toLowerCase();

      return this.votes.filter((vote) => {
        let textMatch = true;
        let passedOptionMatch = true;

        if (lowerTextFilter) {
          textMatch = vote.title.toLowerCase().includes(lowerTextFilter);
        }

        if (this.selectedPassedOption) {
          passedOptionMatch =
            this.selectedPassedOption.id === String(vote.passed);
        }

        return textMatch && passedOptionMatch;
      });
    },
    selectedPassedOption() {
      return this.passedOptions.find((po) => po.selected);
    },
  },
  created() {
    // TODO:
    // this.$options.cardData.template.contextUrl = this.getSessionVotesLink(
    //   this.data.session
    // );
  },
  methods: {
    selectPassedOption(passedOption) {
      if (passedOption.selected) {
        passedOption.selected = false;
      } else {
        this.passedOptions.forEach((po) => {
          po.selected = passedOption === po;
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import 'parlassets/scss/breakpoints';
@import 'parlassets/scss/colors';

.votes-list {
  .filters {
    display: flex;
    padding-bottom: 12px;

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
      height: 20px;
      margin-top: 6px;
    }

    .text-filter {
      @include respond-to(desktop) {
        width: 50%;
      }

      width: 100%;

      .text-filter-input {
        background-image: url('#{get-parlassets-url()}/icons/search.svg');
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

    .buttons-filter {
      display: flex;
      align-items: flex-end;
      gap: 3px;

      .striped-button {
        width: 120px;
      }
    }
  }

  .votes-list-shadow {
    overflow-y: auto;
    overflow-x: hidden;
    height: $full-card-height;

    &.has-filters {
      height: $full-card-height - 89;
    }
  }
}
</style>
