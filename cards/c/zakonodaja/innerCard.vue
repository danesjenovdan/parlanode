<template>
  <card-wrapper
    class="card-halfling card-seznam-zakonov"
    :card-url="generatedCardUrl"
    :header-config="headerConfig">

    <div slot="info" v-html="infoText"></div>

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
import formatDate from 'helpers/dateFormatter';
import { ICONS_ROOT_URL, ORGS_ROOT_URL } from 'components/constants';

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
    infoText: String,
    generatedCardUrl: String,
  },
  computed: {
      mappedItems () {
          const mapResultIcon = {
            "sprejet": {
              "icon": "glyphicon-ok",
              "name": "Sprejet"
            },
            "zavrnjen": {
              "icon": "glyphicon-remove",
              "name": "Zavrnjen"
            },
            "v obravnavi": {
              "icon": "v-obravnavi",
              "name": "V obravnavi"
            }
          };

          return this.items.map(legislation => {
            let mapKey = legislation.result;
            if (!mapKey) {
              mapKey = 'v obravnavi';
            }

            const outcomeHtml = `<div class="outcome"><i class="glyphicon ${mapResultIcon[mapKey].icon}"></i><div class="text">${mapResultIcon[mapKey].name}</div></div>`;

            return [
              {html: `<a href="${this.slugs.legislationLink}${legislation.epa}" class="funblue-light-hover">${legislation.text}</a>`},
              {text: legislation.epa},
              {text: legislation.date},
              // {html: `<a href="${ORGS_ROOT_URL}${legislation.mdt.id}?frame=true&altHeader=true" class="funblue-light-hover">${legislation.mdt.name}</a>`},
              {html: outcomeHtml},
            ];
          })
      }
  },
  // methods: {
  //   getSessionUrl(session) {
  //     if (!this.slugs || session.link_to === 'nothing') return '';
  //     return this.slugs.base + this.slugs.sessionLink[session.link_to === 'votes' ? 'glasovanja' : 'transkript'] + session.id;
  //   },
  // },
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
        }
      }
    }
  }
</style>
