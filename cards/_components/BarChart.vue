<template>
  <div class="word-list">
    <div :class="['column-label', { 'flexible': flexibleLabels }]">
      <div v-for="(row, index) in rows" :key="index" class="column chart-label">
        <div class="label-container">
          <template v-if="row.link">
            <a :href="row.link" class="funblue-light-hover">
              <img v-if="row.portrait" class="portrait" :src="row.portrait" />
              {{ row.name }}
            </a>
          </template>
          <template v-else>
            <img v-if="row.portrait" class="portrait" :src="row.portrait" />
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
    flexibleLabels: Boolean,
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
        portrait: row.portrait,
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
    margin-right: 15px;
    &:not(.flexible) { flex: 1; }
  }

  .column-bar {
    flex: 4;
  }

  .column {
    height: 27px;
    margin-top: 10px;
    margin-bottom: 21px;
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

      .portrait {
        border-radius: 50%;
        height: 40px;
        margin-right: 10px;
        width: 40px;
        @include show-for('above-limbo', inline);
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
