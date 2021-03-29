<template>
  <card-wrapper
    :id="$options.cardData.mountId"
    :content-class="{ 'is-loading': loading }"
    :card-url="generatedCardUrl"
    :header-config="headerConfig"
    :og-config="ogConfig"
  >
    <template #info>
      <p v-t="'info.lead'" class="info-text lead"></p>
      <p v-t="'info.methodology'" class="info-text heading"></p>
      <p v-t="'info.text'" class="info-text"></p>
    </template>

    <div class="legislation-list">
      <scroll-shadow ref="shadow">
        <div
          id="card-search"
          @scroll="$refs.shadow.check($event.currentTarget)"
        >
          <sortable-table
            v-if="!loading"
            :columns="columns"
            :items="mappedItems"
            :sort="currentSort"
            :sort-order="currentSortOrder"
            :sort-callback="selectSort"
          />
        </div>
      </scroll-shadow>
    </div>
  </card-wrapper>
</template>

<script>
import axios from 'axios';
import SortableTable from '@/_components/SortableTable.vue';
import ScrollShadow from '@/_components/ScrollShadow.vue';
import common from '@/_mixins/common';
import { searchTitle } from '@/_mixins/titles';
import { searchHeader } from '@/_mixins/altHeaders';
import { searchOgImage } from '@/_mixins/ogImages';
import links from '@/_mixins/links';
import stateLoader from '@/_helpers/stateLoader';

export default {
  name: 'ZakonodajaIskanje',
  components: {
    SortableTable,
    ScrollShadow,
  },
  mixins: [common, searchTitle, searchHeader, searchOgImage, links],
  data() {
    const loadFromState = stateLoader(this.$options.cardData.parlaState);
    return {
      data: [],
      currentSort: '',
      currentSortOrder: 'DESC',
      workingBodies: [],
      keywords: loadFromState('query'),
      loading: true,
      error: false,
    };
  },
  computed: {
    columns() {
      return [
        { id: 'name', label: this.$t('name'), additionalClass: 'small-text' },
        { id: 'epa', label: this.$t('epa'), additionalClass: 'small-text' },
        {
          id: 'result',
          label: this.$t('status'),
          additionalClass: 'small-text',
        },
      ];
    },
    generatedCardUrl() {
      const state = { query: this.keywords };
      return `${this.url}?state=${encodeURIComponent(
        JSON.stringify(state)
      )}&altHeader=true`;
    },
    mappedItems() {
      const mapResultIcon = {
        enacted: {
          icon: 'vote-result--enacted',
          name: this.$t('vote-result--enacted'),
        },
        adopted: {
          icon: 'vote-result--adopted',
          name: this.$t('vote-result--adopted'),
        },
        rejected: {
          icon: 'vote-result--rejected',
          name: this.$t('vote-result--rejected'),
        },
        retracted: {
          icon: 'vote-result--retracted',
          name: this.$t('vote-result--retracted'),
        },
        submitted: {
          icon: 'vote-result--submitted',
          name: this.$t('vote-result--submitted'),
        },
        received: {
          icon: 'vote-result--received',
          name: this.$t('vote-result--received'),
        },
        in_procedure: {
          icon: 'vote-result--in_procedure',
          name: this.$t('vote-result--in_procedure'),
        },
      };

      return this.processedData.map((legislation) => {
        const mapKey = legislation.status || 'in_procedure';
        const outcomeHtml = `<div class="outcome"><i class="parlaicon ${mapResultIcon[mapKey].icon}"></i><div class="text">${mapResultIcon[mapKey].name}</div></div>`;

        return [
          {
            html: `<a href="${this.getLegislationLink(
              legislation
            )}" class="funblue-light-hover">${legislation.title}</a>`,
          },
          { text: legislation.act_id != null ? legislation.act_id : '' },
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
            a = this.$t('vote-under-consideration');
            b = this.$t('vote-under-consideration');
            if (typeof A.result !== 'undefined') {
              a = A.result[0];
            }
            if (typeof B.result !== 'undefined') {
              b = B.result[0];
            }
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
  mounted() {
    const searchUrl = `${
      this.slugs.urls.isci
    }/search/legislation?q=${encodeURIComponent(this.keywords)}`;
    axios
      .get(searchUrl)
      .then((res) => {
        this.data = (res.data.response && res.data.response.docs) || [];
        this.loading = false;
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.error(error);
        this.loading = false;
        this.error = true;
      });
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
    selectFilter(filter) {
      this.currentFilter = filter;
    },
  },
};
</script>

<style lang="scss" scoped>
@import 'parlassets/scss/breakpoints';
@import 'parlassets/scss/colors';

#card-search {
  overflow-y: auto;
  overflow-x: hidden;
  height: 420px;
}

.card-content {
  padding: 0;
}

.legislation-list ::v-deep {
  ul {
    padding: 0;
  }

  a {
    color: $second;
  }

  .headers {
    padding: 0 20px 10px;
    margin-left: -20px;
    margin-right: -20px;
  }

  .item .column {
    &:first-child {
      font-family: 'Roboto Slab', sans-serif;
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
        background: url("#{getConfig('urls.cdn')}/icons/v-obravnavi.svg");
        background-size: contain !important;
        background-repeat: no-repeat;
      }
    }
  }
}
</style>
