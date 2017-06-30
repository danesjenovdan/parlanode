<template>
  <div class="card-container card-halfling card-IME_KARTICE" :id="$options.cardData.cardData._id">
    <card-header :config="headerConfig" />

    <div class="card-content">
      <div class="card-content-front">
        <ul class="person-list">
          <li class="person" v-for="member in data">
            <a :href="slugs.base + slugs.personLink.base + slugs.person[member.id].slug + slugs.personLink.pregled" class="portrait column">
                    <img :src="'https://cdn.parlameter.si/v1/parlassets/img/people/square/' + member.gov_id + '.png'" />
                </a>
            <div class="column name">
              <a :href="slugs.base + slugs.personLink.base + slugs.person[member.id].slug + slugs.personLink.pregled" class="funblue-light-hover">{{ member.name }}</a><br>
              <a v-if="member.acronym.indexOf('NeP') === -1" :href="slugs.base + slugs.partyLink.base + slugs.party[member.party_id].acronym + slugs.partyLink.pregled" class="funblue-light-hover">{{ member.acronym }}</a>
              <span v-if="member.acronym.indexOf('NeP') !== -1">{{ member.acronym }}</span>
            </div>
            <div class="column large-number">
              {{ member.mandates }}
            </div>
          </li>
        </ul>
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
  import common from 'mixins/common';

  export default {
    components: {},
    mixins: [common],
    name: 'ImeKartice',
    data() {

      // const members = this.$options.cardData.data.map((member) => {
      //   return {

      //   }
      // });

      return {
        data: this.$options.cardData.data.filter(person => person.mandates > 3).sort((a, b) => {
          return b.mandates - a.mandates;
        }),
        slugs: this.$options.cardData.urlsData,
        shortenedCardUrl: '',
        url: 'https://glej.parlameter.si/group/method/',
        headerConfig: {
          circleIcon: 'og-list',
          heading: '&nbsp;',
          subheading: '7. sklic parlamenta',
          alternative: this.$options.cardData.cardData.altHeader === 'true',
          title: this.$options.cardData.cardData.name,
        },
      };
    },
    methods: {
      shortenUrl() {
        return new Promise((resolve) => {
          $.get(`https://parla.me/shortner/generate?url=${window.encodeURIComponent(`${this.url}&frame=true`)}`, (
            response) => {
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
    mounted() {
      this.shortenUrl();
    },
  };
</script>

<style lang="scss" scoped>

</style>