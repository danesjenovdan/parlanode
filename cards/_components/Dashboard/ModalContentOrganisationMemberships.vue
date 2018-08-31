<template>
  <div>
    <div v-if="listing" class="row">
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
              <dash-button @click="editPerson(person.id)">Edit</dash-button>
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
    </div>
    <div v-else class="row">
      <div class="col-md-12">
        <p-search-dropdown
          :value="dropdownItems"
          :placeholder="peoplePlaceholder"
          @select="selectCallback"
          @clear="clearCallback"
          single
        />
      </div>
      <div
        v-if="selectedPersonId"
        class="col-md-12"
      >
        <div
          v-for="membership in personalMemberships"
          :key="membership.id"
          class="row"
        >
          <div class="col-md-6">
            Start date
          </div>
          <div class="col-md-6">
            Start time
          </div>
          <div class="col-md-6">
            <input v-model="membership.start_date" class="form-control" type="date">
          </div>
          <div class="col-md-6">
            <input v-model="membership.start_time" class="form-control" type="time">
          </div>
          <br>
          <div class="col-md-6">
            <label>End date</label>
          </div>
          <div class="col-md-6">
            <label>End time</label>
          </div>
          <div class="col-md-6">
            <input v-model="membership.end_date" class="form-control" type="date">
          </div>
          <div class="col-md-6">
            <input v-model="membership.end_time" class="form-control" type="time">
          </div>
          <br>
          <div class="col-md-6">
            <label>Role</label>
          </div>
          <div class="col-md-6">
            <p-search-dropdown
              v-model="membership.roles"
              single
              @select="roleSelectCallback(membership.id, $event)"
            ></p-search-dropdown>
          </div>
          <div class="col-md-6">
            <label>On behalf of</label>
          </div>
          <div class="col-md-6">
            <p-search-dropdown
              :value="membership.organisations"
              single
              @select="onBehalfOfSelectCallback(membership.id, $event)"
            ></p-search-dropdown>
          </div>
          <div class="col-md-12">
            <dash-button @click="saveMembership(membership.id)">SAVE MEMBERSHIP</dash-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { sortBy } from 'lodash';
import DashButton from 'components/Dashboard/Button.vue';
import PSearchDropdown from 'components/SearchDropdown.vue';
import parlapi from 'mixins/parlapi';
import links from 'mixins/links';

// TODO
// There is a weird bug. If you select someone after you cleared the dropdown
// it says dropdownItems.find doesn't exist.

export default {
  name: 'DashboardModalContentOrganisationMemberships',

  components: {
    DashButton,
    PSearchDropdown,
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
    return {
      currentOnly: true,
      listing: true,
      people: [],
      dropdownItems: [],
      selectedPersonId: null,
      organisations: [],
      error: null,
      roles: [
        {
          label: 'voter',
          id: 'voter',
          selected: false,
        }, {
          label: 'member',
          id: 'member',
          selected: false,
        }, {
          label: 'president',
          id: 'president',
          selected: false,
        }, {
          label: 'deputy',
          id: 'deputy',
          selected: false,
        }],
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

    peoplePlaceholder() {
      const numberOfSelectedPeople = this.people.filter(p => p.selected).length;
      return numberOfSelectedPeople > 0 ? `Izbranih ${numberOfSelectedPeople} poslancev` : 'Izberi poslance';
    },

    personalMemberships() {
      if (this.loadedData.data.filter(m => m.person === this.selectedPersonId).length > 0) {
        return this.loadedData.data.filter(m => m.person === this.selectedPersonId).map((m) => {
          return {
            start_date: m.start_time.split('T')[0],
            start_time: m.start_time.split('T')[1],
            end_date: !m.end_time ? '' : m.end_time.split('T')[0],
            end_time: !m.end_time ? '' : m.end_time.split('T')[1],
            roles: this.roles.map((role) => {
              return {
                id: role.id,
                label: role.label,
                selected: role.id === m.role,
              };
            }),
            organisations: this.organisations.map((org) => {
              return {
                id: org.id,
                label: org.label,
                selected: org.id === m.on_behalf_of,
              };
            }),
            on_behalf_of: m.on_behalf_of,
            role: m.role,
            id: m.id,
          };
        });
      }

      return [{
        start_date: '',
        start_time: '',
        end_date: '',
        end_time: '',
      }];
    },
  },

  mounted() {
    this.fetchPeople();
    this.fetchOrgs();
  },

  methods: {
    fetchPeople() {
      this.$parlapi.getPeople().then((allPeople) => {
        this.people = allPeople.data.results;

        this.dropdownItems = this.people.map((p) => {
          return {
            id: p.id,
            label: p.name,
            selected: false,
            image: this.getPersonPortrait(p),
          };
        });
      });
    },

    fetchOrgs() {
      this.$parlapi.getAllOrganisations()
        .then((orgs) => {
          console.log(orgs.data.results[1]);
          this.organisations = sortBy(orgs.data.results, ['_name']).map((org) => {
            return {
              id: org.id,
              label: org._name,
              selected: false,
            };
          });
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.error(error);
          this.error = error;
        });
    },

    fetchPersonalMemberships() {
      this.$parlapi.getPersonalOrganisationMemberships().then((memberships) => {
        this.personalMemberships = memberships.data.results || [];
      });
    },

    groupBy(array, f) {
      const groups = {};
      array.forEach((o) => {
        const group = JSON.stringify(f(o));
        groups[group] = groups[group] || [];
        groups[group].push(o);
      });
      return Object.keys(groups).map(group => groups[group]);
    },

    selectCallback(id) {
      this.dropdownItems.find(p => p.id === id).selected = true;
      this.selectedPersonId = id;
    },
    clearCallback() {
      this.dropdownItems.find(p => p.selected).selected = false;
      this.selectedPersonId = null;
    },

    roleSelectCallback(id, value) {
      this.personalMemberships.find(m => m.id === id).role = value;
      const membershipIndex = this.personalMemberships.indexOf(this.personalMemberships.find(m => m.id === id));
      this.personalMemberships.find(m => m.id === id).roles.forEach((r) => {
        if (r.id === value) {
          r.selected = true;
        }
        r.selected = false;
      });
    },
    onBehalfOfSelectCallback(id, value) {
      this.personalMemberships.find(m => m.id === id).on_behalf_of = value;
    },
    onBehalfOfClearCallback(id, value) {
      this.personalMemberships.find(m => m.id === id).on_behalf_of = null;
    },

    editPerson(id) {
      this.listing = false;
      this.selectCallback(id);
    },

    saveMembership(id) {
      const membershipToSave = JSON.parse(JSON.stringify(this.personalMemberships.find(m => m.id === id)));

      membershipToSave.start_time = `${membershipToSave.start_date}T${membershipToSave.start_time}`;
      membershipToSave.end_time = `${membershipToSave.end_date}T${membershipToSave.end_time}`;

      if (membershipToSave.end_time === 'T') {
        membershipToSave.end_time = null;
      }

      this.$parlapi.patchOrganisationMembership(id, membershipToSave);
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
