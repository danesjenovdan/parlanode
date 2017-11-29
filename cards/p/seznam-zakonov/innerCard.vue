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

    <div class="row">
    <sortable-table
      class="session-list"
      :columns="columns"
      :items="mappedItems"
      :sort="currentSort"
      :sort-order="currentSortOrder"
      :sort-callback="selectSort"
    />
    </div>
  </card-wrapper>
</template>

<script>
import SortableTable from 'components/SortableTable.vue';
import common from 'mixins/common';
import formatDate from 'helpers/dateFormatter';
import { ICONS_ROOT_URL, ORGS_ROOT_URL } from 'components/constants';

export default {
  components: { SortableTable },
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
          return this.items.map(legislation => [
              { link: this.slugs.legislationLink + legislation.epa, text: legislation.text },
              { text: 'bla' },
              { link: `${ORGS_ROOT_URL}?frame=true&altHeader=true`, text: legislation.mdt },
              { html: '<b>' + legislation.result + '</b>' },
          ])
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

<style lang="scss" scoped>
  .card-seznam-zakonov .session-list {
    .headers { margin-left: 0; }
  }
</style>
