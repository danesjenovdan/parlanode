<template>
  <div>
    <div class="row">
      <div class="col-md-12">
        <div class="row">
          <div class="col-md-12">
            <label>{{ $t('name') }}</label>
          </div>
          <div class="col-md-12">
            <input v-model.trim="fullName" class="form-control" disabled>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="row">
          <div class="col-md-12">
            <label>honorific_prefix</label>
          </div>
          <div class="col-md-12">
            <input v-model.trim="loadedData.person.honorific_prefix" class="form-control">
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="row">
          <div class="col-md-12">
            <label>given_name</label>
          </div>
          <div class="col-md-12">
            <input v-model.trim="loadedData.person.given_name" class="form-control">
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="row">
          <div class="col-md-12">
            <label>additional_name</label>
          </div>
          <div class="col-md-12">
            <input v-model.trim="loadedData.person.additional_name" class="form-control">
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="row">
          <div class="col-md-12">
            <label>patronymic_name</label>
          </div>
          <div class="col-md-12">
            <input v-model.trim="loadedData.person.patronymic_name" class="form-control">
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="row">
          <div class="col-md-12">
            <label>family_name</label>
          </div>
          <div class="col-md-12">
            <input v-model.trim="loadedData.person.family_name" class="form-control">
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="row">
          <div class="col-md-12">
            <label>honorific_suffix</label>
          </div>
          <div class="col-md-12">
            <input v-model="loadedData.person.honorific_suffix" class="form-control">
          </div>
        </div>
      </div>
      <div class="col-md-12">
        <hr>
      </div>
      <div class="col-md-6">
        <div class="row">
          <div class="col-md-12">
            <label>{{ $t('number-of-votes') }}</label>
          </div>
          <div class="col-md-12">
            <input v-model.number="loadedData.person.voters" class="form-control" type="number">
          </div>
        </div>
      </div>
      <div class="col-md-6">
        <div class="row">
          <div class="col-md-12">
            <label>{{ $t('number-of-terms') }}</label>
          </div>
          <div class="col-md-12">
            <input v-model.number="loadedData.person.mandates" class="form-control" type="number">
          </div>
        </div>
      </div>
      <div class="col-md-6">
        <div class="row">
          <div class="col-md-12">
            <label>{{ $t('previous-occupation') }}</label>
          </div>
          <div class="col-md-12">
            <input v-model="loadedData.person.previous_occupation" class="form-control">
          </div>
        </div>
      </div>
      <div class="col-md-6">
        <div class="row">
          <div class="col-md-12">
            <label>{{ $t('birth-date') }}</label>
          </div>
          <div class="col-md-12">
            <input v-model="birthDate" class="form-control" type="date">
          </div>
        </div>
      </div>
      <div class="col-md-6">
        <div class="row">
          <div class="col-md-12">
            <label>{{ $t('education') }}</label>
          </div>
          <div class="col-md-12">
            <input v-model="loadedData.person.education" class="form-control">
          </div>
        </div>
      </div>
      <div class="col-md-6">
        <div class="row">
          <div class="col-md-12">
            <label>{{ $t('education-level') }}</label>
          </div>
          <div class="col-md-12">
            <input v-model="loadedData.person.education_level" class="form-control">
          </div>
        </div>
      </div>
      <div class="col-md-6">
        <div class="row">
          <div class="col-md-12">
            <label>Facebook</label>
          </div>
          <div class="col-md-12 small">
            <textarea v-model.trim="loadedData.socials.facebook" class="form-control" />
          </div>
        </div>
      </div>
      <div class="col-md-6">
        <div class="row">
          <div class="col-md-12">
            <label>Twitter</label>
          </div>
          <div class="col-md-12 small">
            <textarea v-model.trim="loadedData.socials.twitter" class="form-control" />
          </div>
        </div>
      </div>
      <div class="col-md-6">
        <div class="row">
          <div class="col-md-12">
            <label>GOV ID</label>
          </div>
          <div class="col-md-12 small">
            <input v-model.trim="loadedData.person.gov_id" class="form-control">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DashboardModalContentPersonInfo',
  props: {
    loadedData: {
      type: Object,
      default: null,
    },
  },
  computed: {
    birthDate: {
      get() {
        const birth = this.loadedData.person.birth_date || '';
        return birth.split('T')[0];
      },
      set(newVal) {
        this.loadedData.person.birth_date = `${newVal}T00:00:00`;
      },
    },
    fullName() {
      const { person } = this.loadedData;
      const nameParts = [
        person.honorific_prefix,
        person.given_name,
        person.additional_name,
        person.patronymic_name,
        person.family_name,
        person.honorific_suffix,
      ];
      const name = nameParts.filter(Boolean).join(' ');
      if (name.trim()) {
        person.name = name;
      }
      return person.name;
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

textarea {
  resize: vertical;
  min-height: 60px;
}

hr {
  margin: 16px 0 6px;
  border-color: #000;
}
</style>
