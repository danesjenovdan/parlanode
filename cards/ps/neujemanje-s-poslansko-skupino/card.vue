<template>
  <card-wrapper
    :id="$options.cardData.cardData._id"
    contentHeight="518px"
    :card-url="generatedCardUrl"
    :header-config="headerConfig"
  >
    <div slot="info">
      <p class="info-text lead">
        Seznam vseh poslancev poslanske skupine, ki so razvrščeni glede na vrednost ujemanja z glasom poslanske skupine. Večja kot je vrednost, manjše je ujemanje.
      </p>
      <p class="info-text heading">METODOLOGIJA</p>
      <p class="info-text">
        Za vsako glasovanje izračunamo "glas poslanske skupine", ki ji posamezni/-a poslanec/-ka. Potem za vsakega člana/-ico izračunamo odstotek glasovanj, na katerih je poslanec/-ka glasoval/-a drugače od večinskega glasu poslanske skupine in rezultate razvrstimo od največjega odstopanja proti najmanjšemu.
      </p>
      <p class="info-text">
        Vse glasovnice z vrednostjo "NI" ignoriramo, kar ima za posledico to, da če je večinski glas poslanske skupine "NI" (večina poslank in poslancev se glasovanja ni udeležila) to glasovanje iz analize izključimo. Če ima poslanska skupina več "večinskih glasov" (dve opciji imata enako največje število glasov znotraj poslanske skupine) upoštevamo obe opciji pri primerjavi z individualnimi poslanci ni poslankami.
      </p>
    </div>
    <person-list :people="people" />
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
  name: 'NeujemanjeSPoslanskoSkupino',
  data() {
    const people = this.$options.cardData.data.results.map((o) => {
      const { person } = o;
      person.score = `${o.ratio.toFixed(2).replace('.', ',')} %`;
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
