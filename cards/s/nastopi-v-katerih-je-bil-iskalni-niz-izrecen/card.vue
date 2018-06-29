<template>
  <card-wrapper
    :id="$options.cardData.cardData._id"
    :card-url="generatedCardUrl"
    :header-config="headerConfig"
    content-height="518px"
  >
    <div slot="info">
      <p v-t="'info.lead'" class="info-text lead"></p>
      <p v-t="'info.methodology'" class="info-text heading"></p>
      <p v-t="'info.text'" class="info-text"></p>
    </div>

    <div v-t="'no-results'" v-if="rawSpeeches.length === 0" class="no-results"></div>
    <scroll-shadow v-else ref="shadow">
      <ul ref="scrollElement" class="person-list thing-list" @scroll="$refs.shadow.check($event.currentTarget)">
        <li v-for="speech in speeches" :key="speech.speech_id" class="person">
          <template v-if="speech.person.type === 'mp'">
            <a :href="speech.memberUrl" class="column portrait">
              <img :src="speech.memberImageUrl">
            </a>
            <div class="column name">
              <a :href="speech.memberUrl" class="funblue-light-hover">{{ speech.person.name }}</a><br>
              <template v-if="speech.partyUrl">
                <a :href="speech.partyUrl" class="funblue-light-hover">{{ speech.person.party.acronym }}</a>
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
import common from 'mixins/common';
import { searchTitle } from 'mixins/titles';
import {
  getPersonLink,
  getPersonPartyLink,
  getPersonPortrait,
  getSessionSpeechLink,
} from 'components/links';
import dateFormatter from 'helpers/dateFormatter';
import ScrollShadow from 'components/ScrollShadow.vue';

const PAGE_SIZE = 50;

export default {
  name: 'NastopiVKaterihJeBilIskalniNizIzrecen',
  components: {
    ScrollShadow,
  },
  mixins: [
    common,
    searchTitle,
  ],
  data() {
    const keywords = this.$options.cardData.data.responseHeader.params.q
      .split('content_t:')[1].split(')')[0];
    return {
      data: this.$options.cardData.data,
      headerConfig: {
        circleIcon: 'og-search',
        heading: keywords,
        subheading: 'iskalni niz',
        alternative: this.$options.cardData.cardData.altHeader === 'true',
        title: this.$options.cardData.cardData.name,
      },
      keywords,
      rawSpeeches: this.$options.cardData.data.highlighting,
      allResults: this.$options.cardData.data.response.numFound,
      page: 0,
      fetching: false,
    };
  },
  computed: {
    generatedCardUrl() {
      const state = { text: this.keywords };
      const searchUrl = `${this.slugs.urls.isci}/q/${this.keywords}`;
      return `${this.url}?state=${encodeURIComponent(JSON.stringify(state))}&altHeader=true&customUrl=${encodeURIComponent(searchUrl)}`;
    },
    speeches() {
      return this.rawSpeeches.map((speech) => {
        if (speech.person.type === 'mp') {
          speech.memberUrl = getPersonLink(speech.person);
          speech.partyUrl = getPersonPartyLink(speech.person);
        }
        speech.memberImageUrl = getPersonPortrait(speech.person);
        speech.formattedDate = dateFormatter(speech.date);
        speech.speechUrl = getSessionSpeechLink(speech);
        return speech;
      });
    },
  },
  mounted() {
    if (this.allResults > PAGE_SIZE) {
      this.$refs.scrollElement.addEventListener('scroll', this.checkIfBottom);
    }
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
      $.get(`${this.slugs.urls.isci}/q/${this.keywords}/${this.page}`, (response) => {
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
  background: rgba($white, 0.75);
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
        color: $black;

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
