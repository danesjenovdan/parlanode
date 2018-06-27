<template>
  <card-wrapper
    :id="$options.cardData.cardData._id"
    :card-url="generatedCardUrl"
    :header-config="headerConfig"
  >
    <div slot="info">
      <p class="info-text lead" v-t="'info.lead'"></p>
      <p class="info-text heading" v-t="'info.methodology'"></p>
      <p class="info-text" v-t="'info.text'"></p>
    </div>

    <seznam-glasovanj :data="votes" :show-filters="false" />
  </card-wrapper>
</template>

<script>
import SeznamGlasovanj from 'components/SeznamGlasovanj.vue';
import common from 'mixins/common';
import { searchTitle } from 'mixins/titles';

export default {
  components: {
    SeznamGlasovanj,
  },
  mixins: [
    common,
    searchTitle,
  ],
  name: 'GlasovanjaIskanje',
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
      const searchUrl = `https://isci.parlameter.si/v2/${this.keywords.replace(/\s+/g, '+')}`;
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
