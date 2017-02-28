<template>
  <div class="card-container card-halfling card-seznam-sej">
    <card-header :config="headerConfig" />

    <div class="card-content">
      <div class="card-content-front">
        <ul class="session-list">
          <li class="headers">
            <div v-for="column in columns"
                :class="['column', column.additionalClass, { sort: currentSort === column.id }, { reverse: currentSortOrder === 'desc' }]"
                @click="selectSort(column.id)">
              {{ column.label }}
            </div>
          </li>
          <div v-if="processedSessions.length === 0" class="no-results">Brez rezultatov.</div>
          <li v-for="session in processedSessions" class="item">
            <a class="column image" :href="getSessionUrl(session.id)">
              <img :src="'https://cdn.parlameter.si/v1/parlassets/icons/seja-' + session.name.split(' ')[1] + '.svg'" />
            </a>
            <div class="column wider name">
              <a class="funblue-light-hover" :href="getSessionUrl(session.id)">{{ session.name }}</a>
            </div>
            <div class="column">{{ formatDate(session.date_ts) }}</div>
            <div class="column optional">{{ formatDate(session.updated_at_ts) }}</div>
            <div class="column wider optional">
              <template v-for="organization, index in session.orgs">
                <template v-if="organisationIsWorkingBody(organization.id)">
                  <a class="funblue-light-hover" :href="'https://glej.parlameter.si/wb/getWorkingBodies/' + organization.id + '?frame=true&altHeader=true'">{{ organization.name }}</a>{{ index < session.orgs.length - 1 ? ', ' : '' }}
                </template>
                <template v-else>
                  <span>{{ organization.name }}</span>{{ index < session.orgs.length - 1 ? ', ' : '' }}
                </template>
              </template>
            </div>
          </li>
        </ul>
      </div>

      <card-info>
        <p class="info-text lead">{{ infoText }}</p>
        <p class="info-text heading">METODOLOGIJA</p>
        <p class="info-text">Podatke o sejah pridobivamo iz spletnega mesta DZ RS, natančneje od <a href="https://www.dz-rs.si/wps/portal/Home/deloDZ/seje/sejeDt/poDatumu/!ut/p/z1/04_Sj9CPykssy0xPLMnMz0vMAfIjo8zivT39gy2dDB0N3F0NXQw8DX09PTz9HI0M3E30w9EUBJkYARV4W4b4-PoYGnib6UdRot8dXT-G8Wj6_S0N3Qw8Q43dTYx9QwwMfI2I02-AAzgakGg_pgej8BtfkBsKAooAQ6b9bA!!/dz/d5/L2dBISEvZ0FBIS9nQSEh/">tu</a>, <a href="https://www.dz-rs.si/wps/portal/Home/deloDZ/seje/sejeDrzavnegaZbora/PoDatumuSeje/!ut/p/z1/04_Sj9CPykssy0xPLMnMz0vMAfIjo8zivT39gy2dDB0N3INMjAw8Db0tQ3x8fQwNvM30wwkpiAJKG-AAjgYE9LtD9BNvv7-loZuBZ6ixu4mxb4iBga8RcfrxOJCA_oLcUCBwVAQAGc0QlQ!!/dz/d5/L2dBISEvZ0FBIS9nQSEh/">tu</a> in <a href="https://www.dz-rs.si/wps/portal/Home/deloDZ/seje/sejeDt/poDatumu/!ut/p/z1/04_Sj9CPykssy0xPLMnMz0vMAfIjo8zivT39gy2dDB0N3F0NXQw8DX09PTz9HI0M3E30w9EUBJkYARV4W4b4-PoYGnib6UdRot8dXT-G8Wj6_S0N3Qw8Q43dTYx9QwwMfI2I02-AAzgakGg_pgej8BtfkBsKAooAQ6b9bA!!/dz/d5/L2dBISEvZ0FBIS9nQSEh/.">tu.</a></p>
      </card-info>

      <card-embed :url="generatedCardUrl" />

      <card-share :url="shortenedCardUrl" />
    </div>
    <card-footer :link="slugs.base" />
  </div>
</template>

<script>
import { find } from 'lodash'
import CardInfo from 'components/Card/Info.vue'
import CardEmbed from 'components/Card/Embed.vue'
import CardShare from 'components/Card/Share.vue'
import CardHeader from 'components/Card/Header.vue'
import CardFooter from 'components/Card/Footer.vue'
import initializeBack from 'mixins/initializeBack'

export default {
  components: { CardInfo, CardEmbed, CardShare, CardHeader, CardFooter },
  mixins: [ initializeBack ],
  name: 'SeznamSejKartica',
  props: {
    headerConfig: Object,
    columns: Array,
    currentSort: String,
    currentSortOrder: String,
    selectSort: Function,
    slugs: Object,
    processedSessions: Array,
    organisationIsWorkingBody: Function,
    infoText: String,
    generatedCardUrl: String,
    shortenedCardUrl: String,
  },
  methods: {
    getSessionUrl(sessionId) {
      return this.slugs ? this.slugs.base + this.slugs.sessionLink.transkript + sessionId : ''
    },
    formatDate(isoDate) {
      var date = new Date(isoDate);
      return date.getDate() + '. ' + (date.getMonth() + 1) + '. ' + date.getFullYear();
    },
  }
}
</script>

<style lang="sass">
</style>
