<template>
  <card-wrapper
    :id="$options.cardData.mountId"
    :card-url="generatedCardUrl"
    :header-config="headerConfig"
    :og-config="ogConfig"
  >
    <div slot="info">
      <p class="info-text lead"></p>
      <p class="info-text heading">METODOLOGIJA</p>
      <p class="info-text">Kartica predstavlja seznam desetih poslank in poslancev trenutnega sklica DZ, ki imajo največ mandatov. Število mandatov smo prešteli "na roke" z brskanjem po spletnem mestu <a href="http://www.dz-rs.si/">DZ RS</a>.</p>
    </div>

    <ul class="person-list">
      <li v-for="member in data" :key="member.id" class="person">
        <a :href="getPersonLink(member)" class="portrait column">
          <img :src="getPersonPortrait(member)">
        </a>
        <div class="column name">
          <a :href="getPersonLink(member)" class="funblue-light-hover">{{ member.name }}</a><br>
          <a
            v-if="member.acronym.indexOf('NeP') === -1"
            :href="getMemberPartyIdLink(member)"
            class="funblue-light-hover"
          >{{ member.acronym }}</a>
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
import { defaultHeaderConfig } from 'mixins/altHeaders';
import { defaultOgImage } from 'mixins/ogImages';
import links from 'mixins/links';

export default {
  name: 'ObcasnikMandati',
  components: {},
  mixins: [
    common,
    links,
  ],
  data() {
    return {
      data: this.$options.cardData.data
        .filter(person => person.mandates > 3)
        .sort((a, b) => b.mandates - a.mandates),
      headerConfig: defaultHeaderConfig(this),
      ogConfig: defaultOgImage(this),
      generatedCardUrl: `${this.url}?customUrl=https%3A%2F%2Fcdn.parlameter.si%2Fv1%2Fdata%2Fmandati.json`,
    };
  },
};
</script>
