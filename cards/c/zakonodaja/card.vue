<template>
  <div :id="$options.cardData.cardData._id">
    <generator>
      <div slot="generator" class="session-list-generator legislation-list">
        <div v-if="filters.length > 1" class="row">
          <div class="col-md-12">
            <blue-button-list
              :items="filters"
              v-model="currentFilter"
            />
          </div>
        </div>
        <div class="row">
          <div class="col-md-12 filters">
            <div class="filter text-filter">
              <p-search-field v-model="textFilter" />
            </div>
            <div v-if="allWorkingBodies.length" class="filter month-dropdown">
              <p-search-dropdown
                v-model="allWorkingBodies"
                :placeholder="inputPlaceholder"
                :alphabetise="false"
              />
            </div>
            <div class="filter align-checkbox">
              <input
                id="only-abstracts"
                v-model="onlyAbstracts"
                type="checkbox"
                class="checkbox"
              >
              <label v-t="'only-abstracts'" for="only-abstracts"></label>
            </div>
          </div>
        </div>
      </div>
      <inner-card
        :header-config="headerConfig"
        :og-config="ogConfig"
        :columns="columns"
        :items="processedData"
        :current-sort="currentSort"
        :current-sort-order="currentSortOrder"
        :select-sort="selectSort"
        :generated-card-url="generatedCardUrl"
      />
    </generator>
  </div>
</template>

<script>
import common from 'mixins/common';
import { defaultHeaderConfig } from 'mixins/altHeaders';
import { defaultOgImage } from 'mixins/ogImages';
import Generator from 'components/Generator.vue';
import StripedButton from 'components/StripedButton.vue';
import PSearchField from 'components/SearchField.vue';
import PSearchDropdown from 'components/SearchDropdown.vue';
import BlueButtonList from 'components/BlueButtonList.vue';
import dateParser from 'helpers/dateParser';
import InnerCard from './innerCard.vue';

export default {
  name: 'Zakonodaja',
  components: {
    Generator,
    StripedButton,
    PSearchField,
    InnerCard,
    PSearchDropdown,
    BlueButtonList,
  },
  mixins: [common],
  data() {
    // get all working bodies from result data
    let allWorkingBodies = this.$options.cardData.data.results
      .map(x => x.mdt)
      .filter(x => x.id > 0);
    // prepare for dropdown ui component
    allWorkingBodies = allWorkingBodies
      .map(wb => ({ id: wb.id, label: wb.name, selected: false }));
    // remove duplicates
    allWorkingBodies = allWorkingBodies
      .map(JSON.stringify)
      .reverse()
      .filter((e, i, a) => a.indexOf(e, i + 1) === -1)
      .reverse()
      .map(JSON.parse);

    const tabs = this.$options.cardData.cardGlobals.legislation_tabs;
    return {
      tabs,
      data: this.$options.cardData.data.results,
      filters: tabs.map(e => ({ id: e.title, label: e.title })),
      currentFilter: this.$options.cardData.parlaState.filter || tabs[0].title,
      currentSort: 'updated',
      currentSortOrder: 'desc',
      textFilter: '',
      workingBodies: [],
      allWorkingBodies,
      onlyAbstracts: false,
    };
  },
  computed: {
    headerConfig() {
      return defaultHeaderConfig(this, {
        title: this.dynamicTitle,
      });
    },
    ogConfig() {
      return defaultOgImage(this, {
        title: this.dynamicTitle,
      });
    },
    dynamicTitle() {
      const currentTab = this.tabs.find(e => e.title === this.currentFilter);
      if (currentTab && currentTab.card_title) {
        return currentTab.card_title;
      }
      return this.$t('card.title');
    },
    inputPlaceholder() {
      return this.selectedWorkingBodies.length > 0
        ? this.$t('selected-placeholder', { num: this.selectedWorkingBodies.length })
        : this.$t('select-working-body-placeholder');
    },
    selectedWorkingBodies() {
      return this.allWorkingBodies.filter(wb => wb.selected).map(wb => wb.id);
    },
    columns() {
      return [{
        id: 'name',
        label: this.$t('name'),
        additionalClass: 'small-text',
      }, {
        id: 'epa',
        label: this.$t('epa'),
        additionalClass: 'narrow',
      }, {
        id: 'updated',
        label: this.$t('change'),
      }, {
        id: 'result',
        label: this.$t('status'),
      }];
    },
    generatedCardUrl() {
      const state = {};
      state.type = this.currentFilter;

      if (this.textFilter.length > 0) {
        state.text = this.textFilter;
      }
      // @todo probably needs a good fix
      if (this.selectedWorkingBodies.length) {
        state.wb = this.selectedWorkingBodies;
      }

      return `${this.url}?state=${encodeURIComponent(JSON.stringify(state))}&altHeader=true&customUrl=${encodeURIComponent(`${this.slugs.urls.analize}/s/getAllLegislation/`)}`;
    },
    processedData() {
      const filterLegislation = (legislation) => {
        const textMatch = this.textFilter === ''
          || legislation.text === null
          || legislation.text.toLowerCase().indexOf(this.textFilter.toLowerCase()) > -1;
        const wbMatch = this.selectedWorkingBodies.length === 0
          || this.selectedWorkingBodies.includes(legislation.mdt.id);
        const onlyAbstractsMatch = !this.onlyAbstracts || legislation.abstractVisible;

        let typeMatch = this.currentFilter === '';
        if (!typeMatch) {
          const currentTab = this.tabs.find(e => e.title === this.currentFilter);
          if (currentTab) {
            const classification = legislation.classification == null ? 'null' : legislation.classification;
            if (currentTab.classifications) {
              typeMatch = currentTab.classifications.indexOf(classification) !== -1;
            } else {
              const classifications = this.tabs.reduce((acc, cur) => {
                if (cur.classifications) {
                  return acc.concat(cur.classifications);
                }
                return acc;
              }, []);
              typeMatch = classifications.indexOf(classification) === -1;
            }
          }
        }

        return textMatch && typeMatch && wbMatch && onlyAbstractsMatch;
      };

      const sortedAndFilteredLegislation = this.data.filter(filterLegislation).sort((A, B) => {
        let a;
        let b;

        switch (this.currentSort) {
          case 'name':
            a = A.text;
            b = B.text;
            return a.toLowerCase().localeCompare(b.toLowerCase(), 'sl');
          case 'updated':
            a = dateParser(A.date).getTime() || Date.now();
            b = dateParser(B.date).getTime() || Date.now();
            return a - b;
          case 'workingBody':
            a = A.mdt_text;
            b = B.mdt_text;
            return a.localeCompare(b, 'sl');
          case 'result':
            a = A.result || this.$t('vote-under-consideration');
            b = B.result || this.$t('vote-under-consideration');
            return a.toLowerCase().localeCompare(b.toLowerCase(), 'sl');
          case 'epa':
            a = parseInt(A.epa || '0-VII', 10);
            b = parseInt(B.epa || '0-VII', 10);
            return a - b;
          default:
            return 0;
        }
      });

      if (this.currentSortOrder === 'desc') {
        sortedAndFilteredLegislation.reverse();
      }

      return sortedAndFilteredLegislation;
    },
  },
  methods: {
    selectSort(sortId) {
      if (this.currentSort === sortId) {
        this.currentSortOrder = this.currentSortOrder === 'asc' ? 'desc' : 'asc';
      } else {
        this.currentSort = sortId;
        this.currentSortOrder = 'asc';
      }
    },
  },
};
</script>

<style lang="scss">
@import '~parlassets/scss/breakpoints';
@import '~parlassets/scss/colors';

.legislation-list {
  padding: 0;

  a {
    color: $second;
  }

  .item .column {
    &:first-child {
      font-family: "Roboto Slab", sans-serif;
    }
  }

  .column {
    font-size: 16px;

    &:nth-child(2),
    &:nth-child(3),
    &:nth-child(4),
    &:nth-child(5) .text {
      @include respond-to(mobile) {
        display:none;
      }
    }

    &:nth-child(3) {
      @include respond-to(desktop) {
        padding-left: 40px;
      }
    }

    &:nth-child(2),
    &:nth-child(3),
    &:nth-child(4) .text {
      font-size: 16px !important;
    }

    &.small-text {
      font-size: 14px;
    }


    &:last-child {
      .outcome .text {
        min-width: 92px;

        @include respond-to(mobile) {
          min-width: 75px;
        }
      }
    }
  }

  .filters {
    margin-top: 14px;
    display: flex;

    .month-dropdown {
      width: 100%;

      @include respond-to(desktop) {
        margin-left: 10px;
        width: 26%;
      }

      .filter-label {
        margin-left: 10px;
      }
    }

    .text-filter {
      @include respond-to(desktop) {
        width: 26%;
      }

      width: 100%;

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

    .filter {
      flex: 1.5;
    }
  }
}
</style>
