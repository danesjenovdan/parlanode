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
      <i18n path="info.text[0]" tag="p" class="info-text">
        <a
          v-t="'info.link.text'"
          :href="$t('info.link.link')"
          place="link"
          class="funblue-light-hover"
          target="_blank"
        />
      </i18n>
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
import { memberVotes } from 'mixins/contextUrls';
import { memberTitle } from 'mixins/titles';
import { memberHeader } from 'mixins/altHeaders';
import { memberOgImage } from 'mixins/ogImages';
import PersonList from 'components/PersonList.vue';

export default {
  name: 'NajveckratGlasujejoEnako',
  components: {
    PersonList,
    memberTitle,
  },
  mixins: [
    common,
    memberVotes,
    memberHeader,
    memberOgImage,
  ],
  data() {
    const people = this.$options.cardData.data.results.map((o) => {
      const { person } = o;
      person.score = `${(o.ratio || 0).toFixed(2).replace('.', ',')}`;
      return person;
    });
    return {
      data: this.$options.cardData.data,
      people,
    };
  },
  computed: {
    generatedCardUrl() {
      return `${this.url}${this.data.person.id}?altHeader=true`;
    },
  },
};
</script>
