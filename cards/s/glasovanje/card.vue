<template>
  <div class="card-container card-halfling card-glasovanje">
    <card-header :config="headerConfig" />

    <div class="card-content">
      <div class="card-content-front">
        <div class="summary">
          <div v-if="data.result.is_outlier" class="lightning-badge"></div>
          <div class="result">
            <div class="icon-text">
              <template v-if="data.result.accepted">
                <i class="accepted glyphicon glyphicon-ok"></i>
                <div class="text">sprejet</div>
              </template>
              <template v-else>
                <i class="not-accepted glyphicon glyphicon-remove"></i>
                <div class="text">zavrnjen</div>
              </template>
            </div>
            <div class="percentage">
              <span class="number">{{ Math.floor(data.result.value) }} %</span> {{ translatedOption }}
            </div>
          </div>
          <div class="name">{{ data.name }}</div>
          <div class="documents">
            <template v-if="data.documents.length > 0">
              <div class="dropdown-label">Dokumenti</div>
              <search-dropdown
                single
                :items="mappedDocuments"
                placeholder="Izberite dokument"
                select-callback="openDocument"
              />
            </template>
            <template v-else>
              <div class="no-results">Ni dokumentov</div>
            </template>
            <!--<% if (data.documents.length > 0) { %>

            <div class="prikazi" @click="takeMeToTheDocument">Prikaži</div>
            <% } else { %>
            <div class="nodocuments">Ni dokumentov</div>
            <% } %>-->
          </div>
        </div>
        <tabs v-cloak>
          <tab header="Poslanci">
            <sortable-table
              class="person-list"
              :columns="columns"
              :items="mappedMembers"
              :sort="currentSort"
              :sort-order="currentSortOrder"
              :sort-callback="selectSort"
            />
          </tab>
          <tab header="Poslanske skupine">Poslanske skupine</tab>
          <tab header="Stran vlade">
            <h1>Tab three content</h1>
          </tab>
        </tabs>
      </div>

      <card-info>
        <p class="info-text lead"></p>
        <p class="info-text heading">METODOLOGIJA</p>
        <p class="info-text"></p>
      </card-info>

      <card-embed :url="generatedCardUrl" />

      <card-share :url="shortenedCardUrl" />
    </div>
    <card-footer :link="slugs.base" />
  </div>
</template>

<script>
/* globals window $ measure */
import { sortBy, find } from 'lodash';
import { PORTRAIT_ROOT_URL } from 'components/constants';
import { getPersonLink, getPartyLink } from 'components/links';
import SortableTable from 'components/SortableTable.vue';
import common from 'mixins/common';

export default {
  components: { SortableTable },
  mixins: [common],
  name: 'GlasovanjeSeje',
  data() {
    return {
      data: this.$options.cardData.data,
      slugs: this.$options.cardData.urlsData,
      shortenedCardUrl: '',
      headerConfig: {
        circleIcon: 'og-list',
        heading: '&nbsp;',
        subheading: '7. sklic parlamenta',
        alternative: this.$options.cardData.cardData.altHeader === 'true',
        title: this.$options.cardData.cardData.name,
      },
      columns: [
        { id: 'portrait', label: '', additionalClass: 'portrait' },
        { id: 'name', label: 'Ime', additionalClass: 'wider name' },
        { id: 'party', label: 'PS' },
        { id: 'votes', label: 'Glasovi', additionalClass: 'optional' },
      ],
      currentSort: 'votes',
      currentSortOrder: 'asc',
      mappedDocuments: this.$options.cardData.data.documents.map((document, index) => ({
        id: document.name + index,
        label: document.name.substring(0, 3) === ' | ' ? `Dokument brez imena${document.name}` : document.name,
        selected: false,
        url: document.url,
      })),
    };
  },
  computed: {
    mappedMembers() {
      const sorted = sortBy(this.data.members, (member) => {
        switch (this.currentSort) {
          case 'party':
            return member.person.party.acronym;
          case 'votes':
            return member.option;
          default:
            return member.person.name;
        }
      });

      if (this.currentSortOrder === 'desc') {
        sorted.reverse();
      }

      return sorted.map(member => [
        { image: `${PORTRAIT_ROOT_URL}/${member.person.gov_id}.png`, link: getPersonLink(member) },
        { text: member.person.name, link: getPersonLink(member) },
        { text: member.person.party.acronym, link: getPartyLink(member) },
        { text: member.option },
      ]);
    },
    translatedOption() {
      return {
        for: 'ZA',
        against: 'PROTI',
      }[this.data.result.max_opt];
    },
    generatedCardUrl() {
      return 'https://glej.parlameter.si/group/method/';
    },
  },
  methods: {
    selectSort(columnId) {
      if (this.currentSort === columnId) {
        this.currentSortOrder = this.currentSortOrder === 'asc' ? 'desc' : 'asc';
      } else {
        this.currentSort = columnId;
        this.currentSortOrder = 'asc';
      }

      this.measurePiwik('', columnId, this.currentSortOrder);
    },
    openDocument(documentId) {
      const selectedDocument = find(this.mappedDocuments, { id: documentId });
      window.open(selectedDocument.url);
    },
    shortenUrl(url) {
      return new Promise((resolve) => {
        $.get(`https://parla.me/shortner/generate?url=${window.encodeURIComponent(`${url}&frame=true`)}`, (response) => {
          this.$el.querySelector('.card-content-share button').textContent = 'KOPIRAJ';
          resolve(response);
        });
      });
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
  watch: {
    generatedCardUrl(newUrl) {
      this.shortenUrl(newUrl).then(newShortenedUrl => (this.shortenedCardUrl = newShortenedUrl));
    }
  },
  beforeMount() {
    this.shortenUrl(this.generatedCardUrl);
  },
};
</script>

<style lang="sass" scoped>
@import 'parlassets/scss/colors';

.lightning-badge {
  background: $darkgrey;
  border-radius: 50%;
  height: 31px;
  left: -6px;
  position: absolute;
  top: -7px;
  width: 31px;
  background-image: url("https://cdn.parlameter.si/v1/parlassets/icons/strela.svg");
  background-size: 11px 19px;
  background-position: center center;
  background-repeat: no-repeat;
}

.summary {
  $section-border: 1px solid $black;
  background: $grey;
  display: flex;
  margin: 7px 0 24px 0;
  padding: 16px 24px;
  position: relative;

  .result {
    border-right: $section-border;
    flex: 1;
    padding-right: 22px;
    .icon-text {
      display: flex;
      margin: 25px 0 6px 0;
      .glyphicon {
        font-size: 29px;
        &.accepted { color: $funblue; }
        &.not-accepted { color: $red; }
      }
      .text {
        color: #333;
        font-size: 18px;
        font-weight: bold;
        text-transform: uppercase;
        padding: 4px 0 0 12px;
      }
    }
    .percentage {
      font-size: 16px;
      .number {
        font-size: 36px;
        margin-right: 7px;
      }
    }
  }

  .name {
    align-items: center;
    border-right: $section-border;
    display: flex;
    flex: 4;
    font-family: Roboto Slab, Times New Roman, serif;
    font-size: 20px;
    font-weight: 300;
    line-height: 28px;
    padding: 0 22px;
  }

  .documents {
    flex: 2;
    padding-left: 16px;
    .no-results {
      align-items: center;
      display: flex;
      font-style: italic;
      height: 100%;
      justify-content: center;
    }
    .dropdown-label {
      font-family: Roboto Slab, Times New Roman, serif;
      font-size: 18px;
      font-weight: 300;
      line-height: 32px;
      margin-top: 6px;
    }
  }
}

.person-list {
  height: 408px;
}
</style>
