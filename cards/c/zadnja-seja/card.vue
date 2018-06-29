<template>
  <card-wrapper
    :id="$options.cardData.cardData._id"
    :card-url="generatedCardUrl"
    :header-config="headerConfig"
  >
    <div slot="info">
      <i18n path="info.lead" tag="p" class="info-text lead">
        <a
          v-t="'info.link'"
          place="link"
          class="funblue-light-hover"
          target="_blank"
          href="http://www.dz-rs.si/wps/portal/Home/deloDZ/seje/sejeDrzavnegaZbora/PoDatumuSeje"
        />
      </i18n>
      <div v-t="'info.words-heading'" class="info-text heading"></div>
      <p v-t="'info.words-text'" class="info-text"></p>
      <p v-t="'info.presence-headinig'" class="info-text heading"></p>
      <p v-t="'info.presence-text'" class="info-text"></p>
      <p v-t="'info.votes-heading'" class="info-text heading"></p>
      <p v-t="'info.votes-text'" class="info-text"></p>
    </div>

    <div class="smalldate">{{ data.session.date }}</div>
    <hr>
    <div class="link">
      <a :href="getSessionTranscriptLink(data.session)" class="funblue-light-hover">
        <span class="glyphicon glyphicon-comment"></span>
        <span v-t="'info.words-heading'"></span>
      </a>
    </div>
    <div v-if="chartRows.length" class="columns">
      <bar-chart :data="chartRows1" :already-calculated="true" />
      <bar-chart :data="chartRows2" :already-calculated="true" />
    </div>
    <hr>
    <div class="link">
      <a class="funblue-light-hover">
        <span class="glyphicon glyphicon-comment"></span>
        <span v-t="'info.presence-heading'"></span>
      </a>
    </div>
    <prisotnost-po-poslanskih-skupinah :data="data.presence" />
    <hr>
    <div class="link">
      <a :href="getSessionVotesLink(data.session)" class="funblue-light-hover">
        <span class="glyphicon glyphicon-comment"></span>
        <span v-t="'info.votes-heading'"></span>
      </a>
    </div>
    <div class="votes">
      <seznam-glasovanj :data="votes" :show-filters="false" />
    </div>
  </card-wrapper>
</template>

<script>
import common from 'mixins/common';
import BarChart from 'components/BarChart.vue';
import PrisotnostPoPoslanskihSkupinah from 'components/PrisotnostPoPoslanskihSkupinah.vue';
import SeznamGlasovanj from 'components/SeznamGlasovanj.vue';
import {
  getSessionTranscriptLink,
  getSearchTermLink,
  getSessionVotesLink,
} from 'components/links';

export default {
  name: 'ZadnjaSeja',
  components: {
    BarChart,
    SeznamGlasovanj,
    PrisotnostPoPoslanskihSkupinah,
  },
  mixins: [common],
  data() {
    const sessionName = this.$options.cardData.data.session.name;
    let imageName = 'seja-redna';
    if (sessionName.indexOf('izredna') !== -1) {
      imageName = 'seja-izredna';
    } else if (sessionName.indexOf('nujna') !== -1) {
      imageName = 'seja-nujna';
    }
    return {
      getSessionTranscriptLink,
      getSessionVotesLink,
      data: this.$options.cardData.data,
      headerConfig: {
        mediaImage: imageName,
        heading: this.$options.cardData.data.session.name,
        subheading: this.$options.cardData.data.session.date,
        alternative: this.$options.cardData.cardData.altHeader === 'true',
        title: `${this.$options.cardData.cardData.name}: ${this.$options.cardData.data.session.name} DZ`,
      },
    };
  },
  computed: {
    chartRows() {
      // JSON.parse(JSON.stringify(this.data.results));
      const rows = this.data.tfidf.results
        .map((row) => {
          row.value = Math.round(row.scores['tf-idf'] * 5000);
          return row;
        });

      const mymax = this.data.tfidf.results.reduce((acc, row) => Math.max(acc, row.value), 0);
      const mytotal = this.data.tfidf.results.reduce((acc, row) => acc + row.value, 0);

      return rows
        .map(row => ({
          name: this.decodeHTML(row.term),
          value: row.value,
          link: getSearchTermLink(row.term),
          widthPercentage: (row.value / mymax) * (this.showNumbers ? 80 : 100),
          percentage: ((row.value / mytotal) * 100).toFixed(2),
        }))
        .sort((a, b) => b.value - a.value);
    },
    chartRows1() {
      return this.chartRows.slice(0, 5);
    },
    chartRows2() {
      return this.chartRows.slice(5, 10);
    },
    votes() {
      return {
        votes: this.data.motions.map(motion => motion.results),
        session: this.data.session,
        tags: this.data.motions
          .map(motion => motion.results.tags)
          .reduce((acc, cur) => {
            acc.push(...cur);
            return acc;
          }, []),
      };
    },
    generatedCardUrl() {
      return `${this.url}?altHeader=true`;
    },
  },
  methods: {
    decodeHTML(html) {
      return html.replace('&shy;', '\u00AD');
    },
  },
};
</script>

<style lang="scss" scoped>
@import '~parlassets/scss/breakpoints';

hr,
.link {
  margin-top: 10px;
  margin-bottom: 10px;
  text-transform: uppercase;
}

.columns {
  display: flex;

  @include respond-to(mobile) {
    display: block;
  }

  .word-list {
    flex: 1;

    &:first-child {
      margin-right: 20px;

      @include respond-to(mobile) {
        margin-bottom: 0;
      }
    }
  }
}

.votes /deep/ #votingCard {
  height: auto !important;
  max-height: 500px;
}
</style>
