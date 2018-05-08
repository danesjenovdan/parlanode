<template>
  <ul class="person-list">
    <li
      v-for="person in people"
      :key="person.gov_id"
      class="person"
    >
      <a :href="getPersonLink(person)" class="portrait column">
        <img :src="getPersonPortrait(person)" />
      </a>
      <div class="column name">
        <a :href="getPersonLink(person)" class="funblue-light-hover">
          {{ person.name }}
        </a>
        <template v-if="showPartyLink">
          <br />
          <a v-if="getPersonPartyLink(person)" :href="getPersonPartyLink(person)" class="funblue-light-hover">
            {{ person.party.acronym }}
          </a>
          <span v-else>
            {{ person.party.acronym }}
          </span>
        </template>
      </div>
      <div v-if="person.score" class="column large-number">
        {{ person.score.toFixed(2).replace('.', ',') }}
      </div>
    </li>
  </ul>
</template>

<script>
import { getPersonPartyLink, getPersonLink, getPersonPortrait } from 'components/links';

export default {
  props: {
    people: {
      type: Array,
      required: true,
    },
    showPartyLink: Boolean,
  },
  methods: {
    getPersonPartyLink,
    getPersonLink,
    getPersonPortrait,
  },
};
</script>
