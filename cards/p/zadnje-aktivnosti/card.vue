<template>
  <card-wrapper
    contentHeight="518px"
    :id="$options.cardData.cardData._id"
    :card-url="generatedCardUrl"
    :header-config="headerConfig"
  >
    <div slot="info">
      <p class="info-text lead">
        Povezave do vseh {{vocabulary.poslanca[data.person.gender]}} glasovanj in govorov, ki so se zgodili v zadnjih desetih dneh, ko je {{vocabulary.biti[data.person.gender]}} {{vocabulary.poslanec[data.person.gender]}} {{vocabulary.aktiven[data.person.gender]}}.
      </p>
      <p class="info-text heading">METODOLOGIJA</p>
      <p class="info-text">
        Podatke dobimo s spletnega mesta Državnega zbora. Na kartici izpisujemo povezave do vseh {{vocabulary.poslanca[data.person.gender]}} glasovanj in govorov, ki so se zgodili v zadnjih desetih dneh, ko je {{vocabulary.biti[data.person.gender]}} {{vocabulary.poslanec[data.person.gender]}} {{vocabulary.aktiven[data.person.gender]}}.
      </p>
    </div>
    <question-list :questionDays="data.results" />
  </card-wrapper>
</template>

<script>
import common from 'mixins/common';
import { memberOverview } from 'mixins/contextUrls';
import { memberTitle } from 'mixins/titles';
import QuestionList from 'components/QuestionList.vue';

export default {
  name: 'ZadnjeAktivnosti',
  mixins: [common, memberOverview, memberTitle],
  components: { QuestionList },
  data() {
    const { person } = this.$options.cardData.data;
    return {
      data: this.$options.cardData.data,
      headerConfig: {
        heading: person.name,
        subheading: `${person.party.acronym} | ${person.party.is_coalition ? 'koalicija' : 'opozicija'}`,
        circleImage: person.gov_id,
        alternative: this.$options.cardData.cardData.altHeader === 'true',
        title: this.$options.cardData.cardData.name,
      },
    };
  },
  computed: {
    generatedCardUrl() {
      return `${this.url}${this.data.person.id}?altHeader=true`;
    },
  },
};
</script>

<style lang="scss" scoped>
.questions {
  margin-top: 0;
}
</style>
