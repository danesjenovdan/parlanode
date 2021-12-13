<template>
  <sortable-table
    :columns="columns"
    :items="mappedItems"
    :sort="currentSort"
    :sort-order="currentSortOrder"
    :sort-callback="selectSort"
    class="legislation-list"
  />
</template>

<script>
import SortableTable from '@/_components/SortableTable.vue';
import links from '@/_mixins/links.js';
import dateFormatter from '@/_helpers/dateFormatter.js';
import legislationStatus from '@/_helpers/legislationStatus.js';

export default {
  name: 'SeznamZakonovKartica',
  components: {
    SortableTable,
  },
  mixins: [links],
  props: {
    columns: {
      type: Array,
      default: () => [],
    },
    items: {
      type: Array,
      default: () => [],
    },
    currentSort: {
      type: String,
      default: '',
    },
    currentSortOrder: {
      type: String,
      default: '',
    },
    selectSort: {
      type: Function,
      default: () => {},
    },
  },
  computed: {
    mappedItems() {
      return this.items.map((legislation) => {
        const status = legislationStatus(legislation.status);

        const outcomeHtml = `<div class="outcome"><i class="parlaicon ${
          status.iconClass
        }"></i><div class="text">${this.$t(status.translationKey)}</div></div>`;

        // const dataIconsHtml = `
        //   <div class="data-icons">
        //     <i class="parlaicon icon-abstract ${
        //       legislation.abstractVisible ? 'icon-show' : 'icon-hide'
        //     }"></i>
        //     <i class="parlaicon icon-votes ${
        //       legislation.hasVotes ? 'icon-show' : 'icon-hide'
        //     }"></i>
        //   </div>
        // `;

        return [
          {
            html: `<a href="${this.getLegislationLink(
              legislation
            )}" class="funblue-light-hover">${legislation.text}</a>`,
          },
          // { html: dataIconsHtml },
          // { text: legislation.epa },
          { text: dateFormatter(legislation.timestamp || '') || 'N/A' },
          { html: outcomeHtml },
        ];
      });
    },
  },
};
</script>

<!-- TODO: move this global style in to the scoped style block -->
<style lang="scss">
@import 'parlassets/scss/colors';
@import 'parlassets/scss/breakpoints';

.legislation-list {
  .column:last-child {
    margin-left: 8px;
  }

  .narrow {
    flex: 0.5 !important;
  }

  .data-icons {
    i.parlaicon {
      position: relative;

      &.icon-hide {
        display: none;
      }

      &.icon-show + .icon-show {
        margin-left: 10px;

        &::before {
          content: '';
          border-left: 1px solid $font-placeholder;
          position: absolute;
          top: 0;
          bottom: 0;
          left: -5px;
        }
      }

      &.icon-abstract {
        width: 20px !important;
        height: 25px;
        background: url('#{get-parlassets-url()}/icons/abstract.svg');
        background-size: contain !important;
        background-repeat: no-repeat;
        background-position: center;
      }

      &.icon-votes {
        width: 27px !important;
        height: 25px;
        background: url('#{get-parlassets-url()}/icons/votes.svg');
        background-size: contain !important;
        background-repeat: no-repeat;
        background-position: center;
      }
    }
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
        background: url('#{get-parlassets-url()}/icons/v-obravnavi.svg');
        background-size: contain !important;
        background-repeat: no-repeat;
      }
    }
  }
}
</style>
