<template>
  <ul class="party-list">
      <li v-for="row in rows" class="labeled-chart">
        <div class="column chart-label">
          {{ row.name }}
        </div>
        <div class="column chart">
            <div class="progress hugebar">
                <div v-for="property in row.properties" class="progress-bar funblue" role="progressbar" :style="{ width: property.widthPercentage + '%'}"></div>
                <!--<div class="progress_number">{{ property.occurences + ' | ' + property.percentage }} %</div>-->
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
    properties: Array,
  },
  computed: {
    rows: function() {
      const almost = this.data.map(row => {
        const tempobj = {
          name: row.party.acronym,
          widthPercentage: 0,
          percentage: 0,
          properties: this.properties.map((property) => {
            return {
              occurences: row.results[property],
              percentage: 0,
              widthPercentage: 0
            };
          })
        };

        return tempobj;
      });

      const mymax = almost.map(row => row.occurences[0]).reduce((acc, row) => {
        return Math.max(acc, row);
      }, 0);
      const mytotal = almost.map(row => row.occurences[0]).reduce((acc, row) => {
        return acc + row;
      }, 0);

      return almost.map((row) => {
        row.widthPercentage = row.occurences[0] / mymax * 80;
        row.percentage = (row.occurences[0] / mytotal * 100).toFixed(2);
        return row;
      }).sort((a, b) => {
        return b.occurences[0] - a.occurences[0];
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
