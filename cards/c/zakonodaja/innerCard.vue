<template>
  <card-wrapper
    :card-url="generatedCardUrl"
    :header-config="headerConfig"
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

export default {
  name: 'SeznamZakonovKartica',
  components: {
    SortableTable,
  },
  mixins: [common],
  props: {
    headerConfig: Object,
    columns: Array,
    items: Array,
    currentSort: String,
    currentSortOrder: String,
    selectSort: Function,
    generatedCardUrl: String,
  },
  computed: {
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
        vObravnavi: {
          icon: 'v-obravnavi',
          name: this.$t('vote-under-consideration'),
        },
      };

      return this.items.map((legislation) => {
        let mapKey = legislation.result;
        if (!mapKey) {
          mapKey = 'vObravnavi';
        }

        const outcomeHtml = `<div class="outcome"><i class="glyphicon ${mapResultIcon[mapKey].icon}"></i><div class="text">${mapResultIcon[mapKey].name}</div></div>`;

        return [
          { html: `<a href="${this.slugs.legislationLink}${legislation.epa}" class="funblue-light-hover">${legislation.text}</a>` },
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
  color: $grey-medium;
  font-style: normal !important;
}

.legislation-list {

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
        background: url('https://cdn.parlameter.si/v1/parlassets/icons/v-obravnavi.svg');
        background-size: contain !important;
        background-repeat: no-repeat;
      }
    }
  }
}
</style>
