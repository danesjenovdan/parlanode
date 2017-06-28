<template>
  <ul class="party-list">
    <li
      v-for="(row, index) in rows"
      :key="index"
      class="labeled-chart">
      <div class="column chart-label">
        {{ row.name }}
      </div>
      <div class="column chart">
          <div class="progress hugebar">
              <div
                class="progress-bar funblue"
                :style="{ width: row.widthPercentage + '%'}">
              </div>
              <div class="progress_number">
                {{ row.value + ' | ' + row.percentage }} %
              </div>
          </div>
      </div>
    </li>
  </ul>
</template>

<script>
export default {
  name: 'BarChart',
  props: {
    data: Array,
  },
  computed: {
    rows() {
      const rows = JSON.parse(JSON.stringify(this.data));
      const mymax = this.data.reduce((acc, row) => Math.max(acc, row.value), 0);
      const mytotal = this.data.reduce((acc, row) => acc + row.value, 0);

      return rows.map(row => ({
        name: row.label,
        value: row.value,
        widthPercentage: (row.value / mymax) * 80,
        percentage: ((row.value / mytotal) * 100).toFixed(2),
      })).sort((a, b) => b.value - a.value);
    },
  },
};
</script>

<style lang="scss">
@import '~parlassets/scss/colors';

.party-list .labeled-chart .column.chart-label {
  width: auto;
  width: 200px;
}
</style>
