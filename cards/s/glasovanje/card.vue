<template>
  <div class="card-container card-halfling card-glasovanje" :id="$options.cardData.cardData._id">
    <card-header :config="headerConfig" />

    <div class="card-content">
      <div class="card-content-front">
        <div :class="['summary', { 'lightning-badge': data.result.is_outlier }]">
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
          <div class="documents">
            <template v-if="data.documents.length > 0">
              <div class="dropdown-label">Dokumenti</div>
              <search-dropdown
                single
                small
                :items="mappedDocuments"
                placeholder="Izberi dokument"
                :select-callback="openDocument"
              />
            </template>
            <template v-else>
              <div class="no-documents">Ni dokumentov</div>
            </template>
            <!--<% if (data.documents.length > 0) { %>

            <div class="prikazi" @click="takeMeToTheDocument">Prikaži</div>
            <% } else { %>
            <div class="nodocuments">Ni dokumentov</div>
            <% } %>-->
          </div>
        </div>
        <tabs dark>
          <tab header="Poslanci">
            <poslanci
              :members="data.members"
              :member-votes="data.all"
              :result="data.result"
            />
          </tab>
          <tab header="Poslanske skupine">
            <poslanske-skupine
              :members="data.members"
              :parties="data.parties"
            />
          </tab>
          <tab header="Stran vlade">
            <poslanske-skupine
              :members="coalitionOpositionMembers"
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
      coalitionOpositionMembers: this.$options.cardData.data.members.map(member => ({
        person: {
          id: member.person.id,
          gov_id: member.person.gov_id,
          name: member.person.name,
          party: {
            id: member.person.party.is_coalition ? 'coalition' : 'opposition'
          },
        },
        option: member.option,
      })),
      coalitionOpositionParties: ['coalition', 'opposition'].map(side => ({
        party: {
          id: side,
          name: side === 'coalition' ? 'KOALICIJA' : 'OPOZICIJA',
        },
        votes: pick(this.$options.cardData.data.gov_side[side], ['abstain', 'for', 'against', 'not_present']),
        max: {
          score: this.$options.cardData.data.gov_side[side].maxOptPerc,
          option: this.$options.cardData.data.gov_side[side].max_opt,
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

<style lang="sass" scoped>
@import 'parlassets/scss/colors';

.summary {
  $section-border: 1px solid $black;
  background: $grey;
  display: flex;
  margin: 7px 0 24px 0;
  min-height: 90px;
  padding: 10px 14px;
  position: relative;

  .result {
    align-items: center;
    border-right: $section-border;
    display: flex;
    flex: 1;
    padding-right: 22px;
    .glyphicon {
      font-size: 29px;
      margin-bottom: 4px;
      &.accepted { color: $funblue; }
      &.not-accepted { color: $red; }
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
    align-items: center;
    border-right: $section-border;
    display: flex;
    flex: 4;
    font-family: Roboto Slab, Times New Roman, serif;
    font-size: 14px;
    font-weight: 300;
    line-height: 20px;
    padding: 5px 12px;
  }

  .documents {
    display: flex;
    flex: 2;
    flex-direction: column;
    justify-content: center;
    min-width: 204px;
    padding-left: 16px;
    .no-documents {
      align-items: center;
      display: flex;
      font-style: italic;
      height: 100%;
      justify-content: center;
    }
    .dropdown-label {
      font-family: Roboto Slab, Times New Roman, serif;
      font-size: 14px;
      font-weight: 300;
      line-height: 21px;
      margin-bottom: 5px;
    }
  }
}

.tabs .tab-content { overflow: hidden; }
</style>

<style lang="sass">
@import 'parlassets/scss/colors';

.lightning-badge::before {
  background: $darkgrey;
  border-radius: 50%;
  content: '';
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
</style>
