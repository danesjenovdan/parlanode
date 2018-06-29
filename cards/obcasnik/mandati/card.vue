<template>
  <card-wrapper
    :id="$options.cardData.cardData._id"
    :card-url="generatedCardUrl"
    :header-config="headerConfig">

    <div slot="info">
      <p class="info-text lead"></p>
      <p class="info-text heading">METODOLOGIJA</p>
      <p class="info-text">Kartica predstavlja seznam desetih poslank in poslancev trenutnega sklica DZ, ki imajo največ mandatov. Število mandatov smo prešteli "na roke" z brskanjem po spletnem mestu <a href="http://www.dz-rs.si/">DZ RS</a>.</p>
    </div>

    <ul class="person-list">
      <li class="person" v-for="member in data">
        <a :href="slugs.urls.base + slugs.personLink.base + slugs.person[member.id].slug + slugs.personLink.pregled" class="portrait column">
                <img :src="'https://cdn.parlameter.si/v1/parlassets/img/people/square/' + member.gov_id + '.png'" />
            </a>
        <div class="column name">
          <a :href="slugs.urls.base + slugs.personLink.base + slugs.person[member.id].slug + slugs.personLink.pregled" class="funblue-light-hover">{{ member.name }}</a><br>
          <a v-if="member.acronym.indexOf('NeP') === -1" :href="slugs.urls.base + slugs.partyLink.base + slugs.party[member.party_id].acronym + slugs.partyLink.pregled" class="funblue-light-hover">{{ member.acronym }}</a>
          <span v-if="member.acronym.indexOf('NeP') !== -1">{{ member.acronym }}</span>
        </div>
        <div class="column large-number">
          {{ member.mandates }}
        </div>
      </li>
    </ul>
  </card-wrapper>
</template>

<script>
import common from 'mixins/common';

export default {
  components: {},
  mixins: [common],
  name: 'ImeKartice',
  data() {
    return {
      data: this.$options.cardData.data
        .filter(person => person.mandates > 3)
        .sort((a, b) => b.mandates - a.mandates),
      headerConfig: {
        circleIcon: 'og-list',
        heading: '&nbsp;',
        subheading: '7. sklic parlamenta',
        alternative: this.$options.cardData.cardData.altHeader === 'true',
        title: this.$options.cardData.cardData.name,
      },
      generatedCardUrl: `${this.url}?customUrl=https%3A%2F%2Fcdn.parlameter.si%2Fv1%2Fdata%2Fmandati.json`,
    };
  },
};
</script>

<style lang="scss" scoped>

</style>
