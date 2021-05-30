<template>
  <card-wrapper
    :id="$options.cardData.mountId"
    :content-class="['full', { 'is-loading': loading }]"
    :card-url="generatedCardUrl"
    :header-config="headerConfig"
    :og-config="ogConfig"
  >
    <template #info>
      <p v-t="'info.lead'" class="info-text lead"></p>
      <p v-t="'info.methodology'" class="info-text heading"></p>
      <p v-t="'info.text'" class="info-text"></p>
    </template>

    <seznam-glasovanj v-if="data" :data="votes" :show-filters="false" />
  </card-wrapper>
</template>

<script>
import axios from 'axios';
import SeznamGlasovanj from '@/_components/SeznamGlasovanj.vue';
import common from '@/_mixins/common.js';
import { search as searchContext } from '@/_mixins/contextUrls.js';
import { searchHeader } from '@/_mixins/altHeaders.js';
import { searchOgImage } from '@/_mixins/ogImages.js';
import { searchTitle } from '@/_mixins/titles.js';
import stateLoader from '@/_helpers/stateLoader.js';

export default {
  name: 'CardSGlasovanjaSearch',
  components: {
    SeznamGlasovanj,
  },
  mixins: [common, searchTitle, searchHeader, searchOgImage, searchContext],
  data() {
    const loadFromState = stateLoader(this.$options.cardData.parlaState);
    return {
      data: null,
      currentSort: '',
      currentSortOrder: 'DESC',
      workingBodies: [],
      keywords: loadFromState('query'),
      loading: true,
    };
  },
  computed: {
    generatedCardUrl() {
      const state = { query: this.keywords };
      return `${this.url}?state=${encodeURIComponent(
        JSON.stringify(state)
      )}&altHeader=true`;
    },
    votes() {
      if (this.data) {
        return {
          votes: this.data.map((motion) => ({
            ...motion.results,
            session_id: motion.session.id,
          })),
          session: {},
          tags: [],
        };
      }
      return {
        votes: [],
        session: {},
        tags: [],
      };
    },
  },
  mounted() {
    const searchUrl = `${
      this.slugs.urls.isci
    }/search/votes?q=${encodeURIComponent(this.keywords)}`;
    axios
      .get(searchUrl)
      .then((res) => {
        this.data = (res.data.response && res.data.response.docs) || [];
        this.loading = false;
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.error(error);
        this.loading = false;
        this.error = true;
      });
  },
};
</script>
