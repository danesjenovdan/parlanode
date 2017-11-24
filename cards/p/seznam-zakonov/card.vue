<template>
  <div class="row legislation-list">
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

        <search-dropdown class="dropdown-filter" :items="workingBodies" :placeholder="inputPlaceholder"></search-dropdown>
    </div>

    <div class="col-md-12">
      <inner-card
        :header-config="headerConfig"
        :columns="columns"
        :current-sort="currentSort"
        :current-sort-order="currentSortOrder"
        :info-text="infoText"
        :generated-card-url="generatedCardUrl"
      />
    </div>
  </div>


  <!--<card-wrapper-->
    <!--class="card-halfling card-IME_KARTICE"-->
    <!--:id="$options.cardData.cardData._id"-->
    <!--:card-url="url"-->
    <!--:header-config="headerConfig">-->



    <!--<div slot="info">-->
      <!--<p class="info-text lead"></p>-->
      <!--<p class="info-text heading">METODOLOGIJA</p>-->
      <!--<p class="info-text"></p>-->
    <!--</div>-->

    <!--<div class="row">-->
      <!--<div class="col-md-12 filters">-->
        <!--<ul class="button-filters">-->
          <!--<striped-button-->
                  <!--v-for="(filter, index) in filters"-->
                  <!--@click.native="selectFilter(filter)"-->
                  <!--color="sds"-->
                  <!--:key="index"-->
                  <!--:selected="filter === currentFilter"-->
                  <!--:small-text="filter"-->
          <!--/>-->

          <!--<search-field v-model="textFilter"></search-field>-->

          <!--<search-dropdown class="dropdown-filter" :items="workingBodies" :placeholder="inputPlaceholder"></search-dropdown>-->
        <!--</ul>-->
      <!--</div>-->
    <!--</div>-->

    <!--&lt;!&ndash; Card content goes here &ndash;&gt;-->
  <!--</card-wrapper>-->
</template>

<script>
import common from 'mixins/common';
import StripedButton from 'components/StripedButton.vue';
import SearchField from 'components/SearchField.vue';

import InnerCard from './innerCard.vue';

export default {
  components: { StripedButton, SearchField, InnerCard },
  mixins: [common],
  name: 'SeznamZakonov',
  data() {
    return {
      data: this.$options.cardData.data,
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
    };
  },
  computed: {
      inputPlaceholder() {
          return this.workingBodies.length ? `izbranih: ${this.workingBodies.length}` : 'izberi';
      },
      columns: () => [
          { id: 'image', label: '', additionalClass: 'image' },
          { id: 'name', label: 'Ime', additionalClass: 'wider name' },
          { id: 'date', label: 'Začetek' },
          { id: 'updated', label: 'Sprememba', additionalClass: 'optional' },
          { id: 'workingBody', label: 'Organizacija', additionalClass: 'wider optional' },
      ],
      infoText: () => {
          return "Info";
      },
      generatedCardUrl() {
          return 'f';
      }
  },
  methods: {
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
