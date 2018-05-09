<template>
  <card-wrapper
    contentHeight="518px"
    :id="$options.cardData.cardData._id"
    :card-url="generatedCardUrl"
    :header-config="headerConfig"
  >
    <div slot="info">
      <p class="info-text lead">
        Seznam 5 poslancev, ki največkrat glasujejo enako kot "glas poslanske skupine". Razvrščeni so glede na vrednosti od najmanjše proti največji. Manjša kot je vrednost, večje je ujemanje glasovanj.
      </p>
      <p class="info-text heading">METODOLOGIJA</p>
      <p class="info-text">
        Izračunamo evklidsko razdaljo med rezultati glasovanj poslanske skupine in rezultati vseh ostalih poslancev (pri čemer vrednosti glasov pretvorimo v številčne vrednosti med -1 in 1).
      </p>
      <p class="info-text">
        Ko izračunamo "razdaljo" med vsemi poslanci, jih razvrstimo glede na rezultat in prikažemo prvih pet.
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
import { partyOverview } from 'mixins/contextUrls';
import { partyTitle } from 'mixins/titles';
import PersonList from 'components/PersonList.vue';

export default {
  components: {
    PersonList,
    partyOverview,
    partyTitle,
  },
  mixins: [common],
  name: 'NajveckratGlasujejoEnako',
  data() {
    const people = this.$options.cardData.data.results.map((o) => {
      const { person } = o;
      person.score = o.ratio;
      return person;
    });
    const party = this.$options.cardData.data.organization;
    return {
      data: this.$options.cardData.data,
      party,
      people,
      headerConfig: {
        circleIcon: 'og-list',
        heading: party.name,
        subheading: `${party.acronym} | ${party.is_coalition ? 'koalicija' : 'opozicija'}`,
        alternative: this.$options.cardData.cardData.altHeader === 'true',
        title: this.$options.cardData.cardData.name,
        circleText: party.acronym,
        circleClass: `${party.acronym.replace(/ /g, '_').toLowerCase()}-background`,
      },
    };
  },
  computed: {
    generatedCardUrl() {
      return `${this.url}${this.data.organization.id}?altHeader=true`;
    },
  },
};
</script>
