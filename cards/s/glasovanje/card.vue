<template>
  <div class="card-container card-halfling card-glasovanje" :id="$options.cardData.cardData._id">
    <card-header :config="headerConfig" />

    <div class="card-content">
      <div class="card-content-front">
        <div class="summary">
          <div v-if="data.result.is_outlier" class="lightning-badge"></div>
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
              <div class="no-results">Ni dokumentov</div>
            </template>
            <!--<% if (data.documents.length > 0) { %>

            <div class="prikazi" @click="takeMeToTheDocument">Prikaži</div>
            <% } else { %>
            <div class="nodocuments">Ni dokumentov</div>
            <% } %>-->
          </div>
        </div>
        <tabs>
          <tab header="Poslanci">
            <div class="filters">
              <search-field
                v-model="nameFilter"
                placeholder="Vsi poslanci"
              />
              <div class="vote-filters">
                <striped-button
                  v-for="vote, index in votes"
                  :color="vote.id"
                  :key="vote.id"
                  :selected="vote.selected"
                  :small-text="vote.label"
                  :text="String(data.all[vote.id])"
                  :click-handler="() => toggleVote(index)"
                />
              </div>
            </div>
            <sortable-table
              class="person-list"
              :columns="columns"
              :items="mappedMembers"
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
import StripedButton from 'components/StripedButton.vue';
import SearchField from 'components/SearchField.vue';
import common from 'mixins/common';

export default {
  components: { SortableTable, SearchField, StripedButton },
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
      votes: [
        { id: 'for', label: 'za', selected: false },
        { id: 'against', label: 'proti', selected: false },
        { id: 'abstain', label: 'vzdržani', selected: false },
        { id: 'not_present', label: 'niso', selected: false },
      ],
      mappedDocuments: this.$options.cardData.data.documents.map((document, index) => ({
        id: document.name + index,
        label: document.name.substring(0, 3) === ' | ' ? `Dokument brez imena${document.name}` : document.name,
        selected: false,
        url: document.url,
      })),
      nameFilter: '',
    };
  },
  computed: {
    mappedMembers() {
      let members = this.data.members;

      if (this.nameFilter.length > 0) {
        members = members.filter(member =>
          member.person.name.toLowerCase().indexOf(this.nameFilter.toLowerCase()) > -1,
        );
      }

      if (this.selectedVotes.length > 0) {
        members = members.filter(member => this.selectedVotes.indexOf(member.option) > -1);
      }

      return members.map(member => [
        { image: `${PORTRAIT_ROOT_URL}/${member.person.gov_id}.png`, link: getPersonLink(member) },
        { text: member.person.name, link: getPersonLink(member) },
        { text: member.person.party.acronym, link: getPartyLink(member) },
        { text: member.option },
      ]);
    },
    selectedVotes() {
      return this.votes
        .filter(vote => vote.selected)
        .map(vote => vote.id);
    },
    translatedOption() {
      // TODO: Include all options and ask about translations
      return {
        for: 'za',
        against: 'proti',
        absent: 'odsotnih',
        abstain: 'vzdržanih',
      }[this.data.result.max_opt];
    },
    generatedCardUrl() {
      return 'https://glej.parlameter.si/group/method/';
    },
  },
  methods: {
    openDocument(documentId) {
      const selectedDocument = find(this.mappedDocuments, { id: documentId });
      window.open(selectedDocument.url);
    },
    toggleVote(index) {
      // const vote = find(this.votes, { id });
      const newVotes = JSON.parse(JSON.stringify(this.votes));
      newVotes[index].selected = !newVotes[index].selected;
      this.votes = newVotes;
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
    .no-results {
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

.filters {
  align-items: center;
  display: flex;
  margin-top: 13px;

  .vote-filters {
    display: flex;
    margin: 0 0 0 35px;
    .striped-button {
      width: 97px;
      &:not(:last-child) { margin-right: 6px; }
    }
  }
}

.person-list {
  max-height: 388px;
  overflow: auto;
}
</style>
