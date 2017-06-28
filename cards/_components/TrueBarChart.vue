<template>
  <ul class="party-list">
      <li v-for="row in rows" class="labeled-chart">
        <div class="column chart-label">
          {{ row.name }}
        </div>
        <div class="column chart">
            <div class="progress hugebar">
                <div class="progress-bar funblue" role="progressbar" :style="{ width: row.widthPercentage + '%'}"></div>
                <div class="progress_number">{{ row.occurences + ' | ' + row.percentage }} %</div>
            </div>
        </div>
      </li>
    </ul>
</template>

<script>
export default {
  name: 'DateRow',
  props: {
    data: Array,
    property: String,
  },
  computed: {
    rows: function() {
      const almost = this.data.map(row => {
        const tempobj = {
          name: row.party.acronym,
          widthPercentage: 0,
          percentage: 0,
          occurences: row.results[this.property],
        };

        return tempobj;
      });

      const mymax = almost.map(row => row.occurences).reduce((acc, row) => {
        return Math.max(acc, row);
      }, 0);
      const mytotal = almost.map(row => row.occurences).reduce((acc, row) => {
        return acc + row;
      }, 0);

      return almost.map((row) => {
        row.widthPercentage = row.occurences / mymax * 80;
        row.percentage = (row.occurences / mytotal * 100).toFixed(2);
        return row;
      }).sort((a, b) => {
        return b.occurences - a.occurences;
      });
    }
  },
  watch: {
    data: function() {
      this.renderChart();
    }
  }
};
</script>

<style lang="scss">
@import '~parlassets/scss/colors';

  .party-list .labeled-chart .column.chart-label {
    width: auto;
    width: 200px;
  }
</style>
