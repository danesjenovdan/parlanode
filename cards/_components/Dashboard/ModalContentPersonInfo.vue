<template>
  <div>
    <div class="row">
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
            <input v-model.trim="loadedData.socials.facebook.url" class="form-control">
          </div>
        </div>
      </div>
      <div class="col-md-6">
        <div class="row">
          <div class="col-md-12">
            <label>Twitter</label>
          </div>
          <div class="col-md-12 small">
            <input v-model.trim="loadedData.socials.twitter.url" class="form-control">
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
