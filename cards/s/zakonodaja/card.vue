<template>
  <card-wrapper
    class="card-halfling card-IME_KARTICE"
    :id="$options.cardData.cardData._id"
    :card-url="generatedCardUrl"
    :header-config="headerConfig">

    <div slot="info">
      <p class="info-text lead"></p>
      <p class="info-text heading">METODOLOGIJA</p>
      <p class="info-text"></p>
    </div>

    <sortable-table
      class="session-list"
      :columns="columns"
      :items="sortedLaws"
      :sort="currentSort"
      :sort-order="currentSortOrder"
      :sort-callback="selectSort"
    />
  </card-wrapper>
</template>

<script>
import common from 'mixins/common';
import SortableTable from 'components/SortableTable.vue';

export default {
  components: {
    SortableTable,
  },

  mixins: [common],

  name: 'ImeKartice',

  data() {
    return {
      data: this.$options.cardData.data,
      headerConfig: {
        circleIcon: 'og-list',
        heading: '&nbsp;',
        subheading: '7. sklic parlamenta',
        alternative: this.$options.cardData.cardData.altHeader === 'true',
        title: this.$options.cardData.cardData.name,
      },

      currentSort: 'name',
      currentSortOrder: 'desc',
    };
  },

  computed: {
    columns: () => [
      { id: 'name', label: 'Zakon', additionalClass: 'wider name text-left' },
      { id: 'workingBody', label: 'Matično delovno telo', additionalClass: 'wider optional text-left padme' },
      { id: 'state', label: 'Status', additionalClass: 'state text-left' },
    ],

    laws() {
      return this.data.results.map((e) => {
        let resultHTML;
        const result = e.result ? e.result : this.makeRandomResult();

        switch(result) {
          case 1:
            resultHTML = `<i class="glyphicon glyphicon-ok"></i><div class="text">Sprejet</div>`;
            break;
          case 2:
            resultHTML = `<div class="v-obravnavi"></div><div class="text">V obravnavi</div>`;
            break;
          case -1:
            resultHTML = `<i class="glyphicon glyphicon-remove"></i><div class="text">Zavrnjen</div>`;
            break;
        }

        return {
          text: e.text,
          mdt: e.mdt,
          result: result,
          resultHTML: resultHTML,
        };
      });
    },

    sortedLaws() {
      let sorted = this.laws;

      // we don't switch in Array.sort() because #optimisation
      switch(this.currentSort) {
        case 'name':
          sorted = this.laws.sort((a, b) => {
            return a.text.localeCompare(b.text);
          });
          break;

        case 'workingBody':
          sorted = this.laws.sort((a, b) => {
            return (a.mdt || '').localeCompare(b.mdt || '');
          });
          break;
        
        case 'state': // 1. v obravnavi, 2. sprejet, 3. zavrnjen
          sorted = this.laws.sort((a, b) => {
            return a.result - b.result;
          });
          break;
      }
      sorted = sorted.map(e => [
        { link: 'https://www.google.com', text: e.text },
        { text: e.mdt || 'Manjka MDT' },
        { text: e.result, html: e.resultHTML }
      ]);

      return this.currentSortOrder === 'asc' ? sorted : sorted.reverse();
    },

    generatedCardUrl() {
      return `${this.url}${this.data.session.id}?p=np`;
    }
  },

  methods: {
    makeRandomResult() {
      const myRandom = Math.random();
      if (myRandom > 0.66) {
        return 1;
      } else if (myRandom > 0.33) {
        return -1;
      } else {
        return 2;
      }
    },

    selectSort(sortId) {
      if (this.currentSort === sortId) {
        this.currentSortOrder = this.currentSortOrder === 'asc' ? 'desc' : 'asc';
      } else {
        this.currentSort = sortId;
        this.currentSortOrder = 'asc';
      }

      this.measurePiwik('', sortId, this.currentSortOrder);
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

  mounted() {
    console.log(this.$options.cardData);
  },
};
</script>

<style lang="scss">
@import '~parlassets/scss/colors';
@import '~parlassets/scss/breakpoints';

.headers {
  margin-left: 0 !important;

  .state {
    @include respond-to(mobile) {
      text-align: center !important;
    }
  }
}
.text-left {
  text-align: left !important;
}

.item {
  .state {
    white-space: nowrap;

    .glyphicon {
      font-size: 30px;
    }
    .glyphicon-ok {
      color: $funblue;
    }
    .glyphicon-remove {
      color: $red;
    }
    .v-obravnavi {
      width: 30px;
      height: 30px;
      display: inline-block;
      background-image: url('https://cdn.parlameter.si/v1/parlassets/icons/v-obravnavi.svg');
    }
    .text {
      margin-left: 10px;
      top: -8px;
      position: relative;
      display: inline-block;

      @include respond-to(mobile) {
        display: none;
      }
    }

    @include respond-to(mobile) {
      text-align: center !important;
    }
  }

  .padme {
    padding-left: 20px;
    padding-right: 20px;
  }
}
</style>
