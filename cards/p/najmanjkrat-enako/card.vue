<template>
  <card-wrapper
    contentHeight="518px"
    :id="$options.cardData.cardData._id"
    :card-url="generatedCardUrl"
    :header-config="headerConfig"
  >
    <div slot="info">
      <p class="info-text lead">
        Seznam 5 poslancev, ki najmanjkrat glasujejo enako kot {{vocabulary.izbrani[data.person.gender]}} {{vocabulary.poslanec[data.person.gender]}}. Poslanci so razvrščeni glede na vrednosti od največje proti najmanjši. Večja kot je vrednost, manjše je ujemanje glasovanj.
      </p>
      <p class="info-text heading">
        METODOLOGIJA
      </p>
      <p class="info-text">
        Izračunamo <a href="https://en.wikipedia.org/wiki/Euclidean_distance">evklidsko razdaljo</a> med rezultati {{vocabulary.poslanca[data.person.gender]}} glasovanj in rezultati vseh ostalih (pri čemer vrednosti glasov pretvorimo v številčne vrednosti med -1 in 1).
      </p>
      <p class="info-text">
        Ko izračunamo "razdaljo" med vsemi poslanci, jih razvrstimo glede na rezultat in prikažemo zadnjih oz. najbolj oddaljenih pet.
      </p>
      <div class="info-text">
        Številčne vrednosti glasov
        <ul class="info-text">
          <li>-1: proti</li>
          <li>0: vzdržan/-a ali ni prisoten/-na</li>
          <li>1: za</li>
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
import PersonList from 'components/PersonList.vue';

export default {
  components: {
    PersonList,
    memberOverview,
    memberTitle,
  },
  mixins: [common],
  name: 'NajmanjkratGlasujejoEnako',
  data() {
    const people = this.$options.cardData.data.results.map((o) => {
      const { person } = o;
      person.score = `${o.ratio.toFixed(2).replace('.', ',')}`;
      return person;
    });
    const { person } = this.$options.cardData.data;
    return {
      data: this.$options.cardData.data,
      people,
      headerConfig: {
        alternative: this.$options.cardData.cardData.altHeader === 'true',
        title: this.$options.cardData.cardData.name,
        heading: person.name,
        subheading: `${person.party.acronym} | ${person.party.is_coalition ? 'koalicija' : 'opozicija'}`,
        circleImage: person.gov_id,
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
