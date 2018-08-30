<template>
  <div>
    <div class="row">
      <div class="col-md-6">
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
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DashboardModalContentOrganisationInfo',
  props: {
    loadedData: {
      type: Object,
      default: null,
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
