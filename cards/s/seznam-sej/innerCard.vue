<template>
  <div class="card-container card-halfling card-seznam-sej">
    <card-header :config="headerConfig" />

    <div class="card-content">
      <div class="card-content-front">
        <sortable-table
          class="session-list"
          :columns="columns"
          :items="mappedSessions"
          :sort="currentSort"
          :sort-order="currentSortOrder"
          :sort-callback="selectSort"
        />
      </div>

      <card-info>
        <p class="info-text lead">{{ infoText }}</p>
        <p class="info-text heading">METODOLOGIJA</p>
        <p class="info-text">Podatke o sejah pridobivamo iz spletnega mesta DZ RS, natančneje od <a href="https://www.dz-rs.si/wps/portal/Home/deloDZ/seje/sejeDt/poDatumu/!ut/p/z1/04_Sj9CPykssy0xPLMnMz0vMAfIjo8zivT39gy2dDB0N3F0NXQw8DX09PTz9HI0M3E30w9EUBJkYARV4W4b4-PoYGnib6UdRot8dXT-G8Wj6_S0N3Qw8Q43dTYx9QwwMfI2I02-AAzgakGg_pgej8BtfkBsKAooAQ6b9bA!!/dz/d5/L2dBISEvZ0FBIS9nQSEh/">tu</a>, <a href="https://www.dz-rs.si/wps/portal/Home/deloDZ/seje/sejeDrzavnegaZbora/PoDatumuSeje/!ut/p/z1/04_Sj9CPykssy0xPLMnMz0vMAfIjo8zivT39gy2dDB0N3INMjAw8Db0tQ3x8fQwNvM30wwkpiAJKG-AAjgYE9LtD9BNvv7-loZuBZ6ixu4mxb4iBga8RcfrxOJCA_oLcUCBwVAQAGc0QlQ!!/dz/d5/L2dBISEvZ0FBIS9nQSEh/">tu</a> in <a href="https://www.dz-rs.si/wps/portal/Home/deloDZ/seje/sejeDt/poDatumu/!ut/p/z1/04_Sj9CPykssy0xPLMnMz0vMAfIjo8zivT39gy2dDB0N3F0NXQw8DX09PTz9HI0M3E30w9EUBJkYARV4W4b4-PoYGnib6UdRot8dXT-G8Wj6_S0N3Qw8Q43dTYx9QwwMfI2I02-AAzgakGg_pgej8BtfkBsKAooAQ6b9bA!!/dz/d5/L2dBISEvZ0FBIS9nQSEh/.">tu.</a></p>
      </card-info>

      <card-embed :url="generatedCardUrl" />

      <card-share :url="generatedCardUrl" />
    </div>
    <card-footer />
  </div>
</template>

<script>
import SortableTable from 'components/SortableTable.vue';
import common from 'mixins/common';

const ICONS_ROOT_URL = 'https://cdn.parlameter.si/v1/parlassets/icons/';
const ORGS_ROOT_URL = 'https://glej.parlameter.si/wb/getWorkingBodies/';

const formatDate = (isoDate) => {
  const date = new Date(isoDate);
  return `${date.getDate()}. ${date.getMonth() + 1}. ${date.getFullYear()}`;
};

export default {
  components: { SortableTable },
  mixins: [common],
  name: 'SeznamSejKartica',
  props: {
    headerConfig: Object,
    columns: Array,
    currentSort: String,
    currentSortOrder: String,
    selectSort: Function,
    processedSessions: Array,
    organisationIsWorkingBody: Function,
    infoText: String,
    generatedCardUrl: String,
  },
  computed: {
    mappedSessions() {
      return this.processedSessions.map(session => [
        { link: this.getSessionUrl(session), image: `${ICONS_ROOT_URL}seja-${session.name.split(' ')[1]}.svg` },
        { link: this.getSessionUrl(session), text: session.name },
        formatDate(session.date_ts),
        formatDate(session.updated_at_ts),
        { contents: session.orgs.map(org => ({
          text: org.name,
          link: this.organisationIsWorkingBody(org.id) ? `${ORGS_ROOT_URL}${org.id}?frame=true&altHeader=true` : null,
        })) },
      ]);
    },
  },
  methods: {
    getSessionUrl(session) {
      if (!this.slugs || session.link_to === 'nothing') return '';
      return this.slugs.base + this.slugs.sessionLink[session.link_to === 'votes' ? 'glasovanja' : 'transkript'] + session.id;
    },
  },
};
</script>
