<template>
  <div>
    <div class="row">
      <div class="col-md-12">
        <div class="row">
          <div class="col-md-12">
            <label>{{ $t('name') }}</label>
          </div>
          <div class="col-md-12">
            <input v-model="loadedData.org._name" class="form-control" />
          </div>
        </div>
      </div>
      <div class="col-md-12 smaller-field">
        <div class="row">
          <div class="col-md-12">
            <label>name_parser</label>
          </div>
          <div class="col-md-12">
            <input v-model="loadedData.org.name_parser" class="form-control" />
          </div>
        </div>
      </div>
      <div class="col-md-6">
        <div class="row">
          <div class="col-md-12">
            <label>{{ $t('acronym') }}</label>
          </div>
          <div class="col-md-12">
            <input v-model="loadedData.org._acronym" class="form-control" />
          </div>
        </div>
      </div>
      <div class="col-md-6">
        <div class="row">
          <div class="col-md-12">
            <label>{{ $t('classification') }}</label>
          </div>
          <div class="col-md-12">
            <input
              v-model="loadedData.org.classification"
              class="form-control"
            />
          </div>
        </div>
      </div>
      <div class="col-md-6">
        <div class="row">
          <div class="col-md-12">
            <label>{{ $t('number-of-votes') }}</label>
          </div>
          <div class="col-md-12">
            <input
              v-model.number="loadedData.org.voters"
              class="form-control"
              type="number"
            />
          </div>
        </div>
      </div>
      <div class="col-md-6">
        <div class="row">
          <div class="col-md-12">
            <label>GOV ID</label>
          </div>
          <div class="col-md-12">
            <input v-model="loadedData.org.gov_id" class="form-control" />
          </div>
        </div>
      </div>
      <div class="col-md-6">
        <div class="row">
          <div class="col-md-12">
            <label>{{ $t('coalition') }}</label>
          </div>
          <div class="col-md-12">
            <input
              v-model.number="loadedData.org.is_coalition"
              class="form-control"
              type="number"
            />
          </div>
        </div>
      </div>
      <div class="col-md-6">
        <div class="row">
          <div class="col-md-12">
            <label>PARENT</label>
          </div>
          <div class="col-md-12">
            <p-search-dropdown
              v-model="possibleParents"
              :groups="loadedData.org_groups"
              single
              small
              @select="loadedData.org.parent = $event"
              @clear="loadedData.org.parent = null"
            />
          </div>
        </div>
      </div>
      <div class="col-md-12">
        <div class="row">
          <div class="col-md-6">
            <label>{{ $t('dissolution-date') }}</label>
          </div>
          <div class="col-md-6">
            <label>{{ $t('dissolution-time') }}</label>
          </div>
          <div class="col-md-6">
            <input
              v-model="loadedData.org.dissolution_date"
              class="form-control"
              type="date"
            />
          </div>
          <div class="col-md-6">
            <input
              v-model="loadedData.org.dissolution_time"
              class="form-control"
              type="time"
            />
          </div>
        </div>
      </div>
      <div class="col-md-12">
        <hr />
      </div>
      <div class="col-md-6">
        <div class="row">
          <div class="col-md-12">
            <label>Facebook</label>
          </div>
          <div class="col-md-12 small">
            <textarea
              v-model.trim="loadedData.socials.facebook"
              class="form-control"
            />
          </div>
        </div>
      </div>
      <div class="col-md-6">
        <div class="row">
          <div class="col-md-12">
            <label>Twitter</label>
          </div>
          <div class="col-md-12 small">
            <textarea
              v-model.trim="loadedData.socials.twitter"
              class="form-control"
            />
          </div>
        </div>
      </div>
      <div class="col-md-12">
        <div class="row">
          <div class="col-md-12">
            <label>Contact Emails</label>
          </div>
          <div class="col-md-12 small">
            <textarea
              v-model.trim="loadedData.contacts.emails"
              class="form-control"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable no-underscore-dangle */
import PSearchDropdown from '@/_components/SearchDropdown.vue';

export default {
  name: 'DashboardModalContentOrganisationInfo',
  components: {
    PSearchDropdown,
  },
  props: {
    loadedData: {
      type: Object,
      default: null,
    },
  },
  computed: {
    possibleParents() {
      return this.loadedData.orgs.map((org) => ({
        id: org.id,
        label: `${org._acronym} - ${org._name}`,
        selected: org.id === this.loadedData.org.parent,
      }));
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

textarea {
  resize: vertical;
  min-height: 60px;
}

.smaller-field {
  font-size: 10px;

  .form-control {
    font-size: 12px;
    line-height: 1;
    padding: 0 7px;
    height: 25px;
  }

  label {
    margin: 4px 0 2px 0;
  }
}
</style>
