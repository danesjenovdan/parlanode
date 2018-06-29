<template>
  <card-wrapper
    :id="$options.cardData.cardData._id"
    :card-url="generatedCardUrl"
    :header-config="headerConfig"
  >
    <div slot="info">
      <p v-t="'info.lead'" class="info-text lead"></p>
      <p v-t="'info.methodology'" class="info-text heading"></p>
      <p v-t="'info.text'" class="info-text"></p>
    </div>

    <div class="legislation-list">
      <scroll-shadow ref="shadow">
        <div id="card-search" @scroll="$refs.shadow.check($event.currentTarget)">
          <sortable-table
            :columns="columns"
            :items="mappedItems"
            :sort="currentSort"
            :sort-order="currentSortOrder"
            :sort-callback="selectSort"
            class=""
          />
        </div>
      </scroll-shadow>
    </div>
  </card-wrapper>
</template>

<script>
import SortableTable from 'components/SortableTable.vue';
import ScrollShadow from 'components/ScrollShadow.vue';
import common from 'mixins/common';
import { searchTitle } from 'mixins/titles';

export default {
  name: 'ZakonodajaIskanje',
  components: {
    SortableTable,
    ScrollShadow,
  },
  mixins: [
    common,
    searchTitle,
  ],
  data() {
    const keywords = this.$options.cardData.data.responseHeader.params.q.split('content_t:')[1].split(')')[0];
    return {
      data: this.$options.cardData.data.response.docs,
      currentSort: '',
      currentSortOrder: 'DESC',
      workingBodies: [],
      headerConfig: {
        circleIcon: 'og-search',
        heading: keywords,
        subheading: 'iskalni niz',
        alternative: this.$options.cardData.cardData.altHeader === 'true',
        title: this.$options.cardData.cardData.name,
      },
      keywords,
    };
  },
  computed: {
    columns: () => [
      { id: 'name', label: this.$t('name'), additionalClass: 'small-text' },
      { id: 'epa', label: this.$t('epa'), additionalClass: 'small-text' },
      { id: 'result', label: this.$t('status'), additionalClass: 'small-text' },
    ],
    generatedCardUrl() {
      const state = { text: this.keywords };
      const searchUrl = `${this.slugs.urls.isci}/l/${this.keywords}`;
      return `${this.url}?state=${encodeURIComponent(JSON.stringify(state))}&altHeader=true&customUrl=${encodeURIComponent(searchUrl)}`;
    },
    mappedItems() {
      const mapResultIcon = {
        sprejet: {
          icon: 'glyphicon-ok',
          name: this.$t('vote-passed'),
        },
        zavrnjen: {
          icon: 'glyphicon-remove',
          name: this.$t('vote-not-passed'),
        },
        v_obravnavi: {
          icon: 'v-obravnavi',
          name: this.$t('vote-under-consideration'),
        },
      };

      return this.processedData.map((legislation) => {
        let mapKey = typeof legislation.result !== 'undefined' ? legislation.result[0] : null;
        if (!mapKey) {
          mapKey = 'v_obravnavi';
        }

        const outcomeHtml = `<div class="outcome"><i class="glyphicon ${mapResultIcon[mapKey].icon}"></i><div class="text">${mapResultIcon[mapKey].name}</div></div>`;
        return [
          { html: `<a href="${this.slugs.legislationLink}${legislation.id}" class="funblue-light-hover">${legislation.text_t[0]}</a>` },
          { text: typeof legislation.id !== 'undefined' ? legislation.id : '' },
          { html: outcomeHtml },
        ];
      });
    },
    processedData() {
      const dataCopy = this.data.slice();
      const sortedLegislation = dataCopy.sort((A, B) => {
        let a;
        let b;

        switch (this.currentSort) {
          case 'name':
            a = A.text_t[0];
            b = B.text_t[0];
            return a.toLowerCase().localeCompare(b.toLowerCase(), 'sl');
          case 'epa':
            a = typeof A.id !== 'undefined' ? A.id : '';
            b = typeof B.id !== 'undefined' ? B.id : '';
            return parseInt(a, 10) - parseInt(b, 10);
          case 'result':
            a = 'v obravnavi';
            b = 'v obravnavi';
            if (typeof A.result !== 'undefined') a = A.result[0];
            if (typeof B.result !== 'undefined') b = B.result[0];
            return a.toLowerCase().localeCompare(b.toLowerCase(), 'sl');
          default:
            return 0;
        }
      });

      if (this.currentSortOrder === 'desc') {
        sortedLegislation.reverse();
      }

      return sortedLegislation;
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

<style lang="scss" scoped>
@import '~parlassets/scss/breakpoints';
@import '~parlassets/scss/colors';

#card-search {
  overflow-y: auto;
  overflow-x: hidden;
  height: 420px;
}

.card-content {
  padding: 0;
}

.legislation-list /deep/ {
  ul {
    padding: 0;
  }

  a {
    color: #009cda;
  }

  .headers {
    padding: 0 20px 10px;
    margin-left: -20px;
    margin-right: -20px;
  }

  .item .column {
    &:first-child {
      font-family: "Roboto Slab", sans-serif;
    }
  }

  .column {
    font-size: 16px;

    @include respond-to(desktop) {
      font-size: 18px;
    }

    &:nth-child(2) {
      @include respond-to(mobile) {
        display: none;
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

  .column:last-child {
    margin-left: 8px;
  }

  .narrow {
    flex: 0.5 !important;
  }

  .outcome {
    margin-right: 0;

    .text {
      @include respond-to(mobile) {
        font-size: 14px !important;
      }
    }

    i {
      &.glyphicon-ok {
        width: 34px !important;
        height: 28px;
      }

      &.glyphicon-remove {
        width: 28px;
        height: 27px;
      }

      &.v-obravnavi {
        width: 38px !important;
        height: 38px;
        background: url('https://cdn.parlameter.si/v1/parlassets/icons/v-obravnavi.svg');
        background-size: contain !important;
        background-repeat: no-repeat;
      }
    }
  }
}
</style>
