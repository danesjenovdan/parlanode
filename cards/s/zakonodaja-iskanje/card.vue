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
  </div>

</template>

<script>
  import SortableTable from 'components/SortableTable.vue';
  import common from 'mixins/common';
  import { ICONS_ROOT_URL, ORGS_ROOT_URL } from 'components/constants';

  export default {
    components: {
      SortableTable,
    },
    mixins: [common],
    name: 'ZakonodajaIskanje',
    data() {
      const keyword = this.$options.cardData.parlaState.text;
      return {
        data: this.$options.cardData.data.response.docs,
        currentSort: '',
        currentSortOrder: 'DESC',
        workingBodies: [],
        headerConfig: {
          circleIcon: 'og-list',
          heading: '&nbsp;',
          alternative: this.$options.cardData.cardData.altHeader === 'true',
          title: this.$options.cardData.cardData.name,
        },
        keyword
      };
    },
    computed: {
      columns: () => [
        { id: 'name', label: 'Ime', additionalClass: 'small-text' },
        { id: 'workingBody', label: 'Matično delovno telo', additionalClass: 'small-text' },
        { id: 'result', label: 'Status', additionalClass: '' },
      ],
      infoText () {
        let html = `<p class="info-text lead">Seznam vseh zakonov in aktov, ki bodisi v naslovu bodisi v povzetku vsebujejo vaš iskalni niz (${this.keyword}) in so o njih na seji DZ glasovali v času trenutnega sklica.</p>`;
        html += '<p class="info-text heading">METODOLOGIJA</p>';
        html += `<p class="info-text text">Po naslovih in povzetkih vseh zakonov in aktov, obravnavanih v tem sklicu, poiščemo pojavitve iskalnega niza in izpišemo povezave do vseh tistih zakonov ali aktov, v katerih se pojavi njegova lema. Na koncu zakone oziroma akte razvrstimo po podobnosti z iskalnim nizom.</p>`;

        return html;
      },
      generatedCardUrl() {
        const state = { text: this.keyword };

        return `https://glej.parlameter.si/${this.$options.cardData.cardData.group}/${this.$options.cardData.cardData.method}/?state=${encodeURIComponent(JSON.stringify(state))}&altHeader=true&customUrl=${encodeURIComponent('https://isci.parlameter.si/l/')}`;
      },
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

        return this.processedData.map(legislation => {
          let mapKey = typeof legislation.result !== 'undefined' ? legislation.result[0] : null;
          if (!mapKey) {
            mapKey = 'v obravnavi';
          }
          console.log(mapKey)

          const outcomeHtml = `<div class="outcome"><i class="glyphicon ${mapResultIcon[mapKey].icon}"></i><div class="text">${mapResultIcon[mapKey].name}</div></div>`;
          return [
            {html: `<a href="${this.slugs.legislationLink}${legislation.id}" class="funblue-light-hover">${legislation.text_t[0]}</a>`},
            {text: typeof legislation.mdt !== 'undefined' ? legislation.mdt.join(', ') : ''},
            {html: outcomeHtml},
          ];
        })
      },
      processedData () {
        const sortedLegislation = this.data.sort((A, B) => {
          let a,b;

          switch (this.currentSort) {
            case 'name':
              a = A.text_t[0];
              b = B.text_t[0];
              return a.toLowerCase().localeCompare(b.toLowerCase());
              break;
            case 'workingBody':
              a = typeof A.mdt !== 'undefined' ? A.mdt.join(', ') : '';
              b = typeof B.mdt !== 'undefined' ? B.mdt.join(', ') : '';
              return a.localeCompare(b, 'sl');
              break;
            case 'result':
              a = A.result || 'v obravnavi';
              b = B.result || 'v obravnavi';
              return a.toLowerCase().localeCompare(b.toLowerCase());
              break;
            default:
              return 0;
              break;
          };
        });

        if (this.currentSortOrder === 'desc') sortedLegislation.reverse();

        return sortedLegislation;
      }
    },
    methods: {
      selectSort(sortId) {
        if (this.currentSort === sortId) {
          this.currentSortOrder = this.currentSortOrder === 'asc' ? 'desc' : 'asc';
        } else {
          this.currentSort = sortId;
          this.currentSortOrder = 'asc';
        }

        // this.measurePiwik('', sortId, this.currentSortOrder);
      },
      selectFilter(filter) {
        this.currentFilter = filter;
        // this.measurePiwik(filter, '', '');
      },
      measurePiwik(filter, sort, order) {
        if (typeof measure === 'function') {
          if (sort !== '') {
            measure('s', 'session-sort', `${sort} ${order}`, '');
          } else if (filter !== '') {
            measure('s', 'session-filter', filter, '');
          }
        }
      },
    },
  };
</script>

<style lang="scss">
  @import '~parlassets/scss/breakpoints';
  @import '~parlassets/scss/colors';


  .legislation-list {
    padding: 0;

    a {
      color: #009cda;
    }


    .item .column {
      &:first-child {
        font-family: "Roboto Slab", sans-serif;
      }
    }

    .column{
      font-size: 16px;

      @include respond-to(desktop) {
        font-size: 18px;
      }

      &:nth-child(2) {
        @include respond-to(mobile) {
          display:none;
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
