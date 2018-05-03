<template>
  <div class="word-list">
    <div class="column-label">
      <div v-for="(row, index) in rows" :key="index" class="column chart-label">
        <div class="label-container">
          <template v-if="row.link">
            <a :href="row.link" class="funblue-light-hover">
              {{ row.name }}
            </a>
          </template>
          <template v-else>
            {{ row.name }}
          </template>
        </div>
      </div>
    </div>
    <div class="column-bar">
      <div v-for="(row, index) in rows" :key="index" class="column chart">
          <div class="progress hugebar">
              <div
                class="progress-bar funblue"
                :style="{ width: row.widthPercentage + '%'}">
              </div>
              <div
                v-if="showNumbers"
                class="progress_number">
                {{ row.value + ' | ' + row.percentage }} %
              </div>
          </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BarChart',
  props: {
    data: Array,
    showNumbers: Boolean,
    alreadyCalculated: Boolean,
  },
  computed: {
    rows() {
      if (this.alreadyCalculated) return this.data;

      const rows = JSON.parse(JSON.stringify(this.data));
      const mymax = this.data.reduce((acc, row) => Math.max(acc, row.value), 0);
      const mytotal = this.data.reduce((acc, row) => acc + row.value, 0);

      return rows.map(row => ({
        link: row.link,
        name: row.label,
        value: row.value,
        widthPercentage: (row.value / mymax) * (this.showNumbers ? 80 : 100),
        percentage: ((row.value / mytotal) * 100).toFixed(2),
      })).sort((a, b) => b.value - a.value);
    },
  },
};
</script>

<style lang="scss" scoped>
@import '~parlassets/scss/breakpoints';

.word-list {
  max-height: 480px;
  overflow: hidden;
  display: flex;

  .column-label {
    flex: 1;
    margin-right: 15px;
  }

  .column-bar {
    flex: 4;
  }

  .column {
    height: 27px;
    margin-bottom: 22px;
  }

  .chart-label {
    display: flex;
    align-items: center;

    .label-container {
      margin-top: -5px;
      margin-bottom: -5px;
      a {
        font-size: 16px;
        @include respond-to(mobile) {
          font-size: 14px;
        }
      }
    }
  }
}
.progress_number {
  @include respond-to(mobile) { display: none; }
}
.progress.hugebar {
  height: 27px;
}
</style>
