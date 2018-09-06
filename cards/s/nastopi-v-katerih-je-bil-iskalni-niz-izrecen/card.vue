<template>
  <card-wrapper
    :id="$options.cardData.cardData._id"
    :content-class="{'is-loading': fetching}"
    :card-url="generatedCardUrl"
    :header-config="headerConfig"
    :og-config="ogConfig"
    content-height="518px"
  >
    <div slot="info">
      <p v-t="'info.lead'" class="info-text lead"></p>
      <p v-t="'info.methodology'" class="info-text heading"></p>
      <p v-t="'info.text'" class="info-text"></p>
    </div>

    <div v-t="'no-results'" v-if="rawSpeeches.length === 0 && !fetching" class="no-results"></div>
    <scroll-shadow v-else ref="shadow">
      <ul
        ref="scrollElement"
        class="person-list thing-list"
        @scroll="$refs.shadow.check($event.currentTarget)"
      >
        <li v-for="speech in speeches" :key="speech.speech_id" class="person">
          <template v-if="speech.person.type === 'mp'">
            <a :href="speech.memberUrl" class="column portrait">
              <img :src="speech.memberImageUrl">
            </a>
            <div class="column name">
              <a :href="speech.memberUrl" class="funblue-light-hover">
                {{ speech.person.name }}
              </a>
              <br>
              <template v-if="speech.partyUrl">
                <a :href="speech.partyUrl" class="funblue-light-hover">
                  {{ speech.person.party.acronym }}
                </a>
              </template>
              <template v-else>{{ speech.person.party.acronym }}</template>
            </div>
          </template>
          <template v-else>
            <div class="column portrait">
              <img :src="speech.memberImageUrl">
            </div>
            <div class="column name">
              {{ speech.person.name }}<br>
            </div>
          </template>

          <div class="column date">{{ speech.formattedDate }}</div>
          <div class="column quote">
            <a :href="speech.speechUrl" class="funblue-light-hover" v-html="speech.content_t"></a>
          </div>
        </li>
      </ul>
    </scroll-shadow>
    <div v-show="fetching" class="infinite-scroll-loader">
      <div class="nalagalnik"></div>
    </div>
  </card-wrapper>
</template>

<script>
import axios from 'axios';
import common from 'mixins/common';
import { searchTitle } from 'mixins/titles';
import { searchHeader } from 'mixins/altHeaders';
import { searchOgImage } from 'mixins/ogImages';
import links from 'mixins/links';
import dateFormatter from 'helpers/dateFormatter';
import ScrollShadow from 'components/ScrollShadow.vue';
import stateLoader from 'helpers/stateLoader';

const PAGE_SIZE = 50;

export default {
  name: 'NastopiVKaterihJeBilIskalniNizIzrecen',
  components: {
    ScrollShadow,
  },
  mixins: [
    common,
    searchTitle,
    searchHeader,
    searchOgImage,
    links,
  ],
  data() {
    const loadFromState = stateLoader(this.$options.cardData.parlaState);
    return {
      keywords: loadFromState('query'),
      mps: loadFromState('mps') || [],
      pgs: loadFromState('pgs') || [],
      rawSpeeches: [],
      allResults: 0,
      page: 0,
      fetching: true,
    };
  },
  computed: {
    generatedCardUrl() {
      const state = { query: this.keywords };
      return `${this.url}?state=${encodeURIComponent(JSON.stringify(state))}&altHeader=true`;
    },
    speeches() {
      return this.rawSpeeches.map((speech) => {
        if (speech.person.type === 'mp') {
          speech.memberUrl = this.getPersonLink(speech.person);
          speech.partyUrl = this.getPersonPartyLink(speech.person);
        }
        speech.memberImageUrl = this.getPersonPortrait(speech.person);
        speech.formattedDate = dateFormatter(speech.date);
        speech.speechUrl = this.getSessionSpeechLink(speech);
        return speech;
      });
    },
    searchUrl() {
      return `${this.slugs.urls.isci}/filter/${this.keywords}/${this.page}?people=${this.mps.join(',')}&parties=${this.pgs.join(',')}`;
    },
  },
  mounted() {
    axios.get(this.searchUrl)
      .then((res) => {
        this.rawSpeeches = res.data.highlighting || [];
        this.allResults = res.data.response.numFound;
        this.fetching = false;
        if (this.allResults > PAGE_SIZE) {
          this.$refs.scrollElement.addEventListener('scroll', this.checkIfBottom);
        }
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.error(error);
        this.fetching = false;
        this.error = true;
      });
  },
  methods: {
    checkIfBottom() {
      const el = this.$refs.scrollElement;
      if (el.scrollTop + el.offsetHeight >= el.scrollHeight) {
        this.fetchNextPage();
      }
    },
    fetchNextPage() {
      if (this.fetching) {
        return;
      }
      this.fetching = true;
      this.page += 1;
      $.get(this.searchUrl, (response) => {
        this.rawSpeeches = this.rawSpeeches.concat(response.highlighting);
        if (this.allResults <= (this.page + 1) * PAGE_SIZE) {
          this.$refs.scrollElement.removeEventListener('scroll', this.checkIfBottom);
        }
        this.fetching = false;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import '~parlassets/scss/colors';

.infinite-scroll-loader {
  background: $white-hover;
  height: 100%;
  left: 0;
  position: absolute;
  top: 0;
  width: 100%;

  .nalagalnik {
    position: absolute;
    top: calc(50% - 50px);
  }
}

.person-list {
  height: 518px;
  overflow-y: auto;

  .person {
    .date {
      padding-right: 34px;
      text-align: right;
    }

    .quote {
      $line-height: 20px;
      flex: 3;
      font-family: Roboto Slab, Georgia, serif;
      font-size: 14px;
      font-weight: 300;
      height: $line-height * 4;
      line-height: $line-height;
      overflow: hidden;
      text-align: left;

      .funblue-light-hover {
        color: $font-placeholder;

        /deep/ em {
          font-style: normal;
          font-weight: bold;
        }
      }
    }
  }

  @media (max-width: 767px) {
    .person {
      flex-wrap: wrap;

      .name { flex: 2; }

      .date { padding-right: 0; }

      .quote {
        flex: none;
        margin-top: 10px;
        width: calc(100% - 16px);
      }
    }
  }
}
</style>
