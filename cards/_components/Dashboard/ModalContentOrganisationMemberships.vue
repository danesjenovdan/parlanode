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
            v-for="person in currentOnly ? currentMembers : members"
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
              <dash-button @click="editPerson(person.id)">
                <small>{{ $t('edit-membership') }}</small>
              </dash-button>
            </div>
          </li>
        </ul>
      </div>
      <div class="col-md-12">
        <dash-button @click="addMember">
          {{ $t('add-member') }}
        </dash-button>
      </div>
    </div>
    <div v-else-if="adding" class="row">
      <div class="col-md-12">
        <p-search-dropdown
          :value="dropdownItems"
          :placeholder="peoplePlaceholder"
          single
          @select="selectCallback"
          @clear="clearCallback"
        />
      </div>
    </div>
    <div v-else class="row">
      <div class="col-md-12">
        <p class="lead member-title">
          <img :src="getPersonPortrait(selectedPerson)" class="img-circle">
          {{ selectedPerson.name }}
        </p>
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
            <label>Start date</label>
          </div>
          <div class="col-md-6">
            <label>Start time</label>
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
            <label>On behalf of</label>
          </div>
          <div class="col-md-6">
            <p-search-dropdown
              :value="membership.roles"
              single
              @select="roleSelectCallback(membership.id, $event)"
              @clear="roleClearCallback(membership.id)"
            />
          </div>
          <div class="col-md-6">
            <p-search-dropdown
              :value="membership.organisations"
              single
              @select="onBehalfOfSelectCallback(membership.id, $event)"
              @clear="onBehalfOfClearCallback(membership.id)"
            />
          </div>
          <div class="col-md-12">
            <br>
            <dash-button @click="saveMembership(membership.id)">
              {{ $t('save-membership') }}
            </dash-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable no-underscore-dangle */
import { sortBy } from 'lodash';
import DashButton from 'components/Dashboard/Button.vue';
import PSearchDropdown from 'components/SearchDropdown.vue';
import parlapi from 'mixins/parlapi';
import links from 'mixins/links';

//TODO
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
      adding: false,
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
        },
        {
          label: 'member',
          id: 'member',
          selected: false,
        },
        {
          label: 'president',
          id: 'president',
          selected: false,
        },
        {
          label: 'deputy',
          id: 'deputy',
          selected: false,
        },
      ],
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
      console.log('personal memeberships')
      if (this.loadedData.data.filter(m => m.person === this.selectedPersonId).length > 0) {
        return this.loadedData.data.filter(m => m.person === this.selectedPersonId).map((m) => {
          return {
            start_date: m.start_time.split('T')[0],
            start_time: m.start_time.split('T')[1],
            end_date: !m.end_time ? '' : m.end_time.split('T')[0],
            end_time: !m.end_time ? '' : m.end_time.split('T')[1],
            roles: this.roles.map(role => ({
              id: role.id,
              label: role.label,
              selected: role.id === m.role,
            })),
            organisations: this.organisations.map(org => ({
              id: org.id,
              label: org.label,
              selected: org.id === m.on_behalf_of,
            })),
            on_behalf_of: m.on_behalf_of,
            role: m.role,
            id: m.id,
          };
        });
      }

      return [{
        start_date: null,
        start_time: null,
        end_date: null,
        end_time: null,
        roles: this.roles.map(role => ({
          id: role.id,
          label: role.label,
          selected: false,
        })),
        organisations: this.organisations.map(org => ({
          id: org.id,
          label: org.label,
          selected: false,
        })),
        on_behalf_of: null,
        role: null,
        id: null,
      }];
    },

    selectedPerson() {
      return this.people.find(p => p.id === this.selectedPersonId);
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

        this.dropdownItems = this.people.map(p => ({
          id: p.id,
          label: p.name,
          selected: false,
          image: this.getPersonPortrait(p),
        }));
      });
    },

    fetchOrgs() {
      this.$parlapi.getAllOrganisations()
        .then((orgs) => {
          this.organisations = sortBy(orgs.data.results, ['_name'])
            .map(org => ({
              id: org.id,
              label: org._name,
              selected: false,
            }));
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.error(error);
          this.error = error;
        });
    },

    addMember() {
      this.listing = false;
      this.adding = true;
    },

    selectCallback(id) {
      this.adding = false;
      this.dropdownItems.find(p => p.id === id).selected = true;
      this.selectedPersonId = id;
    },

    clearCallback() {
      this.dropdownItems.forEach((p) => {
        if (p.selected) {
          p.selected = false;
        }
      });
      this.selectedPersonId = null;
    },

    roleSelectCallback(id, value) {
      const membership = this.loadedData.data.find(m => m.id === id);
      membership.role = value;
    },

    roleClearCallback(id) {
      const membership = this.loadedData.data.find(m => m.id === id);
      membership.role = null;
    },

    onBehalfOfSelectCallback(id, value) {
      const membership = this.loadedData.data.find(m => m.id === id);
      membership.on_behalf_of = value;
    },

    onBehalfOfClearCallback(id) {
      const membership = this.loadedData.data.find(m => m.id === id);
      membership.on_behalf_of = null;
    },

    editPerson(id) {
      this.listing = false;
      this.selectCallback(id);
    },

    saveMembership(id) {
      const membership = this.personalMemberships.find(m => m.id === id);
      const membershipToSave = JSON.parse(JSON.stringify(membership));

      membershipToSave.start_time = `${membershipToSave.start_date}T${membershipToSave.start_time}`;
      membershipToSave.end_time = `${membershipToSave.end_date}T${membershipToSave.end_time}`;

      if (membershipToSave.end_time === 'T') {
        membershipToSave.end_time = null;
      }

      this.$parlapi.patchOrganisationMembership(id, membershipToSave);

      this.listing = true;
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

.member-title img {
  margin-right: 15px;
}
</style>
