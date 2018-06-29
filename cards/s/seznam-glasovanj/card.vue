<template>
  <card-wrapper
    :id="$options.cardData.cardData._id"
    :card-url="generatedCardUrl"
    :header-config="headerConfig"
  >
    <div slot="info">
      <p class="info-text lead" v-t="'info.lead'"></p>
      <p class="info-text heading" v-t="'info.methodology'"></p>
      <p class="info-text" v-t="'info.text[0]'"></p>
      <i18n path="info.text[1]" tag="p" class="info-text">
        <a
          place="link1"
          class="funblue-light-hover"
          target="_blank"
          :href="$t('info.links[0].link')"
          v-t="'info.links[0].text'"
        />
      </i18n>
      <i18n path="info.text[2]" tag="p" class="info-text">
        <a
          place="link2"
          class="funblue-light-hover"
          target="_blank"
          :href="$t('info.links[1].link')"
          v-t="'info.links[1].text'"
        />
        <a
          place="link3"
          class="funblue-light-hover"
          target="_blank"
          :href="$t('info.links[2].link')"
          v-t="'info.links[2].text'"
        />
      </i18n>
      <i18n path="info.text[3]" tag="p" class="info-text">
        <a
          place="link4"
          class="funblue-light-hover"
          target="_blank"
          :href="$t('info.links[3].link')"
          v-t="'info.links[3].text'"
        />
      </i18n>
    </div>

    <seznam-glasovanj :data="votes" :filters="filters" @filters-changed="onFiltersChanged" />
  </card-wrapper>
</template>

<script>
import common from 'mixins/common';
import SeznamGlasovanj from 'components/SeznamGlasovanj.vue';

export default {
  mixins: [
    common,
  ],
  components: {
    SeznamGlasovanj,
  },
  name: 'GlasovanjaSeja',
  created() {
    this.$options.cardData.template.contextUrl = `${this.slugs.urls.base}/seja/glasovanja/${this.data.session.id}`;
    this.$options.cardData.template.pageTitle = `Druga glasovanja - ${this.$options.cardData.data.session.name}`;
  },
  data() {
    const state = this.$options.cardData.parlaState;
    const text = state && state.text ? state.text : '';
    const tags = state && state.tags ? state.tags : [];
    const results = state && state.results ? state.results : [];

    const sessionName = this.$options.cardData.data.session.name;
    let imageName = 'seja-redna';
    if (sessionName.indexOf('izredna') !== -1) {
      imageName = 'seja-izredna';
    } else if (sessionName.indexOf('nujna') !== -1) {
      imageName = 'seja-nujna';
    }
    return {
      data: this.$options.cardData.data,
      filters: {
        text,
        tags,
        results,
      },
      headerConfig: {
        mediaImage: imageName,
        heading: this.$options.cardData.data.session.name,
        subheading: this.$options.cardData.data.session.date,
        alternative: this.$options.cardData.cardData.altHeader === 'true',
        title: this.$options.cardData.cardData.name,
      },
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
      if (this.filters.results.length) {
        state.results = this.filters.results;
      }
      if (this.$options.cardData.parlaState && this.$options.cardData.parlaState.onlyOther) {
        state.onlyOther = true;
      }

      return `${this.url}${this.data.session.id}?state=${encodeURIComponent(JSON.stringify(state))}&altHeader=true`;
    },
    votes() {
      let votes = this.data.results.map(v => v.results);
      if (this.$options.cardData.parlaState && this.$options.cardData.parlaState.onlyOther) {
        votes = votes.filter(vote => !vote.epa);
      }
      return {
        votes,
        session: this.data.session,
        tags: this.data.tags,
      };
    },
  },
  methods: {
    onFiltersChanged(newFilters) {
      this.filters = newFilters;
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
