<template>
  <div>
    <div class="row header">
      <div class="col-md-1"></div>
      <div class="col-md-5"></div>
      <div class="col-md-1">TF</div>
      <div class="col-md-1">DF</div>
      <div class="col-md-3">TF-IDF</div>
    </div>
    <div v-for="(e, i) in data" :key="i" class="row">
      <div class="col-md-1">
        <button class="btn btn-danger" @click="removeWord(i)">×</button>
      </div>
      <div class="col-md-5">
        <input v-model="e.term" class="form-control">
      </div>
      <div class="col-md-1">
        <label>{{ e.scores.tf }}</label>
      </div>
      <div class="col-md-1">
        <label>{{ e.scores.df }}</label>
      </div>
      <div class="col-md-3">
        <label>{{ e.scores['tf-idf'] }}</label>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DashboardModalContentTfidf',
  props: {
    data: {
      type: Array,
      default: null,
    },
  },
  methods: {
    removeWord(index) {
      this.data.splice(index, 1);
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

.header {
  font-weight: 700;
  line-height: 34px;
}

label {
  font-size: 12px;
  height: 36px;
  display: flex;
  align-items: center;
  font-family: monospace;
}
</style>
