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

    <div
      v-if="!loading && people && people.length === 0"
      v-t="'no-results'"
      class="no-results"
    />
    <person-list v-else :people="people" :show-party-link="true" />
  </card-wrapper>
</template>

<script>
import axios from 'axios';
import common from '@/_mixins/common.js';
import { search as searchContext } from '@/_mixins/contextUrls.js';
import { searchTitle } from '@/_mixins/titles.js';
import { searchHeader } from '@/_mixins/altHeaders.js';
import { searchOgImage } from '@/_mixins/ogImages.js';
import PersonList from '@/_components/PersonList.vue';
import stateLoader from '@/_helpers/stateLoader.js';

export default {
  name: 'NajveckratSoPojemUporabili',
  components: {
    PersonList,
  },
  mixins: [common, searchTitle, searchHeader, searchOgImage, searchContext],
  data() {
    const loadFromState = stateLoader(this.$options.cardData.parlaState);
    return {
      currentSort: '',
      currentSortOrder: 'DESC',
      workingBodies: [],
      keywords: loadFromState('query'),
      mps: loadFromState('mps') || [],
      pgs: loadFromState('pgs') || [],
      loading: true,
      people: [],
    };
  },
  computed: {
    generatedCardUrl() {
      const state = { query: this.keywords };
      return `${this.url}?state=${encodeURIComponent(
        JSON.stringify(state)
      )}&altHeader=true`;
    },
  },
  mounted() {
    const searchUrl = `${
      this.slugs.urls.isci
    }/search/speeches?q=${encodeURIComponent(
      this.keywords
    )}&people=${this.mps.join(',')}&parties=${this.pgs.join(',')}`;
    axios
      .get(searchUrl)
      .then((res) => {
        const people = res.data.facet_counts.facet_fields.person
          .map((o) => {
            const { person } = o;
            person.score = `${Math.round(o.score)}`;
            return person;
          })
          .filter((person) => person.score > 0)
          .slice(0, 5);
        this.people = people;
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
