<template>
  <card-wrapper :header-config="headerConfig">
    <div class="legislation-list">
      <scroll-shadow ref="shadow">
        <div
          v-infinite-scroll="loadMore"
          class="legislation-table-shadow"
          @scroll="$refs.shadow.check($event.currentTarget)"
        >
          <sortable-table :columns="columns" :items="mappedItems" />
        </div>
        <div v-if="card.isLoading" class="nalagalnik__wrapper">
          <div class="nalagalnik"></div>
        </div>
      </scroll-shadow>
    </div>
  </card-wrapper>
</template>

<script>
import axios from 'axios';
import SortableTable from '@/_components/SortableTable.vue';
import ScrollShadow from '@/_components/ScrollShadow.vue';
import common from '@/_mixins/common.js';
import { searchTitle } from '@/_mixins/titles.js';
import { searchHeader } from '@/_mixins/altHeaders.js';
import { searchOgImage } from '@/_mixins/ogImages.js';
import links from '@/_mixins/links.js';
import infiniteScroll from '@/_directives/infiniteScroll.js';
import legislationStatus from '@/_helpers/legislationStatus.js';

export default {
  name: 'CardSearchLegislation',
  directives: {
    infiniteScroll,
  },
  components: {
    SortableTable,
    ScrollShadow,
  },
  mixins: [common, searchTitle, searchHeader, searchOgImage, links],
  cardInfo: {
    doubleWidth: true,
  },
  data() {
    const { cardData } = this.$root.$options.contextData;

    return {
      card: {
        currentPage: 1,
        isLoading: false,
      },
      legislation: cardData?.data?.results || [],
    };
  },
  computed: {
    columns() {
      return [
        { id: 'name', label: this.$t('name'), additionalClass: 'small-text' },
        // { id: 'epa', label: this.$t('epa'), additionalClass: 'small-text' },
        {
          id: 'result',
          label: this.$t('status'),
          additionalClass: 'small-text',
        },
      ];
    },
    mappedItems() {
      return this.processedData.map((legislation) => {
        const status = legislationStatus(legislation.status);

        const outcomeHtml = `<div class="outcome"><i class="parlaicon ${
          status.iconClass
        }"></i><div class="text">${this.$t(status.translationKey)}</div></div>`;

        return [
          {
            html: `<a href="${this.getLegislationLink(
              legislation
            )}" class="funblue-light-hover">${legislation.text}</a>`,
          },
          // { text: legislation.act_id != null ? legislation.act_id : '' },
          { html: outcomeHtml },
        ];
      });
    },
    processedData() {
      return this.legislation;
    },
    searchUrl() {
      const url = new URL(this.cardData.url);
      url.searchParams.set('page', this.card.currentPage);
      return url.toString();
    },
  },
  methods: {
    loadMore() {
      if (this.card.isLoading) {
        return;
      }
      if (this.legislation.length >= this.cardData.data?.count) {
        return;
      }

      this.card.isLoading = true;
      this.card.currentPage += 1;

      const requestedPage = this.card.currentPage;
      axios.get(this.searchUrl).then((response) => {
        if (response?.data?.page === requestedPage) {
          const newLegislation = response?.data?.results || [];
          this.legislation.push(...newLegislation);
        }
        this.card.isLoading = false;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import 'parlassets/scss/breakpoints';
@import 'parlassets/scss/colors';

.legislation-list {
  .legislation-table-shadow {
    overflow-y: auto;
    overflow-x: hidden;
    height: $full-card-height;
  }

  .nalagalnik__wrapper {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: $white-hover;
    z-index: 4;

    .nalagalnik {
      position: absolute;
      top: calc(50% - 50px);
    }
  }
}

.legislation-list :deep(.legislation-table-shadow) {
  ul {
    padding: 0;

    // .column:last-child {
    //   margin-left: 8px;
    // }

    .column {
      font-size: 16px;

      a {
        padding: 0.2em 0;
      }

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

      .outcome .text {
        @include respond-to(mobile) {
          font-size: 14px !important;
        }
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
  }
}
</style>
