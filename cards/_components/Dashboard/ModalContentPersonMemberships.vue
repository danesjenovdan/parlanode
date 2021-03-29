<template>
  <div>
    <div v-for="m in loadedData.memberships" :key="m.id" class="row">
      <div class="col-md-12">
        <div class="row">
          <div class="col-md-12">
            <label>{{ $t('organization') }}</label>
            <dash-button class="delete-button" @click="deleteMembership(m)"
              >&times;</dash-button
            >
          </div>
          <div class="col-md-12">
            <p-search-dropdown
              v-model="m.organizations"
              :groups="loadedData.org_groups"
              single
              small
              @select="m.organization = $event"
              @clear="m.organization = null"
            />
          </div>
          <br />
          <div class="col-md-6">
            <label>On behalf of</label>
          </div>
          <div class="col-md-6">
            <label>Role</label>
          </div>
          <div class="col-md-6">
            <p-search-dropdown
              v-model="m.on_behalf_ofs"
              :groups="loadedData.org_groups"
              single
              small
              @select="m.on_behalf_of = $event"
              @clear="m.on_behalf_of = null"
            />
          </div>
          <div class="col-md-6">
            <p-search-dropdown
              v-model="m.roles"
              single
              small
              @select="m.role = $event"
              @clear="m.role = null"
            />
          </div>
          <br />
          <div class="col-md-6">
            <label>Start date</label>
          </div>
          <div class="col-md-6">
            <label>Start time</label>
          </div>
          <div class="col-md-6">
            <input v-model="m.start_date" class="form-control" type="date" />
          </div>
          <div class="col-md-6">
            <input v-model="m.start_time" class="form-control" type="time" />
          </div>
          <br />
          <div class="col-md-6">
            <label>End date</label>
          </div>
          <div class="col-md-6">
            <label>End time</label>
          </div>
          <div class="col-md-6">
            <input v-model="m.end_date" class="form-control" type="date" />
          </div>
          <div class="col-md-6">
            <input v-model="m.end_time" class="form-control" type="time" />
          </div>
        </div>
      </div>
      <div class="col-md-12">
        <hr />
      </div>
    </div>
    <div class="row">
      <div class="col-md-12">
        <dash-button @click="addMembership">
          {{ $t('add-membership') }}
        </dash-button>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable no-underscore-dangle */
import DashButton from '@/_components/Dashboard/Button.vue';
import PSearchDropdown from '@/_components/SearchDropdown.vue';
import parlapi from '@/_mixins/parlapi.js';
import links from '@/_mixins/links.js';

export default {
  name: 'DashboardModalContentPersonMemberships',
  components: {
    DashButton,
    PSearchDropdown,
  },
  mixins: [parlapi, links],
  props: {
    loadedData: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
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
  created() {
    this.enrichMemberships();
  },
  methods: {
    enrichMemberships() {
      const { orgs, memberships } = this.loadedData;
      memberships.forEach((m) => {
        this.$set(
          m,
          'roles',
          this.roles.map((role) => ({
            id: role.id,
            label: role.label,
            selected: role.id === m.role,
          }))
        );
        this.$set(
          m,
          'organizations',
          orgs.map((org) => ({
            id: org.id,
            label: `${org._acronym} - ${org._name}`,
            selected: org.id === m.organization,
          }))
        );
        this.$set(
          m,
          'on_behalf_ofs',
          orgs.map((org) => ({
            id: org.id,
            label: `${org._acronym} - ${org._name}`,
            selected: org.id === m.on_behalf_of,
          }))
        );
      });
    },
    addMembership() {
      const { orgs, memberships } = this.loadedData;
      memberships.push({
        id: null,
        start_date: null,
        start_time: null,
        end_date: null,
        end_time: null,
        role: null,
        roles: this.roles.map((role) => ({
          id: role.id,
          label: role.label,
          selected: false,
        })),
        organization: null,
        organizations: orgs.map((org) => ({
          id: org.id,
          label: `${org._acronym} - ${org._name}`,
          selected: false,
        })),
        on_behalf_of: null,
        on_behalf_ofs: orgs.map((org) => ({
          id: org.id,
          label: `${org._acronym} - ${org._name}`,
          selected: false,
        })),
      });
    },
    async deleteMembership(m) {
      // if it was saved it has an ID
      if (m.id) {
        // eslint-disable-next-line no-alert
        const sure = window.confirm(
          'Are you sure you want to DELETE? This is final!'
        );
        if (sure) {
          await this.$parlapi.deleteMembership(m.id);
          this.loadedData.memberships = this.loadedData.memberships.filter(
            (ms) => ms.id !== m.id
          );
        }
      } else {
        // it's not saved just remove it
        this.loadedData.memberships = this.loadedData.memberships.filter(
          (ms) => ms.id !== m.id
        );
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.row {
  margin-left: -5px;
  margin-right: -5px;

  > [class*='col-'] {
    padding-left: 5px;
    padding-right: 5px;
  }
}

label {
  margin-top: 10px;
  text-transform: uppercase;
  font-weight: 700;
}

hr {
  margin: 16px 0 6px;
  border-color: #000;
}

.delete-button {
  background-color: #f00;
  padding: 1px 7px;
  float: right;
}

.delete-button:hover {
  background-color: rgba(#f00, 0.7);
}
</style>
