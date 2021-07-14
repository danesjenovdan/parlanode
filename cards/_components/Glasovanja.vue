<template>
  <card-wrapper :header-config="headerConfig" :og-config="ogConfig">
    <div v-show="false" class="card-content__empty">
      <!-- TODO this is hardcoded -->
      <div class="card-content__empty-inner">
        <img :src="`${urls.cdn}/img/icons/no-data.svg`" />
        <p v-t="'data-currently-unavailable'"></p>
      </div>
    </div>
    <div class="filters">
      <div class="filter text-filter">
        <div v-t="'title-search'" class="filter-label"></div>
        <p-search-field v-model="textFilter" />
      </div>
      <!-- <div class="filter type-dropdown">
        <div v-t="'vote-types'" class="filter-label"></div>
        <p-search-dropdown v-model="allClassifications" :alphabetise="false" />
      </div> -->
      <!-- <div class="filter tag-dropdown">
        <div v-t="'working-body'" class="filter-label"></div>
        <p-search-dropdown v-model="dropdownTags" />
      </div> -->
      <div class="filter" style="flex: 1"></div>
      <div v-if="type === 'person'" class="filter option-party-buttons">
        <div
          v-for="opt in allOptions"
          :key="opt.id"
          :class="[
            'party-button',
            opt.class,
            { selected: selectedOptions.indexOf(opt.id) > -1 },
          ]"
          @click="toggleOption(opt.id)"
        >
          {{ opt.label }}
        </div>
      </div>
      <div v-if="type === 'party'" class="filter text-filter">
        <div v-t="'sort-by'" class="filter-label"></div>
        <toggle v-model="selectedSort" :options="sortOptions" />
      </div>
    </div>

    <scroll-shadow ref="shadow">
      <div
        id="card-votes"
        class="votes stickinme date-list"
        @scroll="$refs.shadow.check($event.currentTarget)"
      >
        <div
          v-if="filteredVotingDays.length === 0"
          v-t="'no-results'"
          class="no-results"
        />
        <div v-else>
          <template v-for="(ballots, date) in filteredVotingDays" :key="date">
            <div
              v-if="type === 'person' || selectedSort === 'date'"
              class="date"
            >
              {{ date }}
            </div>
            <div>
              <div
                v-for="ballot in ballots"
                :key="`${ballot.timestamp}_${ballot.motion.id}`"
              >
                <ballot :ballot="ballot" type="person" />
              </div>
            </div>
          </template>
        </div>
      </div>
    </scroll-shadow>
  </card-wrapper>
</template>

<script>
import { find, filter, assign, groupBy, orderBy } from 'lodash-es';
import PSearchField from '@/_components/SearchField.vue';
// import PSearchDropdown from '@/_components/SearchDropdown.vue';
import Toggle from '@/_components/Toggle.vue';
import Ballot from '@/_components/Ballot.vue';
import ScrollShadow from '@/_components/ScrollShadow.vue';
import common from '@/_mixins/common.js';
import { personHeader, partyHeader } from '@/_mixins/altHeaders.js';
import { personOgImage, partyOgImage } from '@/_mixins/ogImages.js';
import { personVotes, partyVotes } from '@/_mixins/contextUrls.js';
import { personTitle, partyTitle } from '@/_mixins/titles.js';
import dateFormatter from '@/_helpers/dateFormatter.js';

export default {
  components: {
    // PSearchDropdown,
    PSearchField,
    Toggle,
    Ballot,
    ScrollShadow,
  },
  mixins: [common],
  props: {
    contextData: {
      type: Object,
      required: true,
    },
    type: {
      type: String,
      required: true,
      validator: (value) => ['person', 'party'].indexOf(value) > -1,
    },
  },
  data() {
    const selectFromState = (items, stateItemIds) =>
      items.map((item) =>
        assign({}, item, { selected: stateItemIds.indexOf(item.id) > -1 })
      );

    let allOptions = [
      {
        id: 'for',
        class: 'for',
        label: this.$t('vote-for'),
        selected: false,
      },
      {
        id: 'against',
        class: 'against',
        label: this.$t('vote-against'),
        selected: false,
      },
      {
        id: 'abstain',
        class: 'abstain',
        label:
          this.type === 'person'
            ? this.$t('vote-abstain')
            : this.$t('vote-abstain-plural'),
        selected: false,
      },
      {
        id: 'absent',
        class: 'absent',
        label:
          this.type === 'person'
            ? this.$t('vote-absent')
            : this.$t('vote-absent-plural'),
        selected: false,
      },
    ];

    let allTags = (this.contextData.cardData.data?.all_tags || []).map(
      (tag) => ({
        id: tag,
        label: tag,
        selected: false,
      })
    );

    let allClassifications = [];
    Object.keys(this.contextData.cardData.data?.classifications || {}).forEach(
      (classificationKey) => {
        allClassifications.push({
          id: classificationKey,
          label: this.$t(
            `vote_types.${this.contextData.cardData.classifications[classificationKey]}`
          ),
          selected: false,
        });
      }
    );

    let textFilter = '';

    if (this.contextData.cardState) {
      const state = this.contextData.cardState;
      if (state.text) {
        textFilter = state.text;
      }

      if (state.classifications) {
        allClassifications = selectFromState(
          allClassifications,
          state.classifications
        );
      }
      if (state.options) {
        allOptions = selectFromState(allOptions, state.options);
      }
      if (state.tags) {
        allTags = selectFromState(allTags, state.tags);
      }
    }

    return {
      results: this.contextData.cardData.data?.results ?? [],
      selectedSort: 'date',
      sortOptions: {
        maximum: this.$t('sort-by--inequality'),
        date: this.$t('sort-by--date'),
      },
      allClassifications,
      allOptions,
      allTags,
      textFilter,
    };
  },
  computed: {
    dropdownTags: {
      get() {
        const validTags = [];
        return filter(this.allTags, (tag) => validTags.indexOf(tag.id) > -1);
      },
      set(newTags) {
        this.allTags = this.allTags.map(
          (tag) => find(newTags, { id: tag.id }) || tag
        );
      },
    },
    selectedTags() {
      return filter(this.allTags, (tag) => tag.selected).map((tag) => tag.id);
    },
    selectedClassifications() {
      return filter(
        this.allClassifications,
        (classification) => classification.selected
      ).map((classification) => classification.id);
    },
    selectedOptions() {
      return filter(this.allOptions, (option) => option.selected).map(
        (option) => option.id
      );
    },
    filteredVotingDays() {
      let form = 'plural';
      if (this.type === 'person') {
        form =
          this.contextData.cardData?.data?.person?.preferred_pronoun === 'she'
            ? 'f'
            : 'm';
      }

      const lowerTextFilter = String(this.textFilter || '').toLowerCase();

      const filteredResults = this.results
        .filter((r) => {
          let textMatch = true;
          let optionMatch = true;

          if (lowerTextFilter) {
            textMatch = r.motion.text.toLowerCase().includes(lowerTextFilter);
          }

          if (this.selectedOptions.length) {
            optionMatch = this.selectedOptions.includes(r.option);
          }

          return textMatch && optionMatch;
        })
        .map((r) => ({
          ...r,
          label: this.$t(`voted-${r.option}--${form}`),
        }));

      const votingDays = groupBy(
        orderBy(filteredResults, ['timestamp'], ['asc']),
        (o) => dateFormatter(o.timestamp)
      );
      return votingDays;
    },
    headerConfig() {
      if (this.type === 'person') {
        return personHeader.computed.headerConfig.call(this);
      }
      return partyHeader.computed.headerConfig.call(this);
    },
    ogConfig() {
      if (this.type === 'person') {
        return personOgImage.computed.ogConfig.call(this);
      }
      return partyOgImage.computed.ogConfig.call(this);
    },
  },
  created() {
    (this.type === 'person' ? personVotes : partyVotes).created.call(this);
    (this.type === 'person' ? personTitle : partyTitle).created.call(this);
  },
  methods: {
    toggleOption(optionId) {
      const clickedOption = filter(
        this.allOptions,
        (option) => option.id === optionId
      )[0];
      clickedOption.selected = !clickedOption.selected;
    },
  },
};
</script>

<style lang="scss" scoped>
@import 'parlassets/scss/breakpoints';
@import 'parlassets/scss/colors';

:deep(.card-content),
:deep(.card-content-front) {
  @include respond-to(mobile) {
    max-height: none;
  }
}

#card-votes {
  height: $full-card-height - 89;
  overflow-y: auto;

  @include respond-to(mobile) {
    height: 352px;
  }
}

.filters {
  padding-bottom: 12px;
  @include respond-to(mobile) {
    flex-wrap: wrap;
    min-height: 154px;
  }
  $label-height: 26px;

  display: flex;

  .option-party-buttons {
    @include show-for(desktop, flex);

    width: 27.5%;
    padding-top: $label-height;

    .party-button:not(:last-child) {
      margin-right: 3px;
    }
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

  .tag-dropdown {
    @include respond-to(desktop) {
      width: 26%;
    }

    width: 100%;
  }

  .month-dropdown {
    @include show-for(desktop);

    width: 17.5%;
  }
}

.votes {
  flex: 1;
  // list-style: none;
  overflow-y: auto;
  position: relative;

  ul {
    list-style: none;
    margin: 0 0 7px;
    padding: 0;
  }

  li {
    display: flex;
    font-weight: 500;
    font-size: 16px;
    line-height: 18px;

    .date {
      height: auto;
      margin: 0 0 -18px 16px;
      padding: 16px 0;
      width: 54px;
    }
  }
}

.filters {
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
}
</style>
