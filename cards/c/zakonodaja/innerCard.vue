<template>
  <card-wrapper
    class="card-halfling card-seznam-zakonov"
    :card-url="generatedCardUrl"
    :header-config="headerConfig">

    <div slot="info">
      <p class="info-text lead">{{ infoText }}</p>
      <p class="info-text heading">METODOLOGIJA</p>
      <p class="info-text">Podatke o sejah pridobivamo iz spletnega mesta DZ RS, natančneje od <a href="https://www.dz-rs.si/wps/portal/Home/deloDZ/seje/sejeDt/poDatumu/!ut/p/z1/04_Sj9CPykssy0xPLMnMz0vMAfIjo8zivT39gy2dDB0N3F0NXQw8DX09PTz9HI0M3E30w9EUBJkYARV4W4b4-PoYGnib6UdRot8dXT-G8Wj6_S0N3Qw8Q43dTYx9QwwMfI2I02-AAzgakGg_pgej8BtfkBsKAooAQ6b9bA!!/dz/d5/L2dBISEvZ0FBIS9nQSEh/">tu</a>, <a href="https://www.dz-rs.si/wps/portal/Home/deloDZ/seje/sejeDrzavnegaZbora/PoDatumuSeje/!ut/p/z1/04_Sj9CPykssy0xPLMnMz0vMAfIjo8zivT39gy2dDB0N3INMjAw8Db0tQ3x8fQwNvM30wwkpiAJKG-AAjgYE9LtD9BNvv7-loZuBZ6ixu4mxb4iBga8RcfrxOJCA_oLcUCBwVAQAGc0QlQ!!/dz/d5/L2dBISEvZ0FBIS9nQSEh/">tu</a> in <a href="https://www.dz-rs.si/wps/portal/Home/deloDZ/seje/sejeDt/poDatumu/!ut/p/z1/04_Sj9CPykssy0xPLMnMz0vMAfIjo8zivT39gy2dDB0N3F0NXQw8DX09PTz9HI0M3E30w9EUBJkYARV4W4b4-PoYGnib6UdRot8dXT-G8Wj6_S0N3Qw8Q43dTYx9QwwMfI2I02-AAzgakGg_pgej8BtfkBsKAooAQ6b9bA!!/dz/d5/L2dBISEvZ0FBIS9nQSEh/.">tu.</a></p>
    </div>

    <empty-card v-if="mappedItems.length === 0" text="Brez rezultatov"></empty-card>
    <sortable-table
      v-else
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
import EmptyCard from 'components/Card/Empty.vue';

import SortableTable from 'components/SortableTable.vue';
import common from 'mixins/common';
import formatDate from 'helpers/dateFormatter';
import { ICONS_ROOT_URL, ORGS_ROOT_URL } from 'components/constants';

export default {
  components: {
    SortableTable,
    EmptyCard
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
              {text: legislation.date},
              {html: `<a href="${ORGS_ROOT_URL}${legislation.mdt.id}?frame=true&altHeader=true" class="funblue-light-hover">${legislation.mdt.name}</a>`},
              {html: outcomeHtml},
            ];
          })
      }
  },
  methods: {
    getSessionUrl(session) {
      if (!this.slugs || session.link_to === 'nothing') return '';
      return this.slugs.base + this.slugs.sessionLink[session.link_to === 'votes' ? 'glasovanja' : 'transkript'] + session.id;
    },
  },
};
</script>

<style lang="scss">
  @import '~parlassets/scss/breakpoints';

  .card-content__empty {
    padding-top: 0;
  }

  .legislation-list {

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
