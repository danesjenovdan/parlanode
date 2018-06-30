<template>
  <card-wrapper
    :id="$root.$options.cardData.cardData._id"
    :card-url="cardUrl"
    :header-config="headerConfig"
    content-class="full"
  >
    <div slot="info">
      <p v-t="'info.lead'" class="info-text lead"></p>
      <p v-t="'info.methodology'" class="info-text heading"></p>
      <p v-t="'info.text[0]'" class="info-text"></p>
      <i18n path="info.text[1]" tag="p" class="info-text">
        <a
          v-t="'info.link.text'"
          :href="$t('info.link.link')"
          place="link"
          class="funblue-light-hover"
          target="_blank"
        />
      </i18n>
    </div>

    <div class="filters">
      <div class="filter tag-dropdown">
        <div v-t="'mp'" class="filter-label"></div>
        <p-search-dropdown :items="dropdownItems.MPs" :placeholder="MPsPlaceholder" />
      </div>
      <div class="filter tag-dropdown naslovljenec">
        <div v-t="'addressee'" class="filter-label"></div>
        <p-search-dropdown :items="dropdownItems.recipients" :placeholder="recipientsPlaceholder" />
      </div>
      <div class="filter month-dropdown">
        <div v-t="'time-period'" class="filter-label"></div>
        <p-search-dropdown
          :items="dropdownItems.months"
          :placeholder="monthPlaceholder"
          :alphabetise="false"
        />
      </div>
      <div class="filter text-filter">
        <div v-t="'title-search'" class="filter-label"></div>
        <input v-model="textFilter" class="text-filter-input" type="text">
      </div>
    </div>
    <div id="vprasanja">
      <question-list :question-days="filteredQuestionDays" show-author />
    </div>
  </card-wrapper>
</template>

<script>
import generateMonths from 'helpers/generateMonths';
import common from 'mixins/common';
import { partyOverview } from 'mixins/contextUrls';
import { partyTitle } from 'mixins/titles';
import { partyHeader, memberHeader } from 'mixins/altHeaders';

import CardWrapper from 'components/Card/Wrapper.vue';
import PSearchDropdown from 'components/SearchDropdown.vue';
import QuestionList from 'components/QuestionList.vue';

export default {
  components: { CardWrapper, PSearchDropdown, QuestionList },
  mixins: [common, partyOverview, partyTitle],
  props: {
    cardData: {
      type: Object,
      required: true,
    },
    type: {
      type: String,
      required: true,
      validator: value => ['person', 'party'].indexOf(value) > -1,
    },
    person: {
      type: Object,
      default: () => ({}),
    },
    party: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    const selectFromState = (items, stateItemIds) => (
      items.map(item => Object.assign({}, item, { selected: stateItemIds.indexOf(item.id) > -1 }))
    );

    let allMonths = generateMonths();
    let allMPs = this.cardData.data.all_authors
      .map(author => ({ id: author.id, label: author.name, selected: false }));
    let allRecipients = this.cardData.data.all_recipients
      .map(recipient => ({ id: recipient, label: recipient, selected: false }));
    let textFilter = '';

    if (this.cardData.parlaState) {
      if (this.cardData.parlaState.text) {
        textFilter = this.cardData.parlaState.text;
      }
      if (this.cardData.parlaState.months) {
        allMonths = selectFromState(allMonths, this.cardData.parlaState.months);
      }
      if (this.cardData.parlaState.recipients) {
        allRecipients = selectFromState(allRecipients, this.cardData.parlaState.recipients);
      }
      if (this.cardData.parlaState.mps) {
        allMPs = selectFromState(allMPs, this.cardData.parlaState.mps);
      }
    }

    return {
      cardMethod: this.cardData.cardData.method,
      cardGroup: this.cardData.cardData.group,
      questionDays: this.cardData.data.results,
      allMonths,
      allMPs,
      allRecipients,
      textFilter,
    };
  },
  computed: {
    MPsPlaceholder() {
      return this.selectedMPs.length > 0
        ? this.$t('selected-placeholder', { num: this.selectedMPs.length })
        : this.$t('select-placeholder');
    },
    recipientsPlaceholder() {
      return this.selectedRecipients.length > 0
        ? this.$t('selected-placeholder', { num: this.selectedRecipients.length })
        : this.$t('select-placeholder');
    },
    monthPlaceholder() {
      return this.selectedMonths.length > 0
        ? this.$t('selected-placeholder', { num: this.selectedMonths.length })
        : this.$t('select-placeholder');
    },
    dropdownItems() {
      const validMPs = [];
      const validRecipients = [];
      const validMonths = [];

      this.getFilteredQuestionDays(true).forEach((questionDay) => {
        const [, month, year] = questionDay.date.split(' ').map(string => parseInt(string, 10));
        const monthId = `${year}-${month}`;
        if (validMonths.indexOf(monthId) === -1) {
          validMonths.push(monthId);
        }

        questionDay.questions
          .forEach((question) => {
            if (validMPs.indexOf(question.person.id) === -1) {
              validMPs.push(question.person.id);
            }
            if (validRecipients.indexOf(question.recipient_text) === -1) {
              validRecipients.push(question.recipient_text);
            }
          });
      });

      return {
        MPs: this.allMPs.filter(mp => validMPs.indexOf(mp.id) > -1),
        recipients: this.allRecipients
          .filter(recipient => validRecipients.indexOf(recipient.id) > -1),
        months: this.allMonths.filter(month => validMonths.indexOf(month.id) > -1),
      };
    },
    selectedMPs() {
      return this.allMPs
        .filter(tag => tag.selected)
        .map(tag => tag.id);
    },
    selectedRecipients() {
      return this.allRecipients
        .filter(tag => tag.selected)
        .map(tag => tag.id);
    },
    selectedMonths() {
      return this.allMonths.filter(month => month.selected);
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
        state.months = this.selectedMonths.map(month => month.id);
      }
      if (this.textFilter.length > 0) {
        state.text = this.textFilter;
      }
      if (this.selectedMPs.length > 0) {
        state.mps = this.selectedMPs;
      }

      return `${this.url}/${this[this.type].id}?state=${encodeURIComponent(JSON.stringify(state))}&altHeader=true`;
    },
    headerConfig() {
      if (this.type === 'person') {
        return memberHeader.computed.headerConfig.call(this);
      }
      return partyHeader.computed.headerConfig.call(this);
    },
  },
  methods: {
    getFilteredQuestionDays(onlyFilterByText = false) {
      const filterQuestions = (question) => {
        const MPMatch = onlyFilterByText
          || this.selectedMPs.length === 0
          || this.selectedMPs.indexOf(question.person.id) !== -1;
        const recipientMatch = onlyFilterByText || this.selectedRecipients.length === 0
          || this.selectedRecipients.indexOf(question.recipient_text) !== -1;
        const textMatch = this.textFilter === ''
          || question.title.toLowerCase().indexOf(this.textFilter.toLowerCase()) > -1;
        return MPMatch && recipientMatch && textMatch;
      };

      const filterDates = (questionDay) => {
        if (onlyFilterByText || this.selectedMonths.length === 0) {
          return true;
        }

        const [, month, year] = questionDay.date.split(' ').map(string => parseInt(string, 10));

        return this.selectedMonths.filter(m => m.month === month && m.year === year).length > 0;
      };

      return this.questionDays
        .map(questionDay => ({
          date: questionDay.date,
          questions: questionDay.questions.filter(filterQuestions),
        }))
        .filter(questionDay => questionDay.questions.length > 0)
        .filter(filterDates);
    },
  },
};
</script>

<style lang="scss" scoped>
@import '~parlassets/scss/breakpoints';

.card-content-front {
  display: flex;
  flex-direction: column;
}

.filters {

  $label-height: 26px;

  display: flex;
  justify-content: space-between;

  min-height: 83px;

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

  .search-dropdown-input {
    padding-top: 11px;
    padding-bottom: 11px;
  }

  .search-dropdown-options { top: 50px; }

  .search-dropdown input {
    background-color: #ffffff;
  }
}

.votes {
  min-height: 100px;
  flex: 1;
  // list-style: none;
  overflow-y: auto;
  margin-top: 18px;
  position: relative;

  &:empty::after {
    color: #c8c8c8;
    content: "Ni rezultatov.";
    left: calc(50% - 41px);
    position: absolute;
    top: calc(50% - 10px);
  }

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

      &.za { background-image: url("https://cdn.parlameter.si/v1/parlassets/icons/za.svg"); }
      &.proti { background-image: url("https://cdn.parlameter.si/v1/parlassets/icons/proti.svg"); }
      &.ni { background-image: url("https://cdn.parlameter.si/v1/parlassets/icons/ni.svg"); }
      &.kvorum { background-image: url("https://cdn.parlameter.si/v1/parlassets/icons/vzdrzan.svg"); }
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
      a { font-weight: normal; }
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

#vprasanja /deep/ .questions {
  height: 435px;
}
</style>
