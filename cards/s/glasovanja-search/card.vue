<template>
  <card-wrapper
    :id="$root.$options.cardData.mountId"
    :content-class="['full', {'is-loading': loading}]"
    :card-url="generatedCardUrl"
    :header-config="headerConfig"
    :og-config="ogConfig"
  >
    <div slot="info">
      <p v-t="'info.lead'" class="info-text lead"></p>
      <p v-t="'info.methodology'" class="info-text heading"></p>
      <p v-t="'info.text'" class="info-text"></p>
    </div>

    <seznam-glasovanj v-if="data" :data="votes" :show-filters="false" />
  </card-wrapper>
</template>

<script>
import axios from 'axios';
import SeznamGlasovanj from 'components/SeznamGlasovanj.vue';
import common from 'mixins/common';
import { search as searchContext } from 'mixins/contextUrls';
import { searchHeader } from 'mixins/altHeaders';
import { searchOgImage } from 'mixins/ogImages';
import { searchTitle } from 'mixins/titles';
import stateLoader from 'helpers/stateLoader';

export default {
  name: 'GlasovanjaIskanje',
  components: {
    SeznamGlasovanj,
  },
  mixins: [
    common,
    searchTitle,
    searchHeader,
    searchOgImage,
    searchContext,
  ],
  data() {
    const loadFromState = stateLoader(this.$root.$options.cardData.parlaState);
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
      return `${this.url}?state=${encodeURIComponent(JSON.stringify(state))}&altHeader=true`;
    },
    votes() {
      if (this.data) {
        return {
          votes: this.data.map(motion => ({
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
    const searchUrl = `${this.slugs.urls.isci}/search/votes?q=${encodeURIComponent(this.keywords)}`;
    axios.get(searchUrl)
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
