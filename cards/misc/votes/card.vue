<template>
  <card-wrapper
    :id="$options.cardData.mountId"
    :card-url="generatedCardUrl"
    :header-config="headerConfig"
    :og-config="ogConfig"
  >
    <template #info>
      <p v-t="'info.lead'" class="info-text lead"></p>
      <p v-t="'info.methodology'" class="info-text heading"></p>
      <p v-t="'info.text[0]'" class="info-text"></p>
      <i18n-t keypath="info.text[1]" tag="p" class="info-text">
        <a
          v-t="'info.links[0].text'"
          :href="$t('info.links[0].link')"
          place="link"
          class="funblue-light-hover"
          target="_blank"
        />
      </i18n-t>
      <i18n-t keypath="info.text[2]" tag="p" class="info-text">
        <a
          v-t="'info.links[1].text'"
          :href="$t('info.links[1].link')"
          place="link1"
          class="funblue-light-hover"
          target="_blank"
        />
        <a
          v-t="'info.links[2].text'"
          :href="$t('info.links[2].link')"
          place="link2"
          class="funblue-light-hover"
          target="_blank"
        />
      </i18n-t>
      <i18n-t keypath="info.text[3]" tag="p" class="info-text">
        <a
          v-t="'info.links[3].text'"
          :href="$t('info.links[3].link')"
          place="link"
          class="funblue-light-hover"
          target="_blank"
        />
      </i18n-t>
      <p v-t="'info.text[4]'" class="info-text"></p>
    </template>

    <seznam-glasovanj
      :data="votes"
      :filters="filters"
      virtualize
      @filters-changed="onFiltersChanged"
    />
  </card-wrapper>
</template>

<script>
import common from '@/_mixins/common.js';
import links from '@/_mixins/links.js';
import { defaultHeaderConfig } from '@/_mixins/altHeaders.js';
import { defaultOgImage } from '@/_mixins/ogImages.js';
import SeznamGlasovanj from '@/_components/SeznamGlasovanj.vue';

export default {
  name: 'CardCVsaGlasovanja',
  components: {
    SeznamGlasovanj,
  },
  mixins: [common, links],
  data() {
    const state = this.$options.cardData.parlaState;
    const text = state && state.text ? state.text : '';
    const tags = state && state.tags ? state.tags : [];
    const classifications =
      state && state.classifications ? state.classifications : [];
    const results = state && state.results ? state.results : [];

    return {
      data: this.$options.cardData.data,
      filters: {
        text,
        tags,
        classifications,
        results,
      },
      headerConfig: defaultHeaderConfig(this, {}),
      ogConfig: defaultOgImage(this, {}),
    };
  },
  computed: {
    generatedCardUrl() {
      const state = {};

      if (this.filters.text) {
        state.text = this.filters.text;
      }
      if (this.filters.tags.length) {
        state.tags = this.filters.tags;
      }
      if (this.filters.classifications.length) {
        state.classifications = this.filters.classifications;
      }
      if (this.filters.results.length) {
        state.results = this.filters.results;
      }
      if (
        this.$options.cardData.parlaState &&
        this.$options.cardData.parlaState.onlyOther
      ) {
        state.onlyOther = true;
      }

      return `${this.url}?state=${encodeURIComponent(
        JSON.stringify(state)
      )}&altHeader=true`;
    },
    votes() {
      let votes = this.data.results.map((v) => v.results);
      if (
        this.$options.cardData.parlaState &&
        this.$options.cardData.parlaState.onlyOther
      ) {
        votes = votes.filter((vote) => !vote.epa);
      }
      return {
        votes,
        session: this.data.session,
        tags: this.data.tags,
        classifications: this.data.classifications,
      };
    },
  },
  created() {
    const { template, siteMap: sm } = this.$options.cardData;
    template.contextUrl = `${this.slugs.urls.base}/${sm.landing.legislation}`;
  },
  methods: {
    onFiltersChanged(newFilters) {
      this.filters = newFilters;
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep #votingCard {
  height: auto;
  min-height: 500px;
}
</style>
