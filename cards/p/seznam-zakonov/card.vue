<template>
  <div v-if="$options.cardData.state && $options.cardData.state.generator" class="row legislation-list">
    <div class="col-md-12 filters">
      <div class="button-filters">
        <striped-button
          v-for="(filter, index) in filters"
          @click.native="selectFilter(filter)"
          color="sds"
          :key="index"
          :selected="filter === currentFilter"
          :small-text="filter"
        />
      </div>

        <search-field v-model="textFilter"></search-field>

        <search-dropdown class="dropdown-filter" :items="allworkingBodies" :placeholder="inputPlaceholder"></search-dropdown>
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
  .legislation-list {

    .filters {
      display: flex;
      padding: 0;
    }

    .button-filters {

    }
  }
</style>
