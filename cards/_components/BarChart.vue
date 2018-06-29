<template>
  <div class="word-list">
    <div :class="['column-label', { 'flexible': flexibleLabels }]">
      <div v-for="(row, index) in rows" :key="index" class="column chart-label">
        <div class="label-container">
          <template v-if="row.link">
            <img v-if="row.portrait" :src="row.portrait" class="portrait" />
            <a :href="row.link" class="funblue-light-hover">
              {{ row.name }}
            </a>
          </template>
          <template v-else>
            <img v-if="row.portrait" :src="row.portrait" class="portrait" />
            {{ row.name }}
          </template>
        </div>
      </div>
    </div>
    <div class="column-bar">
      <div v-for="(row, index) in rows" :key="index" class="column chart">
        <div class="progress hugebar">
          <div
            :style="{ width: row.widthPercentage + '%'}"
            class="progress-bar funblue">
          </div>
          <div v-if="showNumbers && showPercentage" class="progress_number">
            {{ row.value.toString().replace('.', ',') + ' | ' + row.percentage }} %
          </div>
          <div v-else-if="showNumbers" class="progress_number">
            {{ row.value.toString().replace('.', ',') }}
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
    showPercentage: {
      type: Boolean,
      default: true,
    },
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
        percentage: ((row.value / mytotal) * 100).toFixed(2).replace('.', ','),
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
        font-weight: 300;
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
  line-height: 27px;
}
.progress.hugebar {
  height: 27px;
}
</style>
