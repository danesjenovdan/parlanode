<template>
  <scroll-shadow ref="shadow">
    <div id="person-list" @scroll="$refs.shadow.check($event.currentTarget)">
      <ul class="person-list">
        <li
          v-for="person in people"
          :key="person.gov_id"
          class="person"
        >
          <a :href="getPersonLink(person)" class="portrait column">
            <img :src="getPersonPortrait(person)">
          </a>
          <div class="column name">
            <a :href="getPersonLink(person)" class="funblue-light-hover">
              {{ person.name }}
            </a>
            <template v-if="showPartyLink">
              <br>
              <a
                v-if="getPersonPartyLink(person)"
                :href="getPersonPartyLink(person)"
                class="funblue-light-hover"
              >
                {{ person.party.acronym }}
              </a>
              <span v-else>
                {{ person.party.acronym }}
              </span>
            </template>
          </div>
          <div v-if="person.score" class="column large-number">
            {{ person.score }}
          </div>
        </li>
      </ul>
    </div>
  </scroll-shadow>
</template>

<script>
import { getPersonPartyLink, getPersonLink, getPersonPortrait } from 'components/links';
import ScrollShadow from 'components/ScrollShadow.vue';

export default {
  components: {
    ScrollShadow,
  },
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

<style lang="scss" scoped>
@import '~parlassets/scss/breakpoints';

#person-list {
  overflow-y: auto;
  height: 518px;

  @include respond-to(mobile) {
    height: auto;
    max-height: 518px;
  }
}
</style>
