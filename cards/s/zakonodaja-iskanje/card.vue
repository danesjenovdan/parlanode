<template>
    <card-wrapper
            :id="$options.cardData.cardData._id"
            class="card-scroll card-seznam-zakonov"
            :card-url="generatedCardUrl"
            :header-config="headerConfig">

        <div slot="info" v-html="infoText"></div>

        <div class="legislation-list">
            <div :class="{ 'headers': true, 'filters--shadow': card.shouldShadow }">
                <div
                        :class="['column', 'small-text', { sort: currentSort === columns[0].id }]"
                        @click="selectSort(columns[0].id)">Ime</div>
                <div
                        :class="['column', 'small-text', { sort: currentSort === columns[1].id }]"
                        @click="selectSort(columns[1].id)">EPA</div>
                <div
                        :class="['column', 'small-text', { sort: currentSort === columns[2].id }]"
                        @click="selectSort(columns[2].id)">Status</div>
            </div>
            <div id="card-search" class="card-scroll__wrapper">

                <sortable-table
                        class=""
                        :columns="columns"
                        :items="mappedItems"
                        :sort="currentSort"
                        :sort-order="currentSortOrder"
                />
            </div>
        </div>
    </card-wrapper>

</template>

<script>
  import SortableTable from 'components/SortableTable.vue';
  import common from 'mixins/common';
  import scroll from 'mixins/scroll';
  import {ICONS_ROOT_URL, ORGS_ROOT_URL} from 'components/constants';

  export default {
    components: {
      SortableTable,
    },
    mixins: [common, scroll],
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
        {id: 'name', label: 'Ime', additionalClass: 'small-text'},
        // { id: 'workingBody', label: 'Matično delovno telo', additionalClass: 'small-text' },
        {id: 'epa', label: 'EPA', additionalClass: 'small-text'},
        {id: 'result', label: 'Status', additionalClass: ''},
      ],
      infoText() {
        let html = `<p class="info-text lead">Seznam vseh zakonov in aktov, ki bodisi v naslovu bodisi v povzetku vsebujejo vaš iskalni niz (${this.keyword}) in so o njih na seji DZ glasovali v času trenutnega sklica.</p>`;
        html += '<p class="info-text heading">METODOLOGIJA</p>';
        html += `<p class="info-text text">Po naslovih in povzetkih vseh zakonov in aktov, obravnavanih v tem sklicu, poiščemo pojavitve iskalnega niza in izpišemo povezave do vseh tistih zakonov ali aktov, v katerih se pojavi njegova lema. Na koncu zakone oziroma akte razvrstimo po podobnosti z iskalnim nizom.</p>`;

        return html;
      },
      generatedCardUrl() {
        const state = {text: this.keyword};

        return `https://glej.parlameter.si/${this.$options.cardData.cardData.group}/${this.$options.cardData.cardData.method}/?state=${encodeURIComponent(JSON.stringify(state))}&altHeader=true&customUrl=${encodeURIComponent('https://isci.parlameter.si/l/')}`;
      },
      mappedItems() {
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

          const outcomeHtml = `<div class="outcome"><i class="glyphicon ${mapResultIcon[mapKey].icon}"></i><div class="text">${mapResultIcon[mapKey].name}</div></div>`;
          return [
            {html: `<a href="${this.slugs.legislationLink}${legislation.id}" class="funblue-light-hover">${legislation.text_t[0]}</a>`},
            {text: typeof legislation.id !== 'undefined' ? legislation.id : ''},
            {html: outcomeHtml},
          ];
        })
      },
      processedData() {
        const sortedLegislation = this.data.sort((A, B) => {
          let a, b;

          switch (this.currentSort) {
            case 'name':
              a = A.text_t[0];
              b = B.text_t[0];
              return a.toLowerCase().localeCompare(b.toLowerCase());
            case 'epa':
              a = typeof A.id !== 'undefined' ? A.id : '';
              b = typeof B.id !== 'undefined' ? B.id : '';
              return parseInt(a) - parseInt(b);
            case 'result':
              a = b = 'v obravnavi';
              if (typeof A.result !== 'undefined') a = A.result[0];
              if (typeof B.result !== 'undefined') b = B.result[0];
              return a.toLowerCase().localeCompare(b.toLowerCase());
            default:
              return 0;
          }
          ;
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
    mounted () {
      this.card.shadowElement = 'card-search';
      if (document) {
        document.getElementById(this.card.shadowElement).addEventListener('scroll', this.checkScrollPosition);
      }
    }
  };
</script>

<style lang="scss">
    @import '~parlassets/scss/breakpoints';
    @import '~parlassets/scss/colors';

    .card-content {
        padding: 0;
    }

    .legislation-list {
        ul {
            padding: 0;
        }

        a {
            color: #009cda;
        }

        .headers {
            padding: 0 20px 10px;
        }

        .card-scroll__wrapper {
            .headers {
                /*display: none;*/
            }
        }

        .item .column {
            &:first-child {
                font-family: "Roboto Slab", sans-serif;
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
                    background: url('https://cdn.parlameter.si/v1/parlassets/icons/v-obravnavi.svg');
                    background-size: contain !important;
                    background-repeat: no-repeat;
                }
            }
        }
    }


</style>
