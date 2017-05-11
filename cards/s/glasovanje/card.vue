<template>
  <div class="card-container card-halfling card-glasovanje" :id="$options.cardData.cardData._id">
    <card-header :config="headerConfig" />

    <div class="card-content">
      <div class="card-content-front">
        <div :class="['summary', { 'fire-badge': data.result.is_outlier }]">
          <div class="result">
            <template v-if="data.result.accepted">
              <i class="accepted glyphicon glyphicon-ok"></i>
              <div class="text">sprejet</div>
            </template>
            <template v-else>
              <i class="not-accepted glyphicon glyphicon-remove"></i>
              <div class="text">zavrnjen</div>
            </template>
          </div>
          <div class="name">{{ data.name }}</div>
          <div v-if="data.documents.length > 0" class="documents">
            <div class="dropdown-label">Dokumenti</div>
            <search-dropdown
              single
              small
              :items="mappedDocuments"
              placeholder="Izberi dokument"
              :select-callback="openDocument"
            />
          </div>
        </div>
        <tabs dark :switch-callback="focusTab">
          <tab header="Poslanci">
            <poslanci
              :members="data.members"
              :member-votes="data.all"
              :result="data.result"
            />
          </tab>
          <tab header="Poslanske skupine">
            <poslanske-skupine
              ref="parties"
              :members="data.members"
              :parties="data.parties"
            />
          </tab>
          <tab header="Stran vlade">
            <poslanske-skupine
              ref="sides"
              :members="data.members"
              :parties="coalitionOpositionParties"
            />
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
import { find, pick } from 'lodash';
import common from 'mixins/common';
import Poslanci from './Poslanci.vue';
import PoslanskeSkupine from './PoslanskeSkupine.vue';

export default {
  components: { Poslanci, PoslanskeSkupine },
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
      mappedDocuments: this.$options.cardData.data.documents.map((document, index) => ({
        id: document.name + index,
        label: document.name.substring(0, 3) === ' | ' ? `Dokument brez imena${document.name}` : document.name,
        selected: false,
        url: document.url,
      })),
      coalitionOpositionParties: ['coalition', 'opposition'].map(side => ({
        party: {
          id: side,
          name: side === 'coalition' ? 'KOALICIJA' : 'OPOZICIJA',
        },
        votes: pick(this.$options.cardData.data.gov_side[side].votes, ['abstain', 'for', 'against', 'not_present']),
        max: {
          maxOptPerc: this.$options.cardData.data.gov_side[side].max.maxOptPerc,
          max_opt: this.$options.cardData.data.gov_side[side].max.max_opt,
        },
        outliers: this.$options.cardData.data.gov_side[side].outliers,
      })),
    };
  },
  computed: {
    generatedCardUrl() {
      return 'https://glej.parlameter.si/group/method/';
    },
  },
  methods: {
    focusTab(tabNumber) {
      if (tabNumber !== 1) {
        this.$refs.parties.expandedParty = null;
        this.$refs.parties.expandedOption = null;
      }
      if (tabNumber !== 2) {
        this.$refs.sides.expandedParty = null;
        this.$refs.sides.expandedOption = null;
      }
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
    },
  },
  beforeMount() {
    this.shortenUrl(this.generatedCardUrl);
  },
};
</script>

<style lang="scss" scoped>
@import '~parlassets/scss/colors';
@import '~parlassets/scss/breakpoints';

.summary {
  $section-border: 1px solid $black;
  background: $grey;
  margin: 7px 0 8px 0;
  min-height: 90px;
  padding: 10px 14px;
  position: relative;

  @include respond-to(desktop) {
    display: flex;
    margin-bottom: 24px;
  }

  .result {
    align-items: center;
    border-bottom: $section-border;
    display: flex;
    justify-content: center;
    padding: 0 0 10px 0;

    @include respond-to(desktop) {
      border-bottom: none;
      border-right: $section-border;
      padding: 0 22px 0 0;
    }

    .glyphicon {
      font-size: 24px;
      margin-bottom: 4px;
      &.accepted { color: $funblue; }
      &.not-accepted { color: $red; }

      @include respond-to(desktop) { font-size: 29px; }
    }

    .text {
      color: #333;
      font-size: 14px;
      font-weight: bold;
      text-transform: uppercase;
      margin-left: 12px;
    }
  }

  .name {
    font-family: Roboto Slab, Times New Roman, serif;
    font-size: 11px;
    font-weight: 300;
    line-height: 1.45em;
    padding: 10px 0 4px 0;

    @include respond-to(desktop) {
      align-items: center;
      display: flex;
      flex: 4;
      font-size: 14px;
      padding: 5px 0 5px 12px;
    }
  }

  .documents {
    border-top: $section-border;
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin: 6px 0 0 0;

    @include respond-to(desktop) {
      border-left: $section-border;
      border-top: none;
      flex: 2;
      margin: 0 0 0 12px;
      min-width: 204px;
      padding-left: 16px;
    }

    .dropdown-label {
      @include show-for(desktop);
      font-family: Roboto Slab, Times New Roman, serif;
      font-size: 14px;
      font-weight: 300;
      line-height: 21px;
      margin-bottom: 5px;
    }

    .search-dropdown {
      margin: 10px -2px 3px -2px;
      @include respond-to(desktop) { margin: 0; }
    }
  }
}

.tabs .tab-content { overflow: hidden; }
</style>

<style lang="scss">
@import '~parlassets/scss/colors';

.lightning-badge::before {
  background: $darkgrey;
  border-radius: 50%;
  content: '';
  height: 31px;
  left: -6px;
  position: absolute;
  bottom: -6px;
  width: 31px;
  background-image: url("https://cdn.parlameter.si/v1/parlassets/icons/strela.svg");
  background-size: 11px 19px;
  background-position: center center;
  background-repeat: no-repeat;
}
.fire-badge::before {
  background: $darkgrey;
  border-radius: 50%;
  content: '';
  height: 31px;
  left: -6px;
  position: absolute;
  top: -7px;
  width: 31px;
  background-image: url("https://cdn.parlameter.si/v1/parlassets/icons/ogenj.svg");
  background-size: 40px 40px;
  background-position: center center;
  background-repeat: no-repeat;
}
</style>
