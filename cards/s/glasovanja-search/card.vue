<template>
  <card-wrapper
    :id="$options.cardData.cardData._id"
    :card-url="generatedCardUrl"
    :header-config="headerConfig"
  >
    <div slot="info">
      <p v-t="'info.lead'" class="info-text lead"></p>
      <p v-t="'info.methodology'" class="info-text heading"></p>
      <p v-t="'info.text'" class="info-text"></p>
    </div>

    <seznam-glasovanj :data="votes" :show-filters="false" />
  </card-wrapper>
</template>

<script>
import SeznamGlasovanj from 'components/SeznamGlasovanj.vue';
import common from 'mixins/common';
import { searchTitle } from 'mixins/titles';

export default {
  name: 'GlasovanjaIskanje',
  components: {
    SeznamGlasovanj,
  },
  mixins: [
    common,
    searchTitle,
  ],
  data() {
    const keywords = this.$options.cardData.data.search_query.replace(/\+/g, ' ');
    return {
      data: this.$options.cardData.data.data,
      currentSort: '',
      currentSortOrder: 'DESC',
      workingBodies: [],
      headerConfig: {
        circleIcon: 'og-search',
        heading: keywords,
        subheading: 'iskalni niz',
        alternative: this.$options.cardData.cardData.altHeader === 'true',
        title: this.$options.cardData.cardData.name,
      },
      keywords,
    };
  },
  computed: {
    generatedCardUrl() {
      const state = { text: this.keywords };
      const searchUrl = `${this.slugs.urls.isci}/v2/${this.keywords.replace(/\s+/g, '+')}`;
      return `${this.url}?state=${encodeURIComponent(JSON.stringify(state))}&altHeader=true&customUrl=${encodeURIComponent(searchUrl)}`;
    },
    votes() {
      return {
        votes: this.data.map(motion => ({
          ...motion.results,
          session_id: motion.session.id,
        })),
        session: {},
        tags: [],
      };
    },
  },
};
</script>
