<template>
  <card-wrapper
    :id="$options.cardData.cardData._id"
    :content-class="{'is-loading': loading}"
    :card-url="generatedCardUrl"
    :header-config="headerConfig"
    :og-config="ogConfig"
  >
    <div slot="info">
      <p v-t="'info.lead'" class="info-text lead"></p>
      <p v-t="'info.methodology'" class="info-text heading"></p>
      <p v-t="'info.text'" class="info-text"></p>
    </div>

    <person-list :people="people" :show-party-link="true" />
  </card-wrapper>
</template>

<script>
import axios from 'axios';
import common from 'mixins/common';
import { searchTitle } from 'mixins/titles';
import { searchHeader } from 'mixins/altHeaders';
import { searchOgImage } from 'mixins/ogImages';
import PersonList from 'components/PersonList.vue';
import stateLoader from 'helpers/stateLoader';

export default {
  name: 'NajveckratSoPojemUporabili',
  components: {
    PersonList,
  },
  mixins: [
    common,
    searchTitle,
    searchHeader,
    searchOgImage,
  ],
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
      return `${this.url}?state=${encodeURIComponent(JSON.stringify(state))}&altHeader=true`;
    },
  },
  mounted() {
    const searchUrl = `${this.slugs.urls.isci}/filter/${this.keywords}?people=${this.mps.join(',')}&parties=${this.pgs.join(',')}`;
    axios.get(searchUrl)
      .then((res) => {
        const people = res.data.facet_counts.facet_fields.speaker_i
          .map((o) => {
            const { person } = o;
            person.score = `${Math.round(o.score)}`;
            return person;
          })
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
