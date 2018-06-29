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

    <person-list :people="people" :show-party-link="true" />
  </card-wrapper>
</template>

<script>
import common from 'mixins/common';
import { searchTitle } from 'mixins/titles';
import PersonList from 'components/PersonList.vue';

export default {
  name: 'NajveckratSoPojemUporabili',
  components: {
    PersonList,
  },
  mixins: [
    common,
    searchTitle,
  ],
  data() {
    const keywords = this.$options.cardData.data.responseHeader.params.q.split('content_t:')[1];
    const { data } = this.$options.cardData;
    const people = data.facet_counts.facet_fields.speaker_i
      .map((o) => {
        const { person } = o;
        person.score = `${Math.round(o.score)}`;
        return person;
      })
      .slice(0, 5);
    return {
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
      people,
    };
  },
  computed: {
    generatedCardUrl() {
      const state = { text: this.keywords };
      const searchUrl = `${this.slugs.urls.isci}/q/${this.keywords}`;
      return `${this.url}?state=${encodeURIComponent(JSON.stringify(state))}&altHeader=true&customUrl=${encodeURIComponent(searchUrl)}`;
    },
  },
};
</script>
