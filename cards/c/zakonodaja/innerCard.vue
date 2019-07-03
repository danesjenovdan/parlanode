<template>
  <card-wrapper
    :card-url="generatedCardUrl"
    :header-config="headerConfig"
    :og-config="ogConfig"
    class="card-halfling card-seznam-zakonov"
  >
    <div slot="info">
      <p v-t="'info.lead'" class="info-text lead"></p>
      <p v-t="'info.methodology'" class="info-text heading"></p>
      <p class="info-text">
        <span v-t="'info.text'"></span>
        <template v-for="infoLink in $t('info.links')">
          {{ ' ' }}
          <a v-t="infoLink.text" :key="infoLink.text" :href="infoLink.link"></a>
          {{ ' ' }}
        </template>
      </p>
    </div>

    <sortable-table
      :columns="columns"
      :items="mappedItems"
      :sort="currentSort"
      :sort-order="currentSortOrder"
      :sort-callback="selectSort"
      class="legislation-list"
    />
  </card-wrapper>
</template>

<script>
import SortableTable from 'components/SortableTable.vue';
import common from 'mixins/common';
import links from 'mixins/links';

export default {
  name: 'SeznamZakonovKartica',
  components: {
    SortableTable,
  },
  mixins: [
    common,
    links,
  ],
  props: {
    headerConfig: {
      type: Object,
      default: () => ({}),
    },
    ogConfig: {
      type: Object,
      default: null,
    },
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
    generatedCardUrl: {
      type: String,
      default: '',
    },
  },
  computed: {
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

      return this.items.map((legislation) => {
        let mapKey = legislation.result;
        if (!mapKey) {
          mapKey = 'in_procedure';
        }

        const outcomeHtml = `<div class="outcome"><i class="parlaicon ${mapResultIcon[mapKey].icon}"></i><div class="text">${mapResultIcon[mapKey].name}</div></div>`;
        const dataIconsHtml = `
          <div class="data-icons">
            <i class="parlaicon icon-abstract ${legislation.abstractVisible ? 'icon-show' : 'icon-hide'}"></i>
            <i class="parlaicon icon-votes ${legislation.hasVotes ? 'icon-show' : 'icon-hide'}"></i>
          </div>
        `;

        return [
          { html: `<a href="${this.getLegislationLink(legislation)}" class="funblue-light-hover">${legislation.text}</a>` },
          { html: dataIconsHtml },
          { text: legislation.epa },
          { text: legislation.date },
          { html: outcomeHtml },
        ];
      });
    },
  },
};
</script>

<style lang="scss">
@import '~parlassets/scss/colors';
@import '~parlassets/scss/breakpoints';

.empty-dataset {
  color: $font-placeholder;
  font-style: normal !important;
}

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
        background: url("#{getConfig('urls.cdn')}/icons/abstract.svg");
        background-size: contain !important;
        background-repeat: no-repeat;
        background-position: center;
      }

      &.icon-votes {
        width: 27px !important;
        height: 25px;
        background: url("#{getConfig('urls.cdn')}/icons/votes.svg");
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
        font-size:14px !important;
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
