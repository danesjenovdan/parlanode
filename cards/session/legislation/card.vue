<template>
  <card-wrapper :header-config="headerConfig" max-height>
    <template #generator>
      <div class="session-list-generator legislation-list">
        <div v-if="filters.length > 1" class="row">
          <div class="col-md-12">
            <blue-button-list v-model="currentFilter" :items="filters" />
          </div>
        </div>
        <div class="row">
          <div class="col-md-12 filters">
            <div class="filter text-filter">
              <search-field v-model="textFilter" />
            </div>
            <div v-if="allWorkingBodies.length" class="filter month-dropdown">
              <p-search-dropdown
                v-model="allWorkingBodies"
                :placeholder="inputPlaceholder"
                :alphabetise="false"
              />
            </div>
            <!-- <div class="checkbox-filters">
              <div class="filter align-checkbox">
                <input
                  id="only-abstracts"
                  v-model="onlyAbstracts"
                  type="checkbox"
                  class="checkbox"
                />
                <label v-t="'only-abstracts'" for="only-abstracts"></label>
              </div>
              <div class="filter align-checkbox">
                <input
                  id="only-with-votes"
                  v-model="onlyWithVotes"
                  type="checkbox"
                  class="checkbox"
                />
                <label v-t="'only-with-votes'" for="only-with-votes"></label>
              </div>
            </div> -->
          </div>
        </div>
      </div>
    </template>
    <inner-card
      :header-config="headerConfig"
      :columns="columns"
      :items="processedData"
      :current-sort="currentSort"
      :current-sort-order="currentSortOrder"
      :select-sort="selectSort"
    />
  </card-wrapper>
</template>

<script>
import common from '@/_mixins/common.js';
import { defaultHeaderConfig } from '@/_mixins/altHeaders.js';
import { defaultOgImage } from '@/_mixins/ogImages.js';
import { sessionLegislationContextUrl } from '@/_mixins/contextUrls.js';
import SearchField from '@/_components/SearchField.vue';
import PSearchDropdown from '@/_components/SearchDropdown.vue';
import BlueButtonList from '@/_components/BlueButtonList.vue';
import InnerCard from './InnerCard.vue';

// TODO: get from config
const legislationTabs = [
  {
    title: 'Zakonodaja',
    // classifications: ['zakon'],
  },
  // {
  //   title: 'Akti',
  //   card_title: 'Seznam aktov',
  // },
];

export default {
  name: 'CardSessionLegislation',
  components: {
    SearchField,
    InnerCard,
    PSearchDropdown,
    BlueButtonList,
  },
  mixins: [common, sessionLegislationContextUrl],
  cardInfo: {
    doubleWidth: true,
  },
  data() {
    const { cardState, cardData } = this.$root.$options.contextData;

    // get all working bodies from result data
    let allWorkingBodies = (cardData?.data?.wbs || [])
      .map((x) => x.mdt)
      .filter((x) => x.id > 0);
    // prepare for dropdown ui component
    allWorkingBodies = allWorkingBodies.map((wb) => ({
      id: wb.id,
      label: wb.name,
      selected: false,
    }));
    // remove duplicates
    allWorkingBodies = allWorkingBodies
      .map(JSON.stringify)
      .reverse()
      .filter((e, i, a) => a.indexOf(e, i + 1) === -1)
      .reverse()
      .map(JSON.parse);

    const tabs = legislationTabs;
    return {
      tabs,
      filters: tabs.map((e) => ({ id: e.title, label: e.title })),
      currentFilter:
        cardState?.type || (cardState?.generator ? tabs[0].title : null),
      currentSort: 'updated',
      currentSortOrder: 'desc',
      textFilter: cardState?.text || '',
      workingBodies: [],
      allWorkingBodies,
      onlyAbstracts: !!cardState?.onlyAbstracts,
      onlyWithVotes: !!cardState?.onlyWithVotes,
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
      const currentTab = this.tabs.find((e) => e.title === this.currentFilter);
      if (currentTab && currentTab.card_title) {
        return currentTab.card_title;
      }
      return this.$t('card.title');
    },
    inputPlaceholder() {
      return this.selectedWorkingBodies.length > 0
        ? this.$t('selected-placeholder', {
            num: this.selectedWorkingBodies.length,
          })
        : this.$t('select-working-body-placeholder');
    },
    selectedWorkingBodies() {
      return this.allWorkingBodies
        .filter((wb) => wb.selected)
        .map((wb) => wb.id);
    },
    columns() {
      return [
        {
          id: 'name',
          label: this.$t('name'),
          additionalClass: 'small-text',
        },
        // {
        //   id: 'data',
        //   label: this.$t('data'),
        //   additionalClass: 'narrow no-sort',
        // },
        // {
        //   id: 'epa',
        //   label: this.$t('epa'),
        //   additionalClass: 'narrow',
        // },
        {
          id: 'updated',
          label: this.$t('date'),
        },
        {
          id: 'result',
          label: this.$t('status'),
        },
      ];
    },

    processedData() {
      const filterLegislation = (legislation) => {
        const textMatch =
          this.textFilter === '' ||
          legislation.text === null ||
          legislation.text
            .toLowerCase()
            .indexOf(this.textFilter.toLowerCase()) > -1;
        const wbMatch =
          this.selectedWorkingBodies.length === 0 ||
          this.selectedWorkingBodies.includes(legislation.mdt.id);
        const onlyAbstractsMatch =
          !this.onlyAbstracts || legislation.abstractVisible;
        const onlyWithVotesMatch = !this.onlyWithVotes || legislation.hasVotes;

        let typeMatch = this.currentFilter == null || this.currentFilter === '';
        if (!typeMatch) {
          const currentTab = this.tabs.find(
            (e) => e.title === this.currentFilter
          );
          if (currentTab) {
            const classification =
              legislation.classification == null
                ? 'null'
                : legislation.classification;
            if (currentTab.classifications) {
              typeMatch =
                currentTab.classifications.indexOf(classification) !== -1;
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

        return (
          textMatch &&
          typeMatch &&
          wbMatch &&
          onlyAbstractsMatch &&
          onlyWithVotesMatch
        );
      };

      const sortedAndFilteredLegislation = (this.cardData.data?.results || [])
        .filter(filterLegislation)
        .sort((A, B) => {
          let a;
          let b;

          switch (this.currentSort) {
            case 'name':
              a = A.text;
              b = B.text;
              return a.toLowerCase().localeCompare(b.toLowerCase(), 'sl');
            case 'updated':
              a = A.timestamp || 'N/A';
              b = B.timestamp || 'N/A';
              return a.localeCompare(b, 'en');
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
        this.currentSortOrder =
          this.currentSortOrder === 'asc' ? 'desc' : 'asc';
      } else {
        this.currentSort = sortId;
        this.currentSortOrder = 'asc';
      }
    },
  },
};
</script>

<style lang="scss">
@import 'parlassets/scss/breakpoints';
@import 'parlassets/scss/colors';

@function icon-abstract($color) {
  @return 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" fill="%23#{str_slice("#{$color}", 2)}"><path d="M112 8h-6V4a4 4 0 0 0-4-4H16a4 4 0 0 0-4 4v120a4 4 0 0 0 4 4h86a4 4 0 0 0 4-4v-4h6a4 4 0 0 0 4-4V12a4 4 0 0 0-4-4zM16 4h86v4H24a4 4 0 0 0-4 4v9h-4zm0 21h4v6h-4zm0 10h4v6h-4zm0 10h4v6h-4zm0 10h4v6h-4zm0 10h4v6h-4zm0 10h4v6h-4zm0 10h4v6h-4zm0 10h4v6h-4zm0 29v-19h4v11a4 4 0 0 0 4 4h78v4zm8-8v-11h4a2 2 0 0 0 0-4h-4v-6h4a2 2 0 0 0 0-4h-4v-6h4a2 2 0 0 0 0-4h-4v-6h4a2 2 0 0 0 0-4h-4v-6h4a2 2 0 0 0 0-4h-4v-6h4a2 2 0 0 0 0-4h-4v-6h4a2 2 0 0 0 0-4h-4v-6h4a2 2 0 0 0 0-4h-4v-6h4a2 2 0 0 0 0-4h-4v-9h88v104z"/><path d="M106 97H36a2 2 0 0 0 0 4h70a2 2 0 0 0 0-4zm0-70H36a2 2 0 0 0 0 4h70a2 2 0 0 0 0-4zM34 39a2 2 0 0 0 2 2h13.56a29.54 29.54 0 0 1 6.58-4H36a2 2 0 0 0-2 2zm72-2H79.87a29.54 29.54 0 0 1 6.58 4H106a2 2 0 0 0 0-4zM36 51h5.53a29.52 29.52 0 0 1 2.39-4H36a2 2 0 0 0 0 4zm70-4H92.09a29.52 29.52 0 0 1 2.39 4H106a2 2 0 0 0 0-4zm0 10h-9.35a29.3 29.3 0 0 1 .69 4H106a2 2 0 0 0 0-4zm-70 4h2.65a29.3 29.3 0 0 1 .69-4H36a2 2 0 0 0 0 4zm70 6h-8.65a29.3 29.3 0 0 1-.69 4H106a2 2 0 0 0 0-4zm-70 4h3.35a29.3 29.3 0 0 1-.69-4H36a2 2 0 0 0 0 4zm70 6H94.47a29.52 29.52 0 0 1-2.39 4H106a2 2 0 0 0 0-4zm-70 4h7.91a29.52 29.52 0 0 1-2.39-4H36a2 2 0 0 0 0 4zm0 10h20.13a29.54 29.54 0 0 1-6.58-4H36a2 2 0 0 0 0 4zm70-4H86.44a29.54 29.54 0 0 1-6.58 4H106a2 2 0 0 0 0-4zM52.74 67l8.19 8.19a2 2 0 0 0 2.83 0l19.5-19.5a2 2 0 0 0-2.83-2.83L62.34 70.92l-6.77-6.77A2 2 0 0 0 52.74 67z"/><path d="M68 89.5A25.5 25.5 0 1 0 42.5 64 25.53 25.53 0 0 0 68 89.5zm0-47A21.5 21.5 0 1 1 46.5 64 21.52 21.52 0 0 1 68 42.5z"/></svg>';
}

@function icon-votes($color) {
  @return 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="%23#{str_slice("#{$color}", 2)}"><path d="M29 11C17.978 11 9 20.006 9 31.023c0 8.928 5.9 16.499 14 19.055v10.933h-2.062c-1.256.053-2.146.745-3.032 1.406-.25-.807-1.061-1.404-1.906-1.406H9.813c-.984.093-1.817 1.012-1.813 2V87c0 1.047.953 2 2 2h6c.774.01 1.53-.48 1.844-1.187.418.246.835.463 1.25.656.548.254.985.53 1.906.53h14.844c.2 0 .402-.032.594-.093 3.128-.944 4.137-4.455 2.937-7.341.923-.84 1.623-1.818 1.75-2.967.108-.984-.086-1.955-.469-2.843 1.14-.773 2.045-1.75 2.313-2.968.26-1.182-.036-2.257-.531-3.28.898-.869 1.562-1.911 1.562-3.123 0-2.005-1.255-3.803-3.125-5.06a2.014 2.014 0 0 0-1.094-.313H35V50.078c8.1-2.556 14-10.127 14-19.055C49 20.006 40.022 11 29 11zm42 0c-11.022 0-20 9.006-20 20.023 0 8.928 5.9 16.499 14 19.055v10.933h-4.969a2.01 2.01 0 0 0-.906.312C57.255 62.582 56 64.38 56 66.383c0 1.213.664 2.256 1.563 3.125-.496 1.022-.792 2.097-.532 3.28.269 1.218 1.173 2.194 2.313 2.967-.383.888-.577 1.86-.469 2.843.127 1.149.827 2.127 1.75 2.967-1.2 2.886-.191 6.397 2.938 7.34.191.062.392.094.593.095H79c.92 0 1.358-.277 1.906-.531.415-.193.832-.41 1.25-.656A2.049 2.049 0 0 0 84 89h6c1.047 0 2-.952 2-2V63.01c0-1.046-.953-1.999-2-1.999h-6.187a2.05 2.05 0 0 0-1.75 1.406c-.902-.754-2.05-1.394-3-1.406H77V50.078c8.1-2.556 14-10.127 14-19.055C91 20.006 82.022 11 71 11zm-42 4.03c8.86 0 16 7.137 16 15.993 0 8.857-7.14 15.963-16 15.963S13 39.88 13 31.023c0-8.856 7.14-15.993 16-15.993zm42 0c8.86 0 16 7.137 16 15.993 0 8.857-7.14 15.963-16 15.963S55 39.88 55 31.023c0-8.856 7.14-15.993 16-15.993zm8.031 7.622L68.344 34.24l-5.531-4.748c-.794-.687-2.141-.59-2.828.203-.687.793-.59 2.14.203 2.827l7 5.997c.776.673 2.085.6 2.78-.156l12-12.995c.894-1.14.564-2.265-.315-3.015-.899-.628-1.79-.394-2.622.298zm-45.781 1.28L29 28.18l-4.25-4.248c-1.015-.771-1.886-.707-2.71-.129-.992.913-.781 2.181-.102 2.972l4.25 4.248-4.25 4.217c-.77.73-.79 2.102-.045 2.855.746.754 2.118.748 2.857-.013L29 33.834l4.25 4.248c.739.76 2.111.767 2.857.013.746-.753.724-2.125-.045-2.855l-4.25-4.217 4.25-4.248c.8-1.067.722-1.998-.049-2.969-1.045-.76-1.711-.524-2.763.126zM12 65.009h2v19.992h-2zm9.188 0H39.03c1.096 1.043 1.022 1.429.313 2h-4.531c-1.048.049-1.956 1.046-1.907 2.093.049 1.047 1.047 1.954 2.094 1.905h3.781c.662 1.288-.565 1.79-1.281 2h-3.687c-1.048.048-1.956 1.045-1.907 2.092.049 1.047 1.047 1.955 2.094 1.906h2.844c.584 1.102.1 1.522-.469 1.999h-3.562c-1.048.049-1.956 1.046-1.907 2.093.049 1.047 1.047 1.954 2.094 1.905h2.781c.435.886.07 1.78-.468 2H21c-.982-.607-2.096-1.275-3-1.937V67.82c1.075-.98 2.128-2.056 3.188-2.812zm39.78 0h17.845c1.223.763 2.306 1.93 3.187 2.812v15.243c-.985.669-1.973 1.336-3 1.937H64.687c-.538-.219-.903-1.113-.468-2H67c1.057.016 2.028-.942 2.028-1.998s-.971-2.014-2.028-2h-3.375c-1.054-.54-.742-1.176-.469-1.999H66c1.057.015 2.028-.942 2.028-1.999 0-1.056-.971-2.014-2.028-1.999h-3.5c-1.42-.404-1.676-.93-1.281-2H65c1.057.016 2.028-.942 2.028-1.998 0-1.057-.971-2.014-2.028-2h-4.344c-1.199-.548-.244-1.503.313-1.999zm25.032 0h2v19.992h-2z"/></svg>';
}

.legislation-list {
  padding: 0;

  a {
    color: $second;
  }

  .item .column {
    &:first-child {
      font-family: 'Roboto Slab', sans-serif;
    }
  }

  .column {
    font-size: 16px;

    &:nth-child(2),
    &:nth-child(3),
    &:nth-child(4),
    &:nth-child(5) .text {
      @include respond-to(mobile) {
        display: none;
      }
    }

    &:nth-child(5) {
      @include respond-to(mobile) {
        max-width: 52px;

        .outcome {
          justify-content: center;
        }
      }

      .text {
        font-size: 16px !important;
      }
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

    .filter {
      flex: 1.5;
    }

    .text-filter {
      flex-basis: 100%;

      @include respond-to(desktop) {
        flex-basis: 50%;
        flex-grow: 0;
      }
    }

    .checkbox-filters {
      display: flex;
      flex-wrap: wrap;
      flex: 1.5;

      .filter.align-checkbox {
        margin-left: 10px;
        flex-basis: 160px;
        margin-top: 12px;
      }

      @include respond-to(desktop) {
        margin-top: 0;
        flex-grow: 0;
        flex-shrink: 0;
        flex-basis: 365px;

        .filter.align-checkbox {
          margin-left: 20px;
          margin-top: 0px;
        }
      }

      label[for='only-abstracts']::after,
      label[for='only-with-votes']::after {
        content: '';
        display: inline-block;
        width: 20px;
        height: 20px;
        margin: -5px 0 -5px 5px;
        background-repeat: no-repeat;
        background-position: center;
      }

      label[for='only-abstracts']::after {
        background-image: url('#{icon-abstract($font-default)}');
        background-size: 17px;
      }

      label[for='only-with-votes']::after {
        background-image: url('#{icon-votes($font-default)}');
        background-size: 19px;
      }
    }
  }
}
</style>
