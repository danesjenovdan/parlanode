<template>
  <card-wrapper
    :id="$options.cardData.mountId"
    :card-url="generatedCardUrl"
    :header-config="headerConfig"
    :og-config="ogConfig"
    content-class="full"
  >
    <div slot="info">
      <p v-t="'info.lead'" class="info-text lead"></p>
      <p v-t="'info.methodology'" class="info-text heading"></p>
      <p v-t="'info.text[0]'" class="info-text"></p>
      <p v-t="'info.text[1]'" class="info-text"></p>
      <div class="info-text">
        <span v-t="'info.text[2]'"></span>
        <ul>
          <li v-t="'info.list[0]'"></li>
          <li v-t="'info.list[1]'"></li>
          <li v-t="'info.list[2]'"></li>
        </ul>
      </div>
    </div>
    <person-list :people="people" :show-party-link="true" />
  </card-wrapper>
</template>

<script>
import common from 'mixins/common';
import { partyVotes } from 'mixins/contextUrls';
import { partyTitle } from 'mixins/titles';
import { partyHeader } from 'mixins/altHeaders';
import { partyOgImage } from 'mixins/ogImages';
import PersonList from 'components/PersonList.vue';

export default {
  name: 'NajmanjkratGlasujejoEnako',
  components: {
    PersonList,
  },
  mixins: [
    common,
    partyVotes,
    partyTitle,
    partyHeader,
    partyOgImage,
  ],
  data() {
    const people = this.$options.cardData.data.results.map((o) => {
      const { person } = o;
      person.score = `${(o.ratio || 0).toFixed(2).replace('.', ',')}`;
      return person;
    });
    const party = this.$options.cardData.data.organization;
    return {
      data: this.$options.cardData.data,
      party,
      people,
    };
  },
  computed: {
    generatedCardUrl() {
      return `${this.url}${this.data.organization.id}?altHeader=true`;
    },
  },
};
</script>
