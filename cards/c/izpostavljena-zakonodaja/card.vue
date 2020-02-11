<template>
  <card-wrapper
    :id="$options.cardData.mountId"
    :card-url="generatedCardUrl"
    :header-config="headerConfig"
    :og-config="ogConfig"
    class="card-halfling card-featured-legislation"
    content-class="full"
  >
    <div slot="info">
      <p v-t="'info.lead'" class="info-text lead"></p>
      <p v-t="'info.methodology'" class="info-text heading"></p>
      <p v-t="'info.text'" class="info-text"></p>
    </div>
    <div class="legislation">
      <p-tabs :start-tab="selectedTab">
        <p-tab :label="$t('under-consideration')">
          <div class="row">
            <div
              v-for="legislation in data.under_consideration"
              :key="legislation.epa"
              class="col-xs-12 col-sm-6 legislation__wrapper"
            >
              <a :href="getLegislationLink(legislation)" class="legislation__single">
                <div class="icon">
                  <div class="img-circle circle">
                    <img
                      v-if="legislation.icon"
                      :src="`${slugs.urls.cdn}/icons/legislation/${legislation.icon}`"
                    >
                  </div>
                </div>
                <div class="text">
                  {{ legislation.text }}
                </div>
              </a>
            </div>
          </div>
        </p-tab>
        <p-tab :label="$t('recently-passed')">
          <div class="legislation row">
            <div
              v-for="legislation in data.accepted"
              :key="legislation.epa"
              class="col-sm-6 legislation__wrapper"
            >
              <a :href="getLegislationLink(legislation)" class="legislation__single">
                <div class="icon">
                  <div class="img-circle circle">
                    <img
                      v-if="legislation.icon"
                      :src="`${slugs.urls.cdn}/icons/legislation/${legislation.icon}`"
                    >
                  </div>
                </div>
                <div class="text">
                  {{ legislation.text }}
                </div>
              </a>
            </div>
          </div>
        </p-tab>
        <p-tab v-if="false" :label="$t('most-discussed')">
          <div class="legislation row">
            <template v-if="mostDiscussedLoading">
              <div class="nalagalnik" />
            </template>
            <template v-else-if="mostDiscussed === false">
              <center>
                ERROR!
              </center>
            </template>
            <template v-else-if="mostDiscussed && mostDiscussed.length < 1">
              <center>
                EMPTY!
              </center>
            </template>
            <template v-else>
              <div
                v-for="legislation in mostDiscussed"
                :key="legislation.epa"
                class="col-sm-6 legislation__wrapper"
              >
                <a :href="getLegislationLink(legislation)" class="legislation__single">
                  <div class="icon">
                    <div class="img-circle circle">
                      <img
                        v-if="legislation.icon"
                        :src="`${slugs.urls.cdn}/icons/legislation/${legislation.icon}`"
                      >
                    </div>
                  </div>
                  <div class="text">
                    {{ legislation.text }}
                  </div>
                </a>
              </div>
            </template>
          </div>
        </p-tab>
      </p-tabs>
      <div class="legislation__all">
        <a
          v-t="'all-legislation'"
          :href="getLegislationListLink()"
          class="legislation-link-icon funblue-light-hover"
        ></a>
      </div>
    </div>
  </card-wrapper>
</template>

<script>
import axios from 'axios';
import { sortBy } from 'lodash';
import common from 'mixins/common';
import links from 'mixins/links';
import commentapi from 'mixins/commentapi';
import { defaultHeaderConfig } from 'mixins/altHeaders';
import { defaultOgImage } from 'mixins/ogImages';
import PTab from 'components/Tab.vue';
import PTabs from 'components/Tabs.vue';

export default {
  name: 'IzpostavljenaZakonodaja',
  components: { PTab, PTabs },
  mixins: [
    common,
    links,
    commentapi,
  ],
  data() {
    return {
      data: this.$options.cardData.data,
      mostDiscussedLoading: true,
      mostDiscussed: [],
      state: this.$options.cardData.parlaState || {},
      selectedTab: this.$options.cardData.parlaState.selectedTab || 0,
      headerConfig: defaultHeaderConfig(this),
      ogConfig: defaultOgImage(this),
    };
  },
  computed: {
    generatedCardUrl() {
      const customUrl = encodeURIComponent(`${this.slugs.urls.analize}/s/getExposedLegislation/`);
      const state = encodeURIComponent(JSON.stringify({ selectedTab: this.selectedTab }));
      return `${this.url}?customUrl=${customUrl}&state=${state}`;
    },
  },
  created() {
    if (this.state.selectedTab) {
      this.selectedTab = this.state.selectedTab;
    }
  },
  mounted() {
    Promise.all([
      axios.get(`${this.slugs.urls.analize}/s/getAllLegislation/`),
      this.$commentapi.getMostDiscussed(),
    ])
      .then(([resAll, resMost]) => {
        const sortedArticles = sortBy(resMost.data.articles || [], ['voter_count']).reverse();
        const epas = sortedArticles.map(a => a.title);
        this.mostDiscussed = epas
          .map(epa => resAll.data.results.find(e => e.epa === epa))
          .filter(Boolean)
          .slice(0, 6);
        this.mostDiscussedLoading = false;
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.log(error);
        this.mostDiscussed = false;
        this.mostDiscussedLoading = false;
      });
  },
};
</script>

<style lang="scss" scoped>
@import "~parlassets/scss/breakpoints";
@import "~parlassets/scss/colors";

.legislation {
  overflow: hidden;

  .tab-content {
    margin-top: 15px;
    overflow-y: auto;
    height: 420px;
  }

  &__single {
    background: $background;
    color: $font-default;
    display: flex;
    align-items: center;
    height: 125px;
    padding: 13px 12px 11px;
    text-decoration: none;

    .text {
      $line-height: 18px;
      line-height: $line-height;
      font-weight: 300;
      font-size: 14px;
      overflow: hidden;
      max-height: $line-height * 4;
    }

    .circle {
      height: 101px;
      width: 102px;
      background-color: $white;
      padding: 20px;
    }

    .icon {
      margin-right: 32px;
    }

    &:hover {
      color: $link;
      background-color: $link-hover-background;
    }

    &:focus,
    &:active,
    &:visited {
      text-decoration: none;
    }
  }

  &__wrapper {
    margin-bottom: 15px;
    position: relative;

    &:nth-child(odd) {
      @include respond-to(desktop) {
        padding-right: 7px;
      }
    }

    &:nth-child(even) {
      @include respond-to(desktop) {
        padding-left: 7px;
      }
    }
  }

  &__all {
    position: absolute;
    left: 0;
    bottom: 0;
    padding: 4px 20px 15px 20px;
    background: $white;
    width: 100%;

    a {
      padding-left: 22px;
      font-size: 14px;
      font-weight: 400;
      text-transform: uppercase;
    }
  }
}
</style>
