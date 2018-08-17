<template>
  <div :id="$options.cardData.cardData._id">
    <generator>
      <div slot="generator" class="row legislation-list">
        <div class="session-list-generator">
          <div class="col-md-12 filters">
            <ul class="button-filters">
              <striped-button
                v-for="(filter, index) in filters"
                :key="index"
                :selected="filter === currentFilter"
                :small-text="$te(filter) ? $t(filter) : filter"
                color="sds"
                @click.native="selectFilter(filter)"
              />
            </ul>

            <div class="filter text-filter">
              <div v-t="'title-search'" class="filter-label"></div>
              <p-search-field v-model="textFilter" />
            </div>

            <div class="filter month-dropdown">
              <div v-t="'working-body'" class="filter-label"></div>
              <p-search-dropdown
                :items="allWorkingBodies"
                :placeholder="inputPlaceholder"
                :alphabetise="false"
              />
            </div>

            <div class="filter only-abstracts">
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
import dateParser from 'helpers/dateParser';
import InnerCard from './innerCard.vue';
import cardConfigJson from './config.json';

export default {
  name: 'Zakonodaja',
  components: {
    Generator,
    StripedButton,
    PSearchField,
    InnerCard,
    PSearchDropdown,
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

    const cardConfig = cardConfigJson[this.$i18n.locale];

    return {
      cardConfig,
      data: this.$options.cardData.data.results,
      filters: cardConfig.tabs.map(e => e.title),
      currentFilter: this.$options.cardData.parlaState.filter || cardConfig.tabs[0].title,
      currentSort: 'updated',
      currentSortOrder: 'desc',
      textFilter: '',
      workingBodies: [],
      headerConfig: defaultHeaderConfig(this),
      ogConfig: defaultOgImage(this),
      allWorkingBodies,
      onlyAbstracts: false,
    };
  },
  computed: {
    inputPlaceholder() {
      return this.selectedWorkingBodies.length > 0
        ? this.$t('selected-placeholder', { num: this.selectedWorkingBodies.length })
        : this.$t('select-placeholder');
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
          const currentTab = this.cardConfig.tabs.find(e => e.title === this.currentFilter);
          if (currentTab) {
            const classification = legislation.classification == null ? 'null' : legislation.classification;
            if (currentTab.classifications) {
              typeMatch = currentTab.classifications.indexOf(classification) !== -1;
            } else {
              const classifications = this.cardConfig.tabs.reduce((acc, cur) => {
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
            a = dateParser(A.date).getTime();
            b = dateParser(B.date).getTime();
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
    selectFilter(filter) {
      this.currentFilter = filter;
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
    color: #009cda;
  }

  .dropdown-filter.search-dropdown { height: 51px; }

  .item .column {
    &:first-child {
      font-family: "Roboto Slab", sans-serif;
    }
  }

  .column{
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
    padding: 0;

    .dropdown-filter {
      margin-right: 0;

      @include respond-to(desktop) { margin-left: 10px; }
    }

    $label-height: 26px;

    display: flex;

    .striped-button {
      width: 50%;
      height: 51px;
    }

    .filter-label {
      font-size: 14px;
      font-weight: 300;
      line-height: $label-height;
    }

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
        margin-left: 10px;
      }

      width: 100%;

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

    .search-dropdown-input {
      padding-top: 11px;
      padding-bottom: 11px;
    }

    .button-filters {

      @include respond-to(desktop) {
        flex: 0;
        margin-top: $label-height;
      }

      .striped-button {
        @include respond-to(mobile) { width: 49%; }
        @include respond-to(desktop) { width: 140px; }

        &:first-child {
          @include respond-to(desktop) { margin-right: 10px; }
        }
      }
    }

    .only-abstracts {
      padding-top: 40px;
      padding-left: 10px;

      @include respond-to(mobile) {
        padding-top: 10px;
        padding-left: 0;
        margin-bottom: -5px;
      }
    }

  }
}

.button-filters {
  .striped-button {
    background-color: $grey;
  }
}
</style>
