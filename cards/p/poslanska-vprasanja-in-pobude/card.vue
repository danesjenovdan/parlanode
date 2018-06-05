<template>
  <card-wrapper
    :id="$options.cardData.cardData._id"
    :card-url="generatedCardUrl"
    :header-config="headerConfig"
  >
    <div slot="info">
      <p class="info-text lead">
        Izpis vseh poslanskih vprašanj in pobud, ki ji je {{vocabulary.poslanec[data.person.gender]}} {{vocabulary.postaviti[data.person.gender]}} v tem sklicu DZ RS.
      </p>
      <p class="info-text heading">METODOLOGIJA</p>
      <p class="info-text">
        Podatke pridobivamo s spletnega mesta <a class="funblue-light-hover" target="_blank" href="https://www.dz-rs.si/wps/portal/Home/deloDZ/poslanskaVprasanjaInPobude/">DZ RS</a>.
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
  name: 'PoslanskaVprasanjaInPobudePoslanca',
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
