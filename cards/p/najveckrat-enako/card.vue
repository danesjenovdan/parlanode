<template>
  <card-wrapper
    contentHeight="518px"
    :id="$options.cardData.cardData._id"
    :card-url="generatedCardUrl"
    :header-config="headerConfig"
  >
    <div slot="info">
      <p class="info-text lead" v-t="'info.lead'"></p>
      <p class="info-text heading" v-t="'info.methodology'"></p>
      <i18n path="info.text[0]" tag="p" class="info-text">
        <a
          place="link"
          class="funblue-light-hover"
          target="_blank"
          :href="$t('info.link.link')"
          v-t="'info.link.text'"
        />
      </i18n>
      <p class="info-text" v-t="'info.text[1]'"></p>
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
import { memberOverview } from 'mixins/contextUrls';
import { memberTitle } from 'mixins/titles';
import { memberHeader } from 'mixins/altHeaders';
import PersonList from 'components/PersonList.vue';

export default {
  components: {
    PersonList,
    memberOverview,
    memberTitle,
  },
  mixins: [
    common,
    memberHeader,
  ],
  name: 'NajveckratGlasujejoEnako',
  data() {
    const people = this.$options.cardData.data.results.map((o) => {
      const { person } = o;
      person.score = `${o.ratio.toFixed(2).replace('.', ',')}`;
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
