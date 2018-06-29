<template>
  <card-wrapper
    :id="$options.cardData.cardData._id"
    :card-url="generatedCardUrl"
    :header-config="headerConfig"
    class="card-halfling card-featured-legislation"
    content-height="518px"
  >
    <div slot="info">
      <p v-t="'info.lead'" class="info-text lead"></p>
      <p v-t="'info.methodology'" class="info-text heading"></p>
      <p v-t="'info.text'" class="info-text"></p>
    </div>
    <div class="p-tabs-2col legislation">
      <p-tabs :start-tab="selectedTab">
        <p-tab :label="$t('under-consideration')">
          <div class="row">
            <div
              v-for="legislation in data.under_consideration"
              :key="legislation.epa"
              class="col-xs-12 col-sm-6 legislation__wrapper"
            >
              <a :href="slugs.legislationLink + legislation.epa" class="legislation__single">
                <div class="icon">
                  <div class="img-circle circle">
                    <img v-if="legislation.icon" :src="'https://cdn.parlameter.si/v1/parlassets/icons/legislation/' + legislation.icon">
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
              <a :href="slugs.legislationLink + legislation.epa" class="legislation__single">
                <div class="icon">
                  <div class="img-circle circle">
                    <img v-if="legislation.icon" :src="'https://cdn.parlameter.si/v1/parlassets/icons/legislation/' + legislation.icon">
                  </div>
                </div>
                <div class="text">
                  {{ legislation.text }}
                </div>
              </a>
            </div>
          </div>
        </p-tab>
      </p-tabs>
      <div class="legislation__all">
        <a v-t="'all-legislation'" :href="`${slugs.legislationLink}`"></a>
      </div>
    </div>
  </card-wrapper>
</template>

<script>
import common from 'mixins/common';

import PTab from 'components/Tab.vue';
import PTabs from 'components/Tabs.vue';

export default {
  name: 'IzpostavljenaZakonodaja',
  components: { PTab, PTabs },
  mixins: [common],
  data() {
    return {
      data: this.$options.cardData.data,
      state: this.$options.cardData.parlaState || {},
      selectedTab: this.$options.cardData.parlaState.selectedTab || 0,
      headerConfig: {
        circleIcon: 'og-list',
        heading: '&nbsp;',
        alternative: this.$options.cardData.cardData.altHeader === 'true',
        title: this.$options.cardData.cardData.name,
      },
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
    background: $grey;
    color: $black;
    display: flex;
    align-items: center;
    height: 125px;
    padding: 13px 12px 11px;
    text-decoration: none;

    .text {
      line-height: 18px;
      font-weight: 300;
      font-size: 14px;
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
      background-color: #e7f5fe;
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
    background: #ffffff;
    width: 100%;

    a {
      padding: 3px;
      padding-left: 32px;
      background: url(https://cdn.parlameter.si/v1/parlassets/icons/zakonodaja-modra.svg)
        no-repeat top left;
      font-size: 14px;
      font-weight: 400;
      color: #227497;
      text-transform: uppercase;
    }
  }
}
</style>
