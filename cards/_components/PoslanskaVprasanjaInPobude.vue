<template>
  <card-wrapper
    :card-url="cardUrl"
    :header-config="headerConfig"
    :og-config="ogConfig"
  >
    <!-- TODO: empty state should take care of this -->
    <!-- <data-not-published
      v-if="showEmptyState"
      :text="$t('data-not-published.parlamentary-questions')"
    /> -->
    <div class="filters">
      <div class="filter tag-dropdown">
        <div v-t="'mp'" class="filter-label"></div>
        <p-search-dropdown
          :model-value="dropdownItems.MPs"
          @update:modelValue="updateDropdownOptions('allMPs', $event)"
        />
      </div>
      <div class="filter tag-dropdown naslovljenec">
        <div v-t="'addressee'" class="filter-label"></div>
        <p-search-dropdown
          :model-value="dropdownItems.recipients"
          @update:modelValue="updateDropdownOptions('allRecipients', $event)"
        />
      </div>
      <div class="filter month-dropdown">
        <div v-t="'time-period'" class="filter-label"></div>
        <p-search-dropdown
          :model-value="dropdownItems.months"
          :alphabetise="false"
          @update:modelValue="updateDropdownOptions('allMonths', $event)"
        />
      </div>
      <div class="filter text-filter">
        <div v-t="'title-search'" class="filter-label"></div>
        <input v-model="textFilter" class="text-filter-input" type="text" />
      </div>
    </div>
    <div id="vprasanja">
      <question-list :question-days="filteredQuestionDays" show-author />
    </div>
  </card-wrapper>
</template>

<script>
import { find, intersection, assign } from 'lodash-es';
import generateMonths from '@/_mixins/generateMonths.js';
import common from '@/_mixins/common.js';
import { partyOverview } from '@/_mixins/contextUrls.js';
import { partyTitle } from '@/_mixins/titles.js';
import { partyHeader, memberHeader } from '@/_mixins/altHeaders.js';
import { partyOgImage, memberOgImage } from '@/_mixins/ogImages.js';
import CardWrapper from '@/_components/Card/Wrapper.vue';
import PSearchDropdown from '@/_components/SearchDropdown.vue';
import QuestionList from '@/_components/QuestionList.vue';
import getD3Locale from '@/_i18n/d3locales.js';

export default {
  components: {
    CardWrapper,
    PSearchDropdown,
    QuestionList,
  },
  mixins: [common, partyOverview, partyTitle, generateMonths],
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

    const { months } = getD3Locale(import.meta.env.VITE_CARD_LANG);
    let allMonths = this.generateMonths(months);
    let allMPs = this.contextData.cardData.all_authors.map((author) => ({
      id: author.id,
      label: author.name,
      selected: false,
    }));
    let allRecipients = this.contextData.cardData.all_recipients.map(
      (recipient) => ({
        id: recipient,
        label: recipient,
        selected: false,
      })
    );
    let textFilter = '';

    if (this.cardData.parlaState) {
      if (this.cardData.parlaState.text) {
        textFilter = this.cardData.parlaState.text;
      }
      if (this.cardData.parlaState.months) {
        allMonths = selectFromState(allMonths, this.cardData.parlaState.months);
      }
      if (this.cardData.parlaState.recipients) {
        allRecipients = selectFromState(
          allRecipients,
          this.cardData.parlaState.recipients
        );
      }
      if (this.cardData.parlaState.mps) {
        allMPs = selectFromState(allMPs, this.cardData.parlaState.mps);
      }
    }

    return {
      questionDays: this.contextData.cardData.results,
      allMonths,
      allMPs,
      allRecipients,
      textFilter,
    };
  },
  computed: {
    dropdownItems() {
      const validMPs = [];
      const validRecipients = [];
      const validMonths = [];

      this.getFilteredQuestionDays(true).forEach((questionDay) => {
        const [, month, year] = questionDay.date
          .split(' ')
          .map((string) => parseInt(string, 10));
        const monthId = `${year}-${month}`;
        if (validMonths.indexOf(monthId) === -1) {
          validMonths.push(monthId);
        }

        questionDay.questions.forEach((question) => {
          const authors = question.authors || [question.person];
          authors.forEach((author) => {
            if (validMPs.indexOf(author.id) === -1) {
              validMPs.push(author.id);
            }
          });
          if (validRecipients.indexOf(question.recipient_text) === -1) {
            validRecipients.push(question.recipient_text);
          }
        });
      });

      return {
        MPs: this.allMPs.filter((mp) => validMPs.indexOf(mp.id) > -1),
        recipients: this.allRecipients.filter(
          (recipient) => validRecipients.indexOf(recipient.id) > -1
        ),
        months: this.allMonths.filter(
          (month) => validMonths.indexOf(month.id) > -1
        ),
      };
    },
    selectedMPs() {
      return this.allMPs.filter((tag) => tag.selected).map((tag) => tag.id);
    },
    selectedRecipients() {
      return this.allRecipients
        .filter((tag) => tag.selected)
        .map((tag) => tag.id);
    },
    selectedMonths() {
      return this.allMonths.filter((month) => month.selected);
    },
    filteredQuestionDays() {
      return this.getFilteredQuestionDays();
    },
    cardUrl() {
      const state = {};

      if (this.selectedRecipients.length > 0) {
        state.recipients = this.selectedRecipients;
      }
      if (this.selectedMonths.length > 0) {
        state.months = this.selectedMonths.map((month) => month.id);
      }
      if (this.textFilter.length > 0) {
        state.text = this.textFilter;
      }
      if (this.selectedMPs.length > 0) {
        state.mps = this.selectedMPs;
      }

      return `${this.url}${
        this.type === 'person'
          ? this.contextData.cardData.person.id
          : this.contextData.cardData.party.id
      }?state=${encodeURIComponent(JSON.stringify(state))}&altHeader=true`;
    },
    headerConfig() {
      if (this.type === 'person') {
        return memberHeader.computed.headerConfig.call(this);
      }
      return partyHeader.computed.headerConfig.call(this);
    },
    ogConfig() {
      if (this.type === 'person') {
        return memberOgImage.computed.ogConfig.call(this);
      }
      return partyOgImage.computed.ogConfig.call(this);
    },
  },
  methods: {
    getFilteredQuestionDays(onlyFilterByText = false) {
      const filterQuestions = (question) => {
        const authorIds = (question.authors || [question.person]).map(
          (a) => a.id
        );
        const MPMatch =
          onlyFilterByText ||
          this.selectedMPs.length === 0 ||
          intersection(this.selectedMPs, authorIds).length > 0;
        const recipientMatch =
          onlyFilterByText ||
          this.selectedRecipients.length === 0 ||
          this.selectedRecipients.indexOf(question.recipient_text) !== -1;
        const textMatch =
          this.textFilter === '' ||
          question.title.toLowerCase().indexOf(this.textFilter.toLowerCase()) >
            -1;
        return MPMatch && recipientMatch && textMatch;
      };

      const filterDates = (questionDay) => {
        if (onlyFilterByText || this.selectedMonths.length === 0) {
          return true;
        }

        const [, month, year] = questionDay.date
          .split(' ')
          .map((string) => parseInt(string, 10));

        return (
          this.selectedMonths.filter(
            (m) => m.month === month && m.year === year
          ).length > 0
        );
      };

      return this.questionDays
        .map((questionDay) => ({
          date: questionDay.date,
          questions: questionDay.questions.filter(filterQuestions),
        }))
        .filter((questionDay) => questionDay.questions.length > 0)
        .filter(filterDates);
    },
    updateDropdownOptions(itemType, newOptions) {
      const allItems = this[itemType];
      newOptions.forEach((newOption) => {
        find(allItems, { id: newOption.id }).selected = newOption.selected;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import 'parlassets/scss/breakpoints';
@import 'parlassets/scss/colors';

.card-content-front {
  display: flex;
  flex-direction: column;
}

.filters {
  $label-height: 26px;

  display: flex;
  min-height: 83px;

  .filter {
    flex: 1;
  }

  .filter:not(:last-child) {
    margin-right: 10px;
  }

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
    @include show-for(desktop);
    // @include respond-to(desktop) { width: 26%; }

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

    &.naslovljenec {
      @include respond-to(mobile) {
        margin-left: 10px;
      }
    }
  }

  .month-dropdown {
    @include show-for(desktop);

    width: 17.5%;
  }
}

.votes {
  min-height: 100px;
  flex: 1;
  // list-style: none;
  overflow-y: auto;
  margin-top: 18px;
  position: relative;

  .date {
    font-weight: 500;
  }

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

    .icon {
      @include show-for(desktop);

      background-position: center;
      background-repeat: no-repeat;
      background-size: 25px;
      height: 48px;
      width: 52px;

      &.za {
        background-image: url("#{getConfig('urls.cdn')}/icons/za.svg");
      }
      &.proti {
        background-image: url("#{getConfig('urls.cdn')}/icons/proti.svg");
      }
      &.ni {
        background-image: url("#{getConfig('urls.cdn')}/icons/ni.svg");
      }
      &.kvorum {
        background-image: url("#{getConfig('urls.cdn')}/icons/vzdrzan.svg");
      }
    }

    .parlaicon {
      height: auto;
      margin-right: 10px;
    }

    .motion {
      flex: 1;
      font-weight: 300;
      line-height: 20px;
      padding: 15px 0;
      a {
        font-weight: normal;
      }
    }

    .outcome {
      font-size: 11px;
      font-weight: 400;
      line-height: 13px;
      padding: 20px 15px 0;
      text-align: left;
      text-transform: uppercase;
      width: 90px;
    }
  }
}

#vprasanja :deep(.questions) {
  // height: 435px;
  height: $full-card-height - 83px;
}

.data-not-published {
  height: 100%;
}
</style>
