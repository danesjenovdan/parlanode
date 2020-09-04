<template>
  <card-wrapper
    :id="$root.$options.cardData.mountId"
    :card-url="cardUrl"
    :header-config="headerConfig"
    :og-config="ogConfig"
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

    <data-not-published
      v-if="false"
      :text="$t('data-not-published.parlamentary-questions')"
    />
    <template v-else>
      <div class="filters">
        <div class="filter tag-dropdown">
          <div v-t="'mp'" class="filter-label"></div>
          <p-search-dropdown
            :value="dropdownItems.MPs"
            @input="updateDropdownOptions('allMPs', $event)"
          />
        </div>
        <div class="filter tag-dropdown naslovljenec">
          <div v-t="'addressee'" class="filter-label"></div>
          <p-search-dropdown
            :value="dropdownItems.recipients"
            @input="updateDropdownOptions('allRecipients', $event)"
          />
        </div>
        <div class="filter month-dropdown">
          <div v-t="'time-period'" class="filter-label"></div>
          <p-search-dropdown
            :value="dropdownItems.months"
            :alphabetise="false"
            @input="updateDropdownOptions('allMonths', $event)"
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
    </template>
  </card-wrapper>
</template>

<script>
import { find, intersection, assign } from 'lodash';
import generateMonths from 'mixins/generateMonths';
import common from 'mixins/common';
import { partyOverview } from 'mixins/contextUrls';
import { partyTitle } from 'mixins/titles';
import { partyHeader, memberHeader } from 'mixins/altHeaders';
import { partyOgImage, memberOgImage } from 'mixins/ogImages';
import CardWrapper from 'components/Card/Wrapper.vue';
import PSearchDropdown from 'components/SearchDropdown.vue';
import QuestionList from 'components/QuestionList.vue';
import DataNotPublished from 'components/DataNotPublished.vue';

export default {
  components: {
    CardWrapper,
    PSearchDropdown,
    QuestionList,
    DataNotPublished,
  },
  mixins: [common, partyOverview, partyTitle, generateMonths],
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
      items.map(item => assign({}, item, { selected: stateItemIds.indexOf(item.id) > -1 }))
    );

    let allMonths = this.generateMonths(this.$t('months'));
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
      questionDays: this.cardData.data.results,
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
        const [, month, year] = questionDay.date.split(' ').map(string => parseInt(string, 10));
        const monthId = `${year}-${month}`;
        if (validMonths.indexOf(monthId) === -1) {
          validMonths.push(monthId);
        }

        questionDay.questions
          .forEach((question) => {
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

      return `${this.url}${this[this.type].id}?state=${encodeURIComponent(JSON.stringify(state))}&altHeader=true`;
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
        const authorIds = (question.authors || [question.person]).map(a => a.id);
        const MPMatch = onlyFilterByText
          || this.selectedMPs.length === 0
          || intersection(this.selectedMPs, authorIds).length > 0;
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
@import '~parlassets/scss/breakpoints';
@import '~parlassets/scss/colors';

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
      background-image: url("#{getConfig('urls.cdn')}/icons/search.svg");
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

      &.za { background-image: url("#{getConfig('urls.cdn')}/icons/za.svg"); }
      &.proti { background-image: url("#{getConfig('urls.cdn')}/icons/proti.svg"); }
      &.ni { background-image: url("#{getConfig('urls.cdn')}/icons/ni.svg"); }
      &.kvorum { background-image: url("#{getConfig('urls.cdn')}/icons/vzdrzan.svg"); }
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
  // height: 435px;
  height: $full-card-height - 83px;
}

.data-not-published {
  height: 100%;
}
</style>
