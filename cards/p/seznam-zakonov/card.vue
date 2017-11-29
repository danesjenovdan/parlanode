<template>
  <div v-if="$options.cardData.state && $options.cardData.state.generator" class="row legislation-list">
    <div class="session-list-generator">
      <div class="col-md-12 filters">
        <ul class="button-filters">
          <striped-button
                  v-for="(filter, index) in filters"
                  @click.native="selectFilter(filter)"
                  color="sds"
                  :key="index"
                  :selected="filter === currentFilter"
                  :small-text="filter"
          />
        </ul>

        <div class="filter text-filter">
          <div class="filter-label">Išči po naslovu ali povzetku</div>
          <search-field v-model="textFilter"></search-field>
        </div>

        <div class="filter tag-dropdown">
          <div class="filter-label">Matično delovno telo</div>
          <search-dropdown class="dropdown-filter" :items="allworkingBodies" :placeholder="inputPlaceholder"></search-dropdown>
        </div>


      </div>

      <div class="col-md-12">
        <inner-card
                :header-config="headerConfig"
                :columns="columns"
                :items="processedData"
                :current-sort="currentSort"
                :current-sort-order="currentSortOrder"
                :select-sort="selectSort"
                :info-text="infoText"
                :generated-card-url="generatedCardUrl"
        />
      </div>
    </div>
  </div>
  <inner-card
          v-else
          :header-config="headerConfig"
          :columns="columns"
          :items="processedData"
          :current-sort="currentSort"
          :current-sort-order="currentSortOrder"
          :select-sort="selectSort"
          :info-text="infoText"
          :generated-card-url="generatedCardUrl"
  />

</template>

<script>
  import common from 'mixins/common';
  import StripedButton from 'components/StripedButton.vue';
  import SearchField from 'components/SearchField.vue';
  import SearchDropdown from 'components/SearchDropdown.vue';

  import InnerCard from './innerCard.vue';

  export default {
    components: { StripedButton, SearchField, InnerCard, SearchDropdown },
    mixins: [common],
    name: 'SeznamZakonov',
    data() {

      let allworkingBodies = this.$options.cardData.data.results.map(x => x.mdt).filter((x) => x.length);
      allworkingBodies = allworkingBodies.map(
        wb => ({ id: wb, label: wb, selected: false})
      );
      allworkingBodies = allworkingBodies.map(JSON.stringify).reverse().filter(function (e, i, a) {
        return a.indexOf(e, i+1) === -1;
      }).reverse().map(JSON.parse)


      return {
        data: this.$options.cardData.data.results,
        filters: ['Zakoni', 'Akti'],
        currentFilter: this.$options.cardData.state.filter || 'Zakoni',
        currentSort: 'date',
        currentSortOrder: 'desc',
        textFilter: '',
        workingBodies: [],
        headerConfig: {
          circleIcon: 'og-list',
          heading: '&nbsp;',
          alternative: this.$options.cardData.cardData.altHeader === 'true',
          title: this.$options.cardData.cardData.name,
        },
        allworkingBodies,
      };
    },
    computed: {
      inputPlaceholder() {
        return this.workingBodies.length ? `izbranih: ${this.workingBodies.length}` : 'izberi';
      },
      columns: () => [
        { id: 'name', label: 'Ime', additionalClass: '' },
        { id: 'date', label: 'Sprememba' },
        { id: 'updated', label: 'Matično delovno telo', additionalClass: '' },
        { id: 'workingBody', label: 'Status', additionalClass: '' },
      ],
      infoText: () => {
        return "Info";
      },
      generatedCardUrl() {
        return 'f';
      },
      processedData () {
        const filterLegislation = (legislation) => {
          const textMatch = this.textFilter === '' || legislation.text.toLowerCase().indexOf(this.textFilter.toLowerCase()) > -1;

          return textMatch;
        }

        return this.data.filter(filterLegislation);
      }
    },
    methods: {
      selectSort(sortId) {
        if (this.currentSort === sortId) {
          this.currentSortOrder = this.currentSortOrder === 'asc' ? 'desc' : 'asc';
        } else {
          this.currentSort = sortId;
          this.currentSortOrder = 'asc';
        }

        // this.measurePiwik('', sortId, this.currentSortOrder);
      },
      selectFilter(filter) {
        this.currentFilter = filter;
        // this.measurePiwik(filter, '', '');
      },
      measurePiwik(filter, sort, order) {
        if (typeof measure === 'function') {
          if (sort !== '') {
            measure('s', 'session-sort', `${sort} ${order}`, '');
          } else if (filter !== '') {
            measure('s', 'session-filter', filter, '');
          }
        }
      },
    },
  };
</script>

<style lang="scss" scoped>
  @import '~parlassets/scss/breakpoints';
  @import '~parlassets/scss/colors';

  .legislation-list {
    .dropdown-filter.search-dropdown { height: 51px; }

    .headers{
      margin: 0 !important;
    }

    .filters {
      .dropdown-filter {
        @include respond-to(desktop) { margin-left: 10px; }

        margin-right: 0;
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

      .tag-dropdown {
        @include respond-to(desktop) { width: 26%; }

        width: 100%;
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

    }
  }

  .button-filters {
    .striped-button {
      background-color: #f0f0f0;
    }
  }

</style>
