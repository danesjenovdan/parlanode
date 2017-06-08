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
  },
  computed: {
    rows: function() {

      const almost = this.data.reduce((acc, d) => {
        if (acc.indexOf(d.results.tags[0]) === -1) {
          acc.push(d.results.tags[0]);
        }
        return acc;
      }, []).map((tag) => {
        const occurences = this.data.filter(d => d.results.tags[0] === tag).length;
        return {
          name: tag,
          occurences: occurences,
          widthPercentage: 0,
          percentage: 0
        }
      });

      console.log(almost);

      const mymax = almost.map(row => row.occurences).reduce((acc, row) => {
        return Math.max(acc, row);
      }, 0);
      console.log(mymax);

      return almost.map((row) => {
        console.log(row);
        row.widthPercentage = row.occurences / mymax * 80;
        row.percentage = (row.occurences / this.data.length * 100).toFixed(2);
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
