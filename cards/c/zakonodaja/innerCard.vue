<template>
  <card-wrapper
    class="card-halfling card-seznam-zakonov"
    :card-url="generatedCardUrl"
    :header-config="headerConfig"
  >
    <div slot="info">
      <p class="info-text lead" v-t="'info.lead'"></p>
      <p class="info-text heading" v-t="'info.methodology'"></p>
      <p class="info-text">
        <span v-t="'info.text'"></span>
        <template v-for="infoLink in $t('info.links')">
          {{ ' ' }}
          <a :key="infoLink.text" :href="infoLink.link" v-t="infoLink.text"></a>
          {{ ' ' }}
        </template>
      </p>
    </div>

    <sortable-table
      class="legislation-list"
      :columns="columns"
      :items="mappedItems"
      :sort="currentSort"
      :sort-order="currentSortOrder"
      :sort-callback="selectSort"
    />
  </card-wrapper>
</template>

<script>
import SortableTable from 'components/SortableTable.vue';
import common from 'mixins/common';

export default {
  components: {
    SortableTable,
  },
  mixins: [common],
  name: 'SeznamZakonovKartica',
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
