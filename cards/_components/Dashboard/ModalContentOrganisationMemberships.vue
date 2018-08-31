<template>
  <div>
    <div class="row">
      <div class="col-md-12">
        <input
          id="currentOnly"
          v-model="currentOnly"
          type="checkbox"
          class="checkbox"
        >
        <label for="currentOnly">{{ $t('only-current') }}</label>
      </div>
      <div class="col-md-12">
        <div v-if="members.length === 0" class="nalagalnik"></div>
        <ul class="person-list">
          <li
            v-for="person in currentOnly ? currentMembers: members"
            :key="person.id"
            class="person"
          >
            <a :href="getPersonLink(person)" class="portrait column">
              <img :src="getPersonPortrait(person)">
            </a>
            <div class="column name">
              <a :href="getPersonLink(person)" class="funblue-light-hover">
                {{ person.name }}
              </a>
              <br>
              <dash-button>Edit</dash-button>
            </div>
            <div v-if="person.score" class="column large-number">
              {{ person.score }}
            </div>
          </li>
        </ul>
      </div>
      <div class="col-md-12">
        <dash-button>{{ $t('add-member') }}</dash-button>
      </div>
      <!-- <div class="col-md-6">
        <div class="row">
          <div class="col-md-12">
            <label>{{ $t('name') }}</label>
          </div>
          <div class="col-md-12">
            <input v-model.number="loadedData.org.name" class="form-control" type="text">
          </div>
        </div>
      </div>
      <div class="col-md-6">
        <div class="row">
          <div class="col-md-12">
            <label>{{ $t('acronym') }}</label>
          </div>
          <div class="col-md-12">
            <input v-model.number="loadedData.org.acronym" class="form-control" type="text">
          </div>
        </div>
      </div>
      <div class="col-md-6">
        <div class="row">
          <div class="col-md-12">
            <label>{{ $t('classification') }}</label>
          </div>
          <div class="col-md-12">
            <input v-model.number="loadedData.org.classification" class="form-control" type="text">
          </div>
        </div>
      </div> -->
    </div>
  </div>
</template>

<script>
import DashButton from 'components/Dashboard/Button.vue';
import parlapi from 'mixins/parlapi';
import links from 'mixins/links';

export default {
  name: 'DashboardModalContentOrganisationMemberships',

  components: {
    DashButton,
  },

  mixins: [
    parlapi,
    links,
  ],

  props: {
    loadedData: {
      type: Object,
      default: null,
    },
  },

  data() {
    const people = [];

    return {
      currentOnly: true,
      listing: true,
      people,
    };
  },

  computed: {
    members() {
      const ids = this.loadedData.data.map(e => e.person);
      return this.people.filter(p => ids.indexOf(p.id) !== -1);
    },

    currentMembers() {
      // return all members who's end_time is null
      return this.members.filter(p => !this.loadedData.data.find(m => m.person === p.id).end_time);
    },
  },

  mounted() {
    this.fetchPeople();
  },

  methods: {
    fetchPeople() {
      this.$parlapi.getPeople().then((allPeople) => {
        this.people = allPeople.data.results;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.row {
  margin-left: -5px;
  margin-right: -5px;

  > [class*="col-"] {
    padding-left: 5px;
    padding-right: 5px;
  }
}

label {
  margin-top: 10px;
  text-transform: uppercase;
  font-weight: 700;
}
</style>
