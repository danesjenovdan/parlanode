<template>
  <card-wrapper :header-config="headerConfig" :og-config="ogConfig">
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
    return {
      card: {
        currentPage: 1,
        isLoading: false,
      },
      legislation: this.cardData.data?.results || [],
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
    background: $white-hover;
    height: 100%;
    left: 0;
    position: absolute;
    top: 0;
    width: 100%;

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
